/**
 * useAutoHide.ts
 * 스크롤바 자동 숨김 관련 로직
 *
 * @copyright 2025 KIM YOUNG JIN (ehfuse@gmail.com)
 */

import { useRef, useCallback } from "react";
import { AutoHideConfig } from "../types";

interface UseAutoHideProps {
    autoHide: AutoHideConfig;
    isScrollable: () => boolean;
    setScrollbarVisible: (visible: boolean) => void;
}

export const useAutoHide = ({
    autoHide,
    isScrollable,
    setScrollbarVisible,
}: UseAutoHideProps) => {
    const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
            if (!autoHide.enabled) return;

            clearHideTimer();
            hideTimeoutRef.current = setTimeout(() => {
                setScrollbarVisible(false);
                hideTimeoutRef.current = null;
            }, delay);
        },
        [autoHide.enabled, clearHideTimer, setScrollbarVisible]
    );

    return {
        clearHideTimer,
        setHideTimer,
        hideTimeoutRef,
    };
};
