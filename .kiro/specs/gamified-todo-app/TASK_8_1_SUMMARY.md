# Task 8.1: App Router로 Next.js 초기화

## 완료 내용

Next.js 15 웹 애플리케이션을 React Native Web 지원과 함께 성공적으로 초기화했습니다. 웹과 모바일이 최대한 코드를 공유할 수 있도록 구성했습니다.

## 주요 구성

### 1. React Native Web 통합

**next.config.ts 설정:**

- `react-native` → `react-native-web` 별칭 설정
- 공유 패키지 트랜스파일 (`@repo/ui`, `@repo/hooks`, `@repo/api`, `@repo/utils`, `@repo/types`)
- `.web.tsx` 확장자 우선순위 지원
- 패키지 최적화 설정

**장점:**

- React Native 컴포넌트를 웹에서 그대로 사용 가능
- `<View>`, `<Text>`, `StyleSheet` 등이 자동으로 HTML로 변환
- 웹/모바일 간 코드 중복 최소화

### 2. App Router 구조

```
apps/web/src/app/
├── layout.tsx       # 루트 레이아웃 (메타데이터, Providers)
├── page.tsx         # 홈 페이지 (대시보드로 리다이렉트)
├── providers.tsx    # React Query + Auth Provider
└── globals.css      # 글로벌 스타일 + RN Web 호환성
```

### 3. Providers 설정

**QueryClientProvider:**

- React Query 설정 (1분 staleTime, 재시도 1회)
- 윈도우 포커스 시 자동 refetch 비활성화

**AuthProvider:**

- `@repo/hooks`의 인증 컨텍스트
- 전역 인증 상태 관리

**Supabase 클라이언트:**

- 환경 변수에서 자동 초기화
- 세션 지속성, 자동 토큰 갱신, URL 세션 감지 활성화

### 4. TypeScript 설정

**경로 별칭:**

```typescript
"@/*": ["./src/*"]
"@repo/ui": ["../../packages/ui/src"]
"@repo/hooks": ["../../packages/hooks/src"]
"@repo/api": ["../../packages/api/src"]
"@repo/types": ["../../packages/types/src"]
"@repo/utils": ["../../packages/utils/src"]
```

**skipLibCheck:** 의존성 패키지의 타입 에러 무시

### 5. 환경 변수

```.env.local
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 6. 글로벌 스타일

**globals.css 특징:**

- CSS 리셋 및 기본 스타일
- React Native Web 호환성 (`#__next` flex 레이아웃)
- 커스텀 스크롤바 스타일링
- 접근성을 위한 포커스 스타일
- 마우스 사용자를 위한 포커스 아웃라인 비활성화

## 코드 공유 전략

### 공유 가능한 코드

✅ **UI 컴포넌트** - `@repo/ui`에서 React Native로 작성
✅ **비즈니스 로직** - `@repo/hooks`의 커스텀 훅
✅ **API 호출** - `@repo/api`의 Supabase 클라이언트
✅ **타입 정의** - `@repo/types`의 TypeScript 타입
✅ **유틸리티** - `@repo/utils`의 헬퍼 함수

### 플랫폼별 코드

🌐 **웹 전용:**

- Next.js 라우팅 (`app/` 디렉토리)
- SEO 메타데이터
- 서버 컴포넌트 (필요시)

📱 **모바일 전용:**

- React Native 네비게이션
- 네이티브 모듈 (카메라, 알림 등)
- 앱 설정 (app.json)

## 사용 예시

### 공유 컴포넌트 사용

```typescript
// 웹과 모바일 모두에서 동일하게 작동
import { Button, Container } from '@repo/ui'
import { useAuth, useTasks } from '@repo/hooks'

export default function TaskList() {
  const { user } = useAuth()
  const { data: tasks } = useTasks()

  return (
    <Container>
      {tasks?.tasks.map(task => (
        <Button key={task.id} title={task.title} />
      ))}
    </Container>
  )
}
```

### 플랫폼별 확장자

```
Button.tsx          # 공통 코드
Button.web.tsx      # 웹 전용 오버라이드
Button.native.tsx   # 모바일 전용 오버라이드
```

## 개발 명령어

```bash
# 개발 서버 실행
pnpm dev

# 프로덕션 빌드
pnpm build

# 프로덕션 서버 실행
pnpm start

# 타입 체크
pnpm check-types

# 린트
pnpm lint
```

## 다음 단계

Task 8.2부터는 실제 페이지들을 구현합니다:

- 8.2: 인증 페이지 (로그인/회원가입)
- 8.3: 대시보드 레이아웃
- 8.4: 대시보드 페이지
- 8.5: 태스크 페이지
- 8.6: 캐릭터 페이지
- 8.7: 상점 및 인벤토리 페이지
- 8.8: 분석 페이지
- 8.9: 설정 페이지

## 기술 스택

- **프레임워크:** Next.js 15 (App Router)
- **UI:** React Native Web + @repo/ui
- **상태 관리:** React Query + Context API
- **인증:** Supabase Auth
- **데이터베이스:** Supabase (PostgreSQL)
- **스타일링:** React Native StyleSheet
- **TypeScript:** 완전한 타입 안전성

## 성능 최적화

- 코드 스플리팅 (Next.js 자동)
- 공유 패키지 최적화 (`optimizePackageImports`)
- React Query 캐싱
- 서버 사이드 렌더링 (SSR)

## 접근성

- 키보드 네비게이션 지원
- 포커스 관리
- 시맨틱 HTML (React Native Web 자동 변환)

## 배포

**Vercel 권장:**

- 자동 배포 (Git push 시)
- 환경 변수 관리
- 프리뷰 배포
- Edge Functions 지원

## 참고사항

- React Native Web은 대부분의 RN 컴포넌트를 지원하지만, 일부 네이티브 모듈은 웹에서 작동하지 않을 수 있습니다
- 플랫폼별 코드가 필요한 경우 `.web.tsx` 또는 `.native.tsx` 확장자를 사용하세요
- 이미지 경로는 Next.js의 `public/` 폴더 또는 `next/image` 컴포넌트를 사용하세요
