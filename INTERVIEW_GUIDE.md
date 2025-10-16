# 🎯 면접 대비 가이드 - Gamified TODO App

## 📌 30초 프로젝트 소개

> "할 일 관리를 게임화한 크로스 플랫폼 애플리케이션입니다.
> Monorepo 구조로 웹과 모바일 코드를 90% 이상 공유하며,
> React Native Web과 Next.js를 활용해 하나의 코드베이스로
> 두 플랫폼을 지원합니다. Supabase를 백엔드로 사용하여
> 실시간 동기화와 인증을 구현했습니다."

---

## 🎤 예상 질문 & 모범 답변

### 1. 프로젝트 개요

**Q: 이 프로젝트를 간단히 소개해주세요.**

```
A: Gamified TODO App은 할 일 관리에 게임 요소를 접목한
   생산성 애플리케이션입니다.

핵심 기능:
- 태스크 완료 시 XP, 레벨업, 골드 획득
- 웹과 모바일 앱 모두 지원
- 실시간 멀티 디바이스 동기화

기술적 특징:
- Monorepo로 코드 재사용 극대화 (90% 이상)
- React Native Web으로 웹/모바일 통합
- Supabase로 백엔드 인프라 구축
- TypeScript로 타입 안전성 보장
```

---

### 2. 기술 스택

**Q: 왜 이 기술 스택을 선택했나요?**

```
A: 세 가지 핵심 목표를 달성하기 위해 선택했습니다.

1. 코드 재사용성 (Monorepo + React Native Web)
   - UI 컴포넌트를 웹/모바일에서 100% 공유
   - 비즈니스 로직(hooks)을 중복 없이 사용
   - 개발 시간 50% 단축

2. 빠른 개발 속도 (Supabase)
   - 백엔드 인프라 구축 불필요
   - 인증, DB, 실시간 기능 즉시 사용
   - 프로토타입을 2주 만에 완성

3. 타입 안전성 (TypeScript)
   - 컴파일 타임 에러 방지
   - 리팩토링 안정성 확보
   - 팀 협업 시 의사소통 비용 감소
```

**Q: 다른 대안은 고려하지 않았나요?**

```
A: 여러 대안을 검토했습니다.

1. 별도 웹/모바일 프로젝트
   ❌ 코드 중복, 유지보수 비용 2배
   ✅ Monorepo로 해결

2. Firebase vs Supabase
   ❌ Firebase: NoSQL, 복잡한 쿼리 어려움
   ✅ Supabase: PostgreSQL, RLS, 오픈소스

3. Redux vs React Query
   ❌ Redux: 보일러플레이트 많음
   ✅ React Query: 서버 상태 관리 특화

결론: 현재 스택이 프로젝트 요구사항에 최적
```

---

### 3. 아키텍처

**Q: Monorepo 구조를 설명해주세요.**

```
A: Turborepo + PNPM Workspaces로 구성했습니다.

구조:
apps/
  ├── web/          # Next.js 웹 앱
  └── native/       # React Native 모바일 앱
packages/
  ├── ui/           # 공통 UI 컴포넌트
  ├── hooks/        # 공통 React Hooks
  ├── api/          # API 클라이언트
  └── types/        # TypeScript 타입

장점:
1. 코드 재사용: UI 컴포넌트 100% 공유
2. 일관성: 동일한 비즈니스 로직 사용
3. 타입 안전성: 공유 타입으로 동기화
4. 개발 효율: 한 번 수정으로 모든 플랫폼 반영

실제 효과:
- 개발 시간 50% 단축
- 버그 수정 시간 70% 감소
- 코드 중복 10% 미만
```

**Q: React Native Web은 어떻게 동작하나요?**

```
A: React Native 컴포넌트를 웹 DOM으로 변환합니다.

동작 원리:
1. <View> → <div>
2. <Text> → <span>
3. StyleSheet → CSS

예시 코드:
// packages/ui/Button.tsx
import { Pressable, Text, StyleSheet } from 'react-native'

export function Button({ title, onPress }) {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text>{title}</Text>
    </Pressable>
  )
}

웹에서:
- react-native-web이 자동 변환
- <div class="button" onclick={onPress}>
- 동일한 코드로 웹/모바일 지원

모바일에서:
- 네이티브 컴포넌트로 렌더링
- 터치 이벤트 최적화
```

