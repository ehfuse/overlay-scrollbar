/**
 * useScrollbarUpdate.ts
 * 스크롤바 업데이트 관련 로직
 *
 * @copyright 2025 KIM YOUNG JIN (ehfuse@gmail.com)
 */

import { useState, useCallback, useEffect } from "react";
import {
    ThumbConfig,
    TrackConfig,
    ArrowsConfig,
    AutoHideConfig,
} from "../types";

interface UseScrollbarUpdateProps {
    wrapperRef: React.RefObject<HTMLDivElement>;
    scrollbarRef: React.RefObject<HTMLDivElement>;
    contentRef: React.RefObject<HTMLDivElement>;
    findScrollableElement: () => HTMLElement | null;
    clearHideTimer: () => void;
    setScrollbarVisible: (visible: boolean) => void;
    thumb: ThumbConfig;
    track: TrackConfig;
    arrows: ArrowsConfig;
    autoHide: AutoHideConfig;
}

export const useScrollbarUpdate = ({
    wrapperRef,
    scrollbarRef,
    contentRef,
    findScrollableElement,
    clearHideTimer,
    setScrollbarVisible,
    thumb,
    track,
    arrows,
    autoHide,
}: UseScrollbarUpdateProps) => {
    const [thumbHeight, setThumbHeight] = useState(0);
    const [thumbTop, setThumbTop] = useState(0);
    const [hasScrollableContent, setHasScrollableContent] = useState(false);

    const thumbMinHeight = thumb.minHeight ?? 50;
    const finalThumbWidth = thumb.width ?? 8;
    const showArrows = arrows.visible ?? false;
    const finalTrackMargin = track.margin ?? 4;
    const autoHideEnabled = autoHide.enabled ?? true;

    // 스크롤바 위치 및 크기 업데이트
    const updateScrollbar = useCallback(() => {
        const scrollableElement = findScrollableElement();
        if (!scrollableElement) {
            // 스크롤 불가능하면 숨김
            setScrollbarVisible(false);
            setHasScrollableContent(false);
            clearHideTimer();
            return;
        }

        // 스크롤 가능한 콘텐츠가 있음을 표시
        setHasScrollableContent(true);

        if (!scrollbarRef.current) return;

        // 자동 숨김이 비활성화되어 있으면 스크롤바를 항상 표시
        if (!autoHideEnabled) {
            setScrollbarVisible(true);
            clearHideTimer();
        }

        const containerHeight = scrollableElement.clientHeight;
        const contentHeight = scrollableElement.scrollHeight;
        const scrollTop = scrollableElement.scrollTop;

        // wrapper의 패딩 계산 (상하 패딩만 필요)
        let wrapperPaddingTopBottom = 0;
        if (wrapperRef.current) {
            const computedStyle = window.getComputedStyle(wrapperRef.current);
            const paddingTop = parseFloat(computedStyle.paddingTop) || 0;
            const paddingBottom = parseFloat(computedStyle.paddingBottom) || 0;
            wrapperPaddingTopBottom = paddingTop + paddingBottom;
        }

        // 화살표와 간격 공간 계산 (화살표 + 위아래 마진, 화살표 없어도 위아래 마진)
        const arrowSpace = showArrows
            ? finalThumbWidth * 2 + finalTrackMargin * 4
            : finalTrackMargin * 2;

        // 썸 높이 계산 (사용자 설정 최소 높이 사용, 화살표 공간 제외, wrapper 패딩 추가)
        const availableHeight =
            containerHeight - arrowSpace + wrapperPaddingTopBottom;
        const scrollRatio = containerHeight / contentHeight;
        const calculatedThumbHeight = Math.max(
            availableHeight * scrollRatio,
            thumbMinHeight
        );

        // 썸 위치 계산 (화살표와 간격 공간 제외)
        const scrollableHeight = contentHeight - containerHeight;
        const thumbScrollableHeight = availableHeight - calculatedThumbHeight;
        const calculatedThumbTop =
            scrollableHeight > 0
                ? (scrollTop / scrollableHeight) * thumbScrollableHeight
                : 0;

        setThumbHeight(calculatedThumbHeight);
        setThumbTop(calculatedThumbTop);
    }, [
        findScrollableElement,
        clearHideTimer,
        setScrollbarVisible,
        wrapperRef,
        scrollbarRef,
        thumbMinHeight,
        finalThumbWidth,
        showArrows,
        finalTrackMargin,
        autoHideEnabled,
    ]);

    // 초기 스크롤바 업데이트
    useEffect(() => {
        updateScrollbar();
    }, [updateScrollbar]);

    // Resize observer로 크기 변경 감지
    useEffect(() => {
        const scrollableElement = findScrollableElement();
        if (!scrollableElement) return;

        const resizeObserver = new ResizeObserver(() => {
            updateScrollbar();
        });

        resizeObserver.observe(scrollableElement);

        // content의 크기 변경도 감지
        if (contentRef.current) {
            resizeObserver.observe(contentRef.current);
        }

        return () => resizeObserver.disconnect();
    }, [findScrollableElement, contentRef, updateScrollbar]);

    return {
        thumbHeight,
        thumbTop,
        hasScrollableContent,
        updateScrollbar,
    };
};
