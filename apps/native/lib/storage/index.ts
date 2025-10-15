import AsyncStorage from '@react-native-async-storage/async-storage'

/**
 * Loads a string from storage.
 *
 * @param key The key to fetch.
 * @returns The stored string value or null if not found or on error.
 */
export async function loadString(key: string): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(key)
  } catch {
    // Ignore and return null for any storage read error
    return null
  }
}

/**
 * Saves a string to storage.
 *
 * @param key The key to save under.
 * @param value The string value to store.
 * @returns True on success, false on failure.
 */
export async function saveString(key: string, value: string): Promise<boolean> {
  try {
    await AsyncStorage.setItem(key, value)
    return true
  } catch {
    return false
  }
}

/**
 * Loads and parses JSON from storage.
 *
 * @param key The key to fetch.
 * @returns The parsed value or null if not found or on error.
 */
export async function load<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key)
    if (raw == null) return null
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

/**
 * Serializes and saves a value to storage as JSON.
 *
 * @param key The key to save under.
 * @param value The value to store (will be JSON.stringified).
 * @returns True on success, false on failure.
 */
export async function save(key: string, value: unknown): Promise<boolean> {
  try {
    const serialized = JSON.stringify(value)
    await AsyncStorage.setItem(key, serialized)
    return true
  } catch {
    return false
  }
}

/**
 * Removes a key from storage.
 *
 * @param key The key to remove.
 */
export async function remove(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key)
  } catch {
    // Ignore removal errors
  }
}

/**
 * Clears all keys and values from storage.
 * Use with caution – this affects all keys in the app's storage scope.
 */
export async function clear(): Promise<void> {
  try {
    await AsyncStorage.clear()
  } catch {
    // Ignore clear errors
  }
}