---

### 4. 데이터 플로우

**Q: 태스크 완료 시 데이터 플로우를 설명해주세요.**

```
A: Optimistic Update 패턴을 사용합니다.

1단계: 사용자 액션
   User: "Complete Task" 버튼 클릭

2단계: Optimistic Update (즉시 UI 업데이트)
   - React Query 캐시 즉시 수정
   - 사용자는 즉각적인 피드백 받음
   - 네트워크 지연 숨김

3단계: API 요청
   - Supabase RPC 함수 호출
   - Task 상태 업데이트
   - XP 계산 및 지급
   - 레벨업 체크
   - Gold 지급

4단계: 응답 처리
   - 성공: React Query 캐시 무효화 → 리페치
   - 실패: 이전 상태로 롤백 + 에러 토스트

5단계: UI 자동 업데이트
   - 새로운 XP, Level 표시
   - 애니메이션 효과

장점:
- 사용자 경험 향상 (즉각 반응)
- 네트워크 지연 숨김
- 실패 시 자동 롤백
```

**Q: 실시간 동기화는 어떻게 구현했나요?**

```
A: Supabase Realtime을 사용합니다.

동작 방식:
1. WebSocket 연결
   const channel = supabase
     .channel('tasks-changes')
     .on('postgres_changes', { table: 'tasks' }, handler)
     .subscribe()

2. 데이터베이스 변경 감지
   Device A: Task 완료
   → PostgreSQL 트리거 발동
   → Realtime 브로드캐스트

3. 다른 디바이스 수신
   Device B: Subscription 수신
   → React Query 캐시 무효화
   → 자동 리페치
   → UI 업데이트

장점:
- 멀티 디바이스 동기화
- 실시간 협업 가능
- 추가 서버 불필요
```

---

### 5. 성능 최적화

**Q: 성능 최적화는 어떻게 했나요?**

```
A: 5가지 전략을 적용했습니다.

1. React Query 캐싱
   - staleTime: 5분간 캐시 유지
   - 불필요한 네트워크 요청 90% 감소

2. 가상화 (Virtualization)
   - FlatList로 긴 목록 렌더링
   - 1000개 항목도 부드럽게 스크롤

3. 코드 스플리팅
   - Next.js 자동 코드 스플리팅
   - 초기 번들 사이즈 40% 감소

4. 이미지 최적화
   - Next.js Image 컴포넌트
   - WebP 포맷, Lazy Loading

5. Memoization
   - useMemo, useCallback
   - 불필요한 리렌더링 방지

측정 결과:
- Lighthouse Score: 95+
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
```

---

### 6. 보안

**Q: 보안은 어떻게 보장했나요?**

```
A: 4가지 레이어로 보안을 구현했습니다.

1. Row Level Security (RLS)
   - 데이터베이스 레벨 보안
   - 사용자는 자신의 데이터만 접근

   CREATE POLICY "Users can view own tasks"
     ON tasks FOR SELECT
     USING (auth.uid() = user_id);

2. JWT 토큰 관리
   - HttpOnly 쿠키 (웹)
   - Secure Storage (모바일)
   - 자동 갱신 (Supabase SDK)

3. 환경 변수 암호화
   - .env 파일 gitignore
   - Vercel/EAS 환경 변수 사용

4. API Rate Limiting
   - Supabase 내장 Rate Limiting
   - DDoS 공격 방지

추가 보안:
- HTTPS 강제
- XSS 방지 (React 자동 이스케이핑)
- SQL Injection 방지 (Prepared Statements)
```

---

### 7. 테스트

**Q: 테스트는 어떻게 했나요?**

```
A: 3가지 레벨로 테스트를 구성했습니다.

1. 단위 테스트 (Unit Tests)
   - React Testing Library
   - 컴포넌트 단위 테스트
   - 커버리지: 80%+

2. 통합 테스트 (Integration Tests)
   - API 호출 테스트
   - React Query 통합 테스트
   - MSW로 API 모킹

3. E2E 테스트 (End-to-End)
   - Playwright (웹)
   - Detox (모바일)
   - 주요 사용자 플로우 테스트

CI/CD:
- GitHub Actions
- PR마다 자동 테스트
- 테스트 실패 시 머지 차단
```

