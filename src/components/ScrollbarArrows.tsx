/**
 * ScrollbarArrows.tsx
 * 스크롤바 화살표 버튼 컴포넌트
 *
 * @copyright 2025 KIM YOUNG JIN (ehfuse@gmail.com)
 */

import React from "react";

interface ScrollbarArrowsProps {
    adjustedTrackWidth: number;
    finalThumbWidth: number;
    scrollbarVisible: boolean;
    hoveredArrow: "up" | "down" | null;
    finalArrowsConfig: {
        color: string;
        opacity: number;
        hoverColor: string;
        hoverOpacity: number;
    };
    finalTrackConfig: {
        alignment: string;
        margin: number;
    };
    setHoveredArrow: (arrow: "up" | "down" | null) => void;
    handleUpArrowClick: (e: React.MouseEvent) => void;
    handleDownArrowClick: (e: React.MouseEvent) => void;
}

export const ScrollbarArrows: React.FC<ScrollbarArrowsProps> = ({
    adjustedTrackWidth,
    finalThumbWidth,
    scrollbarVisible,
    hoveredArrow,
    finalArrowsConfig,
    finalTrackConfig,
    setHoveredArrow,
    handleUpArrowClick,
    handleDownArrowClick,
}) => {
    const arrowStyle = {
        position: "absolute" as const,
        width: `${finalThumbWidth}px`,
        height: `${finalThumbWidth}px`,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: `${Math.max(finalThumbWidth * 0.75, 8)}px`,
        userSelect: "none" as const,
        zIndex: 1001,
        transition: "opacity 0.2s ease-in-out, color 0.15s ease-in-out",
        right:
            finalTrackConfig.alignment === "right"
                ? "0px"
                : `${(adjustedTrackWidth - finalThumbWidth) / 2}px`,
    };

    return (
        <>
            {/* 위쪽 화살표 */}
            <div
                className="overlay-scrollbar-up-arrow"
                onClick={handleUpArrowClick}
                onMouseEnter={() => setHoveredArrow("up")}
                onMouseLeave={() => setHoveredArrow(null)}
                style={{
                    ...arrowStyle,
                    top: `${finalTrackConfig.margin}px`,
                    color:
                        hoveredArrow === "up"
                            ? finalArrowsConfig.hoverColor
                            : finalArrowsConfig.color,
                    opacity: scrollbarVisible
                        ? hoveredArrow === "up"
                            ? finalArrowsConfig.hoverOpacity
                            : finalArrowsConfig.opacity
                        : 0,
                }}
            >
                ▲
            </div>

            {/* 아래쪽 화살표 */}
            <div
                className="overlay-scrollbar-down-arrow"
                onClick={handleDownArrowClick}
                onMouseEnter={() => setHoveredArrow("down")}
                onMouseLeave={() => setHoveredArrow(null)}
                style={{
                    ...arrowStyle,
                    bottom: `${finalTrackConfig.margin}px`,
                    color:
                        hoveredArrow === "down"
                            ? finalArrowsConfig.hoverColor
                            : finalArrowsConfig.color,
                    opacity: scrollbarVisible
                        ? hoveredArrow === "down"
                            ? finalArrowsConfig.hoverOpacity
                            : finalArrowsConfig.opacity
                        : 0,
                }}
            >
                ▼
            </div>
        </>
    );
};
