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
    useLayoutEffect,
} from "react";
import { isTextInputElement } from "./utils/dragScrollUtils";
import { usePullToRefresh } from "./hooks/usePullToRefresh";
import type { PullToRefreshConfig } from "./types";

// thumb 관련 설정
export interface ThumbConfig {
    width?: number; // 썸의 너비 (기본가: 8px)
    minHeight?: number; // 썸의 최소 높이 (기본가: 50px)
    radius?: number; // 썸의 border-radius (기본가: width / 2)
    color?: string; // 썸 색상 (기본가: "#606060")
    opacity?: number; // 기본 투명도 (기본가: 0.6)
    hoverColor?: string; // 호버 시 색상 (기본값: color 동일)
    hoverOpacity?: number; // 호버 시 투명도 (기본가: 1.0)
}

// track 관련 설정
export interface TrackConfig {
    width?: number; // 호버 영역인 트랙의 너비 (기본값: 16px)
    color?: string; // 트랙 배경 색상 (기본값: "rgba(128, 128, 128, 0.1)")
    visible?: boolean; // 트랙 배경 표시 여부 (기본값: true)
    alignment?: "default" | "outside"; // 트랙 정렬 (기본값: "outside", "default"는 콘텐츠 안쪽에 표시)
    radius?: number; // 트랙 배경의 border-radius (기본값: thumb.radius 또는 4px)
    margin?: number; // 트랙 상하 마진 (기본값: 4px)
    overflowX?: boolean; // 가로 스크롤바 활성화 여부 (기본값: true)
    overflowY?: boolean; // 세로 스크롤바 활성화 여부 (기본값: true)
}

// arrows 관련 설정
export interface ArrowsConfig {
    visible?: boolean; // 화살표 표시 여부 (기본가: false)
    step?: number; // 화살표 클릭시 스크롤 이동 거리 (기본가: 50px)
    color?: string; // 화살표 색상 (기본가: "#808080")
    opacity?: number; // 기본 투명도 (기본가: 0.6)
    hoverColor?: string; // 호버 시 색상 (기본가: color 동일)
    hoverOpacity?: number; // 호버 시 투명도 (기본가: 1.0)
}

// 드래그 스크롤 관련 설정
export interface DragScrollConfig {
    enabled?: boolean; // 드래그 스크롤 활성화 여부 (기본값: true)
    excludeClasses?: string[]; // 드래그 스크롤을 제외할 추가 클래스들 (자신 또는 부모 요소 확인, 최대 5단계)
    excludeSelectors?: string[]; // 드래그 스크롤을 제외할 추가 CSS 셀렉터들 (element.matches() 사용)
}

// 자동 숨김 관련 설정
export interface AutoHideConfig {
    enabled?: boolean; // 자동 숨김 활성화 여부 (기본값: true)
    delay?: number; // 기본 자동 숨김 시간 (기본값: 1500ms)
    delayOnWheel?: number; // 휠 스크롤 후 자동 숨김 시간 (기본가: 700ms)
    initialDelay?: number; // 마운트 후 스크롤바 표시 지연 시간 (기본값: 200ms, 0보다 크면 초기 스크롤 시 스크롤바 숨김)
}

export interface OverlayScrollbarProps {
    className?: string;
    style?: React.CSSProperties; // wrapper div에 적용할 스타일
    containerStyle?: React.CSSProperties; // 스크롤 컨테이너 div에 적용할 스타일
    contentStyle?: React.CSSProperties; // 내부 content div에 적용할 스타일
    children: ReactNode;
    onScroll?: (event: Event) => void;

    // 그룹화된 설정 객체들
    thumb?: ThumbConfig; // 썸 관련 설정
    track?: TrackConfig; // 트랙 관련 설정
    arrows?: ArrowsConfig; // 화살표들 관련 설정
    dragScroll?: DragScrollConfig; // 드래그 스크롤 관련 설정
    autoHide?: AutoHideConfig; // 자동 숨김 관련 설정
    pullToRefresh?: PullToRefreshConfig; // 당겨서 새로고침 관련 설정(터치 전용)

    // 기타 설정들
    showScrollbar?: boolean; // 스크롤바 표시 여부 (기본값: true)
    showHorizontalScrollbar?: boolean; // 하단(가로) 스크롤바 표시 여부 (기본값: true)
    detectInnerScroll?: boolean; // children 내부의 스크롤 요소 감지 여부 (기본값: false, 가상 테이블 등에 사용)
}

// OverlayScrollbar가 노출할 메서드들
export interface OverlayScrollbarRef {
    getScrollContainer: () => HTMLDivElement | null;
    scrollTo: (options: ScrollToOptions) => void;
    scrollTop: number;
    scrollHeight: number;
    clientHeight: number;
}

