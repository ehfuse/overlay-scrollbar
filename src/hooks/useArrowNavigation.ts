/**
 * useArrowNavigation.ts
 * 화살표 네비게이션 관련 로직
 *
 * @copyright 2025 KIM YOUNG JIN (ehfuse@gmail.com)
 */

import { useState, useCallback } from "react";
import { ArrowsConfig } from "../types";

interface UseArrowNavigationProps {
    arrows: ArrowsConfig;
    containerRef: React.RefObject<HTMLDivElement>;
    contentRef: React.RefObject<HTMLDivElement>;
    updateScrollbar: () => void;
    setScrollbarVisible: (visible: boolean) => void;
    setHideTimer: (delay: number) => void;
    hideDelay: number;
    maintainFocus: () => void;
}

export const useArrowNavigation = ({
    arrows,
    containerRef,
    contentRef,
    updateScrollbar,
    setScrollbarVisible,
    setHideTimer,
    hideDelay,
    maintainFocus,
}: UseArrowNavigationProps) => {
    const [activeArrow, setActiveArrow] = useState<"up" | "down" | null>(null);
    const [hoveredArrow, setHoveredArrow] = useState<"up" | "down" | null>(
        null
    );

    const arrowStep = arrows.step ?? 50;

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

            // 포커스 유지 (키보드 입력이 계속 작동하도록)
            maintainFocus();
        },
        [
            containerRef,
            updateScrollbar,
            setHideTimer,
            arrowStep,
            hideDelay,
            maintainFocus,
            setScrollbarVisible,
        ]
    );

    // 아래쪽 화살표 클릭 핸들러
    const handleDownArrowClick = useCallback(
        (event: React.MouseEvent) => {
            event.preventDefault();
            event.stopPropagation();

            if (!containerRef.current || !contentRef.current) return;

            const container = containerRef.current;
            const content = contentRef.current;
            const maxScrollTop = content.scrollHeight - container.clientHeight;
            const newScrollTop = Math.min(
                maxScrollTop,
                container.scrollTop + arrowStep
            );

            container.scrollTop = newScrollTop;
            updateScrollbar();

            setScrollbarVisible(true);
            setHideTimer(hideDelay);

            // 포커스 유지 (키보드 입력이 계속 작동하도록)
            maintainFocus();
        },
        [
            containerRef,
            contentRef,
            updateScrollbar,
            setHideTimer,
            arrowStep,
            hideDelay,
            maintainFocus,
            setScrollbarVisible,
        ]
    );

    return {
        activeArrow,
        setActiveArrow,
        hoveredArrow,
        setHoveredArrow,
        handleUpArrowClick,
        handleDownArrowClick,
    };
};
