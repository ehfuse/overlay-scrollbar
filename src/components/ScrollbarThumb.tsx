/**
 * ScrollbarThumb.tsx
 * 스크롤바 썸 컴포넌트
 *
 * @copyright 2025 KIM YOUNG JIN (ehfuse@gmail.com)
 */

import React from "react";

interface ScrollbarThumbProps {
    thumbRef: React.RefObject<HTMLDivElement>;
    thumbTop: number;
    thumbHeight: number;
    thumbMinHeight: number;
    showArrows: boolean;
    finalThumbWidth: number;
    adjustedTrackWidth: number;
    isDragging: boolean;
    isThumbHovered: boolean;
    finalThumbConfig: {
        width: number;
        color: string;
        opacity: number;
        hoverColor: string;
        hoverOpacity: number;
        radius: number;
    };
    finalTrackConfig: {
        alignment: string;
        margin: number;
    };
    handleThumbMouseDown: (e: React.MouseEvent) => void;
    setIsThumbHovered: (hovered: boolean) => void;
}

export const ScrollbarThumb: React.FC<ScrollbarThumbProps> = ({
    thumbRef,
    thumbTop,
    thumbHeight,
    thumbMinHeight,
    showArrows,
    finalThumbWidth,
    adjustedTrackWidth,
    isDragging,
    isThumbHovered,
    finalThumbConfig,
    finalTrackConfig,
    handleThumbMouseDown,
    setIsThumbHovered,
}) => {
    return (
        <div
            ref={thumbRef}
            className="overlay-scrollbar-thumb"
            onMouseDown={handleThumbMouseDown}
            onMouseEnter={() => setIsThumbHovered(true)}
            onMouseLeave={() => setIsThumbHovered(false)}
            style={{
                position: "absolute",
                top: `${
                    (showArrows
                        ? finalThumbWidth + finalTrackConfig.margin * 2
                        : finalTrackConfig.margin) + thumbTop
                }px`,
                right:
                    finalTrackConfig.alignment === "right"
                        ? "0px"
                        : `${(adjustedTrackWidth - finalThumbWidth) / 2}px`,
                width: `${finalThumbWidth}px`,
                height: `${Math.max(thumbHeight, thumbMinHeight)}px`,
                backgroundColor:
                    isThumbHovered || isDragging
                        ? finalThumbConfig.hoverColor
                        : finalThumbConfig.color,
                opacity:
                    isThumbHovered || isDragging
                        ? finalThumbConfig.hoverOpacity
                        : finalThumbConfig.opacity,
                borderRadius: `${finalThumbConfig.radius}px`,
                cursor: "pointer",
                transition:
                    "background-color 0.2s ease-in-out, opacity 0.2s ease-in-out",
            }}
        />
    );
};