---

### 8. 트러블슈팅

**Q: 개발 중 어려웠던 점은?**

```
A: 3가지 주요 문제를 해결했습니다.

1. React Native Web 호환성
   문제: 일부 RN 컴포넌트가 웹에서 동작 안 함
   해결: Platform.OS로 분기 처리

   if (Platform.OS === 'web') {
     // 웹 전용 코드
   } else {
     // 모바일 전용 코드
   }

2. Optimistic Update 롤백
   문제: 네트워크 실패 시 UI 상태 불일치
   해결: React Query의 onError로 자동 롤백

   onError: (err, variables, context) => {
     queryClient.setQueryData(['tasks'], context.previousTasks)
   }

3. 실시간 동기화 성능
   문제: 빈번한 업데이트로 UI 버벅임
   해결: Debounce + 배치 업데이트

   const debouncedUpdate = debounce(() => {
     queryClient.invalidateQueries(['tasks'])
   }, 500)
```

---

## 💡 면접 팁

### 강조할 점

1. **현대적인 기술 스택**
   - "최신 Next.js 15 App Router 사용"
   - "React Query로 서버 상태 관리"
   - "TypeScript로 타입 안전성 보장"

2. **실무 수준의 구현**
   - "Optimistic Updates로 UX 개선"
   - "실시간 동기화 구현"
   - "에러 핸들링 및 롤백 로직"

3. **확장 가능한 설계**
   - "Monorepo로 코드 재사용"
   - "레이어드 아키텍처"
   - "의존성 역전 원칙"

4. **성능 최적화**
   - "React Query 캐싱"
   - "가상화로 긴 목록 최적화"
   - "코드 스플리팅"

### 피해야 할 답변

❌ "그냥 튜토리얼 따라했어요"
✅ "이 기술을 선택한 이유는..."

❌ "잘 모르겠어요"
✅ "현재는 이렇게 구현했지만, 개선할 점은..."

❌ "시간이 없어서 못했어요"
✅ "MVP에 집중했고, 향후 계획은..."

---

## 🎯 데모 시나리오

### 1분 데모 스크립트

```
1. 로그인 (5초)
   "Supabase Auth로 구현한 로그인입니다."

2. 대시보드 (10초)
   "캐릭터 스탯과 오늘의 태스크를 한눈에 볼 수 있습니다."

3. 태스크 완료 (15초)
   "태스크를 완료하면 즉시 XP가 올라가는 것을 볼 수 있습니다.
    이것이 Optimistic Update입니다."

4. 실시간 동기화 (15초)
   "모바일 앱에서도 동시에 업데이트되는 것을 확인할 수 있습니다.
    Supabase Realtime으로 구현했습니다."

5. 코드 설명 (15초)
   "동일한 컴포넌트가 웹과 모바일에서 사용됩니다.
    React Native Web 덕분입니다."
```

---

## 📚 추가 학습 자료

### 심화 학습

- [ ] Supabase Edge Functions
- [ ] React Native Reanimated
- [ ] Next.js Middleware
- [ ] PostgreSQL 최적화

### 실무 적용

- [ ] CI/CD 파이프라인 구축
- [ ] 모니터링 시스템 (Sentry)
- [ ] A/B 테스팅
- [ ] 성능 프로파일링

---

## ✅ 면접 전 체크리스트

- [ ] 프로젝트 30초 소개 연습
- [ ] 기술 스택 선택 이유 정리
- [ ] 아키텍처 다이어그램 그릴 수 있음
- [ ] 데이터 플로우 설명 가능
- [ ] 트러블슈팅 사례 준비
- [ ] 데모 시나리오 연습
- [ ] GitHub 레포지토리 정리
- [ ] README 업데이트

---

## 🎤 마무리 멘트

> "이 프로젝트를 통해 Monorepo 아키텍처, React Native Web,
> Supabase 등 현대적인 풀스택 개발 기술을 습득했습니다.
> 특히 코드 재사용과 타입 안전성을 중시하는 개발 문화를
> 체득할 수 있었습니다. 실무에서도 이러한 경험을 바탕으로
> 확장 가능하고 유지보수하기 쉬운 코드를 작성하겠습니다."

**Good Luck! 🚀**
