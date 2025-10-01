# OverlayScrollbar

A highly customizable React component that provides a beautiful overlay scrollbar with extensive styling options, interactive features, and smooth animations.

다양한 스타일링 옵션, 인터랙티브 기능, 부드러운 애니메이션을 제공하는 고도로 커스터마이징 가능한 React 오버레이 스크롤바 컴포넌트입니다.

## 📚 Documentation

-   **[Getting Started (English)](https://github.com/ehfuse/overlay-scrollbar/blob/main/docs/getting-started-en.md)** - Complete setup and usage guide
-   **[시작하기 (한국어)](https://github.com/ehfuse/overlay-scrollbar/blob/main/docs/getting-started-ko.md)** - 설치 및 사용법 가이드

## ✨ Key Features

-   🎨 **Fully Customizable** - Control colors, sizes, radius, and positioning
-   🖱️ **Drag Scroll** - Mouse drag scrolling with smart UI library exclusion
-   🏹 **Arrow Navigation** - Optional arrow buttons for precise control
-   ⚡ **Smooth Animations** - Fade transitions and hover effects
-   🔍 **Smart Auto-hide** - Intelligent visibility management
-   🧠 **Smart Input Detection** - Excludes interactive elements automatically
-   📦 **External Container Support** - Works with virtualized lists
-   🔧 **TypeScript** - Complete type definitions
-   🪶 **Zero Dependencies** - Only requires React
-   ♿ **Accessible** - Preserves native scroll behavior

## ✨ 주요 기능

-   🎨 **완전한 커스터마이징** - 색상, 크기, 둥근 모서리, 위치 제어
-   🖱️ **드래그 스크롤** - UI 라이브러리 스마트 제외 기능을 가진 마우스 드래그 스크롤
-   🏹 **화살표 내비게이션** - 정밀한 제어를 위한 선택적 화살표 버튼
-   ⚡ **부드러운 애니메이션** - 페이드 전환 및 호버 효과
-   🔍 **스마트 자동 숨김** - 지능적인 표시 관리
-   🧠 **스마트 입력 감지** - 인터랙티브 요소 자동 제외
-   📦 **외부 컨테이너 지원** - 가상화된 리스트와 연동
-   🔧 **TypeScript** - 완전한 타입 정의
-   🪶 **의존성 없음** - React만 필요
-   ♿ **접근성** - 기본 스크롤 동작 보존

## 🚀 Installation

```bash
npm install @ehfuse/overlay-scrollbar
# or
yarn add @ehfuse/overlay-scrollbar
```

## 📖 Quick Start

```tsx
import React from "react";
import { OverlayScrollbar } from "@ehfuse/overlay-scrollbar";

function App() {
    return (
        <div style={{ height: "400px" }}>
            <OverlayScrollbar
                thumb={{
                    width: 8,
                    color: "rgba(100, 100, 100, 0.7)",
                }}
                dragScroll={{
                    enabled: true,
                    excludeClasses: ["no-drag"],
                }}
            >
                <div style={{ height: "1000px" }}>
                    <p>Your scrollable content here...</p>
                    <input type="text" placeholder="Auto-excluded from drag" />
                </div>
            </OverlayScrollbar>
        </div>
    );
}
```

## 🎯 Main API

### Configuration Objects (v1.3.0+)

```tsx
interface OverlayScrollbarProps {
    // Grouped configuration objects
    thumb?: ThumbConfig; // Scrollbar thumb settings
    track?: TrackConfig; // Track area settings
    arrows?: ArrowsConfig; // Arrow buttons settings
    dragScroll?: DragScrollConfig; // Drag scroll settings

    // General settings
    hideDelay?: number; // Auto-hide delay (default: 1500ms)
    hideDelayOnWheel?: number; // Quick hide after wheel (default: 700ms)
    scrollContainer?: HTMLElement; // External container support
}
```

## 🌍 Browser Support

-   Chrome/Edge: Full support
-   Firefox: Full support
-   Safari: Full support
-   Mobile: Touch scrolling supported

## 📄 License

MIT © [KIM YOUNG JIN](mailto:ehfuse@gmail.com)

## 🐛 Issues

If you find any bugs or have feature requests, please create an issue on [GitHub](https://github.com/ehfuse/overlay-scrollbar/issues).
