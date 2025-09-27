# OverlayScrollbar

A highly customizable React component that provides a beautiful overlay scrollbar with extensive styling options, interactive features, and smooth animations.

다양한 스타일링 옵션, 인터랙티브 기능, 부드러운 애니메이션을 제공하는 고도로 커스터마이징 가능한 React 오버레이 스크롤바 컴포넌트입니다.

## 📚 Documentation

-   **[Getting Started (English)](https://github.com/ehfuse/overlay-scrollbar/blob/main/docs/getting-started-en.md)** - Complete setup and usage guide
-   **[시작하기 (한국어)](https://github.com/ehfuse/overlay-scrollbar/blob/main/docs/getting-started-ko.md)** - 설치 및 사용법 가이드

## Features

-   🎨 **Fully Customizable** - Control colors, sizes, radius, and positioning of all scrollbar elements
-   🏹 **Arrow Navigation** - Optional arrow buttons for precise scrolling control
-   ⚡ **Smooth Animations** - Fade-in/out transitions with hover effects and drag feedback
-   🔍 **Smart Auto-hide** - Intelligent visibility management based on scroll state and user interaction
-   📐 **Flexible Sizing** - Independent control of track width, thumb width, and minimum thumb height
-   🎯 **Interactive** - Click-to-scroll, drag-to-scroll, and wheel event handling
-   🖱️ **Hover Effects** - Visual feedback on hover for arrows and improved UX
-   📱 **True Overlay** - Doesn't affect content layout, floats over content
-   🔧 **TypeScript** - Complete TypeScript support with detailed type definitions
-   🪶 **Zero Dependencies** - Only requires React, no external libraries
-   ♿ **Accessible** - Preserves native scroll behavior while enhancing visual presentation

## 기능 소개

-   🎨 **완전한 커스터마이징** - 스크롤바의 모든 요소에 대한 색상, 크기, 둥근 모서리, 위치 제어
-   🏹 **화살표 내비게이션** - 정밀한 스크롤 제어를 위한 선택적 화살표 버튼
-   ⚡ **부드러운 애니메이션** - 호버 효과와 드래그 피드백이 포함된 페이드 인/아웃 전환
-   🔍 **스마트 자동 숨김** - 스크롤 상태와 사용자 상호작용에 기반한 지능적인 표시 관리
-   📐 **유연한 크기 조정** - 트랙 너비, 썸 너비, 최소 썸 높이의 독립적 제어
-   🎯 **인터랙티브** - 클릭 스크롤, 드래그 스크롤, 휠 이벤트 처리
-   🖱️ **호버 효과** - 화살표 호버 시 시각적 피드백 및 향상된 UX
-   📱 **진정한 오버레이** - 콘텐츠 레이아웃에 영향을 주지 않고 콘텐츠 위에 떠 있음
-   🔧 **TypeScript** - 상세한 타입 정의를 포함한 완전한 TypeScript 지원
-   🪶 **의존성 없음** - React만 필요하며 외부 라이브러리 불필요
-   ♿ **접근성** - 시각적 표현을 향상시키면서 기본 스크롤 동작 보존

## Installation

```bash
npm install @ehfuse/overlay-scrollbar
```

or

```bash
yarn add @ehfuse/overlay-scrollbar
```

## 설치

```bash
npm install @ehfuse/overlay-scrollbar
```

또는

```bash
yarn add @ehfuse/overlay-scrollbar
```

## Quick Start

For detailed setup instructions, see the [Getting Started Guide](https://github.com/ehfuse/overlay-scrollbar/blob/main/docs/getting-started-en.md).

```tsx
import React from "react";
import { OverlayScrollbar } from "@ehfuse/overlay-scrollbar";

function App() {
    return (
        <div style={{ height: "400px" }}>
            <OverlayScrollbar
                showArrows={true}
                thumbRadius={6}
                trackColor="rgba(0, 0, 0, 0.1)"
                thumbColor="rgba(100, 100, 100, 0.7)"
                arrowColor="rgba(80, 80, 80, 0.8)"
                hideDelay={1500} // Auto-hide after 1.5s
                hideDelayOnWheel={700} // Quick hide after wheel scroll
            >
                <div style={{ height: "1000px" }}>
                    {/* Your scrollable content here */}
                    <p>Content that requires scrolling...</p>
                </div>
            </OverlayScrollbar>
        </div>
    );
}
```

## 빠른 시작

자세한 설정 지침은 [시작하기 가이드](https://github.com/ehfuse/overlay-scrollbar/blob/main/docs/getting-started-ko.md)를 참조하세요.

```tsx
import React from "react";
import { OverlayScrollbar } from "@ehfuse/overlay-scrollbar";

function App() {
    return (
        <div style={{ height: "400px" }}>
            <OverlayScrollbar
                showArrows={true}
                thumbRadius={6}
                trackColor="rgba(0, 0, 0, 0.1)"
                thumbColor="rgba(100, 100, 100, 0.7)"
                arrowColor="rgba(80, 80, 80, 0.8)"
                hideDelay={1500} // 1.5초 후 자동 숨김
                hideDelayOnWheel={700} // 휠 스크롤 후 빠른 숨김
            >
                <div style={{ height: "1000px" }}>
                    {/* 스크롤 가능한 콘텐츠 */}
                    <p>스크롤이 필요한 콘텐츠...</p>
                </div>
            </OverlayScrollbar>
        </div>
    );
}
```

## API Reference

### Types

The package exports TypeScript types for better development experience:

```tsx
import {
    OverlayScrollbar,
    OverlayScrollbarProps,
    OverlayScrollbarRef,
} from "@ehfuse/overlay-scrollbar";
```

### OverlayScrollbarProps

Interface for the component props:

```tsx
interface OverlayScrollbarProps {
    className?: string;
    style?: React.CSSProperties;
    children: ReactNode;
    onScroll?: (event: Event) => void;

    // Sizing & Layout
    scrollbarWidth?: number; // deprecated, use trackWidth/thumbWidth instead
    thumbRadius?: number; // Border radius of thumb (default: thumbWidth / 2)
    trackWidth?: number; // Width of hover area (default: 16px)
    thumbWidth?: number; // Width of thumb and track background (default: 8px)
    thumbMinHeight?: number; // Minimum height of thumb (default: 50px)

    // Colors
    trackColor?: string; // Track background color (default: "rgba(128, 128, 128, 0.1)")
    thumbColor?: string; // Thumb color (default: "rgba(128, 128, 128, 0.6)")
    thumbActiveColor?: string; // Thumb color when dragging (default: "rgba(128, 128, 128, 0.9)")
    arrowColor?: string; // Arrow color (default: "rgba(128, 128, 128, 0.8)")
    arrowActiveColor?: string; // Arrow color on hover (default: "rgba(64, 64, 64, 1.0)")

    // Arrow Navigation
    showArrows?: boolean; // Show arrow buttons (default: false)
    arrowStep?: number; // Scroll distance per arrow click (default: 50px)

    // Auto-hide Behavior
    hideDelay?: number; // Default auto-hide delay (default: 1500ms)
    hideDelayOnWheel?: number; // Auto-hide delay after wheel scroll (default: 700ms)
}
```

### OverlayScrollbarRef

Interface for component methods accessible via ref:

```tsx
interface OverlayScrollbarRef {
    getScrollContainer: () => HTMLDivElement | null;
    scrollTo: (options: ScrollToOptions) => void;
    scrollTop: number;
    scrollHeight: number;
    clientHeight: number;
}
```

### Usage with TypeScript

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
            console.log("Scrolled!", scrollRef.current?.scrollTop);
        },
    };

    const handleScrollToTop = () => {
        scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div style={{ height: "400px" }}>
            <button onClick={handleScrollToTop}>Scroll to Top</button>
            <OverlayScrollbar ref={scrollRef} {...scrollbarProps}>
                <div style={{ height: "1000px" }}>Your content here...</div>
            </OverlayScrollbar>
        </div>
    );
};
```

## Browser Support

-   Chrome/Edge: Full support
-   Firefox: Full support
-   Safari: Full support
-   Mobile browsers: Touch scrolling supported, overlay scrollbar hidden on mobile

## 브라우저 지원

-   Chrome/Edge: 완전 지원
-   Firefox: 완전 지원
-   Safari: 완전 지원
-   모바일 브라우저: 터치 스크롤 지원, 모바일에서는 오버레이 스크롤바 숨김

## License

MIT © [KIM YOUNG JIN](mailto:ehfuse@gmail.com)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Issues

If you find any bugs or have feature requests, please create an issue on [GitHub](https://github.com/ehfuse/overlay-scrollbar/issues).
