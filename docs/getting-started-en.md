# OverlayScrollbar Getting Started (English)

This guide provides step-by-step instructions for installing and using the highly customizable OverlayScrollbar React component in your project.

## Table of Contents

1. [Installation](#installation)
2. [Basic Usage](#basic-usage)
3. [Size Settings](#size-settings)
4. [Arrow Navigation](#arrow-navigation)
5. [Color Customization](#color-customization)
6. [Advanced Usage](#advanced-usage)
7. [Ref Usage](#ref-usage)
8. [Troubleshooting](#troubleshooting)

## Installation

### Using npm

```bash
npm install @ehfuse/overlay-scrollbar
```

### Using yarn

```bash
yarn add @ehfuse/overlay-scrollbar
```

### Using pnpm

```bash
pnpm add @ehfuse/overlay-scrollbar
```

## Basic Usage

### 1. Import the Component

```tsx
import React from "react";
import { OverlayScrollbar } from "@ehfuse/overlay-scrollbar";
```

### 2. Basic Implementation

```tsx
function MyComponent() {
    return (
        <div style={{ height: "400px" }}>
            <OverlayScrollbar>
                <div style={{ height: "1000px", padding: "20px" }}>
                    <h2>Scrollable Content</h2>
                    <p>Add your long content here...</p>
                    {/* More content */}
                </div>
            </OverlayScrollbar>
        </div>
    );
}
```

### 3. Core Concepts

-   **True Overlay**: Floats over content without affecting layout
-   **Smart Auto-hide**: Intelligent visibility management based on scroll state
-   **Hover Display**: Appears immediately when hovering over the track area
-   **Interactive**: Supports click, drag, and arrow button scrolling
-   **Smooth Animations**: Fade transitions applied to all state changes

## Size Settings

### Independent Size Control

```tsx
function SizeCustomization() {
    return (
        <OverlayScrollbar
            trackWidth={20} // Hover detection area width (default: 16px)
            thumbWidth={10} // Thumb and track background width (default: 8px)
            thumbMinHeight={60} // Minimum thumb height (default: 50px)
            thumbRadius={8} // Thumb corner rounding (default: thumbWidth/2)
            style={{ height: "400px" }}
        >
            <div style={{ height: "1000px" }}>Custom sized scrollbar</div>
        </OverlayScrollbar>
    );
}
```

## Arrow Navigation

### Enable Arrow Buttons

```tsx
function ArrowNavigation() {
    return (
        <OverlayScrollbar
            showArrows={true} // Display arrow buttons
            arrowStep={100} // Scroll distance per arrow click (default: 50px)
            arrowColor="rgba(80, 80, 80, 0.8)"
            arrowActiveColor="rgba(40, 40, 40, 1.0)" // Color on hover
            style={{ height: "400px" }}
        >
            <div style={{ height: "1500px" }}>
                Scrollable content with arrow navigation
            </div>
        </OverlayScrollbar>
    );
}
```

## Color Customization

### Complete Color Control

```tsx
function ColorCustomization() {
    return (
        <OverlayScrollbar
            // Track background color
            trackColor="rgba(240, 240, 240, 0.8)"
            // Thumb color (normal state)
            thumbColor="rgba(100, 150, 200, 0.7)"
            // Thumb color (dragging)
            thumbActiveColor="rgba(100, 150, 200, 1.0)"
            // Arrow color
            showArrows={true}
            arrowColor="rgba(80, 80, 80, 0.8)"
            arrowActiveColor="rgba(40, 40, 40, 1.0)"
            style={{ height: "400px" }}
        >
            <div style={{ height: "1000px" }}>Color customized scrollbar</div>
        </OverlayScrollbar>
    );
}
```

## Advanced Usage

### Using All Options

```tsx
function AdvancedUsage() {
    const handleScroll = (event: Event) => {
        console.log("Scroll event:", event);
    };

    return (
        <OverlayScrollbar
            // Size settings
            trackWidth={24}
            thumbWidth={12}
            thumbMinHeight={80}
            thumbRadius={10}
            // Arrow settings
            showArrows={true}
            arrowStep={120}
            // Color settings
            trackColor="rgba(220, 220, 220, 0.9)"
            thumbColor="rgba(70, 130, 180, 0.8)"
            thumbActiveColor="rgba(70, 130, 180, 1.0)"
            arrowColor="rgba(100, 100, 100, 0.9)"
            arrowActiveColor="rgba(50, 50, 50, 1.0)"
            // Event handling
            onScroll={handleScroll}
            className="custom-scrollbar"
            style={{
                height: "500px",
                border: "1px solid #ddd",
                borderRadius: "8px",
            }}
        >
            <div style={{ height: "2000px", padding: "20px" }}>
                <h2>Advanced Customization Example</h2>
                <p>This scrollbar has all options applied.</p>
                {/* More content */}
            </div>
        </OverlayScrollbar>
    );
}
```

## Ref Usage

### Programmatic Scroll Control

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
            console.log("Current scroll position:", scrollTop);
            console.log("Total scroll height:", scrollHeight);
            console.log("Visible height:", clientHeight);
        }
    };

    return (
        <div>
            <div style={{ marginBottom: "10px" }}>
                <button onClick={scrollToTop}>Scroll to Top</button>
                <button onClick={scrollToBottom}>Scroll to Bottom</button>
                <button onClick={getScrollInfo}>Get Scroll Info</button>
            </div>

            <OverlayScrollbar ref={scrollbarRef} style={{ height: "400px" }}>
                <div style={{ height: "1000px", padding: "20px" }}>
                    Scrollbar controllable via ref
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
                currentPosition: scrollTop,
                totalHeight: scrollHeight,
                visibleHeight: clientHeight,
                scrollableHeight: scrollHeight - clientHeight,
            });
        }
    };

    return (
        <div>
            <div style={{ marginBottom: "10px" }}>
                <button onClick={scrollToTop}>Scroll to Top</button>
                <button onClick={() => scrollToPosition(500)}>
                    Scroll to 500px
                </button>
                <button onClick={getScrollInfo}>Log Scroll Info</button>
            </div>

            <div style={{ height: "400px" }}>
                <OverlayScrollbar
                    ref={scrollbarRef}
                    onScroll={(event) => {
                        console.log("Scroll event:", event);
                    }}
                >
                    <div style={{ height: "1000px", padding: "20px" }}>
                        {/* Content */}
                    </div>
                </OverlayScrollbar>
            </div>
        </div>
    );
}
```

### Scroll Event Handling

```tsx
function ScrollEventExample() {
    const handleScroll = (event: Event) => {
        const target = event.target as HTMLDivElement;
        const scrollPercentage =
            (target.scrollTop / (target.scrollHeight - target.clientHeight)) *
            100;

        console.log(`Scroll progress: ${scrollPercentage.toFixed(1)}%`);
    };

    return (
        <OverlayScrollbar onScroll={handleScroll}>
            {/* Content */}
        </OverlayScrollbar>
    );
}
```

## Styling

### CSS Class Customization

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
            {/* Content */}
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

/* Customize scrollbar track */
.my-custom-scrollbar .overlay-scrollbar-track:hover {
    background-color: rgba(0, 0, 0, 0.05) !important;
}
```

### Custom Scrollbar Width

Starting from version 2.0, you can adjust the scrollbar width using the `scrollbarWidth` prop:

```tsx
function CustomWidthScrollbars() {
    return (
        <div style={{ display: "flex", gap: "20px" }}>
            {/* Thin scrollbar (6px) */}
            <div style={{ width: "200px" }}>
                <h4>Thin Scrollbar</h4>
                <OverlayScrollbar
                    scrollbarWidth={6}
                    style={{ height: "300px", border: "1px solid #ddd" }}
                >
                    <div style={{ height: "800px", padding: "16px" }}>
                        Minimal design suitable for small screens or fine UI.
                    </div>
                </OverlayScrollbar>
            </div>

            {/* Default scrollbar (8px) */}
            <div style={{ width: "200px" }}>
                <h4>Default Scrollbar</h4>
                <OverlayScrollbar
                    style={{ height: "300px", border: "1px solid #ddd" }}
                >
                    <div style={{ height: "800px", padding: "16px" }}>
                        Default 8px width scrollbar. Suitable for most
                        situations.
                    </div>
                </OverlayScrollbar>
            </div>

            {/* Thick scrollbar (12px) */}
            <div style={{ width: "200px" }}>
                <h4>Thick Scrollbar</h4>
                <OverlayScrollbar
                    scrollbarWidth={12}
                    style={{ height: "300px", border: "1px solid #ddd" }}
                >
                    <div style={{ height: "800px", padding: "16px" }}>
                        More visible thick scrollbar. Useful for touch devices
                        or accessibility.
                    </div>
                </OverlayScrollbar>
            </div>
        </div>
    );
}
```

### Usage in Various Layouts

```tsx
// Inside a card
function CardWithScrollbar() {
    return (
        <div className="card">
            <div className="card-header">
                <h3>Title</h3>
            </div>
            <div className="card-body" style={{ height: "300px" }}>
                <OverlayScrollbar scrollbarWidth={6}>
                    <div style={{ padding: "16px" }}>{/* Card content */}</div>
                </OverlayScrollbar>
            </div>
        </div>
    );
}

// In sidebar
function Sidebar() {
    return (
        <div className="sidebar" style={{ width: "250px", height: "100vh" }}>
            <div className="sidebar-header">Logo</div>
            <div style={{ flex: 1 }}>
                <OverlayScrollbar scrollbarWidth={10}>
                    <nav>{/* Navigation menu */}</nav>
                </OverlayScrollbar>
            </div>
        </div>
    );
}
```

## API Reference

### Props

| Prop                    | Type                     | Default                      | Description                                                      |
| ----------------------- | ------------------------ | ---------------------------- | ---------------------------------------------------------------- |
| `children`              | `ReactNode`              | -                            | Scrollable content                                               |
| `className`             | `string`                 | -                            | Additional CSS class for container                               |
| `style`                 | `React.CSSProperties`    | -                            | Additional inline style for container                            |
| `onScroll`              | `(event: Event) => void` | -                            | Callback fired on scroll                                         |
| **Size Settings**       |                          |                              |                                                                  |
| `trackWidth`            | `number`                 | `16`                         | Width of hover detection track area (px)                         |
| `thumbWidth`            | `number`                 | `8`                          | Width of thumb and track background (px)                         |
| `thumbMinHeight`        | `number`                 | `50`                         | Minimum height of thumb (px)                                     |
| `thumbRadius`           | `number`                 | `thumbWidth / 2`             | Border radius of thumb (px)                                      |
| `scrollbarWidth`        | `number`                 | `8`                          | **Deprecated:** Use `trackWidth`/`thumbWidth` instead            |
| **Arrow Settings**      |                          |                              |                                                                  |
| `showArrows`            | `boolean`                | `false`                      | Show top/bottom navigation arrows                                |
| `arrowStep`             | `number`                 | `50`                         | Scroll distance per arrow click (px)                             |
| **Color Customization** |                          |                              |                                                                  |
| `trackColor`            | `string`                 | `"rgba(128, 128, 128, 0.1)"` | Background color of scrollbar track                              |
| `thumbColor`            | `string`                 | `"rgba(128, 128, 128, 0.6)"` | Color of scrollbar thumb                                         |
| `thumbActiveColor`      | `string`                 | `"rgba(128, 128, 128, 0.9)"` | Color of thumb when dragging                                     |
| `arrowColor`            | `string`                 | `"rgba(128, 128, 128, 0.8)"` | Color of navigation arrows                                       |
| `arrowActiveColor`      | `string`                 | `"rgba(64, 64, 64, 1.0)"`    | Arrow color on hover                                             |
| **Auto-hide Settings**  |                          |                              |                                                                  |
| `hideDelay`             | `number`                 | `1500`                       | Default auto-hide delay (ms) - applied after drag, arrows, hover |
| `hideDelayOnWheel`      | `number`                 | `700`                        | Auto-hide delay after wheel scroll (ms) - quick hide             |

### TypeScript Types

The package provides TypeScript types for better development experience:

```tsx
import {
    OverlayScrollbar,
    OverlayScrollbarProps,
    OverlayScrollbarRef,
} from "@ehfuse/overlay-scrollbar";
```

#### OverlayScrollbarProps

Interface for component props:

```tsx
interface OverlayScrollbarProps {
    className?: string;
    style?: React.CSSProperties;
    children: ReactNode;
    onScroll?: (event: Event) => void;

    // Size & Layout
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

#### OverlayScrollbarRef

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

#### Using with TypeScript

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
                <div style={{ height: "1000px" }}>Content here...</div>
            </OverlayScrollbar>
        </div>
    );
};
```

### Ref Methods

The component provides several methods through ref:

| Method               | Type                                 | Description                          |
| -------------------- | ------------------------------------ | ------------------------------------ |
| `getScrollContainer` | `() => HTMLDivElement \| null`       | Returns scrollable container element |
| `scrollTo`           | `(options: ScrollToOptions) => void` | Scroll to specific position          |
| `scrollTop`          | `number`                             | Get current scroll top position      |
| `scrollHeight`       | `number`                             | Get total scrollable height          |
| `clientHeight`       | `number`                             | Get container visible height         |

### ScrollToOptions

```typescript
interface ScrollToOptions {
    top?: number;
    left?: number;
    behavior?: "auto" | "smooth";
}
```

### Event Handlers

```typescript
type ScrollEventHandler = (event: Event) => void;
```

## How It Works

### Smart Auto-hide System

-   **After wheel scroll**: Auto-hide after 700ms (quick response)
-   **During drag operation**: Maintain visible state
-   **After drag ends**: Hide after 1500ms
-   **After arrow click**: Hide after 1500ms
-   **After hover ends**: Hide after 1500ms
-   **On hover**: Appear immediately when mouse enters track area

#### Timing Customization

```tsx
<OverlayScrollbar
    hideDelay={2000} // Default hide time: 2 seconds
    hideDelayOnWheel={500} // After wheel scroll: 0.5 seconds
>
    {children}
</OverlayScrollbar>
```

### Interactive Scrolling

-   **Track click**: Jump to clicked position immediately
-   **Thumb drag**: Precise scroll control
-   **Arrow buttons**: Step-by-step navigation (when enabled)
-   **Wheel/touch**: Preserve native scroll behavior

### Visual Feedback

-   **Thumb states**: Color change when dragging
-   **Arrow hover**: Color change on mouse over
-   **Smooth transitions**: Fade animations for all state changes
-   **Responsive**: Auto-resize using ResizeObserver

## Troubleshooting

### Frequently Asked Questions

**Q: Scrollbar is not visible**
A: Check the following:

-   Is the container set to a fixed height?
-   Is the content taller than the container?
-   Is overflow set to hidden in CSS?

**Q: Scrolling is not smooth**
A: Use `behavior: 'smooth'` option in the `scrollTo` method:

```tsx
scrollbarRef.current?.scrollTo({ top: 100, behavior: "smooth" });
```

**Q: Doesn't work on mobile**
A: On mobile devices, native touch scrolling takes priority. This is intended behavior.

**Q: Conflicts with other scrollbars**
A: When using with other scrollbar libraries, check CSS priority and use `!important` if needed.

### Performance Optimization Tips

1. **Virtualize large lists**: Use react-window or react-virtualized for very long lists
2. **Debounce events**: Apply debouncing for heavy operations in onScroll events
3. **Memoization**: Use React.memo or useMemo to prevent unnecessary re-renders

### Debugging

For debugging during development, you can use this code:

```tsx
function DebugScrollbar() {
    const scrollbarRef = useRef<OverlayScrollbarRef>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            if (scrollbarRef.current) {
                console.log("Scroll state:", {
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
        <OverlayScrollbar ref={scrollbarRef}>{/* Content */}</OverlayScrollbar>
    );
}
```

## Browser Support

### Desktop Browsers

-   **Chrome/Chromium**: Full support (version 60+)
-   **Firefox**: Full support (version 55+)
-   **Safari**: Full support (version 12+)
-   **Edge**: Full support (Chromium-based)

### Mobile Browsers

-   **iOS Safari**: Touch scroll supported, overlay scrollbar hidden
-   **Chrome Mobile**: Touch scroll supported, overlay scrollbar hidden
-   **Samsung Internet**: Touch scroll supported
-   **Firefox Mobile**: Touch scroll supported

### Compatibility Notes

-   On mobile devices, native touch scrolling takes priority
-   Overlay scrollbar is automatically hidden on touch devices
-   Keyboard navigation supported in all browsers (PageUp/PageDown, Home/End, arrow keys)

## License and Contributing

### MIT License

This project is distributed under the MIT license. You can use it freely in both commercial and non-commercial projects.

### Contributing

1. **Issue Reporting**: Report bugs on [GitHub Issues](https://github.com/ehfuse/overlay-scrollbar/issues)
2. **Feature Suggestions**: Submit ideas for new features
3. **Code Contributions**: Improve code through Pull Requests
4. **Documentation**: Improve and translate documentation
5. **Testing**: Test in various environments

### Development Environment Setup

```bash
# Clone project
git clone https://github.com/ehfuse/overlay-scrollbar.git
cd overlay-scrollbar

# Install dependencies
npm install

# Start development server
npm run dev

# Build
npm run build

# Run tests
npm test
```

## Next Steps

-   Check all props and methods in the [API Reference](https://github.com/ehfuse/overlay-scrollbar/blob/main/README.md#api-reference)
-   [Korean version guide](https://github.com/ehfuse/overlay-scrollbar/blob/main/docs/getting-started-ko.md)
-   [Deployment guide](https://github.com/ehfuse/overlay-scrollbar/blob/main/docs/DEPLOY.md) (for developers)

## Need Help?

-   Report bugs or request features on [GitHub Issues](https://github.com/ehfuse/overlay-scrollbar/issues)
-   Ask questions on [GitHub Discussions](https://github.com/ehfuse/overlay-scrollbar/discussions)
