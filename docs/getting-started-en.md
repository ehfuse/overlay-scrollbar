# Getting Started with OverlayScrollbar

This guide provides step-by-step instructions for installing and using the OverlayScrollbar React component in your project.

## Table of Contents

1. [Installation](#installation)
2. [Basic Usage](#basic-usage)
3. [Advanced Usage](#advanced-usage)
4. [Styling](#styling)
5. [Troubleshooting](#troubleshooting)

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
                    <p>Your long content goes here...</p>
                    {/* More content */}
                </div>
            </OverlayScrollbar>
        </div>
    );
}
```

### 3. Key Concepts

-   **Overlay Scrollbar**: Displays over content without affecting layout
-   **Auto-hide**: Automatically hides when not needed or inactive
-   **Hover Reveal**: Appears when hovering over the right edge
-   **Smooth Animations**: All state transitions are smoothly animated

## Advanced Usage

### Scroll Control with Ref

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

### Handling Scroll Events

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

### Customization with CSS Classes

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

/* Custom scrollbar track styling */
.my-custom-scrollbar .overlay-scrollbar-track:hover {
    background-color: rgba(0, 0, 0, 0.05) !important;
}
```

### Usage in Different Layouts

```tsx
// Usage inside cards
function CardWithScrollbar() {
    return (
        <div className="card">
            <div className="card-header">
                <h3>Title</h3>
            </div>
            <div className="card-body" style={{ height: "300px" }}>
                <OverlayScrollbar>
                    <div style={{ padding: "16px" }}>{/* Card content */}</div>
                </OverlayScrollbar>
            </div>
        </div>
    );
}

// Usage in sidebars
function Sidebar() {
    return (
        <div className="sidebar" style={{ width: "250px", height: "100vh" }}>
            <div className="sidebar-header">Logo</div>
            <div style={{ flex: 1 }}>
                <OverlayScrollbar>
                    <nav>{/* Navigation menu */}</nav>
                </OverlayScrollbar>
            </div>
        </div>
    );
}
```

## Troubleshooting

### Frequently Asked Questions

**Q: The scrollbar is not visible**
A: Check the following:

-   Container has a fixed height
-   Content is taller than the container
-   CSS overflow is not set to hidden

**Q: Scrolling is not smooth**
A: Use the `behavior: 'smooth'` option in the `scrollTo` method:

```tsx
scrollbarRef.current?.scrollTo({ top: 100, behavior: "smooth" });
```

**Q: It doesn't work on mobile devices**
A: On mobile devices, native touch scrolling takes precedence. This is intended behavior.

**Q: Conflicts with other scrollbar libraries**
A: When using with other scrollbar libraries, check CSS priority and use `!important` if necessary.

### Performance Optimization Tips

1. **Virtualize large lists**: For very long lists, use with react-window or react-virtualized
2. **Debounce events**: Apply debouncing for heavy operations in onScroll events
3. **Memoization**: Use React.memo or useMemo to prevent unnecessary re-renders

### Debugging

If you encounter issues during development, you can debug with this code:

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

## Next Steps

-   Check out the [API Reference](https://github.com/ehfuse/overlay-scrollbar/blob/main/README.md#api-reference) for all props and methods
-   [Korean version guide](https://github.com/ehfuse/overlay-scrollbar/blob/main/docs/getting-started-ko.md)
-   [Deployment guide](https://github.com/ehfuse/overlay-scrollbar/blob/main/docs/DEPLOY.md) (for developers)

## Need Help?

-   Report bugs or request features on [GitHub Issues](https://github.com/ehfuse/overlay-scrollbar/issues)
-   Ask questions on [GitHub Discussions](https://github.com/ehfuse/overlay-scrollbar/discussions)
