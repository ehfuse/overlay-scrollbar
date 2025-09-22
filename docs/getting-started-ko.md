# OverlayScrollbar 시작하기 (한국어)

이 가이드는 OverlayScrollbar React 컴포넌트를 프로젝트에 설치하고 사용하는 방법을 단계별로 설명합니다.

## 목차

1. [설치](#설치)
2. [기본 사용법](#기본-사용법)
3. [고급 사용법](#고급-사용법)
4. [스타일링](#스타일링)
5. [문제 해결](#문제-해결)

## 설치

### npm 사용

```bash
npm install @ehfuse/overlay-scrollbar
```

### yarn 사용

```bash
yarn add @ehfuse/overlay-scrollbar
```

### pnpm 사용

```bash
pnpm add @ehfuse/overlay-scrollbar
```

## 기본 사용법

### 1. 컴포넌트 가져오기

```tsx
import React from "react";
import { OverlayScrollbar } from "@ehfuse/overlay-scrollbar";
```

### 2. 기본 구현

```tsx
function MyComponent() {
    return (
        <div style={{ height: "400px" }}>
            <OverlayScrollbar>
                <div style={{ height: "1000px", padding: "20px" }}>
                    <h2>스크롤 가능한 콘텐츠</h2>
                    <p>여기에 긴 콘텐츠가 들어갑니다...</p>
                    {/* 더 많은 콘텐츠 */}
                </div>
            </OverlayScrollbar>
        </div>
    );
}
```

### 3. 핵심 개념

-   **오버레이 스크롤바**: 콘텐츠 위에 표시되어 레이아웃에 영향을 주지 않습니다
-   **자동 숨김**: 스크롤이 필요없거나 비활성 상태일 때 자동으로 숨겨집니다
-   **호버 표시**: 마우스를 오른쪽 가장자리에 올리면 스크롤바가 나타납니다
-   **부드러운 애니메이션**: 모든 상태 변화에 부드러운 전환 효과가 적용됩니다

## 고급 사용법

### Ref를 통한 스크롤 제어

```tsx
import React, { useRef } from "react";
import {
    OverlayScrollbar,
    OverlayScrollbarRef,
} from "@ehfuse/overlay-scrollbar";

function AdvancedComponent() {
    const scrollbarRef = useRef<OverlayScrollbarRef>(null);

    const scrollToTop = () => {
        scrollbarRef.current?.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const scrollToPosition = (position: number) => {
        scrollbarRef.current?.scrollTo({
            top: position,
            behavior: "smooth",
        });
    };

    const getScrollInfo = () => {
        if (scrollbarRef.current) {
            const scrollTop = scrollbarRef.current.scrollTop;
            const scrollHeight = scrollbarRef.current.scrollHeight;
            const clientHeight = scrollbarRef.current.clientHeight;

            console.log({
                현재위치: scrollTop,
                전체높이: scrollHeight,
                보이는높이: clientHeight,
                스크롤가능높이: scrollHeight - clientHeight,
            });
        }
    };

    return (
        <div>
            <div style={{ marginBottom: "10px" }}>
                <button onClick={scrollToTop}>맨 위로</button>
                <button onClick={() => scrollToPosition(500)}>
                    500px 위치로
                </button>
                <button onClick={getScrollInfo}>스크롤 정보 출력</button>
            </div>

            <div style={{ height: "400px" }}>
                <OverlayScrollbar
                    ref={scrollbarRef}
                    onScroll={(event) => {
                        console.log("스크롤 이벤트:", event);
                    }}
                >
                    <div style={{ height: "1000px", padding: "20px" }}>
                        {/* 콘텐츠 */}
                    </div>
                </OverlayScrollbar>
            </div>
        </div>
    );
}
```

### 스크롤 이벤트 처리

```tsx
function ScrollEventExample() {
    const handleScroll = (event: Event) => {
        const target = event.target as HTMLDivElement;
        const scrollPercentage =
            (target.scrollTop / (target.scrollHeight - target.clientHeight)) *
            100;

        console.log(`스크롤 진행률: ${scrollPercentage.toFixed(1)}%`);
    };

    return (
        <OverlayScrollbar onScroll={handleScroll}>
            {/* 콘텐츠 */}
        </OverlayScrollbar>
    );
}
```

## 스타일링

### CSS 클래스를 통한 커스터마이징

```tsx
import "./custom-scrollbar.css";

function StyledScrollbar() {
    return (
        <OverlayScrollbar
            className="my-custom-scrollbar"
            style={{
                height: "400px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                backgroundColor: "#f9f9f9",
            }}
        >
            {/* 콘텐츠 */}
        </OverlayScrollbar>
    );
}
```

**custom-scrollbar.css:**

```css
.my-custom-scrollbar {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.my-custom-scrollbar .overlay-scrollbar-container {
    padding: 16px;
}

/* 스크롤바 트랙 커스터마이징 */
.my-custom-scrollbar .overlay-scrollbar-track:hover {
    background-color: rgba(0, 0, 0, 0.05) !important;
}
```

### 다양한 레이아웃에서의 사용

```tsx
// 카드 내부에서 사용
function CardWithScrollbar() {
    return (
        <div className="card">
            <div className="card-header">
                <h3>제목</h3>
            </div>
            <div className="card-body" style={{ height: "300px" }}>
                <OverlayScrollbar>
                    <div style={{ padding: "16px" }}>{/* 카드 내용 */}</div>
                </OverlayScrollbar>
            </div>
        </div>
    );
}

// 사이드바에서 사용
function Sidebar() {
    return (
        <div className="sidebar" style={{ width: "250px", height: "100vh" }}>
            <div className="sidebar-header">로고</div>
            <div style={{ flex: 1 }}>
                <OverlayScrollbar>
                    <nav>{/* 네비게이션 메뉴 */}</nav>
                </OverlayScrollbar>
            </div>
        </div>
    );
}
```

## 문제 해결

### 자주 묻는 질문

**Q: 스크롤바가 보이지 않아요**
A: 다음을 확인해보세요:

-   컨테이너에 고정 높이가 설정되어 있는지
-   콘텐츠가 컨테이너보다 높은지
-   CSS에서 overflow가 hidden으로 설정되어 있는지

**Q: 스크롤이 부드럽지 않아요**
A: `scrollTo` 메서드에 `behavior: 'smooth'` 옵션을 사용하세요:

```tsx
scrollbarRef.current?.scrollTo({ top: 100, behavior: "smooth" });
```

**Q: 모바일에서 작동하지 않아요**
A: 모바일 디바이스에서는 네이티브 터치 스크롤이 우선시됩니다. 이는 의도된 동작입니다.

**Q: 다른 스크롤바와 충돌해요**
A: 다른 스크롤바 라이브러리와 함께 사용할 때는 CSS 우선순위를 확인하고, 필요시 `!important`를 사용하세요.

### 성능 최적화 팁

1. **큰 리스트 가상화**: 매우 긴 리스트의 경우 react-window나 react-virtualized와 함께 사용하세요
2. **이벤트 디바운싱**: onScroll 이벤트에서 무거운 작업을 할 때는 디바운싱을 적용하세요
3. **메모이제이션**: React.memo나 useMemo를 사용하여 불필요한 리렌더링을 방지하세요

### 디버깅

개발 중 문제가 발생하면 다음 코드로 디버깅할 수 있습니다:

```tsx
function DebugScrollbar() {
    const scrollbarRef = useRef<OverlayScrollbarRef>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            if (scrollbarRef.current) {
                console.log("스크롤 상태:", {
                    scrollTop: scrollbarRef.current.scrollTop,
                    scrollHeight: scrollbarRef.current.scrollHeight,
                    clientHeight: scrollbarRef.current.clientHeight,
                    container: scrollbarRef.current.getScrollContainer(),
                });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <OverlayScrollbar ref={scrollbarRef}>{/* 콘텐츠 */}</OverlayScrollbar>
    );
}
```

## 다음 단계

-   [API 레퍼런스](https://github.com/ehfuse/overlay-scrollbar/blob/main/README.md#api-reference)에서 모든 prop과 메서드 확인
-   [영어 버전 가이드](https://github.com/ehfuse/overlay-scrollbar/blob/main/docs/getting-started-en.md)
-   [배포 가이드](https://github.com/ehfuse/overlay-scrollbar/blob/main/docs/DEPLOY.md) (개발자용)

## 도움이 필요하신가요?

-   [GitHub Issues](https://github.com/ehfuse/overlay-scrollbar/issues)에서 버그 신고나 기능 요청
-   [GitHub Discussions](https://github.com/ehfuse/overlay-scrollbar/discussions)에서 질문하기
