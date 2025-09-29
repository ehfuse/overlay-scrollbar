/**
 * OverlayScrollbar.tsx
 *
 * @copyright 2025 KIM YOUNG JIN (ehfuse@gmail.com)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import React, {
    useRef,
    useEffect,
    useState,
    useCallback,
    useMemo,
    ReactNode,
    forwardRef,
    useImperativeHandle,
} from "react";

export interface OverlayScrollbarProps {
    className?: string;
    style?: React.CSSProperties;
    children: ReactNode;
    onScroll?: (event: Event) => void;
    scrollbarWidth?: number; // 스크롤바 썸과 트랙의 너비 (기본값: 8px) - deprecated, use trackWidth/thumbWidth instead
    thumbRadius?: number; // 스크롤바 썸의 border-radius (기본값: thumbWidth / 2)
    showScrollbar?: boolean; // 스크롤바 표시 여부 (기본값: true)
    showArrows?: boolean; // 스크롤 화살표 표시 여부 (기본값: false)
    arrowStep?: number; // 화살표 클릭시 스크롤 이동 거리 (기본값: 50px)
    trackWidth?: number; // 호버 영역인 트랙의 너비 (기본값: 16px)
    thumbWidth?: number; // 썸과 트랙 배경의 너비 (기본값: 8px)
    thumbMinHeight?: number; // 썸의 최소 높이 (기본값: 50px)
    trackColor?: string; // 트랙 배경 색상 (기본값: "rgba(128, 128, 128, 0.1)")
    thumbColor?: string; // 썸 색상 (기본값: "rgba(128, 128, 128, 0.6)")
    thumbActiveColor?: string; // 드래그 중 썸 색상 (기본값: "rgba(128, 128, 128, 0.9)")
    arrowColor?: string; // 화살표 색상 (기본값: "rgba(128, 128, 128, 0.8)")
    arrowActiveColor?: string; // 화살표 hover 시 색상 (기본값: "rgba(64, 64, 64, 1.0)")
    hideDelay?: number; // 기본 자동 숨김 시간 (기본값: 1500ms)
    hideDelayOnWheel?: number; // 휠 스크롤 후 자동 숨김 시간 (기본값: 700ms)
}

// OverlayScrollbar가 노출할 메서드들
export interface OverlayScrollbarRef {
    getScrollContainer: () => HTMLDivElement | null;
    scrollTo: (options: ScrollToOptions) => void;
    scrollTop: number;
    scrollHeight: number;
    clientHeight: number;
}

const OverlayScrollbar = forwardRef<OverlayScrollbarRef, OverlayScrollbarProps>(
    (
        {
            className = "",
            style = {},
            children,
            onScroll,
            scrollbarWidth = 8, // deprecated
            thumbRadius,
            showScrollbar = true,
            showArrows = false,
            arrowStep = 50,
            trackWidth = 16,
            thumbWidth = 8,
            thumbMinHeight = 50,
            trackColor = "rgba(128, 128, 128, 0.1)",
            thumbColor = "rgba(128, 128, 128, 0.6)",
            thumbActiveColor = "rgba(128, 128, 128, 0.9)",
            arrowColor = "rgba(128, 128, 128, 0.6)",
            arrowActiveColor = "rgba(64, 64, 64, 1.0)",
            hideDelay = 1500,
            hideDelayOnWheel = 700,
        },
        ref
    ) => {
        const containerRef = useRef<HTMLDivElement>(null);
        const contentRef = useRef<HTMLDivElement>(null);
        const scrollbarRef = useRef<HTMLDivElement>(null);
        const thumbRef = useRef<HTMLDivElement>(null);

        // 기본 상태들
        const [scrollbarVisible, setScrollbarVisible] = useState(false);
        const [isDragging, setIsDragging] = useState(false);
        const [dragStart, setDragStart] = useState({ y: 0, scrollTop: 0 });
        const [thumbHeight, setThumbHeight] = useState(0);
        const [thumbTop, setThumbTop] = useState(0);
        const [activeArrow, setActiveArrow] = useState<"up" | "down" | null>(
            null
        );
        const [hoveredArrow, setHoveredArrow] = useState<"up" | "down" | null>(
            null
        );

        // 초기 마운트 시 hover 방지용
        const [isInitialized, setIsInitialized] = useState(false);

        // 휠 스크롤 감지용
        const wheelTimeoutRef = useRef<NodeJS.Timeout | null>(null);
        const [isWheelScrolling, setIsWheelScrolling] = useState(false);

        // 숨김 타이머
        const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

        // ref를 통해 외부에서 스크롤 컨테이너에 접근할 수 있도록 함
        useImperativeHandle(
            ref,
            () => ({
                getScrollContainer: () => containerRef.current,
                scrollTo: (options: ScrollToOptions) => {
                    if (containerRef.current) {
                        containerRef.current.scrollTo(options);
                    }
                },
                get scrollTop() {
                    return containerRef.current?.scrollTop || 0;
                },
                get scrollHeight() {
                    return containerRef.current?.scrollHeight || 0;
                },
                get clientHeight() {
                    return containerRef.current?.clientHeight || 0;
                },
            }),
            []
        );

        // 스크롤 가능 여부 체크
        const isScrollable = useCallback(() => {
            if (!containerRef.current || !contentRef.current) return false;
            return (
                contentRef.current.scrollHeight >
                containerRef.current.clientHeight + 2
            );
        }, []);

        // 타이머 정리
        const clearHideTimer = useCallback(() => {
            if (hideTimeoutRef.current) {
                clearTimeout(hideTimeoutRef.current);
                hideTimeoutRef.current = null;
            }
        }, []);

        // 스크롤바 숨기기 타이머
        const setHideTimer = useCallback(
            (delay: number) => {
                clearHideTimer();
                hideTimeoutRef.current = setTimeout(() => {
                    setScrollbarVisible(false);
                    hideTimeoutRef.current = null;
                }, delay);
            },
            [clearHideTimer, isDragging]
        );

        // 스크롤바 위치 및 크기 업데이트
        const updateScrollbar = useCallback(() => {
            if (
                !containerRef.current ||
                !contentRef.current ||
                !scrollbarRef.current
            )
                return;

            const container = containerRef.current;
            const content = contentRef.current;
            const containerHeight = container.clientHeight;
            const contentHeight = content.scrollHeight;
            const scrollTop = container.scrollTop;

            // 스크롤 불가능하면 숨김
            if (contentHeight <= containerHeight + 2) {
                setScrollbarVisible(false);
                clearHideTimer();
                return;
            }

            // 화살표와 간격 공간 계산 (화살표 + 위아래여백 4px + 화살표간격 4px씩, 화살표 없어도 위아래 4px씩 여백)
            const arrowSpace = showArrows ? scrollbarWidth * 2 + 16 : 8;

            // 썸 높이 계산 (사용자 설정 최소 높이 사용, 화살표 공간 제외)
            const availableHeight = containerHeight - arrowSpace;
            const scrollRatio = containerHeight / contentHeight;
            const calculatedThumbHeight = Math.max(
                availableHeight * scrollRatio,
                thumbMinHeight
            );

            // 썸 위치 계산 (화살표와 간격 공간 제외)
            const scrollableHeight = contentHeight - containerHeight;
            const thumbScrollableHeight =
                availableHeight - calculatedThumbHeight;
            const calculatedThumbTop =
                scrollableHeight > 0
                    ? (scrollTop / scrollableHeight) * thumbScrollableHeight
                    : 0;

            setThumbHeight(calculatedThumbHeight);
            setThumbTop(calculatedThumbTop);
        }, [clearHideTimer, showArrows, scrollbarWidth, thumbMinHeight]);

        // 썸 드래그 시작
        const handleThumbMouseDown = useCallback(
            (event: React.MouseEvent) => {
                event.preventDefault();
                event.stopPropagation();

                if (!containerRef.current) return;

                setIsDragging(true);
                setDragStart({
                    y: event.clientY,
                    scrollTop: containerRef.current.scrollTop,
                });

                clearHideTimer();
                setScrollbarVisible(true);
            },
            [clearHideTimer]
        );

        // 썸 드래그 중
        const handleMouseMove = useCallback(
            (event: MouseEvent) => {
                if (!isDragging || !containerRef.current || !contentRef.current)
                    return;

                const container = containerRef.current;
                const content = contentRef.current;
                const containerHeight = container.clientHeight;
                const contentHeight = content.scrollHeight;
                const scrollableHeight = contentHeight - containerHeight;

                const deltaY = event.clientY - dragStart.y;
                const thumbScrollableHeight = containerHeight - thumbHeight;
                const scrollDelta =
                    (deltaY / thumbScrollableHeight) * scrollableHeight;

                const newScrollTop = Math.max(
                    0,
                    Math.min(
                        scrollableHeight,
                        dragStart.scrollTop + scrollDelta
                    )
                );

                container.scrollTop = newScrollTop;
                updateScrollbar();
            },
            [isDragging, dragStart, thumbHeight, updateScrollbar]
        );

        // 썸 드래그 종료
        const handleMouseUp = useCallback(() => {
            setIsDragging(false);
            if (isScrollable()) {
                setHideTimer(hideDelay); // 기본 숨김 시간 적용
            }
        }, [isScrollable, setHideTimer, hideDelay]);

        // 트랙 클릭으로 스크롤 점프
        const handleTrackClick = useCallback(
            (event: React.MouseEvent) => {
                if (
                    !containerRef.current ||
                    !contentRef.current ||
                    !scrollbarRef.current
                )
                    return;

                const scrollbar = scrollbarRef.current;
                const rect = scrollbar.getBoundingClientRect();
                const clickY = event.clientY - rect.top;

                const container = containerRef.current;
                const content = contentRef.current;
                const containerHeight = container.clientHeight;
                const contentHeight = content.scrollHeight;

                const scrollRatio = clickY / containerHeight;
                const newScrollTop =
                    scrollRatio * (contentHeight - containerHeight);

                container.scrollTop = Math.max(
                    0,
                    Math.min(contentHeight - containerHeight, newScrollTop)
                );
                updateScrollbar();

                setScrollbarVisible(true);
                setHideTimer(hideDelay);
            },
            [updateScrollbar, setHideTimer, hideDelay]
        );

        // 위쪽 화살표 클릭 핸들러
        const handleUpArrowClick = useCallback(
            (event: React.MouseEvent) => {
                event.preventDefault();
                event.stopPropagation();

                if (!containerRef.current) return;

                const newScrollTop = Math.max(
                    0,
                    containerRef.current.scrollTop - arrowStep
                );

                containerRef.current.scrollTop = newScrollTop;
                updateScrollbar();

                setScrollbarVisible(true);
                setHideTimer(hideDelay);
            },
            [updateScrollbar, setHideTimer, arrowStep, hideDelay]
        );

        // 아래쪽 화살표 클릭 핸들러
        const handleDownArrowClick = useCallback(
            (event: React.MouseEvent) => {
                event.preventDefault();
                event.stopPropagation();

                if (!containerRef.current || !contentRef.current) return;

                const container = containerRef.current;
                const content = contentRef.current;
                const maxScrollTop =
                    content.scrollHeight - container.clientHeight;
                const newScrollTop = Math.min(
                    maxScrollTop,
                    container.scrollTop + arrowStep
                );

                container.scrollTop = newScrollTop;
                updateScrollbar();

                setScrollbarVisible(true);
                setHideTimer(hideDelay);
            },
            [updateScrollbar, setHideTimer, arrowStep, hideDelay]
        );

        // 스크롤 이벤트 리스너
        useEffect(() => {
            const container = containerRef.current;
            if (!container) return;

            const handleScroll = (event: Event) => {
                updateScrollbar();

                // 스크롤 중에는 스크롤바 표시
                clearHideTimer();
                setScrollbarVisible(true);

                // 휠 스크롤 중이면 빠른 숨김, 아니면 기본 숨김 시간 적용
                const delay = isWheelScrolling ? hideDelayOnWheel : hideDelay;
                setHideTimer(delay);

                if (onScroll) {
                    onScroll(event);
                }
            };

            const handleWheel = () => {
                // 휠 스크롤 상태 표시
                setIsWheelScrolling(true);

                // 기존 휠 타이머 제거
                if (wheelTimeoutRef.current) {
                    clearTimeout(wheelTimeoutRef.current);
                }

                // 300ms 후 휠 스크롤 상태 해제 (휠 스크롤이 끝났다고 간주)
                wheelTimeoutRef.current = setTimeout(() => {
                    setIsWheelScrolling(false);
                }, 300);

                clearHideTimer();
                setScrollbarVisible(true);
            };

            container.addEventListener("scroll", handleScroll, {
                passive: true,
            });
            container.addEventListener("wheel", handleWheel, {
                passive: true,
            });

            return () => {
                container.removeEventListener("scroll", handleScroll);
                container.removeEventListener("wheel", handleWheel);
                if (wheelTimeoutRef.current) {
                    clearTimeout(wheelTimeoutRef.current);
                }
            };
        }, [
            updateScrollbar,
            onScroll,
            clearHideTimer,
            setHideTimer,
            hideDelay,
            hideDelayOnWheel,
            isWheelScrolling,
        ]);

        // 전역 마우스 이벤트 리스너
        useEffect(() => {
            if (isDragging) {
                document.addEventListener("mousemove", handleMouseMove);
                document.addEventListener("mouseup", handleMouseUp);
                return () => {
                    document.removeEventListener("mousemove", handleMouseMove);
                    document.removeEventListener("mouseup", handleMouseUp);
                };
            }
        }, [isDragging, handleMouseMove, handleMouseUp]);

        // 초기 스크롤바 업데이트
        useEffect(() => {
            updateScrollbar();
        }, [updateScrollbar]);

        // 컴포넌트 초기화 완료 표시 (hover 이벤트 활성화용)
        useEffect(() => {
            const timer = setTimeout(() => {
                setIsInitialized(true);
            }, 100); // 100ms 후 초기화 완료

            return () => clearTimeout(timer);
        }, []);

        // Resize observer로 크기 변경 감지
        useEffect(() => {
            if (!containerRef.current || !contentRef.current) return;

            const resizeObserver = new ResizeObserver(() => {
                updateScrollbar();
            });

            resizeObserver.observe(containerRef.current);
            resizeObserver.observe(contentRef.current);

            return () => resizeObserver.disconnect();
        }, [updateScrollbar]);

        // 계산된 값들을 메모이제이션하여 안정화
        const { finalThumbWidth, finalTrackWidth } = useMemo(() => {
            const computedThumbWidth =
                thumbWidth !== undefined ? thumbWidth : scrollbarWidth;
            let computedTrackWidth =
                trackWidth !== undefined ? trackWidth : scrollbarWidth * 2;

            // thumbWidth가 trackWidth보다 크거나 같으면 trackWidth를 thumbWidth와 같게 설정
            if (computedThumbWidth >= computedTrackWidth) {
                computedTrackWidth = computedThumbWidth;
            }

            return {
                finalThumbWidth: computedThumbWidth,
                finalTrackWidth: computedTrackWidth,
            };
        }, [thumbWidth, trackWidth, scrollbarWidth]);

        // 썸 radius 계산 (기본값: thumbWidth / 2)
        const calculatedThumbRadius =
            thumbRadius !== undefined ? thumbRadius : finalThumbWidth / 2;

        // 화살표 색상 계산 (기본값: 독립적인 색상)
        const finalArrowColor = arrowColor || "rgba(128, 128, 128, 0.8)";
        const finalArrowActiveColor =
            arrowActiveColor || "rgba(128, 128, 128, 1.0)";

        // 웹킷 스크롤바 숨기기용 CSS 동적 주입
        useEffect(() => {
            const styleId = "overlay-scrollbar-webkit-hide";

            // 이미 스타일이 있으면 제거
            const existingStyle = document.getElementById(styleId);
            if (existingStyle) {
                existingStyle.remove();
            }

            const style = document.createElement("style");
            style.id = styleId;
            style.textContent = `
                .overlay-scrollbar-container::-webkit-scrollbar {
                    display: none !important;
                    width: 0 !important;
                    height: 0 !important;
                }
                .overlay-scrollbar-container::-webkit-scrollbar-track {
                    display: none !important;
                }
                .overlay-scrollbar-container::-webkit-scrollbar-thumb {
                    display: none !important;
                }
            `;
            document.head.appendChild(style);

            return () => {
                const styleToRemove = document.getElementById(styleId);
                if (styleToRemove) {
                    styleToRemove.remove();
                }
            };
        }, []);

        return (
            <div
                className={`overlay-scrollbar-wrapper ${className}`}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                    minHeight: 0, // shrink 가능하도록
                    height: "100%", // 부모의 전체 높이 사용
                    flex: "1 1 0%", // 기본적으로 flex item으로 동작
                    ...style, // 사용자가 flex를 override 할 수 있도록 style을 뒤에 배치
                }}
            >
                {/* 스크롤 컨테이너 */}
                <div
                    ref={containerRef}
                    className="overlay-scrollbar-container"
                    style={{
                        width: "100%", // 명시적 너비 설정
                        height: "100%", // 상위 컨테이너의 전체 높이 사용
                        minHeight: 0, // 최소 높이 보장
                        overflow: "auto", // 네이티브 스크롤 기능 유지
                        // 브라우저 기본 스크롤바만 숨기기
                        scrollbarWidth: "none", // Firefox
                        msOverflowStyle: "none", // IE/Edge
                    }}
                >
                    <div
                        ref={contentRef}
                        className="overlay-scrollbar-content"
                        style={{
                            minHeight: "100%",
                        }}
                    >
                        {children}
                    </div>
                </div>

                {/* 커스텀 스크롤바 */}
                {showScrollbar && (
                    <div
                        ref={scrollbarRef}
                        className="overlay-scrollbar-track"
                        onMouseEnter={() => {
                            console.log("🔍 트랙 mouseEnter");
                            if (isScrollable()) {
                                console.log("✅ 트랙 hover로 스크롤바 표시");
                                clearHideTimer();
                                setScrollbarVisible(true);
                            }
                        }}
                        onMouseLeave={() => {
                            console.log("🔍 트랙 mouseLeave");
                            if (!isDragging && isScrollable()) {
                                setHideTimer(hideDelay);
                            }
                        }}
                        style={{
                            position: "absolute",
                            top: 0,
                            right: 0, // 완전히 오른쪽에 붙임
                            width: `${finalTrackWidth}px`, // hover 영역 너비
                            height: "100%",
                            opacity: scrollbarVisible ? 1 : 0,
                            transition: "opacity 0.2s ease-in-out",
                            cursor: "pointer",
                            zIndex: 1000,
                            pointerEvents: "auto", // 항상 이벤트 활성화 (hover 감지용)
                        }}
                    >
                        {/* 스크롤바 트랙 배경 */}
                        <div
                            className="overlay-scrollbar-track-background"
                            onClick={handleTrackClick}
                            style={{
                                position: "absolute",
                                top: showArrows
                                    ? `${finalThumbWidth + 8}px`
                                    : "4px",
                                right: `${
                                    (finalTrackWidth - finalThumbWidth) / 2
                                }px`, // 트랙 가운데 정렬
                                width: `${finalThumbWidth}px`,
                                height: showArrows
                                    ? `calc(100% - ${
                                          finalThumbWidth * 2 + 16
                                      }px)`
                                    : "calc(100% - 8px)",
                                backgroundColor: trackColor,
                                borderRadius: `${calculatedThumbRadius}px`,
                                cursor: "pointer",
                            }}
                        />

                        {/* 스크롤바 썸 */}
                        <div
                            ref={thumbRef}
                            className="overlay-scrollbar-thumb"
                            onMouseDown={handleThumbMouseDown}
                            style={{
                                position: "absolute",
                                top: `${
                                    (showArrows ? finalThumbWidth + 8 : 4) +
                                    thumbTop
                                }px`,
                                right: `${
                                    (finalTrackWidth - finalThumbWidth) / 2
                                }px`, // 트랙 가운데 정렬
                                width: `${finalThumbWidth}px`,
                                height: `${Math.max(
                                    thumbHeight,
                                    thumbMinHeight
                                )}px`,
                                backgroundColor: isDragging
                                    ? thumbActiveColor
                                    : thumbColor,
                                borderRadius: `${calculatedThumbRadius}px`,
                                cursor: "pointer",
                                transition: isDragging
                                    ? "none"
                                    : "background-color 0.2s ease-in-out",
                            }}
                        />
                    </div>
                )}

                {/* 위쪽 화살표 버튼 */}
                {showScrollbar && showArrows && (
                    <div
                        className="overlay-scrollbar-up-arrow"
                        onClick={handleUpArrowClick}
                        onMouseEnter={() => setHoveredArrow("up")}
                        onMouseLeave={() => setHoveredArrow(null)}
                        style={{
                            position: "absolute",
                            top: "4px",
                            right: `${
                                (finalTrackWidth - finalThumbWidth) / 2
                            }px`, // 트랙 가운데 정렬
                            width: `${finalThumbWidth}px`,
                            height: `${finalThumbWidth}px`,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: `${Math.max(
                                finalThumbWidth * 0.75,
                                8
                            )}px`,
                            color:
                                hoveredArrow === "up"
                                    ? finalArrowActiveColor
                                    : finalArrowColor,
                            userSelect: "none",
                            zIndex: 1001,
                            opacity: scrollbarVisible ? 1 : 0,
                            transition:
                                "opacity 0.2s ease-in-out, color 0.15s ease-in-out",
                        }}
                    >
                        ▲
                    </div>
                )}

                {/* 아래쪽 화살표 버튼 */}
                {showScrollbar && showArrows && (
                    <div
                        className="overlay-scrollbar-down-arrow"
                        onClick={handleDownArrowClick}
                        onMouseEnter={() => setHoveredArrow("down")}
                        onMouseLeave={() => setHoveredArrow(null)}
                        style={{
                            position: "absolute",
                            bottom: "4px",
                            right: `${
                                (finalTrackWidth - finalThumbWidth) / 2
                            }px`, // 트랙 가운데 정렬
                            width: `${finalThumbWidth}px`,
                            height: `${finalThumbWidth}px`,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: `${Math.max(
                                finalThumbWidth * 0.75,
                                8
                            )}px`,
                            color:
                                hoveredArrow === "down"
                                    ? finalArrowActiveColor
                                    : finalArrowColor,
                            userSelect: "none",
                            zIndex: 1001,
                            opacity: scrollbarVisible ? 1 : 0,
                            transition:
                                "opacity 0.2s ease-in-out, color 0.15s ease-in-out",
                        }}
                    >
                        ▼
                    </div>
                )}
            </div>
        );
    }
);

export default OverlayScrollbar;
export { OverlayScrollbar };
