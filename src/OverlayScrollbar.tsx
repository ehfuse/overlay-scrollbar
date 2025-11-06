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

import {
    useRef,
    useState,
    useCallback,
    forwardRef,
    useImperativeHandle,
} from "react";
import {
    OverlayScrollbarProps,
    OverlayScrollbarRef,
    DEFAULT_THUMB_CONFIG,
    DEFAULT_TRACK_CONFIG,
    DEFAULT_ARROWS_CONFIG,
    DEFAULT_DRAG_SCROLL_CONFIG,
    DEFAULT_AUTO_HIDE_CONFIG,
} from "./types";
import { useScrollbarConfig } from "./hooks/useScrollbarConfig";
import { useScrollbarUpdate } from "./hooks/useScrollbarUpdate";
import { useThumbDrag } from "./hooks/useThumbDrag";
import { useTrackClick } from "./hooks/useTrackClick";
import { useArrowNavigation } from "./hooks/useArrowNavigation";
import { useDragScroll } from "./hooks/useDragScroll";
import { useScrollEvents } from "./hooks/useScrollEvents";
import { useKeyboardNavigation } from "./hooks/useKeyboardNavigation";
import { useScrollbarInitialization } from "./hooks/useScrollbarInitialization";
import { ScrollbarTrack } from "./components/ScrollbarTrack";
import { ScrollbarThumb } from "./components/ScrollbarThumb";
import { ScrollbarArrows } from "./components/ScrollbarArrows";

