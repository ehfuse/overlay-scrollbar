/**
 * useDragScroll.ts
 * 드래그 스크롤 관련 로직
 *
 * @copyright 2025 KIM YOUNG JIN (ehfuse@gmail.com)
 */

import { useState, useCallback, useEffect } from "react";
import { DragScrollConfig } from "../types";
import { isTextInputElement } from "../utils/dragScrollUtils";

interface UseDragScrollProps {
    dragScroll: DragScrollConfig;
    findScrollableElement: () => HTMLElement | null;
    clearHideTimer: () => void;
    setScrollbarVisible: (visible: boolean) => void;
    updateScrollbar: () => void;
    setHideTimer: (delay: number) => void;
    hideDelay: number;
    isScrollable: () => boolean;
}

export const useDragScroll = ({
    dragScroll,
    findScrollableElement,
    clearHideTimer,
    setScrollbarVisible,
    updateScrollbar,
    setHideTimer,
    hideDelay,
    isScrollable,
}: UseDragScrollProps) => {
    const [isDragScrolling, setIsDragScrolling] = useState(false);
    const [isDragStarted, setIsDragStarted] = useState(false); // 드래그가 실제로 시작되었는지 추적
    const [dragScrollStart, setDragScrollStart] = useState({
        x: 0,
        y: 0,
        scrollTop: 0,
        scrollLeft: 0,
    });

    const enabled = dragScroll.enabled ?? true;
    const dragThreshold = 5; // 드래그로 인식하기 위한 최소 이동 거리 (픽셀)

    // 드래그 스크롤 시작
    const handleDragScrollStart = useCallback(
        (event: React.MouseEvent) => {
            // 드래그 스크롤이 비활성화된 경우
            if (!enabled) return;

            // 텍스트 입력 요소나 제외 대상이면 드래그 스크롤 하지 않음
            const target = event.target as Element;
            if (isTextInputElement(target, dragScroll)) {
                return;
            }

            // 오른쪽 클릭이나 휠 클릭은 제외
            if (event.button !== 0) return;

            const scrollableElement = findScrollableElement();
            if (!scrollableElement) return;

            // 스크롤 가능한 영역이 아니면 제외
            if (
                scrollableElement.scrollHeight <= scrollableElement.clientHeight
            )
                return;

            event.preventDefault();
            setIsDragScrolling(true);
            setIsDragStarted(false); // 아직 드래그가 시작되지 않음
            setDragScrollStart({
                x: event.clientX,
                y: event.clientY,
                scrollTop: scrollableElement.scrollTop,
                scrollLeft: scrollableElement.scrollLeft || 0,
            });

            // 스크롤바는 실제로 드래그가 시작될 때 표시 (handleDragScrollMove에서)
        },
        [
            enabled,
            dragScroll,
            findScrollableElement,
            clearHideTimer,
            setScrollbarVisible,
        ]
    );

    // 드래그 스크롤 중
    const handleDragScrollMove = useCallback(
        (event: MouseEvent) => {
            if (!isDragScrolling) return;

            const scrollableElement = findScrollableElement();
            if (!scrollableElement) return;

            const deltaX = dragScrollStart.x - event.clientX;
            const deltaY = dragScrollStart.y - event.clientY;

            // 드래그 거리 체크 - 임계값 이상 움직였을 때만 드래그로 인식
            if (!isDragStarted) {
                const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                if (distance >= dragThreshold) {
                    setIsDragStarted(true);
                    // 이제 진짜 드래그가 시작되었으므로 스크롤바 표시
                    clearHideTimer();
                    setScrollbarVisible(true);
                } else {
                    // 아직 임계값에 도달하지 않음
                    return;
                }
            }

            // 세로 스크롤만 처리 (가로 스크롤은 필요시 나중에 추가)
            const newScrollTop = Math.max(
                0,
                Math.min(
                    scrollableElement.scrollHeight -
                        scrollableElement.clientHeight,
                    dragScrollStart.scrollTop + deltaY
                )
            );

            scrollableElement.scrollTop = newScrollTop;
            updateScrollbar();
        },
        [
            isDragScrolling,
            isDragStarted,
            dragScrollStart,
            dragThreshold,
            findScrollableElement,
            updateScrollbar,
            clearHideTimer,
            setScrollbarVisible,
        ]
    );

    // 드래그 스크롤 종료
    const handleDragScrollEnd = useCallback(() => {
        setIsDragScrolling(false);
        setIsDragStarted(false); // 드래그 상태 초기화
        if (isScrollable()) {
            setHideTimer(hideDelay);
        }
    }, [isScrollable, setHideTimer, hideDelay]);

    // 전역 마우스 이벤트 리스너
    useEffect(() => {
        if (isDragScrolling) {
            document.addEventListener("mousemove", handleDragScrollMove);
            document.addEventListener("mouseup", handleDragScrollEnd);
            return () => {
                document.removeEventListener("mousemove", handleDragScrollMove);
                document.removeEventListener("mouseup", handleDragScrollEnd);
            };
        }
    }, [isDragScrolling, handleDragScrollMove, handleDragScrollEnd]);

    return {
        isDragScrolling,
        handleDragScrollStart,
    };
};
