import type {
  SendFriendRequestRequest,
  SendFriendRequestResponse,
  AcceptFriendRequestRequest,
  AcceptFriendRequestResponse,
  GetFriendsResponse,
  CreateChallengeRequest,
  CreateChallengeResponse,
  JoinChallengeRequest,
  JoinChallengeResponse,
  GetChallengeLeaderboardRequest,
  GetChallengeLeaderboardResponse,
} from '@repo/types'
import { getSupabaseClient } from './client.js'
import { handleSupabaseError, NotFoundError, ConflictError } from './errors.js'
import {
  mapFriendship,
  mapProfile,
  mapCharacter,
  mapChallenge,
  mapChallengeParticipant,
} from './mappers.js'

/**
 * Send a friend request to another user
 */
export async function sendFriendRequest(
  request: SendFriendRequestRequest
): Promise<SendFriendRequestResponse> {
  const supabase = getSupabaseClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    // Find the friend by username
    const { data: friendProfile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', request.friendUsername)
      .single()

    if (profileError) throw profileError
    if (!friendProfile) throw new NotFoundError('User')

    // Check if friendship already exists
    const { data: existingFriendship } = await supabase
      .from('friendships')
      .select('*')
      .or(
        `and(user_id.eq.${user.id},friend_id.eq.${friendProfile.id}),and(user_id.eq.${friendProfile.id},friend_id.eq.${user.id})`
      )
      .single()

    if (existingFriendship) {
      throw new ConflictError('Friend request already exists')
    }

    // Create friendship
    const { data: friendshipData, error: friendshipError } = await supabase
      .from('friendships')
      .insert({
        user_id: user.id,
        friend_id: friendProfile.id,
        status: 'pending',
      })
      .select()
      .single()

    if (friendshipError) throw friendshipError

    return {
      friendship: mapFriendship(friendshipData),
    }
  } catch (error) {
    return handleSupabaseError(error)
  }
}

/**
 * Accept a friend request
 */
export async function acceptFriendRequest(
  request: AcceptFriendRequestRequest
): Promise<AcceptFriendRequestResponse> {
  const supabase = getSupabaseClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    // Update friendship status
    const { data: friendshipData, error: friendshipError } = await supabase
      .from('friendships')
      .update({ status: 'accepted' })
      .eq('id', request.friendshipId)
      .eq('friend_id', user.id)
      .eq('status', 'pending')
      .select()
      .single()

    if (friendshipError) throw friendshipError
    if (!friendshipData) throw new NotFoundError('Friend request')

    return {
      friendship: mapFriendship(friendshipData),
    }
  } catch (error) {
    return handleSupabaseError(error)
  }
}

/**
 * Get user's friends list with profiles and characters
 */
export async function getFriends(): Promise<GetFriendsResponse> {
  const supabase = getSupabaseClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    // Get friendships where user is either user_id or friend_id
    const { data: friendshipsData, error: friendshipsError } = await supabase
      .from('friendships')
      .select('*')
      .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)
      .eq('status', 'accepted')

    if (friendshipsError) throw friendshipsError

    const friends = []

    for (const friendship of friendshipsData || []) {
      // Determine which ID is the friend
      const friendId = friendship.user_id === user.id ? friendship.friend_id : friendship.user_id

      // Get friend's profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', friendId)
        .single()

      if (profileError) continue

      // Get friend's character
      const { data: characterData, error: characterError } = await supabase
        .from('characters')
        .select('*')
        .eq('user_id', friendId)
        .single()

      if (characterError) continue

      friends.push({
        ...mapFriendship(friendship),
        profile: mapProfile(profileData),
        character: mapCharacter(characterData),
      })
    }

    return { friends }
  } catch (error) {
    return handleSupabaseError(error)
  }
}

/**
 * Create a new challenge
 */
