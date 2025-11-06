/**
 * ScrollbarTrack.tsx
 * 스크롤바 트랙 컴포넌트
 *
 * @copyright 2025 KIM YOUNG JIN (ehfuse@gmail.com)
 */

import React from "react";

interface ScrollbarTrackProps {
    scrollbarRef: React.RefObject<HTMLDivElement>;
    adjustedTrackWidth: number;
    scrollbarVisible: boolean;
    isDragging: boolean;
    showArrows: boolean;
    finalThumbWidth: number;
    finalTrackConfig: {
        visible: boolean;
        alignment: string;
        margin: number;
        color: string;
        radius: number;
        width: number;
    };
    clearHideTimer: () => void;
    setScrollbarVisible: (visible: boolean) => void;
    setHideTimer: (delay: number) => void;
    autoHideDelay: number;
    handleTrackClick: (e: React.MouseEvent) => void;
    children: React.ReactNode;
}

export const ScrollbarTrack: React.FC<ScrollbarTrackProps> = ({
    scrollbarRef,
    adjustedTrackWidth,
    scrollbarVisible,
    isDragging,
    showArrows,
    finalThumbWidth,
    finalTrackConfig,
    clearHideTimer,
    setScrollbarVisible,
    setHideTimer,
    autoHideDelay,
    handleTrackClick,
    children,
}) => {
    return (
        <div
            ref={scrollbarRef}
            className="overlay-scrollbar-track"
            onMouseEnter={() => {
                clearHideTimer();
                setScrollbarVisible(true);
            }}
            onMouseLeave={() => {
                if (!isDragging) {
                    setHideTimer(autoHideDelay);
                }
            }}
            style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: `${adjustedTrackWidth}px`,
                height: "100%",
                opacity: scrollbarVisible ? 1 : 0,
                transition: "opacity 0.2s ease-in-out",
                cursor: "pointer",
                zIndex: 1000,
                pointerEvents: "auto",
            }}
        >
            {/* 스크롤바 트랙 배경 */}
            {finalTrackConfig.visible && (
                <div
                    className="overlay-scrollbar-track-background"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleTrackClick(e);
                    }}
                    style={{
                        position: "absolute",
                        top: showArrows
                            ? `${
                                  finalThumbWidth + finalTrackConfig.margin * 2
                              }px`
                            : `${finalTrackConfig.margin}px`,
                        right:
                            finalTrackConfig.alignment === "right"
                                ? "0px"
                                : `${
                                      (adjustedTrackWidth - finalThumbWidth) / 2
                                  }px`,
                        width: `${finalThumbWidth}px`,
                        height: showArrows
                            ? `calc(100% - ${
                                  finalThumbWidth * 2 +
                                  finalTrackConfig.margin * 4
                              }px)`
                            : `calc(100% - ${finalTrackConfig.margin * 2}px)`,
                        backgroundColor: finalTrackConfig.color,
                        borderRadius: `${finalTrackConfig.radius}px`,
                        cursor: "pointer",
                    }}
                />
            )}
            {children}
        </div>
    );
};
