# OverlayScrollbar

A highly customizable React component that provides a beautiful overlay scrollbar with extensive styling options, interactive features, and smooth animations.

다양한 스타일링 옵션, 인터랙티브 기능, 부드러운 애니메이션을 제공하는 고도로 커스터마이징 가능한 React 오버레이 스크롤바 컴포넌트입니다.

## 📚 Documentation

- **[Getting Started (English)](https://github.com/ehfuse/overlay-scrollbar/blob/main/docs/getting-started-en.md)** - Complete setup and usage guide
- **[시작하기 (한국어)](https://github.com/ehfuse/overlay-scrollbar/blob/main/docs/getting-started-ko.md)** - 설치 및 사용법 가이드

## ✨ Key Features

- 🎨 **Fully Customizable** - Control colors, sizes, radius, and positioning
- 🖱️ **Drag Scroll** - Mouse drag scrolling with smart UI library exclusion
- 🏹 **Arrow Navigation** - Optional arrow buttons for precise control
- ⚡ **Smooth Animations** - Fade transitions and hover effects
- 🔍 **Smart Auto-hide** - Intelligent visibility management
- 🧠 **Smart Input Detection** - Excludes interactive elements automatically
- 🤖 **Auto-Detection** - Automatically finds scrollable containers (Virtuoso, react-window, etc.)
- 🔧 **TypeScript** - Complete type definitions
- 🪶 **Zero Dependencies** - Only requires React
- ♿ **Accessible** - Preserves native scroll behavior

## ✨ 주요 기능

- 🎨 **완전한 커스터마이징** - 색상, 크기, 둥근 모서리, 위치 제어
- 🖱️ **드래그 스크롤** - UI 라이브러리 스마트 제외 기능을 가진 마우스 드래그 스크롤
- 🏹 **화살표 내비게이션** - 정밀한 제어를 위한 선택적 화살표 버튼
- ⚡ **부드러운 애니메이션** - 페이드 전환 및 호버 효과
- 🔍 **스마트 자동 숨김** - 지능적인 표시 관리
- 🧠 **스마트 입력 감지** - 인터랙티브 요소 자동 제외
- 🤖 **자동 감지** - 스크롤 가능한 컨테이너 자동 검색 (Virtuoso, react-window 등)
- 🔧 **TypeScript** - 완전한 타입 정의
- 🪶 **의존성 없음** - React만 필요
- ♿ **접근성** - 기본 스크롤 동작 보존

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

### Configuration Objects (v1.4.0+)

```tsx
interface OverlayScrollbarProps {
    children: ReactNode;
    className?: string;
    style?: React.CSSProperties; // Wrapper div styles
    containerStyle?: React.CSSProperties; // Scroll container div styles
    contentStyle?: React.CSSProperties; // Inner content div styles
    onScroll?: (event: Event) => void;

    // Grouped configuration objects
    thumb?: ThumbConfig; // Scrollbar thumb settings
    track?: TrackConfig; // Track area settings
    arrows?: ArrowsConfig; // Arrow buttons settings
    dragScroll?: DragScrollConfig; // Drag scroll settings
    autoHide?: AutoHideConfig; // Auto-hide behavior settings
    pullToRefresh?: PullToRefreshConfig; // Pull-to-refresh settings (touch only, v1.7.0+)

    // General settings
    showScrollbar?: boolean; // Show scrollbar (default: true)
    showHorizontalScrollbar?: boolean; // Show bottom horizontal scrollbar (default: true)
}

interface AutoHideConfig {
    enabled?: boolean; // Enable auto-hide (default: true)
    delay?: number; // Auto-hide delay (default: 1500ms)
    delayOnWheel?: number; // Quick hide after wheel (default: 700ms)
    initialDelay?: number; // Delay before showing scrollbar on mount (default: 200ms)
}

interface TrackConfig {
    alignment?: "default" | "outside"; // Track alignment (default: "outside")
}

interface DragScrollConfig {
    enabled?: boolean; // Enable mouse drag scrolling (default: true)
    excludeClasses?: string[];
    excludeSelectors?: string[];
}

interface PullToRefreshConfig {
    enabled?: boolean; // Enable pull-to-refresh (default: true, requires onRefresh)
    onRefresh?: () => void | Promise<void>; // Refresh callback — spinner stays until the Promise resolves
    threshold?: number; // Pull distance to trigger refresh on release (default: 80px)
    maxDistance?: number; // Max indicator travel distance (default: threshold * 2)
    indicatorColor?: string; // Arrow/spinner color (default: "#1976d2")
}
```

### Pull to Refresh (v1.7.0+)

When the scroll container is at the top, pulling down (touch gesture) shows an
indicator that follows the finger. Releasing past the threshold triggers `onRefresh`.

```tsx
<OverlayScrollbar
    pullToRefresh={{
        onRefresh: async () => {
            await reloadList(); // spinner stays visible until this resolves
        },
        // enabled: false, // turn the gesture off without removing the prop
    }}
>
    {items.map((item) => (
        <ListItem key={item.id} {...item} />
    ))}
</OverlayScrollbar>
```

## 🌍 Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile: Touch scrolling supported

## 📄 License

MIT © [KIM YOUNG JIN](mailto:ehfuse@gmail.com)

## 🐛 Issues

If you find any bugs or have feature requests, please create an issue on [GitHub](https://github.com/ehfuse/overlay-scrollbar/issues).
