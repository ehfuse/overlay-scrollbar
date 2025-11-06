/**
 * useScrollbarInitialization.ts
 * 스크롤바 초기화 관련 로직 (ResizeObserver, MutationObserver, CSS 주입 등)
 *
 * @copyright 2025 KIM YOUNG JIN (ehfuse@gmail.com)
 */

import { useEffect, useLayoutEffect, useState } from "react";
import { AutoHideConfig } from "../types";

interface UseScrollbarInitializationProps {
    containerRef: React.RefObject<HTMLDivElement>;
    contentRef: React.RefObject<HTMLDivElement>;
    cachedScrollContainerRef: React.MutableRefObject<HTMLElement | null>;
    updateScrollbar: () => void;
    setScrollbarVisible: (visible: boolean) => void;
    isScrollable: () => boolean;
    autoHide: AutoHideConfig;
}

export const useScrollbarInitialization = ({
    containerRef,
    contentRef,
    cachedScrollContainerRef,
    updateScrollbar,
    setScrollbarVisible,
    isScrollable,
    autoHide,
}: UseScrollbarInitializationProps) => {
    const [isInitialized, setIsInitialized] = useState(false);

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
        // 자동 숨김이 비활성화되어 있으면 스크롤바를 항상 표시
        if (!autoHide.enabled && isScrollable()) {
            setScrollbarVisible(true);
        }
    }, [isScrollable, updateScrollbar, autoHide.enabled, setScrollbarVisible]);

    // ResizeObserver로 크기 변경 감지
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
    }, [updateScrollbar, containerRef, contentRef, cachedScrollContainerRef]);

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
    }, [updateScrollbar, containerRef, cachedScrollContainerRef]);

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
            .overlay-scrollbar-container:focus {
                outline: 2px solid rgba(0, 123, 255, 0.3);
                outline-offset: -2px;
            }
            .overlay-scrollbar-container:focus-visible {
                outline: 2px solid rgba(0, 123, 255, 0.5);
                outline-offset: -2px;
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

    return {
        isInitialized,
    };
};
