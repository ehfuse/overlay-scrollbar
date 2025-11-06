/**
 * useScrollEvents.ts
 * 스크롤 이벤트 관련 로직
 *
 * @copyright 2025 KIM YOUNG JIN (ehfuse@gmail.com)
 */

import { useRef, useEffect } from "react";
import { AutoHideConfig } from "../types";

interface UseScrollEventsProps {
    containerRef: React.RefObject<HTMLDivElement>;
    findScrollableElement: () => HTMLElement | null;
    updateScrollbar: () => void;
    clearHideTimer: () => void;
    setScrollbarVisible: (visible: boolean) => void;
    setHideTimer: (delay: number) => void;
    autoHide: AutoHideConfig;
    onScroll?: (event: Event) => void;
}

export const useScrollEvents = ({
    containerRef,
    findScrollableElement,
    updateScrollbar,
    clearHideTimer,
    setScrollbarVisible,
    setHideTimer,
    autoHide,
    onScroll,
}: UseScrollEventsProps) => {
    const wheelTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isWheelScrollingRef = useRef(false); // useState 대신 useRef 사용 (리렌더링 방지)

    const hideDelay = autoHide.delay ?? 1500;
    const hideDelayOnWheel = autoHide.delayOnWheel ?? 700;

    useEffect(() => {
        const handleScroll = (event: Event) => {
            // 이벤트 타겟이 실제 스크롤된 요소인지 확인 (버블링 방지)
            const target = event.target as HTMLElement;
            const scrollableElement = findScrollableElement();

            // 스크롤 이벤트가 자신의 스크롤 컨테이너에서 발생한 것이 아니면 무시
            if (!scrollableElement || target !== scrollableElement) {
                return;
            }

            updateScrollbar();

            // 스크롤 중에는 스크롤바 표시
            clearHideTimer();
            setScrollbarVisible(true);

            // 휠 스크롤 중이면 빠른 숨김, 아니면 기본 숨김 시간 적용
            const delay = isWheelScrollingRef.current
                ? hideDelayOnWheel
                : hideDelay;
            setHideTimer(delay);

            if (onScroll) {
                onScroll(event);
            }
        };

        const handleWheel = (event: Event) => {
            // 이벤트 타겟이 자신의 컨테이너 내부인지 확인
            const target = event.target as HTMLElement;
            const container = containerRef.current;

            if (!container) return;

            // 이벤트가 자신의 컨테이너 내부에서 발생한 것인지 확인
            // 중첩된 OverlayScrollbar의 이벤트는 무시
            if (!container.contains(target)) {
                return;
            }

            // 타겟이 다른 OverlayScrollbar의 컨테이너인지 확인
            if (
                target.classList.contains("overlay-scrollbar-container") &&
                target !== container
            ) {
                return;
            }

            // 타겟의 부모 중에 다른 OverlayScrollbar 컨테이너가 있는지 확인
            let parent = target.parentElement;
            while (parent && parent !== container) {
                if (parent.classList.contains("overlay-scrollbar-container")) {
                    // 중첩된 내부 OverlayScrollbar의 이벤트이므로 무시
                    return;
                }
                parent = parent.parentElement;
            }

            // 휠 스크롤 상태 표시
            isWheelScrollingRef.current = true;

            // 기존 휠 타이머 제거
            if (wheelTimeoutRef.current) {
                clearTimeout(wheelTimeoutRef.current);
            }

            // 300ms 후 휠 스크롤 상태 해제 (휠 스크롤이 끝났다고 간주)
            wheelTimeoutRef.current = setTimeout(() => {
                isWheelScrollingRef.current = false;
            }, 300);

            clearHideTimer();
            setScrollbarVisible(true);
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
                '[data-virtuoso-scroller], [style*="overflow"], .virtuoso-scroller, [style*="overflow: auto"], [style*="overflow:auto"]'
            );
            childScrollableElements.forEach((child) => {
                const element = child as HTMLElement;

                // 다른 OverlayScrollbar의 container는 제외
                if (
                    element !== container &&
                    element.classList.contains("overlay-scrollbar-container")
                ) {
                    return;
                }

                // 부모 중에 다른 OverlayScrollbar container가 있으면 제외
                let parent: HTMLElement | null = element.parentElement;
                while (parent && parent !== container) {
                    if (
                        parent.classList.contains(
                            "overlay-scrollbar-container"
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
            elementsToWatch.forEach((element) => {
                element.removeEventListener("scroll", handleScroll);
                element.removeEventListener("wheel", handleWheel);
            });
            if (wheelTimeoutRef.current) {
                clearTimeout(wheelTimeoutRef.current);
            }
        };
    }, [
        containerRef,
        findScrollableElement,
        updateScrollbar,
        onScroll,
        clearHideTimer,
        setHideTimer,
        hideDelay,
        hideDelayOnWheel,
        setScrollbarVisible,
    ]);
};