const OverlayScrollbar = forwardRef<OverlayScrollbarRef, OverlayScrollbarProps>(
    (
        {
            className = "",
            style = {},
            containerStyle = {},
            contentStyle = {},
            children,
            onScroll,

            // 그룹화된 설정 객체들
            thumb = DEFAULT_THUMB_CONFIG,
            track = DEFAULT_TRACK_CONFIG,
            arrows = DEFAULT_ARROWS_CONFIG,
            dragScroll = DEFAULT_DRAG_SCROLL_CONFIG,
            autoHide = DEFAULT_AUTO_HIDE_CONFIG,

            // 기타 설정들
            showScrollbar = true,
            detectInnerScroll = false,
        },
        ref
    ) => {
        const wrapperRef = useRef<HTMLDivElement>(null);
        const containerRef = useRef<HTMLDivElement>(null);
        const contentRef = useRef<HTMLDivElement>(null);
        const scrollbarRef = useRef<HTMLDivElement>(null);
        const thumbRef = useRef<HTMLDivElement>(null);

        // 스크롤 컨테이너 캐싱용 ref (성능 최적화)
        const cachedScrollContainerRef = useRef<HTMLElement | null>(null);

        // 기본 상태들
        const [scrollbarVisible, setScrollbarVisible] = useState(false);

        // 숨김 타이머
        const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

        // useScrollbarConfig 훅 사용 - 설정 계산
        const {
            finalThumbConfig,
            finalTrackConfig,
            finalArrowsConfig,
            finalDragScrollConfig,
            finalAutoHideConfig,
        } = useScrollbarConfig({
            thumb,
            track,
            arrows,
            dragScroll,
            autoHide,
        });

        // 자주 사용되는 변수들
        const finalThumbWidth = finalThumbConfig.width;
        const finalTrackWidth = finalTrackConfig.width;
        const thumbMinHeight = finalThumbConfig.minHeight;
        const showArrows = finalArrowsConfig.visible;

        // 포커스 유지 함수 (키보드 입력이 계속 작동하도록)
        const maintainFocus = useCallback(() => {
            if (!containerRef.current) return;

            // 현재 포커스된 요소 확인
            const activeElement = document.activeElement;

            // 오버레이 스크롤바 내부에 이미 포커스된 요소가 있으면 스킵
            if (
                activeElement &&
                containerRef.current.contains(activeElement) &&
                activeElement !== containerRef.current
            ) {
                return;
            }

            // 포커스된 요소가 없거나 외부에 있으면 컨테이너에 포커스
            containerRef.current.focus();
        }, []);

        // 컨테이너 클릭 시 포커스 (키보드 작동을 위해)
        const handleContainerClick = useCallback((e: React.MouseEvent) => {
            // 텍스트 선택이나 다른 상호작용을 방해하지 않도록 체크
            const target = e.target as HTMLElement;

            // input, textarea, button 등은 제외
            if (
                target.tagName === "INPUT" ||
                target.tagName === "TEXTAREA" ||
                target.tagName === "BUTTON" ||
                target.tagName === "SELECT" ||
                target.isContentEditable
            ) {
                return;
            }

            // 컨테이너에 포커스 (키보드 이벤트 활성화)
            if (
                containerRef.current &&
                containerRef.current !== document.activeElement
            ) {
                containerRef.current.focus();
            }
        }, []);

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

        // 실제 스크롤 가능한 요소 찾기 (캐싱 최적화)
        const findScrollableElement = useCallback((): HTMLElement | null => {
            // 캐시된 요소가 여전히 유효한지 확인
            if (cachedScrollContainerRef.current) {
                const cached = cachedScrollContainerRef.current;
                // DOM에 연결되어 있고 여전히 스크롤 가능한지 확인
                if (
                    document.contains(cached) &&
                    cached.scrollHeight > cached.clientHeight + 2
                ) {
                    return cached;
                }
                // 캐시 무효화
                cachedScrollContainerRef.current = null;
            }

            if (!containerRef.current) {
                return null;
            }

            // 내부 컨테이너의 스크롤 가능 여부 확인
            if (
                contentRef.current &&
                contentRef.current.scrollHeight >
                    containerRef.current.clientHeight + 2
            ) {
                cachedScrollContainerRef.current = containerRef.current;
                return containerRef.current;
            }

            // detectInnerScroll 옵션이 활성화된 경우에만 children 내부의 스크롤 요소 찾기
            // (가상 테이블 등 내부에서 스크롤을 처리하는 경우에 사용)
            if (!detectInnerScroll) {
                return null;
            }

            // children 요소에서 스크롤 가능한 요소 찾기
            // 중첩된 OverlayScrollbar의 영역은 제외 (다른 OverlayScrollbar의 container는 스킵)
            const childScrollableElements =
                containerRef.current.querySelectorAll(
                    '[data-virtuoso-scroller], [style*="overflow"], .virtuoso-scroller, [style*="overflow: auto"], [style*="overflow:auto"]'
                );

            for (const child of childScrollableElements) {
                const element = child as HTMLElement;

                // 이 요소가 다른 OverlayScrollbar의 container인지 확인
                // (자신의 containerRef는 아니어야 하고, overlay-scrollbar-container 클래스를 가진 경우)
                if (
                    element !== containerRef.current &&
                    element.classList.contains("overlay-scrollbar-container")
                ) {
                    // 중첩된 OverlayScrollbar의 container이므로 스킵
                    continue;
                }

                // 이 요소의 부모 중에 다른 OverlayScrollbar container가 있는지 확인
                let parent: HTMLElement | null = element.parentElement;
                let isNestedInAnotherScrollbar = false;

                while (parent && parent !== containerRef.current) {
                    if (
                        parent.classList.contains(
                            "overlay-scrollbar-container"
                        ) &&
                        parent !== containerRef.current
                    ) {
                        // 다른 OverlayScrollbar 내부의 요소이므로 스킵
                        isNestedInAnotherScrollbar = true;
                        break;
                    }
                    parent = parent.parentElement;
                }

                if (isNestedInAnotherScrollbar) {
                    continue;
                }

                // 스크롤 가능한 요소인지 확인
                if (element.scrollHeight > element.clientHeight + 2) {
                    cachedScrollContainerRef.current = element;
                    return element;
                }
            }

            return null;
        }, []);

        // 스크롤 가능 여부 체크
        const isScrollable = useCallback(() => {
            return findScrollableElement() !== null;
        }, [findScrollableElement]);

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
                // 자동 숨김이 비활성화되어 있으면 타이머를 설정하지 않음
                if (!finalAutoHideConfig.enabled) {
                    return;
                }
                clearHideTimer();
                hideTimeoutRef.current = setTimeout(() => {
                    setScrollbarVisible(false);
                    hideTimeoutRef.current = null;
                }, delay);
            },
            [clearHideTimer, finalAutoHideConfig.enabled]
        );

        // useScrollbarUpdate 훅 사용
        const { thumbHeight, thumbTop, hasScrollableContent, updateScrollbar } =
            useScrollbarUpdate({
                wrapperRef,
                scrollbarRef,
                contentRef,
                findScrollableElement,
                clearHideTimer,
                setScrollbarVisible,
                thumb: finalThumbConfig,
                track: finalTrackConfig,
                arrows: finalArrowsConfig,
                autoHide: finalAutoHideConfig,
            });

        // useThumbDrag 훅 사용
        const {
            isDragging,
            isThumbHovered,
            setIsThumbHovered,
            handleThumbMouseDown,
        } = useThumbDrag({
            findScrollableElement,
            thumbHeight,
            clearHideTimer,
            setScrollbarVisible,
            updateScrollbar,
            setHideTimer,
            hideDelay: finalAutoHideConfig.delay,
            isScrollable,
            maintainFocus,
        });

        // useDragScroll 훅 사용
        const { isDragScrolling, handleDragScrollStart } = useDragScroll({
            dragScroll: finalDragScrollConfig,
            findScrollableElement,
            clearHideTimer,
            setScrollbarVisible,
            updateScrollbar,
            setHideTimer,
            hideDelay: finalAutoHideConfig.delay,
            isScrollable,
        });

        // useTrackClick 훅 사용
        const { handleTrackClick } = useTrackClick({
            scrollbarRef,
            findScrollableElement,
            updateScrollbar,
            setScrollbarVisible,
            setHideTimer,
            hideDelay: finalAutoHideConfig.delay,
            maintainFocus,
        });

        // useArrowNavigation 훅 사용
        const {
            hoveredArrow,
            setHoveredArrow,
            handleUpArrowClick,
            handleDownArrowClick,
        } = useArrowNavigation({
            arrows: finalArrowsConfig,
            containerRef,
            contentRef,
            updateScrollbar,
            setScrollbarVisible,
            setHideTimer,
            hideDelay: finalAutoHideConfig.delay,
            maintainFocus,
        });

        // useScrollEvents 훅 사용
        useScrollEvents({
            containerRef,
            findScrollableElement,
            updateScrollbar,
            clearHideTimer,
            setScrollbarVisible,
            setHideTimer,
            autoHide: finalAutoHideConfig,
            onScroll,
        });

        // useKeyboardNavigation 훅 사용
        useKeyboardNavigation({
            containerRef,
            findScrollableElement,
            updateScrollbar,
            clearHideTimer,
            setScrollbarVisible,
            setHideTimer,
            hideDelay: finalAutoHideConfig.delay,
        });

        // useScrollbarInitialization 훅 사용
        useScrollbarInitialization({
            containerRef,
            contentRef,
            cachedScrollContainerRef,
            updateScrollbar,
            setScrollbarVisible,
            isScrollable,
            autoHide: finalAutoHideConfig,
        });

        // trackWidth가 thumbWidth보다 작으면 thumbWidth와 같게 설정
        const adjustedTrackWidth = Math.max(finalTrackWidth, finalThumbWidth);

        return (
            <div
                ref={wrapperRef}
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
                    tabIndex={0} // 키보드 포커스 가능하게 함 (클릭으로 포커스 가능)
                    onClick={handleContainerClick}
                    onMouseDown={handleDragScrollStart}
                    style={{
                        display: "flex",
                        width: "100%", // 명시적 너비 설정
                        flex: "1 1 auto", // flex item으로 설정하여 높이를 자동으로 계산
                        minHeight: 0, // 최소 높이 보장
                        overflow: "auto", // 네이티브 스크롤 기능 유지
                        // 브라우저 기본 스크롤바만 숨기기
                        scrollbarWidth: "none", // Firefox
                        msOverflowStyle: "none", // IE/Edge
                        // 키보드 포커스 스타일 (접근성)
                        outline: "none", // 기본 아웃라인 제거
                        userSelect: isDragScrolling ? "none" : "auto", // 드래그 중 텍스트 선택 방지
                        ...containerStyle, // 사용자 정의 스타일 적용
                    }}
                >
                    <div
                        ref={contentRef}
                        className="overlay-scrollbar-content"
                        style={{
                            flex: "1 1 0%", // grow하여 공간 채우기
                            minHeight: 0, // flex shrink 허용
                            display: "flex", // flex 컨테이너로 설정
                            flexDirection: "column", // 세로 방향 정렬
                            ...contentStyle, // 사용자 정의 스타일 적용
                        }}
                    >
                        {children}
                    </div>
                </div>

                {/* 커스텀 스크롤바 */}
                {showScrollbar && hasScrollableContent && (
                    <ScrollbarTrack
                        scrollbarRef={scrollbarRef}
                        adjustedTrackWidth={adjustedTrackWidth}
                        scrollbarVisible={scrollbarVisible}
                        isDragging={isDragging}
                        showArrows={showArrows}
                        finalThumbWidth={finalThumbWidth}
                        finalTrackConfig={finalTrackConfig}
                        clearHideTimer={clearHideTimer}
                        setScrollbarVisible={setScrollbarVisible}
                        setHideTimer={setHideTimer}
                        autoHideDelay={finalAutoHideConfig.delay}
                        handleTrackClick={handleTrackClick}
                    >
                        <ScrollbarThumb
                            thumbRef={thumbRef}
                            thumbTop={thumbTop}
                            thumbHeight={thumbHeight}
                            thumbMinHeight={thumbMinHeight}
                            showArrows={showArrows}
                            finalThumbWidth={finalThumbWidth}
                            adjustedTrackWidth={adjustedTrackWidth}
                            isDragging={isDragging}
                            isThumbHovered={isThumbHovered}
                            finalThumbConfig={finalThumbConfig}
                            finalTrackConfig={finalTrackConfig}
                            handleThumbMouseDown={handleThumbMouseDown}
                            setIsThumbHovered={setIsThumbHovered}
                        />
                    </ScrollbarTrack>
                )}

                {/* 화살표 버튼들 */}
                {showScrollbar && hasScrollableContent && showArrows && (
                    <ScrollbarArrows
                        adjustedTrackWidth={adjustedTrackWidth}
                        finalThumbWidth={finalThumbWidth}
                        scrollbarVisible={scrollbarVisible}
                        hoveredArrow={hoveredArrow}
                        finalArrowsConfig={finalArrowsConfig}
                        finalTrackConfig={finalTrackConfig}
                        setHoveredArrow={setHoveredArrow}
                        handleUpArrowClick={handleUpArrowClick}
                        handleDownArrowClick={handleDownArrowClick}
                    />
                )}
            </div>
        );
    }
);

OverlayScrollbar.displayName = "OverlayScrollbar";

export default OverlayScrollbar;
