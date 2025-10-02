# Getting Started with OverlayScrollbar

A guide for installing and using the highly customizable React overlay scrollbar component.

## Table of Contents

1. [Installation](#installation)
2. [Basic Usage](#basic-usage)
3. [Configuration Object (v1.3.0+)](#configuration-object-v130)
4. [Drag Scroll](#drag-scroll)
5. [Arrow Navigation](#arrow-navigation)
6. [Color and Size Customization](#color-and-size-customization)
7. [External Container Connection](#external-container-connection)
8. [TypeScript Usage](#typescript-usage)
9. [API Reference](#api-reference)
10. [Troubleshooting](#troubleshooting)

## Installation

```bash
npm install @ehfuse/overlay-scrollbar
```

or

```bash
yarn add @ehfuse/overlay-scrollbar
```

## Basic Usage

### Simple Example

```tsx
import React from "react";
import { OverlayScrollbar } from "@ehfuse/overlay-scrollbar";

function App() {
    return (
        <div style={{ height: "400px" }}>
            <OverlayScrollbar>
                <div style={{ height: "1000px", padding: "20px" }}>
                    <h2>Scrollable Content</h2>
                    <p>Long content goes here...</p>
                </div>
            </OverlayScrollbar>
        </div>
    );
}
```

### Core Concepts

-   **True Overlay**: Floats above content without affecting layout
-   **Smart Auto-Hide**: Intelligent show/hide based on scroll state
-   **Hover Display**: Appears immediately when hovering over track area
-   **Smooth Animations**: Fade effects for all state changes
-   **Auto-Detection**: Automatically finds and tracks scrollable containers (Virtuoso, custom implementations, etc.)

## Configuration Object (v1.3.0+)

Starting from v1.3.0, related settings are grouped into objects for a cleaner API.

### Basic Structure

```tsx
<OverlayScrollbar
    style={{ height: "100%" }} // Wrapper div styles
    containerStyle={{ padding: "10px" }} // Scroll container styles
    contentStyle={{ display: "flex", flexDirection: "column" }} // Content div styles
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
        alignment: "center",
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
    {/* Content */}
</OverlayScrollbar>
```

## Drag Scroll

A feature that allows scrolling by dragging the content with the mouse.

### Basic Usage

```tsx
function DragScrollExample() {
    return (
        <OverlayScrollbar
            dragScroll={{
                enabled: true, // default: true
            }}
        >
            <div style={{ height: "1000px" }}>
                <p>Drag this area to scroll!</p>
                <input
                    type="text"
                    placeholder="Input fields are automatically excluded"
                />
                <button>Buttons are also automatically excluded</button>
            </div>
        </OverlayScrollbar>
    );
}
```

### Automatically Excluded Elements

Elements that the system automatically excludes from drag scroll:

1. **Basic Input Elements**: `input`, `textarea`, `select`, `button`
2. **Editable Elements**: `contenteditable="true"`
3. **SVG Elements**: Icons and graphic elements
4. **UI Libraries**: Material-UI, Ant Design, Shadcn/ui, Radix UI, etc.

### Custom Exclusion Settings

To exclude specific elements from drag scroll:

```tsx
<OverlayScrollbar
    dragScroll={{
        enabled: true,
        excludeClasses: [
            "no-drag", // exclude by class
            "chart-controls", // chart manipulation area
            "image-gallery", // image gallery
        ],
        excludeSelectors: [
            ".toolbar button", // toolbar buttons
            "[data-interactive='true']", // data attribute
            ".canvas-container canvas", // canvas elements
        ],
    }}
>
    <div>
        <div className="no-drag">This area cannot be drag scrolled</div>
        <div data-interactive="true">Interactive content</div>
        <p>Normal text can be drag scrolled</p>
    </div>
</OverlayScrollbar>
```

## Arrow Navigation

You can add arrow buttons at the top and bottom of the scrollbar.

```tsx
function ArrowExample() {
    return (
        <OverlayScrollbar
            arrows={{
                visible: true, // show arrows
                step: 100, // scroll distance per click (px)
                color: "#808080",
                opacity: 0.6,
                hoverColor: "#404040",
                hoverOpacity: 1.0,
            }}
        >
            <div style={{ height: "1500px" }}>
                Content that can be scrolled with arrows
            </div>
        </OverlayScrollbar>
    );
}
```

## Color and Size Customization

### Complete Style Customization

```tsx
function StyledExample() {
    return (
        <OverlayScrollbar
            thumb={{
                width: 10, // thumb width
                minHeight: 60, // thumb minimum height
                radius: 8, // rounded corners
                color: "#4682b4", // default color
                opacity: 0.7,
                hoverColor: "#4682b4", // color when hovering/dragging
                hoverOpacity: 1.0,
            }}
            track={{
                width: 20, // track width
                color: "rgba(200, 200, 200, 0.8)", // track background color
                visible: true, // show track background
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
                delay: 2000, // hide after 2 seconds
                delayOnWheel: 500, // hide after 0.5 seconds after wheel
            }}
        >
            <div style={{ height: "1000px" }}>Customized scrollbar</div>
        </OverlayScrollbar>
    );
}
```

## Automatic Scroll Container Detection

OverlayScrollbar automatically detects and connects to scrollable containers, including virtualized lists (Virtuoso, react-window, etc.) and custom scroll implementations.

### How It Works

1. **Automatic Discovery**: Searches for common scroll containers (`.virtuoso-scroller`, `[data-virtuoso-scroller]`, elements with overflow styles)
2. **Performance Caching**: Caches the found container to avoid repeated searches
3. **Dynamic Updates**: Uses MutationObserver to detect DOM changes and re-discover containers when needed
4. **Zero Configuration**: No need to manually pass scroll containers

### Usage with Virtualized Lists

```tsx
import React from "react";
import { Virtuoso } from "react-virtuoso";
import { OverlayScrollbar } from "@ehfuse/overlay-scrollbar";

function VirtualizedExample() {
    return (
        <div style={{ height: "400px", position: "relative" }}>
            <OverlayScrollbar thumb={{ width: 8 }} track={{ width: 16 }}>
                {/* Virtuoso's scroll container is automatically detected */}
                <Virtuoso
                    data={Array.from({ length: 1000 })}
                    itemContent={(index) => <div>Item {index}</div>}
                />
            </OverlayScrollbar>
        </div>
    );
}

// Works with any virtualized library
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
                        <div style={style}>Item {index}</div>
                    )}
                </FixedSizeList>
            </OverlayScrollbar>
        </div>
    );
}
```

## TypeScript Usage

Full type support for safe development.

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

    // Type-safe configuration objects
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
                <button onClick={scrollToTop}>Scroll to Top</button>
                <button onClick={getScrollInfo}>Get Scroll Info</button>
            </div>

            <OverlayScrollbar
                ref={scrollbarRef}
                thumb={thumbConfig}
                track={trackConfig}
                dragScroll={dragScrollConfig}
                onScroll={(event) => {
                    console.log("Scrolled!", scrollbarRef.current?.scrollTop);
                }}
            >
                <div style={{ height: "1000px", padding: "20px" }}>
                    <h2>TypeScript Example</h2>
                    <p>Type-safe scrollbar usage</p>
                </div>
            </OverlayScrollbar>
        </div>
    );
};
```

## API Reference

### Style Properties

The component provides three style props for different layers:

```tsx
<OverlayScrollbar
    style={{ height: "100%" }} // Applied to wrapper div
    containerStyle={{ padding: "10px" }} // Applied to scrollable container
    contentStyle={{ display: "flex" }} // Applied to inner content
>
    {children}
</OverlayScrollbar>
```

**DOM Structure:**

```
<div style={style}>                    ← Wrapper (position: relative)
  <div style={containerStyle}>         ← Scroll container (overflow: auto)
    <div style={contentStyle}>         ← Content wrapper
      {children}
    </div>
  </div>
  <div>                                ← Scrollbar track (position: absolute)
    ...
  </div>
</div>
```

### Props

| Property         | Type                     | Default | Description                 |
| ---------------- | ------------------------ | ------- | --------------------------- |
| `children`       | `ReactNode`              | -       | Content to scroll           |
| `className`      | `string`                 | -       | Additional CSS class        |
| `style`          | `React.CSSProperties`    | -       | Wrapper div styles          |
| `containerStyle` | `React.CSSProperties`    | -       | Scroll container div styles |
| `contentStyle`   | `React.CSSProperties`    | -       | Inner content div styles    |
| `onScroll`       | `(event: Event) => void` | -       | Scroll event callback       |
| `thumb`          | `ThumbConfig`            | `{}`    | Thumb configuration object  |
| `track`          | `TrackConfig`            | `{}`    | Track configuration object  |
| `arrows`         | `ArrowsConfig`           | `{}`    | Arrows configuration object |
| `dragScroll`     | `DragScrollConfig`       | `{}`    | Drag scroll configuration   |
| `autoHide`       | `AutoHideConfig`         | `{}`    | Auto-hide configuration     |
| `showScrollbar`  | `boolean`                | `true`  | Show scrollbar              |

### Configuration Object Properties

#### ThumbConfig

| Property       | Type     | Default     | Description                 |
| -------------- | -------- | ----------- | --------------------------- |
| `width`        | `number` | `8`         | Thumb width (px)            |
| `minHeight`    | `number` | `50`        | Thumb minimum height (px)   |
| `radius`       | `number` | `width / 2` | Thumb border radius (px)    |
| `color`        | `string` | `"#606060"` | Thumb base color            |
| `opacity`      | `number` | `0.6`       | Thumb base opacity          |
| `hoverColor`   | `string` | `color`     | Thumb color on hover/drag   |
| `hoverOpacity` | `number` | `1.0`       | Thumb opacity on hover/drag |

#### TrackConfig

| Property    | Type                  | Default                      | Description                  |
| ----------- | --------------------- | ---------------------------- | ---------------------------- |
| `width`     | `number`              | `16`                         | Track hover area width (px)  |
| `color`     | `string`              | `"rgba(128, 128, 128, 0.1)"` | Track background color       |
| `visible`   | `boolean`             | `true`                       | Show track background        |
| `alignment` | `"center" \| "right"` | `"center"`                   | Track alignment              |
| `radius`    | `number`              | `thumb.radius \| 4`          | Track border radius (px)     |
| `margin`    | `number`              | `4`                          | Track top/bottom margin (px) |

#### ArrowsConfig

| Property       | Type      | Default     | Description                    |
| -------------- | --------- | ----------- | ------------------------------ |
| `visible`      | `boolean` | `false`     | Show arrow buttons             |
| `step`         | `number`  | `50`        | Scroll distance per click (px) |
| `color`        | `string`  | `"#808080"` | Arrow base color               |
| `opacity`      | `number`  | `0.6`       | Arrow base opacity             |
| `hoverColor`   | `string`  | `color`     | Arrow color on hover           |
| `hoverOpacity` | `number`  | `1.0`       | Arrow opacity on hover         |

#### DragScrollConfig

| Property           | Type       | Default | Description                               |
| ------------------ | ---------- | ------- | ----------------------------------------- |
| `enabled`          | `boolean`  | `true`  | Enable drag scroll                        |
| `excludeClasses`   | `string[]` | `[]`    | Classes to exclude from drag scroll       |
| `excludeSelectors` | `string[]` | `[]`    | CSS selectors to exclude from drag scroll |

#### AutoHideConfig

| Property       | Type      | Default | Description                      |
| -------------- | --------- | ------- | -------------------------------- |
| `enabled`      | `boolean` | `true`  | Enable auto-hide                 |
| `delay`        | `number`  | `1500`  | Auto-hide delay (ms)             |
| `delayOnWheel` | `number`  | `700`   | Auto-hide delay after wheel (ms) |

### Main Interfaces

```tsx
interface OverlayScrollbarProps {
    children: ReactNode;
    className?: string;
    style?: React.CSSProperties;
    onScroll?: (event: Event) => void;

    // Configuration objects
    thumb?: ThumbConfig;
    track?: TrackConfig;
    arrows?: ArrowsConfig;
    dragScroll?: DragScrollConfig;
    autoHide?: AutoHideConfig;

    // Other settings
    showScrollbar?: boolean; // default: true
}

interface ThumbConfig {
    width?: number; // default: 8px
    minHeight?: number; // default: 50px
    radius?: number; // default: width / 2
    color?: string; // default: "#606060"
    opacity?: number; // default: 0.6
    hoverColor?: string; // default: color
    hoverOpacity?: number; // default: 1.0
}

interface TrackConfig {
    width?: number; // default: 16px
    color?: string; // default: "rgba(128, 128, 128, 0.1)"
    visible?: boolean; // default: true
    alignment?: "center" | "right"; // default: "center"
    radius?: number; // default: thumb.radius or 4px
    margin?: number; // default: 4px
}

interface ArrowsConfig {
    visible?: boolean; // default: false
    step?: number; // default: 50px
    color?: string; // default: "#808080"
    opacity?: number; // default: 0.6
    hoverColor?: string; // default: color
    hoverOpacity?: number; // default: 1.0
}

interface DragScrollConfig {
    enabled?: boolean; // default: true
    excludeClasses?: string[]; // additional exclude classes
    excludeSelectors?: string[]; // additional exclude selectors
}

interface AutoHideConfig {
    enabled?: boolean; // default: true
    delay?: number; // default: 1500ms
    delayOnWheel?: number; // default: 700ms
}
```

### Ref Methods

```tsx
interface OverlayScrollbarRef {
    getScrollContainer: () => HTMLDivElement | null;
    scrollTo: (options: ScrollToOptions) => void;
    scrollTop: number;
    scrollHeight: number;
    clientHeight: number;
}
```

## Troubleshooting

### Frequently Asked Questions

**Q: The scrollbar is not visible**
A: Make sure the container has an explicit height set and the content is larger than the container.

**Q: Drag scroll is not working**
A: Check if `dragScroll.enabled` is `true` and the target element is not in the exclusion list.

**Q: How to use with virtualized lists?**
A: Just wrap the virtualized list component. OverlayScrollbar automatically detects and connects to the scroll container.

```tsx
// Virtuoso example - automatic detection
<OverlayScrollbar>
    <Virtuoso
        data={items}
        itemContent={(index, item) => <div>{item}</div>}
    />
</OverlayScrollbar>

// No need for manual container detection like this:
    setScrollContainer(container);
}, []);

<OverlayScrollbar scrollContainer={scrollContainer} />;
```

**Q: The scrollbar is not visible on mobile**
A: On mobile, touch scroll is prioritized and the overlay scrollbar is automatically hidden.

### Performance Optimization

1. **Large Content**: Recommend using virtualized lists
2. **Many Scrollbars**: Adjust `autoHide.delay` for better performance
3. **Complex Exclusion Rules**: Use simple class names as much as possible

## Browser Support

-   **Chrome/Edge**: Full support
-   **Firefox**: Full support
-   **Safari**: Full support
-   **Mobile**: Touch scroll support, overlay scrollbar hidden

## License

MIT © [KIM YOUNG JIN](mailto:ehfuse@gmail.com)

## Issue Reporting

If you find a bug or have a feature request, please report it at [GitHub Issues](https://github.com/ehfuse/overlay-scrollbar/issues).
