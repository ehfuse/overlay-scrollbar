# OverlayScrollbar 시작하기

고도로 커스터마이징 가능한 React 오버레이 스크롤바 컴포넌트의 설치 및 사용법 가이드입니다.

## 목차

1. [설치](#설치)
2. [기본 사용법](#기본-사용법)
3. [설정 객체 (v1.3.0+)](#설정-객체-v130)
4. [드래그 스크롤](#드래그-스크롤)
5. [화살표 내비게이션](#화살표-내비게이션)
6. [색상 및 크기 커스터마이징](#색상-및-크기-커스터마이징)
7. [외부 컨테이너 연결](#외부-컨테이너-연결)
8. [TypeScript 사용법](#typescript-사용법)
9. [API 레퍼런스](#api-레퍼런스)
10. [문제 해결](#문제-해결)

## 설치

```bash
npm install @ehfuse/overlay-scrollbar
```

또는

```bash
yarn add @ehfuse/overlay-scrollbar
```

## 기본 사용법

### 간단한 예제

```tsx
import React from "react";
import { OverlayScrollbar } from "@ehfuse/overlay-scrollbar";

function App() {
    return (
        <div style={{ height: "400px" }}>
            <OverlayScrollbar>
                <div style={{ height: "1000px", padding: "20px" }}>
                    <h2>스크롤 가능한 콘텐츠</h2>
                    <p>여기에 긴 콘텐츠가 들어갑니다...</p>
                </div>
            </OverlayScrollbar>
        </div>
    );
}
```

### 핵심 개념

-   **진정한 오버레이**: 콘텐츠 위에 떠있어 레이아웃에 영향 없음
-   **스마트 자동 숨김**: 스크롤 상태에 따른 지능적 표시/숨김
-   **호버 표시**: 트랙 영역에 마우스 올리면 즉시 나타남
-   **부드러운 애니메이션**: 모든 상태 변화에 페이드 효과
-   **자동 감지**: 스크롤 가능한 컨테이너를 자동으로 찾아 연결 (Virtuoso, 커스텀 구현 등)

## 설정 객체 (v1.3.0+)

v1.3.0부터는 관련 설정들을 객체로 그룹화하여 더 깔끔한 API를 제공합니다.

### 기본 구조

```tsx
<OverlayScrollbar
    style={{ height: "100%" }} // 래퍼 div 스타일
    containerStyle={{ padding: "10px" }} // 스크롤 컨테이너 스타일
    contentStyle={{ display: "flex", flexDirection: "column" }} // 콘텐츠 div 스타일
    thumb={{
        width: 8,
        color: "#606060",
        opacity: 0.6,
        hoverColor: "#606060",
        hoverOpacity: 1.0,
    }}
    track={{
        width: 16,
        color: "rgba(128, 128, 128, 0.1)",
        alignment: "default",
        radius: 4,
        margin: 4,
    }}
    arrows={{
        visible: true,
        step: 50,
        color: "#808080",
        opacity: 0.6,
        hoverOpacity: 1.0,
    }}
    dragScroll={{
        enabled: true,
        excludeClasses: ["no-drag"],
    }}
    autoHide={{
        enabled: true,
        delay: 1500,
        delayOnWheel: 700,
    }}
>
    {/* 콘텐츠 */}
</OverlayScrollbar>
```

## 드래그 스크롤

마우스로 콘텐츠를 드래그하여 스크롤할 수 있는 기능입니다.

### 기본 사용

```tsx
function DragScrollExample() {
    return (
        <OverlayScrollbar
            dragScroll={{
                enabled: true, // 기본값: true
            }}
        >
            <div style={{ height: "1000px" }}>
                <p>이 영역을 드래그하여 스크롤하세요!</p>
                <input type="text" placeholder="입력 필드는 자동 제외" />
                <button>버튼도 자동 제외</button>
            </div>
        </OverlayScrollbar>
    );
}
```

### 자동 제외되는 요소들

시스템이 자동으로 드래그 스크롤에서 제외하는 요소들:

1. **기본 입력 요소**: `input`, `textarea`, `select`, `button`
2. **편집 가능 요소**: `contenteditable="true"`
3. **SVG 요소**: 아이콘 및 그래픽 요소들
4. **UI 라이브러리**: Material-UI, Ant Design, Shadcn/ui, Radix UI 등

### 커스텀 제외 설정

특정 요소를 드래그 스크롤에서 제외하려면:

```tsx
<OverlayScrollbar
    dragScroll={{
        enabled: true,
        excludeClasses: [
            "no-drag", // 클래스로 제외
            "chart-controls", // 차트 조작 영역
            "image-gallery", // 이미지 갤러리
        ],
        excludeSelectors: [
            ".toolbar button", // 툴바 버튼들
            "[data-interactive='true']", // 데이터 속성
            ".canvas-container canvas", // 캔버스 요소
        ],
    }}
>
    <div>
        <div className="no-drag">이 영역은 드래그 스크롤 안됨</div>
        <div data-interactive="true">인터랙티브 콘텐츠</div>
        <p>일반 텍스트는 드래그 스크롤 가능</p>
    </div>
</OverlayScrollbar>
```

## 화살표 내비게이션

스크롤바 상하단에 화살표 버튼을 추가할 수 있습니다.

```tsx
function ArrowExample() {
    return (
        <OverlayScrollbar
            arrows={{
                visible: true, // 화살표 표시
                step: 100, // 클릭당 스크롤 거리 (px)
                color: "#808080",
                opacity: 0.6,
                hoverColor: "#404040",
                hoverOpacity: 1.0,
            }}
        >
            <div style={{ height: "1500px" }}>
                화살표로 스크롤할 수 있는 콘텐츠
            </div>
        </OverlayScrollbar>
    );
}
```

## 색상 및 크기 커스터마이징

### 완전한 스타일 커스터마이징

```tsx
function StyledExample() {
    return (
        <OverlayScrollbar
            thumb={{
                width: 10, // 썸 너비
                minHeight: 60, // 썸 최소 높이
                radius: 8, // 둥근 모서리
                color: "#4682b4", // 기본 색상
                opacity: 0.7,
                hoverColor: "#4682b4", // 호버/드래그시 색상
                hoverOpacity: 1.0,
            }}
            track={{
                width: 20, // 트랙 너비
                color: "rgba(200, 200, 200, 0.8)", // 트랙 배경색
                visible: true, // 트랙 배경 표시
            }}
            arrows={{
                visible: true,
                color: "#646464",
                opacity: 0.8,
                hoverColor: "#323232",
                hoverOpacity: 1.0,
            }}
            autoHide={{
                enabled: true,
                delay: 2000, // 2초 후 숨김
                delayOnWheel: 500, // 휠 후 0.5초 후 숨김
            }}
        >
            <div style={{ height: "1000px" }}>커스터마이징된 스크롤바</div>
        </OverlayScrollbar>
    );
}
```

## 자동 스크롤 컨테이너 감지

OverlayScrollbar는 가상화된 리스트(Virtuoso, react-window 등)와 커스텀 스크롤 구현을 자동으로 감지하고 연결합니다.

### 작동 방식

1. **자동 검색**: 일반적인 스크롤 컨테이너(`.virtuoso-scroller`, `[data-virtuoso-scroller]`, overflow 스타일 요소)를 검색
2. **성능 캐싱**: 찾은 컨테이너를 캐싱하여 반복 검색 방지
3. **동적 업데이트**: MutationObserver를 사용하여 DOM 변경을 감지하고 필요시 컨테이너 재검색
4. **제로 설정**: 스크롤 컨테이너를 수동으로 전달할 필요 없음

### 가상화 리스트와 함께 사용

```tsx
import React from "react";
import { Virtuoso } from "react-virtuoso";
import { OverlayScrollbar } from "@ehfuse/overlay-scrollbar";

function VirtualizedExample() {
    return (
        <div style={{ height: "400px", position: "relative" }}>
            <OverlayScrollbar thumb={{ width: 8 }} track={{ width: 16 }}>
                {/* Virtuoso의 스크롤 컨테이너가 자동으로 감지됩니다 */}
                <Virtuoso
                    data={Array.from({ length: 1000 })}
                    itemContent={(index) => <div>항목 {index}</div>}
                />
            </OverlayScrollbar>
        </div>
    );
}

// 모든 가상화 라이브러리와 호환됩니다
function ReactWindowExample() {
    return (
        <div style={{ height: "400px" }}>
            <OverlayScrollbar>
                <FixedSizeList
                    height={400}
                    itemCount={1000}
                    itemSize={35}
                    width="100%"
                >
                    {({ index, style }) => (
                        <div style={style}>항목 {index}</div>
                    )}
                </FixedSizeList>
            </OverlayScrollbar>
        </div>
    );
}
```

## TypeScript 사용법

완전한 타입 지원으로 안전한 개발이 가능합니다.

```tsx
import React, { useRef } from "react";
import {
    OverlayScrollbar,
    OverlayScrollbarRef,
    ThumbConfig,
    TrackConfig,
    ArrowsConfig,
    DragScrollConfig,
} from "@ehfuse/overlay-scrollbar";

const MyComponent: React.FC = () => {
    const scrollbarRef = useRef<OverlayScrollbarRef>(null);

    // 타입 안전한 설정 객체들
    const thumbConfig: ThumbConfig = {
        width: 8,
        radius: 6,
        color: "#606060",
        opacity: 0.6,
        hoverColor: "#404040",
        hoverOpacity: 1.0,
    };

    const trackConfig: TrackConfig = {
        width: 16,
        color: "rgba(0, 0, 0, 0.1)",
        visible: true,
    };

    const dragScrollConfig: DragScrollConfig = {
        enabled: true,
        excludeClasses: ["no-drag", "interactive"],
        excludeSelectors: [".toolbar button", "[data-no-drag]"],
    };

    const scrollToTop = () => {
        scrollbarRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    };

    const getScrollInfo = () => {
        if (scrollbarRef.current) {
            console.log({
                scrollTop: scrollbarRef.current.scrollTop,
                scrollHeight: scrollbarRef.current.scrollHeight,
                clientHeight: scrollbarRef.current.clientHeight,
            });
        }
    };

    return (
        <div style={{ height: "400px" }}>
            <div style={{ marginBottom: "10px" }}>
                <button onClick={scrollToTop}>맨 위로</button>
                <button onClick={getScrollInfo}>스크롤 정보</button>
            </div>

            <OverlayScrollbar
                ref={scrollbarRef}
                thumb={thumbConfig}
                track={trackConfig}
                dragScroll={dragScrollConfig}
                onScroll={(event) => {
                    console.log("스크롤됨!", scrollbarRef.current?.scrollTop);
                }}
            >
                <div style={{ height: "1000px", padding: "20px" }}>
                    <h2>TypeScript 예제</h2>
                    <p>타입 안전한 스크롤바 사용</p>
                </div>
            </OverlayScrollbar>
        </div>
    );
};
```

## API 레퍼런스

### 스타일 속성

컴포넌트는 서로 다른 계층에 대한 세 가지 스타일 prop을 제공합니다:

```tsx
<OverlayScrollbar
    style={{ height: "100%" }} // 래퍼 div에 적용
    containerStyle={{ padding: "10px" }} // 스크롤 컨테이너에 적용
    contentStyle={{ display: "flex" }} // 내부 콘텐츠에 적용
>
    {children}
</OverlayScrollbar>
```

**DOM 구조:**

```
<div style={style}>                    ← 래퍼 (position: relative)
  <div style={containerStyle}>         ← 스크롤 컨테이너 (overflow: auto)
    <div style={contentStyle}>         ← 콘텐츠 래퍼
      {children}
    </div>
  </div>
  <div>                                ← 스크롤바 트랙 (position: absolute)
    ...
  </div>
</div>
```

### Props

| 속성             | 타입                     | 기본값 | 설명                       |
| ---------------- | ------------------------ | ------ | -------------------------- |
| `children`       | `ReactNode`              | -      | 스크롤할 콘텐츠            |
| `className`      | `string`                 | -      | 추가 CSS 클래스            |
| `style`          | `React.CSSProperties`    | -      | 래퍼 div 스타일            |
| `containerStyle` | `React.CSSProperties`    | -      | 스크롤 컨테이너 div 스타일 |
| `contentStyle`   | `React.CSSProperties`    | -      | 내부 콘텐츠 div 스타일     |
| `onScroll`       | `(event: Event) => void` | -      | 스크롤 이벤트 콜백         |
| `thumb`          | `ThumbConfig`            | `{}`   | 썸 관련 설정 객체          |
| `track`          | `TrackConfig`            | `{}`   | 트랙 관련 설정 객체        |
| `arrows`         | `ArrowsConfig`           | `{}`   | 화살표 관련 설정 객체      |
| `dragScroll`     | `DragScrollConfig`       | `{}`   | 드래그 스크롤 설정 객체    |
| `autoHide`       | `AutoHideConfig`         | `{}`   | 자동 숨김 설정 객체        |
| `showScrollbar`  | `boolean`                | `true` | 스크롤바 표시 여부         |

### 설정 객체 속성

#### ThumbConfig

| 속성           | 타입     | 기본값      | 설명                       |
| -------------- | -------- | ----------- | -------------------------- |
| `width`        | `number` | `8`         | 썸 너비 (px)               |
| `minHeight`    | `number` | `50`        | 썸 최소 높이 (px)          |
| `radius`       | `number` | `width / 2` | 썸 둥근 모서리 반지름 (px) |
| `color`        | `string` | `"#606060"` | 썸 기본 색상               |
| `opacity`      | `number` | `0.6`       | 썸 기본 투명도             |
| `hoverColor`   | `string` | `color`     | 썸 호버/드래그 시 색상     |
| `hoverOpacity` | `number` | `1.0`       | 썸 호버/드래그 시 투명도   |

#### TrackConfig

| 속성        | 타입                     | 기본값                       | 설명                                               |
| ----------- | ------------------------ | ---------------------------- | -------------------------------------------------- |
| `width`     | `number`                 | `16`                         | 트랙 호버 영역 너비 (px)                           |
| `color`     | `string`                 | `"rgba(128, 128, 128, 0.1)"` | 트랙 배경 색상                                     |
| `visible`   | `boolean`                | `true`                       | 트랙 배경 표시 여부                                |
| `alignment` | `"default" \| "outside"` | `"default"`                  | 트랙 정렬 방식 (default: 중앙, outside: 바깥쪽 끝) |
| `radius`    | `number`                 | `thumb.radius \| 4`          | 트랙 둥근 모서리 (px)                              |
| `margin`    | `number`                 | `4`                          | 트랙 상하 마진 (px)                                |

#### ArrowsConfig

| 속성           | 타입      | 기본값      | 설명                           |
| -------------- | --------- | ----------- | ------------------------------ |
| `visible`      | `boolean` | `false`     | 화살표 버튼 표시 여부          |
| `step`         | `number`  | `50`        | 화살표 클릭당 스크롤 거리 (px) |
| `color`        | `string`  | `"#808080"` | 화살표 기본 색상               |
| `opacity`      | `number`  | `0.6`       | 화살표 기본 투명도             |
| `hoverColor`   | `string`  | `color`     | 화살표 호버 시 색상            |
| `hoverOpacity` | `number`  | `1.0`       | 화살표 호버 시 투명도          |

#### DragScrollConfig

| 속성               | 타입       | 기본값 | 설명                            |
| ------------------ | ---------- | ------ | ------------------------------- |
| `enabled`          | `boolean`  | `true` | 드래그 스크롤 활성화 여부       |
| `excludeClasses`   | `string[]` | `[]`   | 드래그 스크롤 제외 클래스들     |
| `excludeSelectors` | `string[]` | `[]`   | 드래그 스크롤 제외 CSS 셀렉터들 |

#### AutoHideConfig

| 속성           | 타입      | 기본값 | 설명                                   |
| -------------- | --------- | ------ | -------------------------------------- |
| `enabled`      | `boolean` | `true` | 자동 숨김 활성화 여부                  |
| `delay`        | `number`  | `1500` | 자동 숨김 지연 시간 (ms)               |
| `delayOnWheel` | `number`  | `700`  | 휠 후 숨김 지연 시간 (ms)              |
| `initialDelay` | `number`  | `200`  | 마운트 후 스크롤바 표시 지연 시간 (ms) |

### 주요 인터페이스

```tsx
interface OverlayScrollbarProps {
    children: ReactNode;
    className?: string;
    style?: React.CSSProperties;
    onScroll?: (event: Event) => void;

    // 설정 객체들
    thumb?: ThumbConfig;
    track?: TrackConfig;
    arrows?: ArrowsConfig;
    dragScroll?: DragScrollConfig;
    autoHide?: AutoHideConfig;

    // 기타 설정
    showScrollbar?: boolean; // 기본값: true
}

interface ThumbConfig {
    width?: number; // 기본값: 8px
    minHeight?: number; // 기본값: 50px
    radius?: number; // 기본값: width / 2
    color?: string; // 기본값: "#606060"
    opacity?: number; // 기본값: 0.6
    hoverColor?: string; // 기본값: color
    hoverOpacity?: number; // 기본값: 1.0
}

interface TrackConfig {
    width?: number; // 기본값: 16px
    color?: string; // 기본값: "rgba(128, 128, 128, 0.1)"
    visible?: boolean; // 기본값: true
    alignment?: "default" | "outside"; // 기본값: "default" (중앙), "outside" (바깥쪽 끝)
    radius?: number; // 기본값: thumb.radius 또는 4px
    margin?: number; // 기본값: 4px
    overflowX?: boolean; // 기본값: true
    overflowY?: boolean; // 기본값: true
}

interface ArrowsConfig {
    visible?: boolean; // 기본가: false
    step?: number; // 기본가: 50px
    color?: string; // 기본가: "#808080"
    opacity?: number; // 기본가: 0.6
    hoverColor?: string; // 기본값: color
    hoverOpacity?: number; // 기본가: 1.0
}

interface DragScrollConfig {
    enabled?: boolean; // 기본가: true
    excludeClasses?: string[]; // 추가 제외 클래스들
    excludeSelectors?: string[]; // 추가 제외 셀렉터들
}

interface AutoHideConfig {
    enabled?: boolean; // 기본가: true
    delay?: number; // 기본가: 1500ms
    delayOnWheel?: number; // 기본가: 700ms
    initialDelay?: number; // 기본값: 200ms (마운트 후 스크롤바 표시 지연)
}
```

### Ref 메서드

```tsx
interface OverlayScrollbarRef {
    getScrollContainer: () => HTMLDivElement | null;
    scrollTo: (options: ScrollToOptions) => void;
    scrollTop: number;
    scrollHeight: number;
    clientHeight: number;
}
```

## 문제 해결

### 자주 묻는 질문

**Q: 스크롤바가 보이지 않아요**
A: 컨테이너에 명시적인 높이가 설정되어 있고, 콘텐츠가 컨테이너보다 큰지 확인하세요.

**Q: 드래그 스크롤이 작동하지 않아요**
A: `dragScroll.enabled`가 `true`인지 확인하고, 대상 요소가 제외 목록에 없는지 확인하세요.

**Q: 가상화된 리스트와 함께 사용하려면?**
A: 가상화 리스트 컴포넌트를 감싸기만 하면 됩니다. OverlayScrollbar가 자동으로 스크롤 컨테이너를 감지하고 연결합니다.

```tsx
// Virtuoso 예제 - 자동 감지
<OverlayScrollbar>
    <Virtuoso
        data={items}
        itemContent={(index, item) => <div>{item}</div>}
    />
</OverlayScrollbar>

// 이렇게 수동으로 컨테이너를 찾을 필요가 없습니다:

<OverlayScrollbar scrollContainer={scrollContainer} />;
```

**Q: 모바일에서 스크롤바가 보이지 않아요**
A: 모바일에서는 터치 스크롤을 우선시하여 오버레이 스크롤바가 자동으로 숨겨집니다.

### 성능 최적화

1. **큰 콘텐츠**: 가상화된 리스트 사용 권장
2. **많은 스크롤바**: `autoHide.delay` 조정으로 성능 향상
3. **복잡한 제외 규칙**: 가능한 한 간단한 클래스명 사용

## 브라우저 지원

-   **Chrome/Edge**: 완전 지원
-   **Firefox**: 완전 지원
-   **Safari**: 완전 지원
-   **모바일**: 터치 스크롤 지원, 오버레이 스크롤바는 숨김

## 라이센스

MIT © [KIM YOUNG JIN](mailto:ehfuse@gmail.com)

## 이슈 신고

버그를 발견하거나 기능 요청이 있으시면 [GitHub Issues](https://github.com/ehfuse/overlay-scrollbar/issues)에서 신고해 주세요.
