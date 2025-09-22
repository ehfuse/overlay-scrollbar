# OverlayScrollbar

A React component that provides a custom overlay scrollbar with smooth animations and auto-hide functionality.

## 📚 Documentation

-   **[Getting Started (English)](https://github.com/ehfuse/overlay-scrollbar/blob/main/docs/getting-started-en.md)** - Complete setup and usage guide
-   **[시작하기 (한국어)](https://github.com/ehfuse/overlay-scrollbar/blob/main/docs/getting-started-ko.md)** - 설치 및 사용법 가이드

## Features

-   🎨 **Custom styled scrollbar** - Beautiful overlay scrollbar that doesn't take up content space
-   ⚡ **Smooth animations** - Smooth fade-in/out transitions with customizable timing
-   🔍 **Auto-hide functionality** - Automatically hides when not needed and shows on scroll/hover
-   📱 **Responsive design** - Adapts to container size changes with ResizeObserver
-   🎯 **Interactive** - Support for click-to-scroll and drag-to-scroll functionality
-   🔧 **TypeScript support** - Full TypeScript support with proper type definitions
-   🪶 **Lightweight** - No external dependencies except React
-   ♿ **Accessible** - Maintains native scroll behavior while providing visual enhancements

## Installation

```bash
npm install @ehfuse/overlay-scrollbar
```

or

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
            <OverlayScrollbar>
                <div style={{ height: "1000px" }}>
                    {/* Your scrollable content here */}
                </div>
            </OverlayScrollbar>
        </div>
    );
}
```

## Usage

### Basic Usage

```tsx
import React from "react";
import { OverlayScrollbar } from "@ehfuse/overlay-scrollbar";

function App() {
    return (
        <div style={{ height: "400px" }}>
            <OverlayScrollbar>
                <div style={{ height: "1000px" }}>
                    {/* Your scrollable content here */}
                    <p>Long content that requires scrolling...</p>
                </div>
            </OverlayScrollbar>
        </div>
    );
}
```

### With Ref Access

```tsx
import React, { useRef } from "react";
import {
    OverlayScrollbar,
    OverlayScrollbarRef,
} from "@ehfuse/overlay-scrollbar";

function App() {
    const scrollbarRef = useRef<OverlayScrollbarRef>(null);

    const scrollToTop = () => {
        scrollbarRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    };

    const getScrollInfo = () => {
        if (scrollbarRef.current) {
            console.log("Scroll Top:", scrollbarRef.current.scrollTop);
            console.log("Scroll Height:", scrollbarRef.current.scrollHeight);
            console.log("Client Height:", scrollbarRef.current.clientHeight);
        }
    };

    return (
        <div style={{ height: "400px" }}>
            <button onClick={scrollToTop}>Scroll to Top</button>
            <button onClick={getScrollInfo}>Get Scroll Info</button>

            <OverlayScrollbar ref={scrollbarRef}>
                <div style={{ height: "1000px" }}>
                    {/* Your scrollable content here */}
                </div>
            </OverlayScrollbar>
        </div>
    );
}
```

### With Custom Styling

```tsx
import React from "react";
import { OverlayScrollbar } from "@ehfuse/overlay-scrollbar";

function App() {
    return (
        <OverlayScrollbar
            className="my-scrollbar"
            style={{
                height: "400px",
                border: "1px solid #ccc",
                borderRadius: "8px",
            }}
            onScroll={(event) => {
                console.log("Scrolled!", event);
            }}
        >
            <div style={{ height: "1000px", padding: "20px" }}>
                {/* Your content */}
            </div>
        </OverlayScrollbar>
    );
}
```

## API Reference

### Props

| Prop        | Type                     | Default | Description                                |
| ----------- | ------------------------ | ------- | ------------------------------------------ |
| `children`  | `ReactNode`              | -       | The content to be scrolled                 |
| `className` | `string`                 | -       | Additional CSS class for the container     |
| `style`     | `React.CSSProperties`    | -       | Additional inline styles for the container |
| `onScroll`  | `(event: Event) => void` | -       | Callback fired when scrolling occurs       |

### Ref Methods

The component exposes several methods through ref:

| Method               | Type                                 | Description                              |
| -------------------- | ------------------------------------ | ---------------------------------------- |
| `getScrollContainer` | `() => HTMLDivElement \| null`       | Returns the scrollable container element |
| `scrollTo`           | `(options: ScrollToOptions) => void` | Scrolls to a specific position           |
| `scrollTop`          | `number`                             | Gets the current scroll top position     |
| `scrollHeight`       | `number`                             | Gets the total scrollable height         |
| `clientHeight`       | `number`                             | Gets the visible height of the container |

### ScrollToOptions

```typescript
interface ScrollToOptions {
    top?: number;
    left?: number;
    behavior?: "auto" | "smooth";
}
```

## Behavior

-   **Auto-hide**: The scrollbar automatically hides after 0.7 seconds of inactivity during wheel scroll or regular scrolling
-   **Hover reveal**: Hovering over the right edge (20px wide area) shows the scrollbar with track background
-   **Interactive scrolling**:
    -   Click on the track to jump to that position
    -   Drag the thumb for precise scrolling
    -   Mouse wheel scrolling works normally
-   **Responsive**: Automatically adapts to content and container size changes
-   **Smooth animations**: All show/hide transitions are smoothly animated

## Styling

The component uses CSS-in-JS for styling and automatically hides native scrollbars. The custom scrollbar has:

-   **Track**: Semi-transparent background that appears on hover/interaction
-   **Thumb**: The draggable scrollbar handle with hover effects
-   **Positioning**: 8px wide, positioned 2px from the right edge
-   **Colors**: Configurable through CSS custom properties (future enhancement)

## Browser Support

-   Chrome/Edge: Full support
-   Firefox: Full support
-   Safari: Full support
-   Mobile browsers: Touch scrolling supported, overlay scrollbar hidden on mobile

## Performance

-   Uses `ResizeObserver` for efficient size change detection
-   Debounced scroll events to prevent excessive re-renders
-   Passive event listeners where possible
-   Minimal DOM manipulation and optimized for 60fps animations

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