export async function createChallenge(
  request: CreateChallengeRequest
): Promise<CreateChallengeResponse> {
  const supabase = getSupabaseClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    // Create challenge
    const { data: challengeData, error: challengeError } = await supabase
      .from('challenges')
      .insert({
        creator_id: user.id,
        name: request.name,
        description: request.description || null,
        start_date: request.startDate,
        end_date: request.endDate,
        is_active: true,
      })
      .select()
      .single()

    if (challengeError) throw challengeError

    // Automatically add creator as participant
    await supabase.from('challenge_participants').insert({
      challenge_id: challengeData.id,
      user_id: user.id,
      xp_earned: 0,
    })

    return {
      challenge: mapChallenge(challengeData),
    }
  } catch (error) {
    return handleSupabaseError(error)
  }
}

/**
 * Join an existing challenge
 */
export async function joinChallenge(request: JoinChallengeRequest): Promise<JoinChallengeResponse> {
  const supabase = getSupabaseClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    // Check if challenge exists and is active
    const { data: challengeData, error: challengeError } = await supabase
      .from('challenges')
      .select('*')
      .eq('id', request.challengeId)
      .eq('is_active', true)
      .single()

    if (challengeError) throw challengeError
    if (!challengeData) throw new NotFoundError('Challenge')

    // Check if already participating
    const { data: existingParticipant } = await supabase
      .from('challenge_participants')
      .select('*')
      .eq('challenge_id', request.challengeId)
      .eq('user_id', user.id)
      .single()

    if (existingParticipant) {
      throw new ConflictError('Already participating in this challenge')
    }

    // Add participant
    const { data: participantData, error: participantError } = await supabase
      .from('challenge_participants')
      .insert({
        challenge_id: request.challengeId,
        user_id: user.id,
        xp_earned: 0,
      })
      .select()
      .single()

    if (participantError) throw participantError

    return {
      participant: mapChallengeParticipant(participantData),
    }
  } catch (error) {
    return handleSupabaseError(error)
  }
}

/**
 * Get challenge leaderboard with participant details
 */
export async function getChallengeLeaderboard(
  request: GetChallengeLeaderboardRequest
): Promise<GetChallengeLeaderboardResponse> {
  const supabase = getSupabaseClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    // Get all participants for the challenge
    const { data: participantsData, error: participantsError } = await supabase
      .from('challenge_participants')
      .select('*')
      .eq('challenge_id', request.challengeId)
      .order('xp_earned', { ascending: false })

    if (participantsError) throw participantsError

    const leaderboard = []

    for (const participant of participantsData || []) {
      // Get participant's profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', participant.user_id)
        .single()

      if (profileError) continue

      // Get participant's character
      const { data: characterData, error: characterError } = await supabase
        .from('characters')
        .select('*')
        .eq('user_id', participant.user_id)
        .single()

      if (characterError) continue

      leaderboard.push({
        ...mapChallengeParticipant(participant),
        profile: mapProfile(profileData),
        character: mapCharacter(characterData),
      })
    }

    return { leaderboard }
  } catch (error) {
    return handleSupabaseError(error)
  }
}

/**
 * Get active challenges
 */
export async function getActiveChallenges() {
  const supabase = getSupabaseClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) throw error

    return {
      challenges: (data || []).map(mapChallenge),
    }
  } catch (error) {
    return handleSupabaseError(error)
  }
}

/**
 * Get user's challenges (participating in)
 */
export async function getMyChallenges() {
  const supabase = getSupabaseClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    // Get challenge IDs user is participating in
    const { data: participantsData, error: participantsError } = await supabase
      .from('challenge_participants')
      .select('challenge_id')
      .eq('user_id', user.id)

    if (participantsError) throw participantsError

    const challengeIds = (participantsData || []).map((p: any) => p.challenge_id)

    if (challengeIds.length === 0) {
      return { challenges: [] }
    }

    // Get challenge details
    const { data: challengesData, error: challengesError } = await supabase
      .from('challenges')
      .select('*')
      .in('id', challengeIds)
      .order('created_at', { ascending: false })

    if (challengesError) throw challengesError

    return {
      challenges: (challengesData || []).map(mapChallenge),
    }
  } catch (error) {
    return handleSupabaseError(error)
  }
}
