/**
 * useThumbDrag.ts
 * 썸 드래그 관련 로직
 *
 * @copyright 2025 KIM YOUNG JIN (ehfuse@gmail.com)
 */

import { useState, useCallback, useEffect, useRef } from "react";

interface UseThumbDragProps {
    findScrollableElement: () => HTMLElement | null;
    thumbHeight: number;
    clearHideTimer: () => void;
    setScrollbarVisible: (visible: boolean) => void;
    updateScrollbar: () => void;
    setHideTimer: (delay: number) => void;
    hideDelay: number;
    isScrollable: () => boolean;
    maintainFocus: () => void;
}

export const useThumbDrag = ({
    findScrollableElement,
    thumbHeight,
    clearHideTimer,
    setScrollbarVisible,
    updateScrollbar,
    setHideTimer,
    hideDelay,
    isScrollable,
    maintainFocus,
}: UseThumbDragProps) => {
    const [isDragging, setIsDragging] = useState(false);
    const [isThumbHovered, setIsThumbHovered] = useState(false);
    const [dragStart, setDragStart] = useState({ y: 0, scrollTop: 0 });

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
        [
            findScrollableElement,
            clearHideTimer,
            setScrollbarVisible,
            maintainFocus,
        ]
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
                Math.min(scrollableHeight, dragStart.scrollTop + scrollDelta)
            );

            actualScrollContainer.scrollTop = newScrollTop;
            updateScrollbar();
        },
        [
            isDragging,
            dragStart,
            thumbHeight,
            findScrollableElement,
            updateScrollbar,
        ]
    );

    // 썸 드래그 종료
    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
        if (isScrollable()) {
            setHideTimer(hideDelay);
        }
    }, [isScrollable, setHideTimer, hideDelay]);

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

    return {
        isDragging,
        isThumbHovered,
        setIsThumbHovered,
        handleThumbMouseDown,
    };
};
