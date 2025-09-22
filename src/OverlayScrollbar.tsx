/**
 * OverlayScrollbar.tsx
 *
 * A React component that provides a custom overlay scrollbar with smooth animations and auto-hide functionality
 *
 * @license MIT
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
    ReactNode,
    forwardRef,
    useImperativeHandle,
} from "react";

interface OverlayScrollbarProps {
    className?: string;
    style?: React.CSSProperties;
    children: ReactNode;
    onScroll?: (event: Event) => void;
}

// OverlayScrollbar가 노출할 메서드들
export interface OverlayScrollbarRef {
    getScrollContainer: () => HTMLDivElement | null;
    scrollTo: (options: ScrollToOptions) => void;
    scrollTop: number;
    scrollHeight: number;
    clientHeight: number;
}

export const OverlayScrollbar = forwardRef<
    OverlayScrollbarRef,
    OverlayScrollbarProps
>(({ children, onScroll, className, style }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const scrollbarRef = useRef<HTMLDivElement>(null);
    const thumbRef = useRef<HTMLDivElement>(null);

    // 웹킷 스크롤바 숨김을 위한 스타일
    useEffect(() => {
        const style = document.createElement("style");
        style.textContent = `
                .overlay-scrollbar-container::-webkit-scrollbar {
                    display: none !important;
                    width: 0 !important;
                    height: 0 !important;
                    background: transparent !important;
                }
                .overlay-scrollbar-container::-webkit-scrollbar-track {
                    display: none !important;
                }
                .overlay-scrollbar-container::-webkit-scrollbar-thumb {
                    display: none !important;
                }
                .overlay-scrollbar-container::-webkit-scrollbar-corner {
                    display: none !important;
                }
                .overlay-scrollbar-container * {
                    scrollbar-width: none;
                    -ms-overflow-style: none;
                }
                .overlay-scrollbar-container *::-webkit-scrollbar {
                    display: none !important;
                    width: 0 !important;
                    height: 0 !important;
                }
            `;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, []);

    const [scrollbarVisible, setScrollbarVisible] = useState(false);
    const [trackVisible, setTrackVisible] = useState(false); // 트랙 표시 상태 추가
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ y: 0, scrollTop: 0 });
    const [thumbHeight, setThumbHeight] = useState(0);
    const [thumbTop, setThumbTop] = useState(0);

    // 스크롤바 표시/숨김 타이머
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

    // 스크롤바 숨김 타이머 취소
    const clearHideTimer = useCallback(() => {
        if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current);
            hideTimeoutRef.current = null;
        }
    }, []);

    // 스크롤바 숨김 타이머 설정
    const setHideTimer = useCallback(
        (delay: number) => {
            clearHideTimer(); // 기존 타이머 취소
            hideTimeoutRef.current = setTimeout(() => {
                if (!isDragging) {
                    setScrollbarVisible(false);
                    setTrackVisible(false);
                }
                hideTimeoutRef.current = null;
            }, delay);
        },
        [isDragging, clearHideTimer]
    );

    // 스크롤 가능 여부 체크 함수
    const isScrollable = useCallback(() => {
        if (!containerRef.current || !contentRef.current) return false;
        const container = containerRef.current;
        const content = contentRef.current;
        return content.scrollHeight > container.clientHeight + 2;
    }, []);

    // 스크롤바 크기 및 위치 계산
    const updateScrollbar = useCallback(() => {
        if (!containerRef.current || !contentRef.current) return;

        const container = containerRef.current;
        const content = contentRef.current;

        const containerHeight = container.clientHeight;
        const contentHeight = content.scrollHeight;
        const scrollTop = container.scrollTop;

        // console.log("스크롤바 업데이트:", {
        //     containerHeight,
        //     contentHeight,
        //     scrollTop,
        //     hasScrollableContent: contentHeight > containerHeight,
        // });

        // 스크롤 가능한 콘텐츠가 있는지 확인 (여유분 2px 추가로 더 정확한 판단)
        if (contentHeight <= containerHeight + 2) {
            // console.log("스크롤 불가능한 콘텐츠, 스크롤바 숨김");
            setScrollbarVisible(false);
            setTrackVisible(false);
            clearHideTimer(); // 타이머도 정리
            return;
        }

        // 썸 높이 계산 (최소 20px, 최대 컨테이너의 90%)
        const thumbHeightRatio = containerHeight / contentHeight;
        const calculatedThumbHeight = Math.max(
            20,
            Math.min(containerHeight * 0.9, containerHeight * thumbHeightRatio)
        );

        // 썸 위치 계산
        const scrollRatio = scrollTop / (contentHeight - containerHeight);
        const maxThumbTop = containerHeight - calculatedThumbHeight;
        const calculatedThumbTop = scrollRatio * maxThumbTop;

        // console.log("썸 계산:", {
        //     thumbHeightRatio,
        //     calculatedThumbHeight,
        //     scrollRatio,
        //     calculatedThumbTop,
        //     maxThumbTop,
        // });

        setThumbHeight(calculatedThumbHeight);
        setThumbTop(calculatedThumbTop);
    }, []);

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

            setScrollbarVisible(true);
            setTrackVisible(true); // 드래그 시 트랙 표시
            clearHideTimer(); // 드래그 중에는 타이머 취소
        },
        [clearHideTimer]
    );

    // 썸 드래그 중
    const handleMouseMove = useCallback(
        (event: MouseEvent) => {
            if (!isDragging || !containerRef.current || !contentRef.current)
                return;

            event.preventDefault();

            const container = containerRef.current;
            const content = contentRef.current;
            const containerHeight = container.clientHeight;
            const contentHeight = content.scrollHeight;

            const deltaY = event.clientY - dragStart.y;
            const scrollableHeight = contentHeight - containerHeight;
            const maxThumbTop = containerHeight - thumbHeight;

            // 드래그 거리를 스크롤 거리로 변환
            const scrollDelta = (deltaY / maxThumbTop) * scrollableHeight;
            const newScrollTop = Math.max(
                0,
                Math.min(scrollableHeight, dragStart.scrollTop + scrollDelta)
            );

            container.scrollTop = newScrollTop;
            updateScrollbar();
        },
        [isDragging, dragStart, thumbHeight, updateScrollbar]
    );

    // 썸 드래그 종료
    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
        setTrackVisible(false); // 드래그 종료 시 트랙 숨김
        setHideTimer(2000); // 2초 후 숨김
    }, [setHideTimer]);

    // 스크롤바 트랙 클릭
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
            setTrackVisible(true); // 클릭 시 트랙 표시
            setHideTimer(2000); // 클릭 후 2초간 유지
        },
        [updateScrollbar, setHideTimer]
    );

    // 이벤트 리스너 등록
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // 휠 이벤트 핸들러 (마우스 휠 스크롤 감지)
        const handleWheel = () => {
            clearHideTimer(); // 먼저 기존 타이머 취소
            setScrollbarVisible(true);
            // 휠 스크롤 시에는 트랙 숨김 (thumb만 표시)
            updateScrollbar();
            setHideTimer(700); // 0.7초 후 숨김
        };

        // 스크롤 이벤트 디바운스
        const debouncedScroll = (event: Event) => {
            clearHideTimer(); // 먼저 기존 타이머 취소
            setScrollbarVisible(true);
            // 스크롤 시에도 트랙 숨김 (thumb만 표시)
            updateScrollbar();
            setHideTimer(700); // 0.7초 후 숨김

            if (onScroll) {
                onScroll(event);
            }
        };

        container.addEventListener("scroll", debouncedScroll, {
            passive: true,
        });
        container.addEventListener("wheel", handleWheel, { passive: true });

        return () => {
            container.removeEventListener("scroll", debouncedScroll);
            container.removeEventListener("wheel", handleWheel);
        };
    }, [updateScrollbar, isDragging, onScroll, clearHideTimer, setHideTimer]);

    // 마우스 이벤트 리스너 등록 (드래그)
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

    // 초기 스크롤바 계산 및 스크롤 감지
    useEffect(() => {
        const checkAndUpdateScrollbar = () => {
            updateScrollbar();

            // 초기에 스크롤 가능한 콘텐츠가 있는지 확인
            const container = containerRef.current;
            const content = contentRef.current;

            if (container && content) {
                const hasScrollableContent =
                    content.scrollHeight > container.clientHeight + 2; // 여유분 2px 추가
                // console.log("초기 스크롤바 체크:", {
                //     hasScrollableContent,
                //     contentScrollHeight: content.scrollHeight,
                //     containerClientHeight: container.clientHeight,
                // });

                if (hasScrollableContent) {
                    // 초기에는 스크롤바를 숨김 상태로 유지 (스크롤이나 hover 시에만 표시)
                    setScrollbarVisible(false);
                    setTrackVisible(false);
                } else {
                    // 스크롤이 필요 없으면 확실히 숨김
                    setScrollbarVisible(false);
                    setTrackVisible(false);
                }
            }
        };

        // 차트 렌더링을 고려하여 더 긴 지연시간 적용
        const timeoutId = setTimeout(checkAndUpdateScrollbar, 200);

        return () => clearTimeout(timeoutId);
    }, [updateScrollbar, children, isDragging]);

    // 리사이즈 옵저버
    useEffect(() => {
        const container = containerRef.current;
        const content = contentRef.current;

        if (!container || !content) return;

        const resizeObserver = new ResizeObserver(() => {
            // 차트 렌더링 지연을 고려하여 디바운스 적용
            setTimeout(() => {
                updateScrollbar();
            }, 100);
        });

        resizeObserver.observe(container);
        resizeObserver.observe(content);

        return () => {
            resizeObserver.disconnect();
        };
    }, [updateScrollbar]);

    // 컴포넌트 언마운트 시 타이머 정리
    useEffect(() => {
        return () => {
            if (hideTimeoutRef.current) {
                clearTimeout(hideTimeoutRef.current);
            }
        };
    }, []);

    return (
        <div
            className={`overlay-scrollbar ${className || ""}`}
            style={{
                position: "relative",
                overflow: "hidden",
                display: "flex",
                flexGrow: 1,
                width: "100%",
                ...style,
            }}
        >
            {/* 스크롤 가능한 콘텐츠 영역 */}
            <div
                ref={containerRef}
                className="overlay-scrollbar-container"
                style={{
                    display: "flex",
                    flexGrow: 1,
                    overflow: "auto",
                    scrollbarWidth: "none" as any, // Firefox
                    msOverflowStyle: "none" as any, // IE/Edge
                }}
            >
                <div ref={contentRef} style={{ height: "100%", width: "100%" }}>
                    {children}
                </div>
            </div>

            {/* 스크롤바 hover 영역 (넓은 영역) */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: 20, // 20px 넓은 hover 영역
                    height: "100%",
                    zIndex: 5,
                    pointerEvents: "auto",
                }}
                onMouseEnter={() => {
                    // 스크롤 가능한 경우에만 스크롤바 표시
                    if (isScrollable()) {
                        clearHideTimer();
                        setScrollbarVisible(true);
                        setTrackVisible(true); // hover 시 트랙까지 표시
                    }
                }}
                onMouseLeave={() => {
                    // 스크롤바 hover 영역에서 벗어남 시
                    if (!isDragging && isScrollable()) {
                        setTrackVisible(false); // 트랙 숨김
                        setHideTimer(1000); // 1초 후 숨김
                    }
                }}
            />

            {/* 커스텀 스크롤바 */}
            <div
                ref={scrollbarRef}
                onClick={handleTrackClick}
                onMouseEnter={() => {
                    // 스크롤 가능한 경우에만 스크롤바 영역에 hover 시 타이머 취소하고 표시 유지
                    if (isScrollable()) {
                        clearHideTimer();
                        setScrollbarVisible(true);
                        setTrackVisible(true);
                    }
                }}
                onMouseLeave={() => {
                    // 스크롤바 영역에서 벗어나면 일정 시간 후 숨김
                    if (!isDragging && isScrollable()) {
                        setHideTimer(1000);
                    }
                }}
                className={`overlay-scrollbar-track ${
                    scrollbarVisible ? "visible" : ""
                }`}
                style={{
                    position: "absolute",
                    top: 0,
                    right: 2,
                    width: 8,
                    height: "100%",
                    opacity: scrollbarVisible ? 1 : 0,
                    transition: "opacity 0.3s ease-in-out",
                    pointerEvents: scrollbarVisible ? "auto" : "none",
                    zIndex: 10,
                    cursor: "pointer",
                    borderRadius: "4px",
                    // trackVisible 상태에 따라 트랙 배경 표시
                    backgroundColor: trackVisible
                        ? "rgba(200, 200, 200, 0.3)"
                        : "transparent",
                }}
                onMouseOver={(e) => {
                    (e.target as HTMLElement).style.backgroundColor =
                        "rgba(0, 0, 0, 0.1)";
                }}
                onMouseOut={(e) => {
                    (e.target as HTMLElement).style.backgroundColor =
                        trackVisible
                            ? "rgba(200, 200, 200, 0.3)"
                            : "transparent";
                }}
            >
                {/* 스크롤바 썸 */}
                <div
                    ref={thumbRef}
                    onMouseDown={handleThumbMouseDown}
                    style={{
                        position: "absolute",
                        top: `${thumbTop}px`,
                        left: 0,
                        width: "100%",
                        height: `${Math.max(thumbHeight, 30)}px`, // 최소 30px 보장
                        backgroundColor: isDragging
                            ? "rgba(0, 0, 0, 0.7)"
                            : "rgba(0, 0, 0, 0.5)",
                        borderRadius: "4px",
                        cursor: "pointer",
                        minHeight: "30px", // CSS로도 최소 높이 보장
                        transition: isDragging
                            ? "none"
                            : "background-color 0.2s ease, transform 0.1s ease",
                        transform: isDragging ? "scaleX(1.2)" : "scaleX(1)",
                        opacity: isDragging ? 1 : 0.4,
                    }}
                    onMouseOver={(e) => {
                        (e.target as HTMLElement).style.opacity = "1";
                        (e.target as HTMLElement).style.transform =
                            "scaleX(1.1)";
                    }}
                    onMouseOut={(e) => {
                        if (!isDragging) {
                            (e.target as HTMLElement).style.opacity = "0.4";
                            (e.target as HTMLElement).style.transform =
                                "scaleX(1)";
                        }
                    }}
                />
            </div>
        </div>
    );
});

export default OverlayScrollbar;
