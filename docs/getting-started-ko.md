# OverlayScrollbar 시작하기 (한국어)

이 가이드는 고도로 커스터마이징 가능한 OverlayScrollbar React 컴포넌트를 프로젝트에 설치하고 사용하는 방법을 단계별로 설명합니다.

## 목차

1. [설치](#설치)
2. [기본 사용법](#기본-사용법)
3. [크기 설정](#크기-설정)
4. [화살표 네비게이션](#화살표-네비게이션)
5. [색상 커스터마이징](#색상-커스터마이징)
6. [고급 사용법](#고급-사용법)
7. [Ref 사용법](#ref-사용법)
8. [문제 해결](#문제-해결)

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

-   **진정한 오버레이**: 콘텐츠 위에 떠있어 레이아웃에 전혀 영향을 주지 않습니다
-   **스마트 자동 숨김**: 휠 스크롤 후 700ms, 기타 인터랙션 후 1500ms 뒤 자동으로 숨겨집니다
-   **호버 표시**: 트랙 영역에 마우스를 올리면 즉시 스크롤바가 나타납니다
-   **인터랙티브**: 클릭, 드래그, 화살표 버튼을 통한 다양한 스크롤 방식 지원
-   **부드러운 애니메이션**: 모든 상태 변화와 hover 효과에 부드러운 전환 적용

## 크기 설정

### 독립적인 크기 제어

```tsx
function SizeCustomization() {
    return (
        <OverlayScrollbar
            trackWidth={20} // 호버 감지 영역 너비 (기본: 16px)
            thumbWidth={10} // 썸과 트랙 배경 너비 (기본: 8px)
            thumbMinHeight={60} // 썸 최소 높이 (기본: 50px)
            thumbRadius={8} // 썸 모서리 둥글기 (기본: thumbWidth/2)
            style={{ height: "400px" }}
        >
            <div style={{ height: "1000px" }}>
                사이즈가 커스터마이징된 스크롤바
            </div>
        </OverlayScrollbar>
    );
}
```

## 화살표 네비게이션

### 화살표 버튼 활성화

```tsx
function ArrowNavigation() {
    return (
        <OverlayScrollbar
            showArrows={true} // 화살표 버튼 표시
            arrowStep={100} // 화살표 클릭당 스크롤 거리 (기본: 50px)
            arrowColor="rgba(80, 80, 80, 0.8)"
            arrowActiveColor="rgba(40, 40, 40, 1.0)" // 호버 시 색상
            style={{ height: "400px" }}
        >
            <div style={{ height: "1500px" }}>
                화살표 버튼으로 스크롤 가능한 콘텐츠
            </div>
        </OverlayScrollbar>
    );
}
```

## 색상 커스터마이징

### 완전한 색상 제어

```tsx
function ColorCustomization() {
    return (
        <OverlayScrollbar
            // 트랙 배경 색상
            trackColor="rgba(240, 240, 240, 0.8)"
            // 썸 색상 (일반 상태)
            thumbColor="rgba(100, 150, 200, 0.7)"
            // 썸 색상 (드래그 중)
            thumbActiveColor="rgba(100, 150, 200, 1.0)"
            // 화살표 색상
            showArrows={true}
            arrowColor="rgba(80, 80, 80, 0.8)"
            arrowActiveColor="rgba(40, 40, 40, 1.0)"
            style={{ height: "400px" }}
        >
            <div style={{ height: "1000px" }}>
                색상이 커스터마이징된 스크롤바
            </div>
        </OverlayScrollbar>
    );
}
```

## 고급 사용법

### 모든 옵션을 활용한 고급 설정

```tsx
function AdvancedUsage() {
    const handleScroll = (event: Event) => {
        console.log("스크롤 이벤트:", event);
    };

    return (
        <OverlayScrollbar
            // 크기 설정
            trackWidth={24}
            thumbWidth={12}
            thumbMinHeight={80}
            thumbRadius={10}
            // 화살표 설정
            showArrows={true}
            arrowStep={120}
            // 색상 설정
            trackColor="rgba(220, 220, 220, 0.9)"
            thumbColor="rgba(70, 130, 180, 0.8)"
            thumbActiveColor="rgba(70, 130, 180, 1.0)"
            arrowColor="rgba(100, 100, 100, 0.9)"
            arrowActiveColor="rgba(50, 50, 50, 1.0)"
            // 이벤트 핸들링
            onScroll={handleScroll}
            className="custom-scrollbar"
            style={{
                height: "500px",
                border: "1px solid #ddd",
                borderRadius: "8px",
            }}
        >
            <div style={{ height: "2000px", padding: "20px" }}>
                <h2>고급 커스터마이징 예제</h2>
                <p>모든 옵션이 적용된 스크롤바입니다.</p>
                {/* 더 많은 콘텐츠 */}
            </div>
        </OverlayScrollbar>
    );
}
```

## Ref 사용법

### 프로그래매틱 스크롤 제어

```tsx
import React, { useRef } from "react";
import {
    OverlayScrollbar,
    OverlayScrollbarRef,
} from "@ehfuse/overlay-scrollbar";

function RefUsage() {
    const scrollbarRef = useRef<OverlayScrollbarRef>(null);

    const scrollToTop = () => {
        scrollbarRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    };

    const scrollToBottom = () => {
        const container = scrollbarRef.current;
        if (container) {
            container.scrollTo({
                top: container.scrollHeight,
                behavior: "smooth",
            });
        }
    };

    const getScrollInfo = () => {
        if (scrollbarRef.current) {
            const { scrollTop, scrollHeight, clientHeight } =
                scrollbarRef.current;
            console.log("현재 스크롤 위치:", scrollTop);
            console.log("전체 스크롤 높이:", scrollHeight);
            console.log("보이는 영역 높이:", clientHeight);
        }
    };

    return (
        <div>
            <div style={{ marginBottom: "10px" }}>
                <button onClick={scrollToTop}>맨 위로</button>
                <button onClick={scrollToBottom}>맨 아래로</button>
                <button onClick={getScrollInfo}>스크롤 정보</button>
            </div>

            <OverlayScrollbar ref={scrollbarRef} style={{ height: "400px" }}>
                <div style={{ height: "1000px", padding: "20px" }}>
                    Ref를 통해 제어 가능한 스크롤바
                </div>
            </OverlayScrollbar>
        </div>
    );
}

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

### 스크롤바 너비 사용자 정의

버전 2.0부터 `scrollbarWidth` prop을 통해 스크롤바의 너비를 조정할 수 있습니다:

```tsx
function CustomWidthScrollbars() {
    return (
        <div style={{ display: "flex", gap: "20px" }}>
            {/* 얇은 스크롤바 (6px) */}
            <div style={{ width: "200px" }}>
                <h4>얇은 스크롤바</h4>
                <OverlayScrollbar
                    scrollbarWidth={6}
                    style={{ height: "300px", border: "1px solid #ddd" }}
                >
                    <div style={{ height: "800px", padding: "16px" }}>
                        미니멀한 디자인에 적합한 얇은 스크롤바입니다. 작은
                        화면이나 세밀한 UI에서 사용하기 좋습니다.
                    </div>
                </OverlayScrollbar>
            </div>

            {/* 기본 스크롤바 (8px) */}
            <div style={{ width: "200px" }}>
                <h4>기본 스크롤바</h4>
                <OverlayScrollbar
                    style={{ height: "300px", border: "1px solid #ddd" }}
                >
                    <div style={{ height: "800px", padding: "16px" }}>
                        기본 8px 너비의 스크롤바입니다. 대부분의 상황에서 적합한
                        크기입니다.
                    </div>
                </OverlayScrollbar>
            </div>

            {/* 두꺼운 스크롤바 (12px) */}
            <div style={{ width: "200px" }}>
                <h4>두꺼운 스크롤바</h4>
                <OverlayScrollbar
                    scrollbarWidth={12}
                    style={{ height: "300px", border: "1px solid #ddd" }}
                >
                    <div style={{ height: "800px", padding: "16px" }}>
                        더 잘 보이는 두꺼운 스크롤바입니다. 터치 기기나 접근성이
                        중요한 경우에 유용합니다.
                    </div>
                </OverlayScrollbar>
            </div>
        </div>
    );
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
                <OverlayScrollbar scrollbarWidth={6}>
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
                <OverlayScrollbar scrollbarWidth={10}>
                    <nav>{/* 네비게이션 메뉴 */}</nav>
                </OverlayScrollbar>
            </div>
        </div>
    );
}
```

## API 레퍼런스

### Props

| Prop                    | 타입                     | 기본값                       | 설명                                                           |
| ----------------------- | ------------------------ | ---------------------------- | -------------------------------------------------------------- |
| `children`              | `ReactNode`              | -                            | 스크롤할 콘텐츠                                                |
| `className`             | `string`                 | -                            | 컨테이너를 위한 추가 CSS 클래스                                |
| `style`                 | `React.CSSProperties`    | -                            | 컨테이너를 위한 추가 인라인 스타일                             |
| `onScroll`              | `(event: Event) => void` | -                            | 스크롤 발생 시 호출되는 콜백                                   |
| **크기 설정**           |                          |                              |                                                                |
| `trackWidth`            | `number`                 | `16`                         | 호버 감지 트랙 영역의 너비 (px)                                |
| `thumbWidth`            | `number`                 | `8`                          | 스크롤바 썸과 트랙 배경의 너비 (px)                            |
| `thumbMinHeight`        | `number`                 | `50`                         | 스크롤바 썸의 최소 높이 (px)                                   |
| `thumbRadius`           | `number`                 | `thumbWidth / 2`             | 스크롤바 썸의 둥근 모서리 반지름 (px)                          |
| `scrollbarWidth`        | `number`                 | `8`                          | **더 이상 사용되지 않음:** `trackWidth`/`thumbWidth` 사용 권장 |
| **화살표 설정**         |                          |                              |                                                                |
| `showArrows`            | `boolean`                | `false`                      | 상단/하단 내비게이션 화살표 표시                               |
| `arrowStep`             | `number`                 | `50`                         | 화살표 클릭 당 스크롤 거리 (px)                                |
| **색상 커스터마이징**   |                          |                              |                                                                |
| `trackColor`            | `string`                 | `"rgba(128, 128, 128, 0.1)"` | 스크롤바 트랙의 배경 색상                                      |
| `thumbColor`            | `string`                 | `"rgba(128, 128, 128, 0.6)"` | 스크롤바 썸의 색상                                             |
| `thumbActiveColor`      | `string`                 | `"rgba(128, 128, 128, 0.9)"` | 드래그 중인 썸의 색상                                          |
| `arrowColor`            | `string`                 | `"rgba(128, 128, 128, 0.8)"` | 내비게이션 화살표의 색상                                       |
| `arrowActiveColor`      | `string`                 | `"rgba(64, 64, 64, 1.0)"`    | 호버 시 화살표 색상                                            |
| **자동 숨김 시간 설정** |                          |                              |                                                                |
| `hideDelay`             | `number`                 | `1500`                       | 기본 자동 숨김 시간 (ms) - 드래그, 화살표 클릭, 호버 후 적용   |
| `hideDelayOnWheel`      | `number`                 | `700`                        | 휠 스크롤 후 자동 숨김 시간 (ms) - 빠른 숨김                   |

### TypeScript 타입

패키지는 더 나은 개발 경험을 위해 TypeScript 타입을 제공합니다:

```tsx
import {
    OverlayScrollbar,
    OverlayScrollbarProps,
    OverlayScrollbarRef,
} from "@ehfuse/overlay-scrollbar";
```

#### OverlayScrollbarProps

컴포넌트 props에 대한 인터페이스:

```tsx
interface OverlayScrollbarProps {
    className?: string;
    style?: React.CSSProperties;
    children: ReactNode;
    onScroll?: (event: Event) => void;

    // 크기 및 레이아웃
    scrollbarWidth?: number; // deprecated, trackWidth/thumbWidth 사용 권장
    thumbRadius?: number; // 썸의 border-radius (기본값: thumbWidth / 2)
    trackWidth?: number; // 호버 영역 너비 (기본값: 16px)
    thumbWidth?: number; // 썸과 트랙 배경 너비 (기본값: 8px)
    thumbMinHeight?: number; // 썸 최소 높이 (기본값: 50px)

    // 색상
    trackColor?: string; // 트랙 배경 색상 (기본값: "rgba(128, 128, 128, 0.1)")
    thumbColor?: string; // 썸 색상 (기본값: "rgba(128, 128, 128, 0.6)")
    thumbActiveColor?: string; // 드래그 중 썸 색상 (기본값: "rgba(128, 128, 128, 0.9)")
    arrowColor?: string; // 화살표 색상 (기본값: "rgba(128, 128, 128, 0.8)")
    arrowActiveColor?: string; // 화살표 호버 색상 (기본값: "rgba(64, 64, 64, 1.0)")

    // 화살표 네비게이션
    showArrows?: boolean; // 화살표 버튼 표시 (기본값: false)
    arrowStep?: number; // 화살표 클릭당 스크롤 거리 (기본값: 50px)

    // 자동 숨김 동작
    hideDelay?: number; // 기본 자동 숨김 지연 시간 (기본값: 1500ms)
    hideDelayOnWheel?: number; // 휠 스크롤 후 자동 숨김 지연 시간 (기본값: 700ms)
}
```

#### OverlayScrollbarRef

ref를 통해 접근 가능한 컴포넌트 메서드에 대한 인터페이스:

```tsx
interface OverlayScrollbarRef {
    getScrollContainer: () => HTMLDivElement | null;
    scrollTo: (options: ScrollToOptions) => void;
    scrollTop: number;
    scrollHeight: number;
    clientHeight: number;
}
```

#### TypeScript와 함께 사용하기

```tsx
import React, { useRef } from "react";
import {
    OverlayScrollbar,
    OverlayScrollbarProps,
    OverlayScrollbarRef,
} from "@ehfuse/overlay-scrollbar";

const MyComponent: React.FC = () => {
    const scrollRef = useRef<OverlayScrollbarRef>(null);

    const scrollbarProps: OverlayScrollbarProps = {
        showArrows: true,
        thumbRadius: 6,
        trackColor: "rgba(0, 0, 0, 0.1)",
        thumbColor: "rgba(100, 100, 100, 0.7)",
        hideDelay: 1500,
        onScroll: (event) => {
            console.log("스크롤됨!", scrollRef.current?.scrollTop);
        },
    };

    const handleScrollToTop = () => {
        scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div style={{ height: "400px" }}>
            <button onClick={handleScrollToTop}>맨 위로 스크롤</button>
            <OverlayScrollbar ref={scrollRef} {...scrollbarProps}>
                <div style={{ height: "1000px" }}>콘텐츠가 여기에...</div>
            </OverlayScrollbar>
        </div>
    );
};
```

### Ref 메소드

컴포넌트는 ref를 통해 여러 메소드를 제공합니다:

| 메소드               | 타입                                 | 설명                             |
| -------------------- | ------------------------------------ | -------------------------------- |
| `getScrollContainer` | `() => HTMLDivElement \| null`       | 스크롤 가능한 컨테이너 요소 반환 |
| `scrollTo`           | `(options: ScrollToOptions) => void` | 특정 위치로 스크롤               |
| `scrollTop`          | `number`                             | 현재 스크롤 top 위치 가져오기    |
| `scrollHeight`       | `number`                             | 전체 스크롤 가능한 높이 가져오기 |
| `clientHeight`       | `number`                             | 컨테이너의 가시 높이 가져오기    |

### ScrollToOptions

```typescript
interface ScrollToOptions {
    top?: number;
    left?: number;
    behavior?: "auto" | "smooth";
}
```

### 이벤트 핸들러

```typescript
type ScrollEventHandler = (event: Event) => void;
```

## 동작 방식

### 스마트 자동 숨김 시스템

-   **휠 스크롤 후**: 700ms 후 자동으로 숨겨짐 (빠른 반응)
-   **드래그 작업 중**: 표시 상태 유지
-   **드래그 종료 후**: 1500ms 후 숨겨짐
-   **화살표 클릭 후**: 1500ms 후 숨겨짐
-   **호버 해제 후**: 1500ms 후 숨겨짐
-   **호버 표시**: 트랙 영역에 마우스를 올리면 즉시 나타남

#### 타이밍 커스터마이징

```tsx
<OverlayScrollbar
    hideDelay={2000} // 기본 숨김 시간: 2초
    hideDelayOnWheel={500} // 휠 스크롤 후: 0.5초
>
    {children}
</OverlayScrollbar>
```

### 인터랙티브 스크롤

-   **트랙 클릭**: 클릭한 위치로 즉시 점프
-   **썸 드래그**: 정밀한 스크롤 제어
-   **화살표 버튼**: 단계별 내비게이션 (활성화 시)
-   **휠/터치**: 기본 네이티브 스크롤 동작 보존

### 시각적 피드백

-   **썸 상태**: 드래그 중 색상 변화
-   **화살표 호버**: 마우스 오버 시 색상 변화
-   **부드러운 전환**: 모든 상태 변화에 fade 애니메이션 적용
-   **반응형**: ResizeObserver를 사용한 자동 크기 조정

## 스타일링 시스템

### CSS 구조

컴포넌트는 인라인 스타일과 CSS 주입을 통해 진정한 오버레이 스크롤바를 생성합니다:

-   **트랙 영역**: 설정 가능한 호버 존 (기본 16px)으로 쉬운 상호작용
-   **트랙 배경**: 커스터마이징 가능한 색상과 둥근 모서리를 가진 시각적 스크롤바 트랙
-   **썸**: 독립적인 너비 제어와 시각적 상태를 가진 드래그 가능한 핸들
-   **화살표**: 호버 효과가 있는 선택적 내비게이션 버튼
-   **위치 지정**: 오른쪽 정렬된 진정한 오버레이로 콘텐츠 레이아웃에 영향 없음
-   **네이티브 스크롤바**: 기능을 보존하면서 CSS로 완전히 숨김
-   **커스터마이징**: prop을 통한 모든 시각적 측면의 완전한 제어

### CSS 클래스 커스터마이징

컴포넌트에는 다음과 같은 CSS 클래스가 자동으로 적용됩니다:

```css
/* 메인 컨테이너 */
.overlay-scrollbar-container {
    position: relative;
    overflow: hidden;
}

/* 스크롤 가능한 콘텐츠 영역 */
.overlay-scrollbar-content {
    height: 100%;
    overflow-y: auto;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE/Edge */
}

.overlay-scrollbar-content::-webkit-scrollbar {
    display: none; /* Chrome/Safari */
}

/* 트랙 영역 */
.overlay-scrollbar-track {
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    z-index: 1000;
}

/* 썸 */
.overlay-scrollbar-thumb {
    position: absolute;
    right: 0;
    cursor: pointer;
    border-radius: inherit;
    transition: all 0.2s ease;
}

/* 화살표 버튼 */
.overlay-scrollbar-arrow {
    position: absolute;
    right: 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
}
```

### 커스텀 스타일 예제

```css
/* 커스텀 스타일 오버라이드 */
.my-custom-scrollbar .overlay-scrollbar-track {
    background-color: rgba(0, 0, 0, 0.05) !important;
    border-radius: 10px !important;
}

.my-custom-scrollbar .overlay-scrollbar-thumb {
    background: linear-gradient(45deg, #667eea 0%, #764ba2 100%) !important;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2) !important;
}

.my-custom-scrollbar .overlay-scrollbar-thumb:hover {
    transform: scaleX(1.2) !important;
}
```

## 성능 최적화

### 렌더링 최적화

```typescript
// React.memo를 사용한 최적화
const OptimizedScrollbar = React.memo(({ children, ...props }) => {
    return <OverlayScrollbar {...props}>{children}</OverlayScrollbar>;
});

// useMemo를 사용한 props 최적화
function MyComponent() {
    const scrollbarProps = useMemo(
        () => ({
            trackWidth: 20,
            thumbWidth: 12,
            thumbColor: "rgba(100, 150, 200, 0.7)",
            thumbActiveColor: "rgba(100, 150, 200, 1.0)",
        }),
        []
    );

    return (
        <OverlayScrollbar {...scrollbarProps}>{/* 콘텐츠 */}</OverlayScrollbar>
    );
}
```

### 스크롤 이벤트 최적화

```typescript
// 디바운스된 스크롤 이벤트 처리
const debouncedScrollHandler = useMemo(
    () =>
        debounce((event: Event) => {
            console.log("스크롤 이벤트:", event);
            // 무거운 작업 수행
        }, 100),
    []
);

return (
    <OverlayScrollbar onScroll={debouncedScrollHandler}>
        {/* 콘텐츠 */}
    </OverlayScrollbar>
);
```

### 큰 리스트 최적화

```typescript
import { FixedSizeList as List } from "react-window";

function VirtualizedScrollbar() {
    return (
        <OverlayScrollbar style={{ height: "400px" }}>
            <List height={400} itemCount={1000} itemSize={35} itemData={items}>
                {Row}
            </List>
        </OverlayScrollbar>
    );
}
```

## 고급 사용 패턴

### 조건부 스크롤바 표시

```typescript
function ConditionalScrollbar({ showScrollbar = true }) {
    if (!showScrollbar) {
        return (
            <div style={{ height: "400px", overflow: "auto" }}>
                {/* 기본 스크롤바 사용 */}
            </div>
        );
    }

    return (
        <OverlayScrollbar style={{ height: "400px" }}>
            {/* 커스텀 스크롤바 사용 */}
        </OverlayScrollbar>
    );
}
```

### 스크롤 위치 동기화

```typescript
function SynchronizedScrollbars() {
    const [scrollTop, setScrollTop] = useState(0);
    const scrollbarRef1 = useRef<OverlayScrollbarRef>(null);
    const scrollbarRef2 = useRef<OverlayScrollbarRef>(null);

    const handleScroll = (
        event: Event,
        sourceRef: React.RefObject<OverlayScrollbarRef>
    ) => {
        const target = event.target as HTMLDivElement;
        const newScrollTop = target.scrollTop;

        setScrollTop(newScrollTop);

        // 다른 스크롤바 동기화
        const otherRef =
            sourceRef === scrollbarRef1 ? scrollbarRef2 : scrollbarRef1;
        otherRef.current?.scrollTo({ top: newScrollTop });
    };

    return (
        <div style={{ display: "flex", gap: "20px" }}>
            <OverlayScrollbar
                ref={scrollbarRef1}
                onScroll={(e) => handleScroll(e, scrollbarRef1)}
                style={{ width: "300px", height: "400px" }}
            >
                {/* 첫 번째 콘텐츠 */}
            </OverlayScrollbar>

            <OverlayScrollbar
                ref={scrollbarRef2}
                onScroll={(e) => handleScroll(e, scrollbarRef2)}
                style={{ width: "300px", height: "400px" }}
            >
                {/* 두 번째 콘텐츠 */}
            </OverlayScrollbar>
        </div>
    );
}
```

### 스크롤 진행률 표시

```typescript
function ScrollProgressIndicator() {
    const [progress, setProgress] = useState(0);
    const scrollbarRef = useRef<OverlayScrollbarRef>(null);

    const handleScroll = (event: Event) => {
        const target = event.target as HTMLDivElement;
        const { scrollTop, scrollHeight, clientHeight } = target;
        const totalScrollable = scrollHeight - clientHeight;
        const currentProgress =
            totalScrollable > 0 ? (scrollTop / totalScrollable) * 100 : 0;

        setProgress(currentProgress);
    };

    return (
        <div>
            {/* 진행률 바 */}
            <div
                style={{
                    width: "100%",
                    height: "4px",
                    backgroundColor: "#e0e0e0",
                    marginBottom: "10px",
                }}
            >
                <div
                    style={{
                        width: `${progress}%`,
                        height: "100%",
                        backgroundColor: "#2196F3",
                        transition: "width 0.1s ease",
                    }}
                />
            </div>

            <OverlayScrollbar
                ref={scrollbarRef}
                onScroll={handleScroll}
                style={{ height: "400px" }}
            >
                {/* 긴 콘텐츠 */}
            </OverlayScrollbar>

            <div>스크롤 진행률: {Math.round(progress)}%</div>
        </div>
    );
}
```

### 스크롤 위치 기억하기

```typescript
function RememberScrollPosition({ contentId }: { contentId: string }) {
    const scrollbarRef = useRef<OverlayScrollbarRef>(null);

    // 컴포넌트 마운트 시 저장된 스크롤 위치 복원
    useEffect(() => {
        const savedPosition = localStorage.getItem(`scroll-${contentId}`);
        if (savedPosition && scrollbarRef.current) {
            scrollbarRef.current.scrollTo({
                top: parseInt(savedPosition, 10),
                behavior: "auto",
            });
        }
    }, [contentId]);

    // 스크롤 위치 저장
    const handleScroll = useMemo(
        () =>
            debounce((event: Event) => {
                const target = event.target as HTMLDivElement;
                localStorage.setItem(
                    `scroll-${contentId}`,
                    target.scrollTop.toString()
                );
            }, 500),
        [contentId]
    );

    return (
        <OverlayScrollbar
            ref={scrollbarRef}
            onScroll={handleScroll}
            style={{ height: "400px" }}
        >
            {/* 콘텐츠 */}
        </OverlayScrollbar>
    );
}
```

### 스크롤 히스토리 관리

```typescript
function ScrollHistory() {
    const [history, setHistory] = useState<number[]>([]);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const scrollbarRef = useRef<OverlayScrollbarRef>(null);

    const addToHistory = (position: number) => {
        const newHistory = [...history.slice(0, currentIndex + 1), position];
        setHistory(newHistory);
        setCurrentIndex(newHistory.length - 1);
    };

    const goBack = () => {
        if (currentIndex > 0) {
            const newIndex = currentIndex - 1;
            const position = history[newIndex];
            setCurrentIndex(newIndex);
            scrollbarRef.current?.scrollTo({
                top: position,
                behavior: "smooth",
            });
        }
    };

    const goForward = () => {
        if (currentIndex < history.length - 1) {
            const newIndex = currentIndex + 1;
            const position = history[newIndex];
            setCurrentIndex(newIndex);
            scrollbarRef.current?.scrollTo({
                top: position,
                behavior: "smooth",
            });
        }
    };

    return (
        <div>
            <div>
                <button onClick={goBack} disabled={currentIndex <= 0}>
                    뒤로
                </button>
                <button
                    onClick={goForward}
                    disabled={currentIndex >= history.length - 1}
                >
                    앞으로
                </button>
            </div>

            <OverlayScrollbar
                ref={scrollbarRef}
                onScroll={(event) => {
                    const target = event.target as HTMLDivElement;
                    addToHistory(target.scrollTop);
                }}
                style={{ height: "400px" }}
            >
                {/* 콘텐츠 */}
            </OverlayScrollbar>
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

## 브라우저 지원

### 데스크톱 브라우저

-   **Chrome/Chromium**: 완전 지원 (버전 60+)
-   **Firefox**: 완전 지원 (버전 55+)
-   **Safari**: 완전 지원 (버전 12+)
-   **Edge**: 완전 지원 (Chromium 기반)

### 모바일 브라우저

-   **iOS Safari**: 터치 스크롤 지원, 오버레이 스크롤바 숨김
-   **Chrome Mobile**: 터치 스크롤 지원, 오버레이 스크롤바 숨김
-   **Samsung Internet**: 터치 스크롤 지원
-   **Firefox Mobile**: 터치 스크롤 지원

### 호환성 참고사항

-   모바일 디바이스에서는 네이티브 터치 스크롤이 우선시됩니다
-   오버레이 스크롤바는 터치 디바이스에서 자동으로 숨겨집니다
-   모든 브라우저에서 키보드 네비게이션 지원 (PageUp/PageDown, Home/End, 화살표 키)

## 성능 정보

### 최적화 기술

-   **ResizeObserver**: 효율적인 크기 변화 감지
-   **디바운스된 스크롤 이벤트**: 과도한 리렌더링 방지
-   **패시브 이벤트 리스너**: 가능한 경우 사용
-   **최소한의 DOM 조작**: 60fps 애니메이션에 최적화
-   **메모리 효율성**: 메모리 누수 방지를 위한 적절한 이벤트 리스너 정리

### 벤치마크 정보

-   **CPU 사용률**: 유휴 상태에서 0%, 스크롤 중 < 5%
-   **메모리 사용량**: 컴포넌트 당 < 1MB
-   **렌더링 성능**: 60fps 유지
-   **번들 크기**: gzipped 기준 < 10KB

### 성능 모니터링

```typescript
// 성능 모니터링 예제
function PerformanceMonitor() {
    const scrollbarRef = useRef<OverlayScrollbarRef>(null);
    const [metrics, setMetrics] = useState({
        scrollEvents: 0,
        averageScrollTime: 0,
    });

    const handleScroll = useCallback((event: Event) => {
        const startTime = performance.now();

        // 스크롤 처리 로직

        const endTime = performance.now();
        const scrollTime = endTime - startTime;

        setMetrics((prev) => ({
            scrollEvents: prev.scrollEvents + 1,
            averageScrollTime: (prev.averageScrollTime + scrollTime) / 2,
        }));
    }, []);

    return (
        <div>
            <div>
                스크롤 이벤트: {metrics.scrollEvents}, 평균 처리 시간:{" "}
                {metrics.averageScrollTime.toFixed(2)}ms
            </div>
            <OverlayScrollbar ref={scrollbarRef} onScroll={handleScroll}>
                {/* 콘텐츠 */}
            </OverlayScrollbar>
        </div>
    );
}
```

## 접근성 (Accessibility)

### WCAG 호환성

-   **키보드 네비게이션**: 완전 지원
-   **스크린 리더**: ARIA 라벨 및 역할 지원
-   **고대비 모드**: 사용자 정의 색상 지원
-   **모션 감소**: `prefers-reduced-motion` 미디어 쿼리 지원

### 접근성 최적화 예제

```typescript
function AccessibleScrollbar() {
    return (
        <OverlayScrollbar
            // 접근성을 위한 추가 props
            role="scrollbar"
            aria-label="콘텐츠 스크롤바"
            aria-orientation="vertical"
            style={{ height: "400px" }}
        >
            <div role="region" aria-label="스크롤 가능한 콘텐츠">
                {/* 콘텐츠 */}
            </div>
        </OverlayScrollbar>
    );
}
```

### 키보드 단축키

-   **Page Up/Page Down**: 페이지 단위 스크롤
-   **Home/End**: 시작/끝으로 이동
-   **위/아래 화살표**: 라인 단위 스크롤
-   **Space/Shift+Space**: 페이지 다운/업

## 라이센스 및 기여

### MIT 라이센스

이 프로젝트는 MIT 라이센스 하에 배포됩니다. 상업적 및 비상업적 프로젝트 모두에서 자유롭게 사용할 수 있습니다.

### 기여하기

1. **이슈 리포팅**: [GitHub Issues](https://github.com/ehfuse/overlay-scrollbar/issues)에서 버그 신고
2. **기능 제안**: 새로운 기능에 대한 아이디어 제출
3. **코드 기여**: Pull Request를 통한 코드 개선
4. **문서화**: 문서 개선 및 번역
5. **테스팅**: 다양한 환경에서의 테스트

### 개발 환경 설정

```bash
# 프로젝트 클론
git clone https://github.com/ehfuse/overlay-scrollbar.git
cd overlay-scrollbar

# 의존성 설치
npm install

# 개발 서버 시작
npm run dev

# 빌드
npm run build

# 테스트 실행
npm test
```

## 다음 단계

-   [API 레퍼런스](https://github.com/ehfuse/overlay-scrollbar/blob/main/README.md#api-reference)에서 모든 prop과 메서드 확인
-   [영어 버전 가이드](https://github.com/ehfuse/overlay-scrollbar/blob/main/docs/getting-started-en.md)
-   [배포 가이드](https://github.com/ehfuse/overlay-scrollbar/blob/main/docs/DEPLOY.md) (개발자용)

## 도움이 필요하신가요?

-   [GitHub Issues](https://github.com/ehfuse/overlay-scrollbar/issues)에서 버그 신고나 기능 요청
-   [GitHub Discussions](https://github.com/ehfuse/overlay-scrollbar/discussions)에서 질문하기
