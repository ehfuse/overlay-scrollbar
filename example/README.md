# OverlayScrollbar 예제

이 폴더는 OverlayScrollbar 컴포넌트의 다양한 기능을 테스트하고 데모를 확인할 수 있는 예제 프로젝트입니다.

## 🚀 시작하기

### 설치 및 실행

```bash
# example 폴더로 이동
cd example

# 의존성 설치 (이미 설치되어 있다면 생략)
npm install

# 개발 서버 실행
npm run dev
```

개발 서버가 실행되면 브라우저에서 `http://localhost:5173` (또는 표시된 포트)으로 접속하세요.

## 📁 프로젝트 구조

```
example/
├── pages/                      # 테스트 페이지 컴포넌트들
│   ├── BasicScrollPage.tsx     # 기본 스크롤 기능 테스트
│   ├── ControlledScrollPage.tsx # 프로그래밍 방식 스크롤 제어
│   ├── StyleTestPage.tsx       # 다양한 테마/스타일 테스트
│   └── TestIndexPage.tsx       # 테스트 페이지 인덱스
├── src/
│   ├── App.tsx                 # 메인 앱 컴포넌트
│   └── main.tsx               # 엔트리 포인트
├── vite.config.ts             # Vite 설정
└── README.md                  # 이 파일
```

## 🧪 테스트 페이지

### 1. 기본 스크롤 테스트 (`BasicScrollPage.tsx`)

-   OverlayScrollbar의 기본 스크롤 동작
-   긴 콘텐츠 목록을 통한 스크롤 테스트
-   자동 스크롤바 표시/숨김 확인

### 2. 제어 가능한 스크롤 (`ControlledScrollPage.tsx`)

-   프로그래밍 방식으로 스크롤 위치 제어
-   `scrollTo()` 메서드 사용법
-   맨 위/중간/맨 아래로 이동하는 버튼들

### 3. 스타일 테마 테스트 (`StyleTestPage.tsx`)

-   다양한 테마 적용 (기본, 다크, 컬러풀, 미니멀)
-   동적 스타일 변경
-   테마별 시각적 차이 확인

### 4. 테스트 인덱스 (`TestIndexPage.tsx`)

-   모든 테스트 페이지 소개
-   사용법 가이드
-   컴포넌트 참조 정보

## 💻 사용법

### App.tsx에서 테스트 페이지 사용하기

```tsx
import { OverlayScrollbar } from "@/OverlayScrollbar";
import BasicScrollPage from "./pages/BasicScrollPage";

function App() {
    return (
        <div>
            {/* 기본 예제 */}
            <BasicScrollPage />

            {/* 또는 직접 사용 */}
            <OverlayScrollbar style={{ height: "400px" }}>
                <div>{/* 여기에 긴 콘텐츠 */}</div>
            </OverlayScrollbar>
        </div>
    );
}
```

### 라우터 설정 (선택사항)

React Router를 설치하여 페이지 간 네비게이션을 구현할 수 있습니다:

```bash
npm install react-router-dom
```

```tsx
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import BasicScrollPage from "./pages/BasicScrollPage";
import ControlledScrollPage from "./pages/ControlledScrollPage";
import StyleTestPage from "./pages/StyleTestPage";

function App() {
    return (
        <BrowserRouter>
            <nav>
                <Link to="/basic">기본 스크롤</Link>
                <Link to="/controlled">제어 스크롤</Link>
                <Link to="/styles">스타일 테스트</Link>
            </nav>

            <Routes>
                <Route path="/basic" element={<BasicScrollPage />} />
                <Route path="/controlled" element={<ControlledScrollPage />} />
                <Route path="/styles" element={<StyleTestPage />} />
            </Routes>
        </BrowserRouter>
    );
}
```

## 🛠️ 개발 환경

-   **React**: 19.x
-   **TypeScript**: 최신 버전
-   **Vite**: 최신 버전
-   **Node.js**: 18+ 권장

## 📝 참고사항

-   이 예제 폴더는 npm 패키지에 포함되지 않습니다 (`.npmignore`에 설정)
-   TypeScript 경로 매핑이 설정되어 있어 `@/OverlayScrollbar`로 컴포넌트를 import할 수 있습니다
-   모든 테스트 페이지는 독립적으로 작동하므로 필요한 것만 사용할 수 있습니다

## 🤝 기여하기

새로운 테스트 케이스나 예제를 추가하고 싶다면:

1. `pages/` 폴더에 새로운 컴포넌트 추가
2. `TestIndexPage.tsx`에 새 페이지 정보 추가
3. 이 README에 설명 추가

## 📞 문의

문제가 있거나 제안사항이 있다면 이슈를 생성해주세요.
