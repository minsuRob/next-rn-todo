# 🚀 Quick Reference - 면접 1분 전 체크리스트

## 📌 30초 엘리베이터 피치

> "할 일 관리를 RPG 게임처럼 만든 크로스 플랫폼 앱입니다.
> Monorepo로 웹과 모바일 코드를 90% 공유하며,
> Supabase로 실시간 동기화를 구현했습니다.
> React Query로 Optimistic Updates를 적용해
> 사용자 경험을 극대화했습니다."

---

## 🎯 핵심 키워드 (암기 필수!)

### 기술 스택

- **Frontend**: Next.js 15 (App Router) + React Native + Expo
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **상태 관리**: TanStack Query (React Query v5)
- **Monorepo**: Turborepo + PNPM Workspaces
- **타입 안전성**: TypeScript + Zod

### 아키텍처 패턴

- **Monorepo**: 코드 재사용 90%+
- **React Native Web**: 웹/모바일 통합
- **Optimistic Updates**: 즉각적인 UI 반응
- **Row Level Security**: 데이터베이스 레벨 보안
- **Realtime Sync**: WebSocket 기반 동기화

---

## 💡 자주 나오는 질문 TOP 5

### 1. "왜 Monorepo를 선택했나요?"

**답변**: 코드 재사용(90%+), 타입 안전성, 개발 효율성

### 2. "React Native Web은 어떻게 동작하나요?"

**답변**: RN 컴포넌트를 웹 DOM으로 자동 변환 (`<View>` → `<div>`)

### 3. "Optimistic Update가 뭔가요?"

**답변**: API 응답 전에 UI를 먼저 업데이트해서 즉각적인 피드백 제공

### 4. "실시간 동기화는 어떻게 구현했나요?"

**답변**: Supabase Realtime (WebSocket) + React Query 캐시 무효화

### 5. "성능 최적화는 어떻게 했나요?"

**답변**: React Query 캐싱, 가상화, 코드 스플리팅, 이미지 최적화

---

## 📊 숫자로 말하기

- **90%+** 코드 재사용률 (웹/모바일)
- **50%** 개발 시간 단축
- **90%** API 요청 감소 (캐싱)
- **40%** 번들 사이즈 감소 (코드 스플리팅)
- **95+** Lighthouse 점수

---

## 🔄 데이터 플로우 (암기!)

```
User Action
  ↓
Optimistic Update (즉시 UI 변경)
  ↓
API 요청
  ↓
Supabase Function (XP 계산, 레벨업 체크)
  ↓
Response 수신
  ↓
React Query Cache 무효화
  ↓
UI 자동 업데이트
```

---

## 🏗️ 폴더 구조 (핵심만!)

```
apps/
  ├── web/          # Next.js
  └── native/       # React Native
packages/
  ├── ui/           # 공통 컴포넌트
  ├── hooks/        # 공통 훅
  ├── api/          # API 클라이언트
  └── types/        # 타입 정의
```

---

## 🎤 강조할 점

1. **현대적 기술**: Next.js 15, React Query v5, Supabase
2. **실무 패턴**: Monorepo, Optimistic Updates, RLS
3. **성능**: 캐싱, 가상화, 코드 스플리팅
4. **보안**: RLS, JWT, 환경 변수 암호화
5. **확장성**: 레이어드 아키텍처, 의존성 역전

---

## ⚠️ 피해야 할 답변

❌ "튜토리얼 따라했어요"
✅ "이 기술을 선택한 이유는..."

❌ "잘 모르겠어요"
✅ "현재는 이렇게 구현했고, 개선 방향은..."

❌ "시간이 없어서"
✅ "MVP에 집중했고, 로드맵은..."

---

## 🎯 데모 시나리오 (1분)

1. **로그인** (5초)
2. **대시보드** (10초) - 캐릭터 스탯 보여주기
3. **태스크 완료** (15초) - Optimistic Update 강조
4. **실시간 동기화** (15초) - 모바일에서 동시 업데이트
5. **코드 설명** (15초) - 공통 컴포넌트 강조

---

## 📝 마무리 멘트

> "이 프로젝트를 통해 Monorepo 아키텍처와
> 크로스 플랫폼 개발 경험을 쌓았습니다.
> 특히 코드 재사용과 타입 안전성을 중시하는
> 개발 문화를 체득했습니다."

---

## 🔗 빠른 링크

- [상세 아키텍처](ARCHITECTURE.md)
- [면접 가이드](INTERVIEW_GUIDE.md)
- [시스템 다이어그램](DIAGRAMS.md)

---

**Good Luck! 화이팅! 🚀**