// 기본 설정 객체들을 컴포넌트 외부에 상수로 선언 (재렌더링 시 동일한 참조 유지)
const DEFAULT_THUMB_CONFIG: ThumbConfig = {};
const DEFAULT_TRACK_CONFIG: TrackConfig = {};
const DEFAULT_ARROWS_CONFIG: ArrowsConfig = {};
const DEFAULT_DRAG_SCROLL_CONFIG: DragScrollConfig = {};
const DEFAULT_AUTO_HIDE_CONFIG: AutoHideConfig = {};
const DEFAULT_PULL_TO_REFRESH_CONFIG: PullToRefreshConfig = {};

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
            pullToRefresh = DEFAULT_PULL_TO_REFRESH_CONFIG,

            // 기타 설정들
            showScrollbar = true,
            showHorizontalScrollbar = true,
            detectInnerScroll = false,
        },
        ref,
    ) => {
        // props 변경 추적용 ref
        const prevPropsRef = useRef<{
            children?: ReactNode;
            onScroll?: (event: Event) => void;
            showScrollbar?: boolean;
            showHorizontalScrollbar?: boolean;
            thumb?: ThumbConfig;
            track?: TrackConfig;
            arrows?: ArrowsConfig;
            dragScroll?: DragScrollConfig;
            autoHide?: AutoHideConfig;
        }>({});

        // 렌더링 시 어떤 prop이 변경되었는지 체크
        useEffect(() => {
            // 현재 props 저장
            prevPropsRef.current = {
                children,
                onScroll,
                showScrollbar,
                showHorizontalScrollbar,
                thumb,
                track,
                arrows,
                dragScroll,
                autoHide,
            };
        });

        const wrapperRef = useRef<HTMLDivElement>(null);
        const containerRef = useRef<HTMLDivElement>(null);
        const contentRef = useRef<HTMLDivElement>(null);
        const scrollbarRef = useRef<HTMLDivElement>(null);
        const thumbRef = useRef<HTMLDivElement>(null);

        // 스크롤 컨테이너 캐싱용 ref (성능 최적화)
        const cachedScrollContainerRef = useRef<HTMLElement | null>(null);

        // 당겨서 새로고침 — 컨테이너가 맨 위일 때 하향 터치 당김을 감지해 onRefresh 를 실행한다.
        const {
            pullDistance,
            isRefreshing,
            pullProgress,
        } = usePullToRefresh({ containerRef, config: pullToRefresh });
        const pullIndicatorColor = pullToRefresh.indicatorColor ?? "#1976d2";
        const pullIndicatorVisible = pullDistance > 0 || isRefreshing;

        // 기본 상태들
        const [scrollbarVisible, setScrollbarVisible] = useState(false);
        const [isDragging, setIsDragging] = useState(false);
        const [isThumbHovered, setIsThumbHovered] = useState(false);
        const [dragStart, setDragStart] = useState({ y: 0, scrollTop: 0 });
        const [thumbHeight, setThumbHeight] = useState(0);
        const [thumbTop, setThumbTop] = useState(0);
        const [hasScrollableContent, setHasScrollableContent] = useState(false);

        // 가로 스크롤바 상태
        const [isHorizontalThumbHovered, setIsHorizontalThumbHovered] =
            useState(false);
        const [isDraggingHorizontal, setIsDraggingHorizontal] = useState(false);
        const [dragStartHorizontal, setDragStartHorizontal] = useState({
            x: 0,
            scrollLeft: 0,
        });
        const [thumbWidth, setThumbWidth] = useState(0);
        const [thumbLeft, setThumbLeft] = useState(0);
        const [
            hasHorizontalScrollableContent,
            setHasHorizontalScrollableContent,
        ] = useState(false);

        // 드래그 스크롤 상태
        const isDragScrollPendingRef = useRef(false);
        const [isDragScrolling, setIsDragScrolling] = useState(false);
        const [dragScrollStart, setDragScrollStart] = useState({
            x: 0,
            y: 0,
            scrollTop: 0,
            scrollLeft: 0,
        });
        const [activeArrow, setActiveArrow] = useState<"up" | "down" | null>(
            null,
        );
        const [hoveredArrow, setHoveredArrow] = useState<"up" | "down" | null>(
            null,
        );

        // 초기 마운트 시 hover 방지용
        const [isInitialized, setIsInitialized] = useState(false);

        // wrapper의 padding-bottom 저장
        const [wrapperPaddingBottom, setWrapperPaddingBottom] = useState(0);

        // 휠 스크롤 감지용
        const wheelTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
            null,
        );
        const [isWheelScrolling, setIsWheelScrolling] = useState(false);

        // 숨김 타이머
        const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
            null,
        );

        // 호버 진입 타이머 (디바운스용)
        const hoverEnterTimeoutRef = useRef<ReturnType<
            typeof setTimeout
        > | null>(null);

        // 휠 이벤트 표시 타이머 (디바운스용)
        const wheelShowTimeoutRef = useRef<ReturnType<
            typeof setTimeout
        > | null>(null);

        // 그룹화된 설정 객체들에 기본값 설정
        const finalThumbConfig = useMemo(() => {
            const baseColor = thumb.color ?? "#606060";
            return {
                width: thumb.width ?? 8,
                minHeight: thumb.minHeight ?? 50,
                radius: thumb.radius ?? (thumb.width ?? 8) / 2,
                color: baseColor,
                opacity: thumb.opacity ?? 0.6,
                hoverColor: thumb.hoverColor ?? baseColor,
                hoverOpacity: thumb.hoverOpacity ?? 1.0,
            };
        }, [thumb]);

        const finalTrackConfig = useMemo(
            () => ({
                width: track.width ?? 16,
                color: track.color ?? "rgba(128, 128, 128, 0.1)",
                visible: track.visible ?? true,
                alignment: track.alignment ?? "outside",
                radius: track.radius ?? finalThumbConfig.radius ?? 4,
                margin: track.margin ?? 4,
                overflowX: track.overflowX ?? true,
                overflowY: track.overflowY ?? true,
            }),
            [track, finalThumbConfig.radius],
        );

        const finalArrowsConfig = useMemo(() => {
            const baseColor = arrows.color ?? "#808080";
            return {
                visible: arrows.visible ?? false,
                step: arrows.step ?? 50,
                color: baseColor,
                opacity: arrows.opacity ?? 0.6,
                hoverColor: arrows.hoverColor ?? baseColor,
                hoverOpacity: arrows.hoverOpacity ?? 1.0,
            };
        }, [arrows]);

        const finalDragScrollConfig = useMemo(
            () => ({
                enabled: dragScroll.enabled ?? true,
                excludeClasses: dragScroll.excludeClasses ?? [],
                excludeSelectors: dragScroll.excludeSelectors ?? [],
            }),
            [dragScroll],
        );

        const finalAutoHideConfig = useMemo(
            () => ({
                enabled: autoHide.enabled ?? true,
                delay: autoHide.delay ?? 1500,
                delayOnWheel: autoHide.delayOnWheel ?? 700,
                initialDelay: autoHide.initialDelay ?? 200,
            }),
            [autoHide],
        );

        // 초기 마운트 시 스크롤바 표시 지연 상태
        const [isInitialDelayActive, setIsInitialDelayActive] = useState(
            () => (autoHide.initialDelay ?? 200) > 0,
        );

        // 호환성을 위한 변수들 (자주 사용되는 변수들만 유지)
        const finalThumbWidth = finalThumbConfig.width;
        const finalTrackWidth = finalTrackConfig.width;
        const thumbMinHeight = finalThumbConfig.minHeight;
        const showArrows = finalArrowsConfig.visible;
        const arrowStep = finalArrowsConfig.step;

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
            [],
        );

        // 실제 스크롤 가능한 요소 찾기 (캐싱 최적화)
        const findScrollableElement = useCallback((): HTMLElement | null => {
            // 캐시된 요소가 여전히 유효한지 확인
            if (cachedScrollContainerRef.current) {
                const cached = cachedScrollContainerRef.current;
                // DOM에 연결되어 있고 여전히 스크롤 가능한지 확인
                if (
                    document.contains(cached) &&
                    (cached.scrollHeight > cached.clientHeight + 2 ||
                        cached.scrollWidth > cached.clientWidth + 2)
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
                containerRef.current.scrollHeight >
                    containerRef.current.clientHeight + 2 ||
                containerRef.current.scrollWidth >
                    containerRef.current.clientWidth + 2
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
                    '[data-virtuoso-scroller], [style*="overflow"], .virtuoso-scroller, [style*="overflow: auto"], [style*="overflow:auto"]',
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
                            "overlay-scrollbar-container",
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
                if (
                    element.scrollHeight > element.clientHeight + 2 ||
                    element.scrollWidth > element.clientWidth + 2
                ) {
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

        const clearHoverEnterTimer = useCallback(() => {
            if (hoverEnterTimeoutRef.current) {
                clearTimeout(hoverEnterTimeoutRef.current);
                hoverEnterTimeoutRef.current = null;
            }
        }, []);

        const clearWheelShowTimer = useCallback(() => {
            if (wheelShowTimeoutRef.current) {
                clearTimeout(wheelShowTimeoutRef.current);
                wheelShowTimeoutRef.current = null;
            }
        }, []);

        // 스크롤 영역 바깥으로 나가면 스크롤바를 즉시 숨긴다.
        const handleWrapperMouseLeave = useCallback(() => {
            clearHoverEnterTimer();

            if (
                isDragging ||
                isDraggingHorizontal ||
                isDragScrolling ||
                isDragScrollPendingRef.current
            ) {
                return;
            }

            clearHideTimer();
            setScrollbarVisible(false);
        }, [
            clearHideTimer,
            clearHoverEnterTimer,
            isDragging,
            isDraggingHorizontal,
            isDragScrolling,
        ]);

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
            [clearHideTimer, finalAutoHideConfig.enabled],
        );

        // 스크롤바 위치 및 크기 업데이트
        const updateScrollbar = useCallback(() => {
            // 우선 감지 로직을 사용하고, 실패 시 container를 fallback으로 사용한다.
            // horizontal-only 케이스에서 감지 타이밍 이슈가 발생해도 가로 오버플로우 계산을 유지한다.
            const scrollableElement =
                findScrollableElement() ?? containerRef.current;
            if (!scrollableElement) {
                // 측정 대상이 없으면 숨김
                setScrollbarVisible(false);
                setHasScrollableContent(false);
                setHasHorizontalScrollableContent(false);
                clearHideTimer();
                return;
            }

            // 자동 숨김이 비활성화되어 있고 초기 지연이 끝났으면 스크롤바를 항상 표시
            if (!finalAutoHideConfig.enabled && !isInitialDelayActive) {
                setScrollbarVisible(true);
                clearHideTimer();
            }

            const containerHeight = scrollableElement.clientHeight;
            const contentHeight = scrollableElement.scrollHeight;
            const scrollTop = scrollableElement.scrollTop;

            const containerWidth = scrollableElement.clientWidth;
            const contentWidth = scrollableElement.scrollWidth;
            const scrollLeft = scrollableElement.scrollLeft;
            const hasVerticalOverflow = contentHeight - containerHeight > 0;
            const hasHorizontalOverflow = contentWidth - containerWidth > 0;
            const hasAnyOverflow = hasVerticalOverflow || hasHorizontalOverflow;

            // 축별 오버플로우 상태 반영
            setHasScrollableContent(hasVerticalOverflow);
            setHasHorizontalScrollableContent(hasHorizontalOverflow);

            // 오버플로우가 없으면 스크롤바를 숨긴다.
            if (!hasAnyOverflow) {
                setScrollbarVisible(false);
                clearHideTimer();
            }

            // wrapper의 패딩 계산 (상하 패딩만 필요)
            let wrapperPaddingTopBottom = 0;
            let paddingBottom = 0;
            if (wrapperRef.current) {
                const computedStyle = window.getComputedStyle(
                    wrapperRef.current,
                );
                const paddingTop = parseFloat(computedStyle.paddingTop) || 0;
                paddingBottom = parseFloat(computedStyle.paddingBottom) || 0;
                wrapperPaddingTopBottom = paddingTop + paddingBottom;
                setWrapperPaddingBottom(paddingBottom);
            }

            if (hasVerticalOverflow) {
                // 화살표와 간격 공간 계산 (화살표 + 위아래 마진, 화살표 없어도 위아래 마진)
                const arrowSpace = showArrows
                    ? finalThumbWidth * 2 + finalTrackConfig.margin * 4
                    : finalTrackConfig.margin * 2;

                // 썸 높이 계산 (사용자 설정 최소 높이 사용, 화살표 공간 제외, wrapper 패딩 추가)
                const availableHeight =
                    containerHeight - arrowSpace + wrapperPaddingTopBottom;
                const scrollRatio = containerHeight / contentHeight;
                const calculatedThumbHeight = Math.max(
                    availableHeight * scrollRatio,
                    thumbMinHeight,
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
            } else {
                setThumbHeight(0);
                setThumbTop(0);
            }

            // 가로 스크롤바 계산
            const horizontalScrollableWidth = contentWidth - containerWidth;
            if (horizontalScrollableWidth > 0) {
                const scrollRatioHorizontal = containerWidth / contentWidth;
                const calculatedThumbWidth = Math.max(
                    containerWidth * scrollRatioHorizontal,
                    50, // 최소 너비
                );

                const thumbScrollableWidth =
                    containerWidth - calculatedThumbWidth;
                const calculatedThumbLeft =
                    horizontalScrollableWidth > 0
                        ? (scrollLeft / horizontalScrollableWidth) *
                          thumbScrollableWidth
                        : 0;

                setThumbWidth(calculatedThumbWidth);
                setThumbLeft(calculatedThumbLeft);
            } else {
                setThumbWidth(0);
                setThumbLeft(0);
            }
        }, [
            findScrollableElement,
            clearHideTimer,
            showArrows,
            finalThumbWidth,
            thumbMinHeight,
            finalAutoHideConfig.enabled,
            isInitialDelayActive,
        ]);

        // 썸 드래그 시작
        const handleThumbMouseDown = useCallback(
            (event: React.MouseEvent) => {
                event.preventDefault();
                event.stopPropagation();

                const actualScrollContainer = findScrollableElement();
                if (!actualScrollContainer) {
                    return;
                }

                setIsDragging(true);
                setDragStart({
                    y: event.clientY,
                    scrollTop: actualScrollContainer.scrollTop,
                });

                clearHideTimer();
                setScrollbarVisible(true);

                // 포커스 유지 (키보드 입력이 계속 작동하도록)
                maintainFocus();
            },
            [findScrollableElement, clearHideTimer, maintainFocus],
        );

        // 썸 드래그 중
        const handleMouseMove = useCallback(
            (event: MouseEvent) => {
                if (!isDragging) return;

                const actualScrollContainer = findScrollableElement();
                if (!actualScrollContainer) {
                    return;
                }

                const containerHeight = actualScrollContainer.clientHeight;
                const contentHeight = actualScrollContainer.scrollHeight;
                const scrollableHeight = contentHeight - containerHeight;

                const deltaY = event.clientY - dragStart.y;
                const thumbScrollableHeight = containerHeight - thumbHeight;
                const scrollDelta =
                    (deltaY / thumbScrollableHeight) * scrollableHeight;

                const newScrollTop = Math.max(
                    0,
                    Math.min(
                        scrollableHeight,
                        dragStart.scrollTop + scrollDelta,
                    ),
                );

                actualScrollContainer.scrollTop = newScrollTop;
                updateScrollbar();
            },
            [
                isDragging,
                dragStart,
                thumbHeight,
                updateScrollbar,
                findScrollableElement,
            ],
        );

        // 썸 드래그 종료
        const handleMouseUp = useCallback(() => {
            setIsDragging(false);
            if (isScrollable()) {
                setHideTimer(finalAutoHideConfig.delay); // 기본 숨김 시간 적용
            }
        }, [isScrollable, setHideTimer, finalAutoHideConfig.delay]);

        // 트랙 클릭으로 스크롤 점프
        const handleTrackClick = useCallback(
            (event: React.MouseEvent) => {
                if (!scrollbarRef.current) {
                    return;
                }

                const scrollbar = scrollbarRef.current;
                const rect = scrollbar.getBoundingClientRect();
                const clickY = event.clientY - rect.top;

                const actualScrollContainer = findScrollableElement();
                if (!actualScrollContainer) {
                    return;
                }

                const containerHeight = actualScrollContainer.clientHeight;
                const contentHeight = actualScrollContainer.scrollHeight;

                const scrollRatio = clickY / containerHeight;
                const newScrollTop =
                    scrollRatio * (contentHeight - containerHeight);

                actualScrollContainer.scrollTop = Math.max(
                    0,
                    Math.min(contentHeight - containerHeight, newScrollTop),
                );
                updateScrollbar();

                setScrollbarVisible(true);
                setHideTimer(finalAutoHideConfig.delay);

                // 포커스 유지 (키보드 입력이 계속 작동하도록)
                maintainFocus();
            },
            [
                updateScrollbar,
                setHideTimer,
                finalAutoHideConfig.delay,
                findScrollableElement,
                maintainFocus,
            ],
        );

        // 위쪽 화살표 클릭 핸들러
        const handleUpArrowClick = useCallback(
            (event: React.MouseEvent) => {
                event.preventDefault();
                event.stopPropagation();

                if (!containerRef.current) return;

                const newScrollTop = Math.max(
                    0,
                    containerRef.current.scrollTop - arrowStep,
                );

                containerRef.current.scrollTop = newScrollTop;
                updateScrollbar();

                setScrollbarVisible(true);
                setHideTimer(finalAutoHideConfig.delay);

                // 포커스 유지 (키보드 입력이 계속 작동하도록)
                maintainFocus();
            },
            [
                updateScrollbar,
                setHideTimer,
                arrowStep,
                finalAutoHideConfig.delay,
                maintainFocus,
            ],
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
                    container.scrollTop + arrowStep,
                );

                container.scrollTop = newScrollTop;
                updateScrollbar();

                setScrollbarVisible(true);
                setHideTimer(finalAutoHideConfig.delay);

                // 포커스 유지 (키보드 입력이 계속 작동하도록)
                maintainFocus();
            },
            [
                updateScrollbar,
                setHideTimer,
                arrowStep,
                finalAutoHideConfig.delay,
                maintainFocus,
            ],
        );

        // 가로 썸 드래그 시작
        const handleHorizontalThumbMouseDown = useCallback(
            (event: React.MouseEvent) => {
                event.preventDefault();
                event.stopPropagation();

                const actualScrollContainer = findScrollableElement();
                if (!actualScrollContainer) {
                    return;
                }

                setIsDraggingHorizontal(true);
                setDragStartHorizontal({
                    x: event.clientX,
                    scrollLeft: actualScrollContainer.scrollLeft,
                });

                clearHideTimer();
                setScrollbarVisible(true);

                // 포커스 유지 (키보드 입력이 계속 작동하도록)
                maintainFocus();
            },
            [findScrollableElement, clearHideTimer, maintainFocus],
        );

        // 가로 썸 드래그 중
        const handleHorizontalMouseMove = useCallback(
            (event: MouseEvent) => {
                if (!isDraggingHorizontal) return;

                const actualScrollContainer = findScrollableElement();
                if (!actualScrollContainer) {
                    return;
                }

                const containerWidth = actualScrollContainer.clientWidth;
                const contentWidth = actualScrollContainer.scrollWidth;
                const scrollableWidth = contentWidth - containerWidth;

                const deltaX = event.clientX - dragStartHorizontal.x;
                const thumbScrollableWidth = containerWidth - thumbWidth;
                const scrollDelta =
                    (deltaX / thumbScrollableWidth) * scrollableWidth;

                const newScrollLeft = Math.max(
                    0,
                    Math.min(
                        scrollableWidth,
                        dragStartHorizontal.scrollLeft + scrollDelta,
                    ),
                );

                actualScrollContainer.scrollLeft = newScrollLeft;
                updateScrollbar();
            },
            [
                isDraggingHorizontal,
                dragStartHorizontal,
                thumbWidth,
                updateScrollbar,
                findScrollableElement,
            ],
        );

        // 가로 썸 드래그 종료
        const handleHorizontalMouseUp = useCallback(() => {
            setIsDraggingHorizontal(false);
            if (isScrollable()) {
                setHideTimer(finalAutoHideConfig.delay); // 기본 숨김 시간 적용
            }
        }, [isScrollable, setHideTimer, finalAutoHideConfig.delay]);

        // 가로 트랙 클릭으로 스크롤 점프
        const handleHorizontalTrackClick = useCallback(
            (event: React.MouseEvent) => {
                if (!scrollbarRef.current) {
                    return;
                }

                const scrollbar = scrollbarRef.current;
                const rect = scrollbar.getBoundingClientRect();
                const clickX = event.clientX - rect.left;

                const actualScrollContainer = findScrollableElement();
                if (!actualScrollContainer) {
                    return;
                }

                const containerWidth = actualScrollContainer.clientWidth;
                const contentWidth = actualScrollContainer.scrollWidth;

                const scrollRatio = clickX / containerWidth;
                const newScrollLeft =
                    scrollRatio * (contentWidth - containerWidth);

                actualScrollContainer.scrollLeft = Math.max(
                    0,
                    Math.min(contentWidth - containerWidth, newScrollLeft),
                );
                updateScrollbar();

                setScrollbarVisible(true);
                setHideTimer(finalAutoHideConfig.delay);

                // 포커스 유지 (키보드 입력이 계속 작동하도록)
                maintainFocus();
            },
            [
                updateScrollbar,
                setHideTimer,
                finalAutoHideConfig.delay,
                findScrollableElement,
                maintainFocus,
            ],
        );

        // 드래그 스크롤 시작
        const handleDragScrollStart = useCallback(
            (event: React.MouseEvent) => {
                // 드래그 스크롤이 비활성화된 경우
                if (!finalDragScrollConfig.enabled) return;

                // 텍스트 입력 요소나 제외 대상이면 드래그 스크롤 하지 않음
                const target = event.target as Element;
                if (isTextInputElement(target, finalDragScrollConfig)) {
                    return;
                }

                // 오른쪽 클릭이나 휠 클릭은 제외
                if (event.button !== 0) return;

                const scrollableElement = findScrollableElement();
                if (!scrollableElement) return;

                // 스크롤 가능한 영역이 아니면 제외
                if (
                    scrollableElement.scrollHeight <=
                        scrollableElement.clientHeight &&
                    scrollableElement.scrollWidth <=
                        scrollableElement.clientWidth
                )
                    return;

                event.preventDefault();
                isDragScrollPendingRef.current = true;
                setDragScrollStart({
                    x: event.clientX,
                    y: event.clientY,
                    scrollTop: scrollableElement.scrollTop,
                    scrollLeft: scrollableElement.scrollLeft || 0,
                });

                // 스크롤바는 실제 드래그가 발생할 때 표시 (handleDragScrollMove에서 처리)
                clearHideTimer();
            },
            [
                finalDragScrollConfig,
                isTextInputElement,
                findScrollableElement,
                clearHideTimer,
            ],
        );

        // 드래그 스크롤 중
        const handleDragScrollMove = useCallback(
            (event: MouseEvent) => {
                if (!isDragScrollPendingRef.current && !isDragScrolling) return;

                const scrollableElement = findScrollableElement();
                if (!scrollableElement) return;

                const deltaX = dragScrollStart.x - event.clientX;
                const deltaY = dragScrollStart.y - event.clientY;

                // 5px 이상 움직였을 때만 실제 드래그 스크롤을 시작한다.
                if (Math.abs(deltaY) < 5 && Math.abs(deltaX) < 5) {
                    return;
                }

                if (isDragScrollPendingRef.current) {
                    isDragScrollPendingRef.current = false;
                    setIsDragScrolling(true);
                }

                // 실제 드래그가 발생했으므로 스크롤바 표시
                setScrollbarVisible(true);

                // 세로 스크롤 처리
                const newScrollTop = Math.max(
                    0,
                    Math.min(
                        scrollableElement.scrollHeight -
                            scrollableElement.clientHeight,
                        dragScrollStart.scrollTop + deltaY,
                    ),
                );

                // 가로 스크롤 처리
                const newScrollLeft = Math.max(
                    0,
                    Math.min(
                        scrollableElement.scrollWidth -
                            scrollableElement.clientWidth,
                        dragScrollStart.scrollLeft + deltaX,
                    ),
                );

                scrollableElement.scrollTop = newScrollTop;
                scrollableElement.scrollLeft = newScrollLeft;
                updateScrollbar();
            },
            [
                isDragScrolling,
                dragScrollStart,
                findScrollableElement,
                updateScrollbar,
            ],
        );

        // 드래그 스크롤 종료
        const handleDragScrollEnd = useCallback(() => {
            const wasDragScrolling = isDragScrolling;
            isDragScrollPendingRef.current = false;
            setIsDragScrolling(false);

            if (wasDragScrolling && isScrollable()) {
                setHideTimer(finalAutoHideConfig.delay);
            }
        }, [
            isDragScrolling,
            isScrollable,
            setHideTimer,
            finalAutoHideConfig.delay,
        ]);

        // 스크롤 이벤트 리스너 (externalScrollContainer 우선 사용)
        useEffect(() => {
            const handleScroll = (event: Event) => {
                updateScrollbar();

                // 초기 지연 중에는 스크롤바 표시하지 않음
                if (isInitialDelayActive) {
                    if (onScroll) {
                        onScroll(event);
                    }
                    return;
                }

                // 스크롤 중에는 스크롤바 표시
                clearHideTimer();
                setScrollbarVisible(true);

                // 휠 이벤트 디바운스 타이머 취소 (실제 스크롤 발생 시)
                clearWheelShowTimer();

                // 휠 스크롤 중이면 빠른 숨김, 아니면 기본 숨김 시간 적용
                const delay = isWheelScrolling
                    ? finalAutoHideConfig.delayOnWheel
                    : finalAutoHideConfig.delay;
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

                // 휠 이벤트 시 50ms 디바운스 적용 (실제 스크롤 발생 시 handleScroll에서 취소됨)
                clearWheelShowTimer();
                wheelShowTimeoutRef.current = setTimeout(() => {
                    setScrollbarVisible(true);
                    wheelShowTimeoutRef.current = null;
                    // 스크롤바 표시 후 자동 숨김 타이머 설정
                    setHideTimer(finalAutoHideConfig.delayOnWheel);
                }, 50);
            };

            const elementsToWatch: HTMLElement[] = [];

            // 실제 스크롤 가능한 요소 찾기
            const scrollableElement = findScrollableElement();
            if (scrollableElement) {
                elementsToWatch.push(scrollableElement);
            }

            // fallback: 내부 컨테이너와 children 요소도 감지
            const container = containerRef.current;
            if (container && !scrollableElement) {
                elementsToWatch.push(container);

                // children 요소들의 스크롤도 감지 (중첩된 OverlayScrollbar 제외)
                const childScrollableElements = container.querySelectorAll(
                    '[data-virtuoso-scroller], [style*="overflow"], .virtuoso-scroller, [style*="overflow: auto"], [style*="overflow:auto"]',
                );
                childScrollableElements.forEach((child) => {
                    const element = child as HTMLElement;

                    // 다른 OverlayScrollbar의 container는 제외
                    if (
                        element !== container &&
                        element.classList.contains(
                            "overlay-scrollbar-container",
                        )
                    ) {
                        return;
                    }

                    // 부모 중에 다른 OverlayScrollbar container가 있으면 제외
                    let parent: HTMLElement | null = element.parentElement;
                    while (parent && parent !== container) {
                        if (
                            parent.classList.contains(
                                "overlay-scrollbar-container",
                            ) &&
                            parent !== container
                        ) {
                            return; // 중첩된 OverlayScrollbar 내부이므로 제외
                        }
                        parent = parent.parentElement;
                    }

                    elementsToWatch.push(element);
                });
            }

            // 모든 요소에 이벤트 리스너 등록
            elementsToWatch.forEach((element) => {
                element.addEventListener("scroll", handleScroll, {
                    passive: true,
                });
                element.addEventListener("wheel", handleWheel, {
                    passive: true,
                });
            });

            return () => {
                // 모든 이벤트 리스너 제거
                elementsToWatch.forEach((element) => {
                    element.removeEventListener("scroll", handleScroll);
                    element.removeEventListener("wheel", handleWheel);
                });

                if (wheelTimeoutRef.current) {
                    clearTimeout(wheelTimeoutRef.current);
                }
                if (wheelShowTimeoutRef.current) {
                    clearTimeout(wheelShowTimeoutRef.current);
                }
            };
        }, [
            findScrollableElement,
            updateScrollbar,
            onScroll,
            clearHideTimer,
            setHideTimer,
            finalAutoHideConfig,
            isWheelScrolling,
            isInitialDelayActive,
        ]);

        // 키보드 네비게이션 핸들러 (방향키, PageUp/PageDown/Home/End)
        useEffect(() => {
            const handleKeyDown = (event: KeyboardEvent) => {
                const target = event.target;
                if (event.defaultPrevented) {
                    return;
                }

                if (
                    target instanceof Element &&
                    isTextInputElement(target, finalDragScrollConfig)
                ) {
                    return;
                }

                const scrollableElement = findScrollableElement();
                if (!scrollableElement) return;

                const { key } = event;
                const { scrollTop, scrollHeight, clientHeight } =
                    scrollableElement;
                const maxScrollTop = scrollHeight - clientHeight;

                // 한 줄 스크롤 단위 (rowHeight 또는 기본값)
                const lineScrollStep = 50;

                let newScrollTop: number | null = null;

                switch (key) {
                    case "ArrowUp":
                        event.preventDefault();
                        newScrollTop = Math.max(0, scrollTop - lineScrollStep);
                        break;
                    case "ArrowDown":
                        event.preventDefault();
                        newScrollTop = Math.min(
                            maxScrollTop,
                            scrollTop + lineScrollStep,
                        );
                        break;
                    case "PageUp":
                        event.preventDefault();
                        newScrollTop = Math.max(0, scrollTop - clientHeight);
                        break;
                    case "PageDown":
                        event.preventDefault();
                        newScrollTop = Math.min(
                            maxScrollTop,
                            scrollTop + clientHeight,
                        );
                        break;
                    case "Home":
                        event.preventDefault();
                        newScrollTop = 0;
                        break;
                    case "End":
                        event.preventDefault();
                        newScrollTop = maxScrollTop;
                        break;
                    default:
                        return;
                }

                if (newScrollTop !== null) {
                    // 썸 위치를 먼저 업데이트
                    const scrollRatio = newScrollTop / maxScrollTop;
                    const arrowSpace = showArrows
                        ? finalThumbWidth * 2 + finalTrackConfig.margin * 4
                        : finalTrackConfig.margin * 2;
                    const availableHeight = clientHeight - arrowSpace;
                    const scrollableThumbHeight = availableHeight - thumbHeight;
                    const newThumbTop = scrollableThumbHeight * scrollRatio;

                    setThumbTop(newThumbTop);

                    // 스크롤 위치를 즉시 변경 (애니메이션 없음)
                    scrollableElement.scrollTop = newScrollTop;

                    // 스크롤바 표시
                    clearHideTimer();
                    setScrollbarVisible(true);
                    setHideTimer(finalAutoHideConfig.delay);
                }
            };

            const container = containerRef.current;
            if (container) {
                container.addEventListener("keydown", handleKeyDown);
                return () => {
                    container.removeEventListener("keydown", handleKeyDown);
                };
            }
        }, [
            findScrollableElement,
            showArrows,
            finalThumbWidth,
            finalTrackConfig.margin,
            thumbHeight,
            clearHideTimer,
            setHideTimer,
            finalAutoHideConfig.delay,
            finalDragScrollConfig,
        ]);

        // 드래그 스크롤 전역 마우스 이벤트 리스너
        useEffect(() => {
            document.addEventListener("mousemove", handleDragScrollMove);
            document.addEventListener("mouseup", handleDragScrollEnd);
            return () => {
                document.removeEventListener("mousemove", handleDragScrollMove);
                document.removeEventListener("mouseup", handleDragScrollEnd);
            };
        }, [isDragScrolling, handleDragScrollMove, handleDragScrollEnd]);

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

        // 가로 전역 마우스 이벤트 리스너
        useEffect(() => {
            if (isDraggingHorizontal) {
                document.addEventListener(
                    "mousemove",
                    handleHorizontalMouseMove,
                );
                document.addEventListener("mouseup", handleHorizontalMouseUp);
                return () => {
                    document.removeEventListener(
                        "mousemove",
                        handleHorizontalMouseMove,
                    );
                    document.removeEventListener(
                        "mouseup",
                        handleHorizontalMouseUp,
                    );
                };
            }
        }, [
            isDraggingHorizontal,
            handleHorizontalMouseMove,
            handleHorizontalMouseUp,
        ]);

        // 초기 스크롤바 업데이트
        useEffect(() => {
            // 즉시 업데이트
            updateScrollbar();
            // 약간의 지연 후에도 업데이트 (DOM이 완전히 렌더링된 후)
            const timer = setTimeout(() => {
                updateScrollbar();
            }, 100);
            return () => clearTimeout(timer);
        }, [updateScrollbar]);

        // 컴포넌트 초기화 완료 표시 (hover 이벤트 활성화용)
        useLayoutEffect(() => {
            setIsInitialized(true);
            // 초기화 직후 스크롤바 업데이트 (썸 높이 정확하게 계산)
            updateScrollbar();
            // 자동 숨김이 비활성화되어 있고 초기 지연이 끝났으면 스크롤바를 항상 표시
            if (
                !finalAutoHideConfig.enabled &&
                !isInitialDelayActive &&
                isScrollable()
            ) {
                setScrollbarVisible(true);
            }
        }, [
            isScrollable,
            updateScrollbar,
            finalAutoHideConfig.enabled,
            isInitialDelayActive,
        ]);

        // 초기 마운트 지연 타이머
        useEffect(() => {
            if (finalAutoHideConfig.initialDelay > 0) {
                const timer = setTimeout(() => {
                    setIsInitialDelayActive(false);
                }, finalAutoHideConfig.initialDelay);
                return () => clearTimeout(timer);
            }
        }, [finalAutoHideConfig.initialDelay]);

        // Resize observer로 크기 변경 감지
        useEffect(() => {
            const resizeObserver = new ResizeObserver(() => {
                updateScrollbar();
            });

            const elementsToObserve: HTMLElement[] = [];

            // 내부 컨테이너들 관찰
            if (containerRef.current) {
                elementsToObserve.push(containerRef.current);
            }
            if (contentRef.current) {
                elementsToObserve.push(contentRef.current);
            }

            // 캐시된 스크롤 컨테이너도 관찰
            if (
                cachedScrollContainerRef.current &&
                document.contains(cachedScrollContainerRef.current)
            ) {
                elementsToObserve.push(cachedScrollContainerRef.current);
            }

            // 모든 요소들 관찰 시작
            elementsToObserve.forEach((element) => {
                resizeObserver.observe(element);
            });

            return () => resizeObserver.disconnect();
        }, [updateScrollbar]);

        // MutationObserver로 DOM 변경 감지
        useEffect(() => {
            if (!containerRef.current) {
                return;
            }

            const observer = new MutationObserver(() => {
                // 캐시 초기화하여 새로운 스크롤 컨테이너 감지
                cachedScrollContainerRef.current = null;
                updateScrollbar();
            });

            observer.observe(containerRef.current, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ["style"],
            });

            return () => observer.disconnect();
        }, [updateScrollbar]);

        // trackWidth가 thumbWidth보다 작으면 thumbWidth와 같게 설정
        const adjustedTrackWidth = Math.max(finalTrackWidth, finalThumbWidth);

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
                /* 모든 스크롤바 숨기기 */
                .overlay-scrollbar-container {
                    scrollbar-width: none !important;
                    -ms-overflow-style: none !important;
                }
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
                /* ehfuse-editor-content는 스크롤바 유지 */
                .overlay-scrollbar-container .ehfuse-editor-content {
                    scrollbar-width: thin !important;
                    -ms-overflow-style: auto !important;
                    overflow: auto !important;
                }
                .overlay-scrollbar-container .ehfuse-editor-content::-webkit-scrollbar {
                    display: block !important;
                    width: 8px !important;
                    height: 8px !important;
                }
                .overlay-scrollbar-container .ehfuse-editor-content::-webkit-scrollbar-track {
                    display: block !important;
                    background: #f1f1f1 !important;
                }
                .overlay-scrollbar-container .ehfuse-editor-content::-webkit-scrollbar-thumb {
                    display: block !important;
                    background: #c1c1c1 !important;
                    border-radius: 4px !important;
                }
                .overlay-scrollbar-container .ehfuse-editor-content::-webkit-scrollbar-thumb:hover {
                    background: #a1a1a1 !important;
                }
                /* 당겨서 새로고침 스피너 회전 */
                @keyframes overlay-scrollbar-ptr-spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
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
                ref={wrapperRef}
                className={`overlay-scrollbar-wrapper ${className}`}
                onMouseLeave={handleWrapperMouseLeave}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                    minHeight: 0, // shrink 가능하도록
                    height: "100%", // 부모의 전체 높이 사용
                    flex: "1 1 0%", // 기본적으로 flex item으로 동작
                    overflow: "visible", // content 그림자와 outside track이 상위 wrapper에서 잘리지 않도록 허용
                    ...style, // 사용자가 flex를 override 할 수 있도록 style을 뒤에 배치
                }}
            >
                {/* 당겨서 새로고침 인디케이터 — 당김 거리를 따라 내려오고, 실행 중엔 스피너로 회전 */}
                {pullIndicatorVisible && (
                    <div
                        className="overlay-scrollbar-pull-indicator"
                        style={{
                            position: "absolute",
                            top: 0,
                            left: "50%",
                            transform: `translate(-50%, ${pullDistance - 44}px)`,
                            transition: isRefreshing
                                ? "transform 0.15s ease-out"
                                : pullDistance === 0
                                  ? "transform 0.2s ease-out"
                                  : "none",
                            width: 36,
                            height: 36,
                            borderRadius: "50%",
                            background: "#ffffff",
                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.25)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 1001,
                            pointerEvents: "none",
                            opacity: isRefreshing ? 1 : Math.min(pullProgress * 1.5, 1),
                        }}
                    >
                        {isRefreshing ? (
                            // 새로고침 실행 중 — 스피너
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                style={{
                                    animation:
                                        "overlay-scrollbar-ptr-spin 0.8s linear infinite",
                                }}
                            >
                                <circle
                                    cx="12"
                                    cy="12"
                                    r="9"
                                    fill="none"
                                    stroke={pullIndicatorColor}
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeDasharray="42"
                                    strokeDashoffset="14"
                                />
                            </svg>
                        ) : (
                            // 당기는 중 — 진행률에 따라 회전하는 새로고침 화살표
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                style={{
                                    transform: `rotate(${pullProgress * 270}deg)`,
                                    opacity: pullProgress >= 1 ? 1 : 0.6,
                                }}
                            >
                                <path
                                    d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"
                                    fill={pullIndicatorColor}
                                />
                            </svg>
                        )}
                    </div>
                )}

                {/* 스크롤 컨테이너 */}
                <div
                    ref={containerRef}
                    className="overlay-scrollbar-container"
                    tabIndex={-1} // 키보드 포커스 가능하게 함
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
                        userSelect: isDragScrolling ? "none" : "auto", // 실제 드래그 중 텍스트 선택 방지
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
                            boxSizing: "border-box",
                            ...contentStyle, // 사용자 정의 스타일 적용
                        }}
                    >
                        {children}
                    </div>
                </div>

                {/* 커스텀 스크롤바 */}
                {showScrollbar &&
                    hasScrollableContent &&
                    (finalTrackConfig.overflowY ?? true) && (
                        <div
                            ref={scrollbarRef}
                            className="overlay-scrollbar-track"
                            onMouseEnter={() => {
                                // 숨김 타이머는 즉시 취소
                                clearHideTimer();

                                // 호버 진입 타이머 설정 (100ms 후 표시)
                                hoverEnterTimeoutRef.current = setTimeout(
                                    () => {
                                        setScrollbarVisible(true);
                                        hoverEnterTimeoutRef.current = null;
                                    },
                                    100,
                                );
                            }}
                            onMouseLeave={() => {
                                // 호버 진입 타이머 취소 (지나가기만 한 경우)
                                clearHoverEnterTimer();

                                if (!isDragging) {
                                    setHideTimer(finalAutoHideConfig.delay);
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
                                                  finalThumbConfig.width +
                                                  finalTrackConfig.margin * 2
                                              }px`
                                            : `${finalTrackConfig.margin}px`,
                                        right:
                                            finalTrackConfig.alignment ===
                                            "outside"
                                                ? "0px"
                                                : `${
                                                      (adjustedTrackWidth -
                                                          finalThumbConfig.width) /
                                                      2
                                                  }px`, // 트랙 정렬
                                        width: `${finalThumbConfig.width}px`,
                                        height: showArrows
                                            ? `calc(100% - ${
                                                  finalThumbConfig.width * 2 +
                                                  finalTrackConfig.margin * 4
                                              }px)`
                                            : `calc(100% - ${
                                                  finalTrackConfig.margin * 2
                                              }px)`,
                                        backgroundColor: finalTrackConfig.color,
                                        borderRadius: `${finalTrackConfig.radius}px`,
                                        cursor: "pointer",
                                    }}
                                />
                            )}

                            {/* 스크롤바 썸 */}
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
                                            ? finalThumbWidth +
                                              finalTrackConfig.margin * 2
                                            : finalTrackConfig.margin) +
                                        thumbTop
                                    }px`,
                                    right:
                                        finalTrackConfig.alignment === "outside"
                                            ? "0px"
                                            : `${
                                                  (adjustedTrackWidth -
                                                      finalThumbWidth) /
                                                  2
                                              }px`, // 트랙 정렬
                                    width: `${finalThumbWidth}px`,
                                    height: `${Math.max(
                                        thumbHeight,
                                        thumbMinHeight,
                                    )}px`,
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
                        </div>
                    )}

                {/* 위쪽 화살표 버튼 */}
                {showScrollbar && hasScrollableContent && showArrows && (
                    <div
                        className="overlay-scrollbar-up-arrow"
                        onClick={handleUpArrowClick}
                        onMouseEnter={() => setHoveredArrow("up")}
                        onMouseLeave={() => setHoveredArrow(null)}
                        style={{
                            position: "absolute",
                            top: `${finalTrackConfig.margin}px`,
                            right:
                                finalTrackConfig.alignment === "outside"
                                    ? "0px"
                                    : `${
                                          (adjustedTrackWidth -
                                              finalThumbWidth) /
                                          2
                                      }px`, // 트랙 정렬
                            width: `${finalThumbWidth}px`,
                            height: `${finalThumbWidth}px`,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: `${Math.max(
                                finalThumbWidth * 0.75,
                                8,
                            )}px`,
                            color:
                                hoveredArrow === "up"
                                    ? finalArrowsConfig.hoverColor
                                    : finalArrowsConfig.color,
                            userSelect: "none",
                            zIndex: 1001,
                            opacity: scrollbarVisible
                                ? hoveredArrow === "up"
                                    ? finalArrowsConfig.hoverOpacity
                                    : finalArrowsConfig.opacity
                                : 0,
                            transition:
                                "opacity 0.2s ease-in-out, color 0.15s ease-in-out",
                        }}
                    >
                        ▲
                    </div>
                )}

                {/* 아래쪽 화살표 버튼 */}
                {showScrollbar && hasScrollableContent && showArrows && (
                    <div
                        className="overlay-scrollbar-down-arrow"
                        onClick={handleDownArrowClick}
                        onMouseEnter={() => setHoveredArrow("down")}
                        onMouseLeave={() => setHoveredArrow(null)}
                        style={{
                            position: "absolute",
                            bottom: `${finalTrackConfig.margin}px`,
                            right:
                                finalTrackConfig.alignment === "outside"
                                    ? "0px"
                                    : `${
                                          (adjustedTrackWidth -
                                              finalThumbWidth) /
                                          2
                                      }px`, // 트랙 정렬
                            width: `${finalThumbWidth}px`,
                            height: `${finalThumbWidth}px`,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: `${Math.max(
                                finalThumbWidth * 0.75,
                                8,
                            )}px`,
                            color:
                                hoveredArrow === "down"
                                    ? finalArrowsConfig.hoverColor
                                    : finalArrowsConfig.color,
                            userSelect: "none",
                            zIndex: 1001,
                            opacity: scrollbarVisible
                                ? hoveredArrow === "down"
                                    ? finalArrowsConfig.hoverOpacity
                                    : finalArrowsConfig.opacity
                                : 0,
                            transition:
                                "opacity 0.2s ease-in-out, color 0.15s ease-in-out",
                        }}
                    >
                        ▼
                    </div>
                )}

                {/* 가로 커스텀 스크롤바 */}
                {showScrollbar &&
                    showHorizontalScrollbar &&
                    hasHorizontalScrollableContent &&
                    (finalTrackConfig.overflowX ?? true) && (
                        <div
                            className="overlay-scrollbar-horizontal-track"
                            onMouseEnter={() => {
                                // 숨김 타이머는 즉시 취소
                                clearHideTimer();

                                // 호버 진입 타이머 설정 (100ms 후 표시)
                                hoverEnterTimeoutRef.current = setTimeout(
                                    () => {
                                        setScrollbarVisible(true);
                                        hoverEnterTimeoutRef.current = null;
                                    },
                                    100,
                                );
                            }}
                            onMouseLeave={() => {
                                // 호버 진입 타이머 취소 (지나가기만 한 경우)
                                clearHoverEnterTimer();

                                if (!isDraggingHorizontal) {
                                    setHideTimer(finalAutoHideConfig.delay);
                                }
                            }}
                            style={{
                                position: "absolute",
                                bottom: `${wrapperPaddingBottom}px`,
                                left: 0,
                                width: "100%",
                                height: `${adjustedTrackWidth}px`,
                                opacity: scrollbarVisible ? 1 : 0,
                                transition: "opacity 0.2s ease-in-out",
                                cursor: "pointer",
                                zIndex: 1000,
                                pointerEvents: "auto",
                            }}
                        >
                            {/* 가로 스크롤바 트랙 배경 */}
                            {finalTrackConfig.visible && (
                                <div
                                    className="overlay-scrollbar-horizontal-track-background"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleHorizontalTrackClick(e);
                                    }}
                                    style={{
                                        position: "absolute",
                                        bottom:
                                            finalTrackConfig.alignment ===
                                            "outside"
                                                ? "0px"
                                                : `${
                                                      (adjustedTrackWidth -
                                                          finalThumbWidth) /
                                                      2
                                                  }px`,
                                        left: `${finalTrackConfig.margin}px`,
                                        right: hasScrollableContent
                                            ? finalTrackConfig.alignment ===
                                              "outside"
                                                ? `${
                                                      adjustedTrackWidth -
                                                      finalTrackConfig.margin
                                                  }px`
                                                : `${adjustedTrackWidth}px`
                                            : `${finalTrackConfig.margin}px`,
                                        height: `${finalThumbWidth}px`,
                                        backgroundColor: finalTrackConfig.color,
                                        borderRadius: `${finalTrackConfig.radius}px`,
                                        cursor: "pointer",
                                    }}
                                />
                            )}

                            {/* 가로 스크롤바 썸 */}
                            <div
                                className="overlay-scrollbar-horizontal-thumb"
                                onMouseDown={handleHorizontalThumbMouseDown}
                                onMouseEnter={() =>
                                    setIsHorizontalThumbHovered(true)
                                }
                                onMouseLeave={() =>
                                    setIsHorizontalThumbHovered(false)
                                }
                                style={{
                                    position: "absolute",
                                    bottom:
                                        finalTrackConfig.alignment === "outside"
                                            ? "0px"
                                            : `${
                                                  (adjustedTrackWidth -
                                                      finalThumbWidth) /
                                                  2
                                              }px`,
                                    left: `${
                                        finalTrackConfig.margin + thumbLeft
                                    }px`,
                                    right: hasScrollableContent
                                        ? finalTrackConfig.alignment ===
                                          "outside"
                                            ? `${
                                                  adjustedTrackWidth -
                                                  finalTrackConfig.margin
                                              }px`
                                            : `${adjustedTrackWidth}px`
                                        : "auto",
                                    maxWidth: hasScrollableContent
                                        ? finalTrackConfig.alignment ===
                                          "outside"
                                            ? `calc(100% - ${
                                                  finalTrackConfig.margin +
                                                  thumbLeft +
                                                  adjustedTrackWidth -
                                                  finalTrackConfig.margin
                                              }px)`
                                            : `calc(100% - ${
                                                  finalTrackConfig.margin +
                                                  thumbLeft +
                                                  adjustedTrackWidth
                                              }px)`
                                        : "none",
                                    width: `${Math.max(thumbWidth, 50)}px`,
                                    height: `${finalThumbWidth}px`,
                                    backgroundColor:
                                        isHorizontalThumbHovered ||
                                        isDraggingHorizontal
                                            ? finalThumbConfig.hoverColor
                                            : finalThumbConfig.color,
                                    opacity:
                                        isHorizontalThumbHovered ||
                                        isDraggingHorizontal
                                            ? finalThumbConfig.hoverOpacity
                                            : finalThumbConfig.opacity,
                                    borderRadius: `${finalThumbConfig.radius}px`,
                                    cursor: "pointer",
                                    transition:
                                        "background-color 0.2s ease-in-out, opacity 0.2s ease-in-out",
                                }}
                            />
                        </div>
                    )}
            </div>
        );
    },
);

export default OverlayScrollbar;
export { OverlayScrollbar };
