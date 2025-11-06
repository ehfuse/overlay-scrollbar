/**
 * useTrackClick.ts
 * 트랙 클릭 관련 로직
 *
 * @copyright 2025 KIM YOUNG JIN (ehfuse@gmail.com)
 */

import { useCallback } from "react";

interface UseTrackClickProps {
    scrollbarRef: React.RefObject<HTMLDivElement>;
    findScrollableElement: () => HTMLElement | null;
    updateScrollbar: () => void;
    setScrollbarVisible: (visible: boolean) => void;
    setHideTimer: (delay: number) => void;
    hideDelay: number;
    maintainFocus: () => void;
}

export const useTrackClick = ({
    scrollbarRef,
    findScrollableElement,
    updateScrollbar,
    setScrollbarVisible,
    setHideTimer,
    hideDelay,
    maintainFocus,
}: UseTrackClickProps) => {
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
                Math.min(contentHeight - containerHeight, newScrollTop)
            );
            updateScrollbar();

            setScrollbarVisible(true);
            setHideTimer(hideDelay);

            // 포커스 유지 (키보드 입력이 계속 작동하도록)
            maintainFocus();
        },
        [
            scrollbarRef,
            updateScrollbar,
            setHideTimer,
            hideDelay,
            findScrollableElement,
            maintainFocus,
            setScrollbarVisible,
        ]
    );

    return {
        handleTrackClick,
    };
};
