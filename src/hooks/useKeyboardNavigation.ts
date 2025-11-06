/**
 * useKeyboardNavigation.ts
 * 키보드 네비게이션 관련 로직 (방향키, PageUp/PageDown/Home/End)
 *
 * @copyright 2025 KIM YOUNG JIN (ehfuse@gmail.com)
 */

import { useEffect } from "react";

interface UseKeyboardNavigationProps {
    containerRef: React.RefObject<HTMLDivElement>;
    findScrollableElement: () => HTMLElement | null;
    updateScrollbar: () => void;
    clearHideTimer: () => void;
    setScrollbarVisible: (visible: boolean) => void;
    setHideTimer: (delay: number) => void;
    hideDelay: number;
}

export const useKeyboardNavigation = ({
    containerRef,
    findScrollableElement,
    updateScrollbar,
    clearHideTimer,
    setScrollbarVisible,
    setHideTimer,
    hideDelay,
}: UseKeyboardNavigationProps) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // 입력 가능한 요소에 포커스가 있으면 키보드 스크롤 비활성화
            const target = event.target as HTMLElement;
            if (
                target.tagName === "INPUT" ||
                target.tagName === "TEXTAREA" ||
                target.tagName === "SELECT" ||
                target.isContentEditable ||
                target.getAttribute("role") === "textbox" ||
                target.classList.contains("MuiInputBase-input") || // Material-UI TextField
                target.closest(".MuiTextField-root") || // Material-UI TextField 컨테이너
                target.closest('[contenteditable="true"]') // contenteditable 요소
            ) {
                return; // 입력 필드에서는 키보드 스크롤을 하지 않음
            }

            const scrollableElement = findScrollableElement();
            if (!scrollableElement) return;

            const { key } = event;
            const { scrollTop, scrollHeight, clientHeight } = scrollableElement;
            const maxScrollTop = scrollHeight - clientHeight;

            // 한 줄 스크롤 단위
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
                        scrollTop + lineScrollStep
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
                        scrollTop + clientHeight
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
                // 스크롤 위치를 즉시 변경
                scrollableElement.scrollTop = newScrollTop;

                // updateScrollbar가 thumbTop을 자동으로 업데이트함
                updateScrollbar();

                // 스크롤바 표시
                clearHideTimer();
                setScrollbarVisible(true);
                setHideTimer(hideDelay);
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
        containerRef,
        findScrollableElement,
        updateScrollbar,
        clearHideTimer,
        setScrollbarVisible,
        setHideTimer,
        hideDelay,
    ]);
};
