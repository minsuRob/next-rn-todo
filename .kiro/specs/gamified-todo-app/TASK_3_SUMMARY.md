# Task 3: Supabase 백엔드 인프라 설정 - 완료 요약

## 개요

Supabase 백엔드 인프라를 성공적으로 설정하고 gamified TODO 앱을 위한 완전한 데이터베이스 스키마를 구축했습니다.

## 완료된 작업

### 3.1 Supabase 프로젝트 및 로컬 개발 환경 초기화 ✅

- Supabase MCP를 통해 기존 프로젝트에 연결
- 환경이 이미 구성되어 있음을 확인

### 3.2 데이터베이스 스키마 마이그레이션 생성 ✅

다음 테이블들을 성공적으로 생성했습니다:

#### 핵심 테이블

1. **profiles** - 사용자 프로필 (auth.users 확장)
   - username, avatar_url
2. **characters** - 캐릭터 진행 상황
   - level, xp, hp, gold
   - theme, avatar_config
3. **tasks** - 모든 태스크 타입 (habit, daily, todo)
   - type, title, description, difficulty
   - is_completed, due_date, repeat_pattern
   - checklist, tags
4. **habit_logs** - 습관 추적 로그
   - task_id, is_positive, logged_at
5. **streaks** - 연속 기록 추적
   - current_streak, best_streak
   - last_completed_date

#### 보상 시스템 테이블

6. **rewards** - 사용 가능한 보상
   - name, price, icon_url
   - is_custom, is_equipment
   - equipment_slot, stat_bonuses
7. **inventory** - 사용자 소유 아이템
   - reward_id, quantity, is_equipped

#### 거래 및 소셜 테이블

8. **transactions** - XP/골드 거래 로그
   - type, amount, source
9. **challenges** - 그룹 챌린지
   - name, description
   - start_date, end_date, is_active
10. **challenge_participants** - 챌린지 참가자
    - challenge_id, user_id, xp_earned
11. **friendships** - 친구 관계
    - user_id, friend_id, status

#### 커스텀 타입

- `task_type` ENUM: 'habit', 'daily', 'todo'
- `task_difficulty` ENUM: 'trivial', 'easy', 'medium', 'hard'

#### 인덱스

성능 최적화를 위한 인덱스 생성:

- tasks: user_id, type, due_date, is_completed
- habit_logs: task_id, logged_at
- streaks: task_id, user_id
- rewards: user_id, is_custom
- inventory: user_id, is_equipped
- transactions: user_id, created_at, type
- challenges: is_active, start_date, end_date
- challenge_participants: challenge_id, user_id
- friendships: user_id, friend_id, status

### 3.3 Row Level Security 정책 구현 ✅

모든 11개 테이블에 대해 RLS를 활성화하고 정책을 구현했습니다:

#### 프로필 및 캐릭터

- 사용자는 자신의 프로필과 캐릭터만 조회/수정 가능

#### 태스크 및 습관

- 사용자는 자신의 태스크, 습관 로그, 연속 기록만 관리 가능

#### 보상 및 인벤토리

- 사용자는 자신의 보상과 인벤토리만 관리 가능

#### 거래

- 사용자는 자신의 거래 내역만 조회 가능

#### 챌린지

- 모든 사용자가 활성 챌린지 조회 가능
- 생성자만 자신의 챌린지 수정 가능
- 모든 사용자가 챌린지 참가 가능

#### 친구

- 사용자는 자신과 관련된 친구 관계만 조회/관리 가능

### 3.4 아바타용 Storage 버킷 설정 ✅

**avatars** 스토리지 버킷 생성:

- 공개 접근 가능 (public: true)
- 파일 크기 제한: 5MB
- 허용된 MIME 타입: image/jpeg, image/png, image/webp, image/gif

#### 스토리지 정책

- 모든 사용자가 아바타 이미지 조회 가능
- 사용자는 자신의 아바타만 업로드/수정/삭제 가능
- 폴더 구조: `{user_id}/avatar.{ext}`

### 3.5 관련 테이블에 대한 Realtime 활성화 ✅

다음 테이블에 대해 Realtime 구독 활성화:

- **tasks** - 실시간 태스크 업데이트
- **characters** - 실시간 캐릭터 진행 상황
- **challenges** - 실시간 챌린지 업데이트
- **challenge_participants** - 실시간 참가자 업데이트
- **streaks** - 실시간 연속 기록 업데이트
- **inventory** - 실시간 장비 업데이트

## 기술 세부사항

### 데이터베이스 제약 조건

- 모든 외래 키에 CASCADE 삭제 설정
- 캐릭터 통계에 CHECK 제약 조건:
  - level >= 1
  - xp >= 0
  - hp: 0-100 범위
  - gold >= 0
- 보상 가격 > 0
- 친구 관계: user_id != friend_id

### 기본값

- 캐릭터: level=1, xp=0, hp=100, gold=0
- 태스크: difficulty='easy', is_completed=false
- 연속 기록: current_streak=0, best_streak=0
- 인벤토리: quantity=1, is_equipped=false
- 챌린지: is_active=true
- 친구: status='pending'

## 검증

✅ 모든 11개 테이블이 성공적으로 생성됨
✅ 모든 테이블에 RLS가 활성화됨
✅ 20개 이상의 RLS 정책이 적용됨
✅ avatars 스토리지 버킷이 생성됨
✅ 6개 테이블에 Realtime이 활성화됨

## 다음 단계

이제 다음 작업을 진행할 수 있습니다:

- Task 4: 공유 유틸리티 패키지 생성 (XP 계산, 날짜 헬퍼, 골드 계산)
- Task 5: 공유 API 클라이언트 패키지 생성 (Supabase 클라이언트, 인증, 태스크 API 등)

## 참고사항

- 마이그레이션 이름:
  1. `create_gamified_todo_schema`
  2. `enable_rls_policies`
  3. `create_avatars_storage_bucket`
  4. `enable_realtime_for_tables`
- 모든 타임스탬프는 UTC 기준
- JSONB 필드는 유연한 데이터 구조를 위해 사용됨 (avatar_config, repeat_pattern, checklist, stat_bonuses)
