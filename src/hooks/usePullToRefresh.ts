/**
 * usePullToRefresh.ts
 * 당겨서 새로고침(pull-to-refresh) 로직
 *
 * 스크롤 컨테이너가 맨 위(scrollTop <= 0)에 있을 때 아래로 당기는 터치 제스처를 감지해,
 * 임계 거리 이상 당긴 상태에서 손을 떼면 onRefresh 콜백을 실행한다.
 *
 * @copyright 2025 KIM YOUNG JIN (ehfuse@gmail.com)
 */

import { useEffect, useRef, useState, RefObject } from "react";
import { PullToRefreshConfig } from "../types";

interface UsePullToRefreshProps {
    containerRef: RefObject<HTMLDivElement | null>; // 스크롤 컨테이너 ref
    config: PullToRefreshConfig; // 당겨서 새로고침 설정
}

interface UsePullToRefreshResult {
    pullDistance: number; // 현재 당김 거리(px, 감쇠 적용 후) — 인디케이터 위치용
    isRefreshing: boolean; // onRefresh 실행 중 여부 — 스피너 표시용
    pullProgress: number; // 임계 거리 대비 진행률(0~1) — 인디케이터 회전/색상용
    pullThreshold: number; // 최종 임계 거리(px)
}

/** 당겨서 새로고침 제스처를 감지하고 상태를 반환한다. */
export const usePullToRefresh = ({
    containerRef,
    config,
}: UsePullToRefreshProps): UsePullToRefreshResult => {
    // 설정 기본값
    const enabled = config.enabled ?? true; // 기본 활성 (onRefresh 가 없으면 동작 안 함)
    const threshold = config.threshold ?? 80; // 놓았을 때 새로고침이 실행되는 임계 당김 거리
    const maxDistance = config.maxDistance ?? threshold * 2; // 인디케이터가 따라오는 최대 거리
    const onRefresh = config.onRefresh;

    const [pullDistance, setPullDistance] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // 터치 추적 상태 (렌더와 무관하므로 ref 로 관리)
    const startYRef = useRef(0);
    const startXRef = useRef(0);
    const trackingRef = useRef(false); // 맨 위에서 시작된 터치 추적 중
    const pullingRef = useRef(false); // 하향 당김으로 확정됨(스크롤 대신 인디케이터 동작)
    const pullDistanceRef = useRef(0); // touchend 에서 최신 거리 참조용
    const refreshingRef = useRef(false); // 리스너 안에서 최신 새로고침 상태 참조용

    useEffect(() => {
        refreshingRef.current = isRefreshing;
    }, [isRefreshing]);

    useEffect(() => {
        const container = containerRef.current;
        const active = enabled && typeof onRefresh === "function";
        if (!container || !active) return;

        /** 터치 지점부터 컨테이너까지의 스크롤 가능한 조상들이 전부 맨 위인지 확인한다.
         *  (내부 목록 스크롤러가 스크롤된 상태에서 당김이 오발동하지 않게 한다) */
        const isTouchPathAtTop = (target: EventTarget | null): boolean => {
            let el = target instanceof Element ? target : null;
            while (el && el !== container) {
                if (
                    el instanceof HTMLElement &&
                    el.scrollHeight > el.clientHeight + 1 &&
                    el.scrollTop > 0
                ) {
                    return false;
                }
                el = el.parentElement;
            }
            return true;
        };

        /** 터치 시작 — 맨 위에서 시작된 단일 터치만 추적 후보로 삼는다. */
        const handleTouchStart = (e: TouchEvent) => {
            if (refreshingRef.current) return;
            if (e.touches.length !== 1) return;
            // 컨테이너 또는 터치 경로의 내부 스크롤러가 맨 위가 아니면 일반 스크롤 — 추적하지 않는다.
            if (container.scrollTop > 0) return;
            if (!isTouchPathAtTop(e.target)) return;
            trackingRef.current = true;
            pullingRef.current = false;
            startYRef.current = e.touches[0].clientY;
            startXRef.current = e.touches[0].clientX;
        };

        /** 터치 이동 — 하향 우세 당김이 확정되면 스크롤을 막고 인디케이터를 따라 내린다. */
        const handleTouchMove = (e: TouchEvent) => {
            if (!trackingRef.current || refreshingRef.current) return;
            if (e.touches.length !== 1) return;

            const dy = e.touches[0].clientY - startYRef.current;
            const dx = e.touches[0].clientX - startXRef.current;

            if (!pullingRef.current) {
                // 아직 미확정 — 위로 스크롤했거나 수평 제스처면 추적 종료
                if (dy <= 0 || container.scrollTop > 0) {
                    trackingRef.current = false;
                    return;
                }
                // 수직 우세(대각선 스와이프 오발동 방지) + 최소 이동량을 넘으면 당김 확정
                if (dy > 8 && dy > Math.abs(dx)) {
                    pullingRef.current = true;
                } else {
                    return;
                }
            }

            // 당김 확정 구간 — 네이티브 스크롤/오버스크롤을 막고 거리(감쇠 0.5)를 갱신한다.
            if (e.cancelable) e.preventDefault();
            const distance = Math.min(Math.max(dy, 0) * 0.5, maxDistance);
            pullDistanceRef.current = distance;
            setPullDistance(distance);
        };

        /** 터치 종료 — 임계 거리 이상이면 onRefresh 실행, 아니면 원위치. */
        const handleTouchEnd = () => {
            if (!trackingRef.current) return;
            trackingRef.current = false;

            if (!pullingRef.current) return;
            pullingRef.current = false;

            const distance = pullDistanceRef.current;
            pullDistanceRef.current = 0;

            if (distance >= threshold && !refreshingRef.current) {
                // 새로고침 실행 — 완료(Promise 해소)까지 스피너를 임계 위치에 유지한다.
                setIsRefreshing(true);
                setPullDistance(threshold);
                Promise.resolve()
                    .then(() => onRefresh())
                    .catch(() => undefined)
                    .finally(() => {
                        setIsRefreshing(false);
                        setPullDistance(0);
                    });
            } else {
                setPullDistance(0);
            }
        };

        // preventDefault 를 쓰므로 touchmove 는 passive: false 로 등록해야 한다.
        container.addEventListener("touchstart", handleTouchStart, {
            passive: true,
        });
        container.addEventListener("touchmove", handleTouchMove, {
            passive: false,
        });
        container.addEventListener("touchend", handleTouchEnd, {
            passive: true,
        });
        container.addEventListener("touchcancel", handleTouchEnd, {
            passive: true,
        });

        return () => {
            container.removeEventListener("touchstart", handleTouchStart);
            container.removeEventListener("touchmove", handleTouchMove);
            container.removeEventListener("touchend", handleTouchEnd);
            container.removeEventListener("touchcancel", handleTouchEnd);
        };
    }, [containerRef, enabled, onRefresh, threshold, maxDistance]);

    return {
        pullDistance,
        isRefreshing,
        pullProgress: Math.min(pullDistance / threshold, 1),
        pullThreshold: threshold,
    };
};
