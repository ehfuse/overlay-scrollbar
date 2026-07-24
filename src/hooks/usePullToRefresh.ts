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
    const nativeBounceRef = useRef(false); // 당김 확정 시점에 이미 네이티브 러버밴드(iOS)가 시작된 상태
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
            // 이전 제스처의 잔존 상태를 무조건 초기화한다(v1.7.5 수정). 터치했던 요소가
            // 제스처 도중 언마운트되거나(실시간 리렌더 등) touchend/touchcancel 이 유실되면
            // (WebView 제스처 아레나가 터치를 가로챌 때·중첩 스크롤러 환경에서 흔함) touch
            // 이벤트가 분리된 원래 타깃에 고정되어 touchend 가 컨테이너까지 버블링되지 않는다 —
            // 리셋 없이는 추적/당김 플래그가 남아 다음 제스처의 touchmove 가 전부 preventDefault
            // 되어 스크롤이 계속 막히고, 잔존 시작좌표 기준 거리로 오작동 새로고침까지 났다.
            trackingRef.current = false;
            pullingRef.current = false;
            nativeBounceRef.current = false;

            if (refreshingRef.current) return;
            if (e.touches.length !== 1) return;
            // 정확히 맨 위(scrollTop === 0)에서 시작한 터치만 추적한다.
            // scrollTop > 0 은 일반 스크롤이고, scrollTop < 0 은 iOS 러버밴드가
            // 진행 중이라는 뜻 — 바운스 중 touchmove 를 preventDefault 하면 WebKit
            // 스크롤러가 영구히 멈추는(이후 모든 터치 무시) 프리즈가 발생한다.
            if (container.scrollTop !== 0) return;
            if (!isTouchPathAtTop(e.target)) return;
            trackingRef.current = true;
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
                    // 확정 시점에 이미 네이티브 러버밴드가 시작됐으면(iOS: 당기는 동안
                    // scrollTop 이 음수로 내려간다) preventDefault 모드로 들어가지 않는다.
                    // 진행 중인 바운스를 도중에 취소하면 WebKit 스크롤러가 프리즈된다.
                    // 대신 네이티브 바운스를 그대로 두고 거리만 추적해, 놓을 때 임계를
                    // 넘었으면 새로고침한다(인디케이터도 동일하게 표시).
                    nativeBounceRef.current = container.scrollTop < 0;
                } else {
                    return;
                }
            }

            // 당김 확정 구간 — 네이티브 스크롤/오버스크롤을 막고 거리(감쇠 0.5)를 갱신한다.
            // (네이티브 바운스 모드에서는 취소하지 않는다 — 위 프리즈 방지)
            if (!nativeBounceRef.current && e.cancelable) e.preventDefault();
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
            nativeBounceRef.current = false;

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
