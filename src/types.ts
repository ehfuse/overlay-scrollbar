/**
 * types.ts
 *
 * @copyright 2025 KIM YOUNG JIN (ehfuse@gmail.com)
 */

import { ReactNode } from "react";

// thumb 관련 설정
export interface ThumbConfig {
    width?: number; // 썸의 너비 (기본값: 8px)
    minHeight?: number; // 썸의 최소 높이 (기본값: 50px)
    radius?: number; // 썸의 border-radius (기본값: width / 2)
    color?: string; // 썸 색상 (기본값: "#606060")
    opacity?: number; // 기본 투명도 (기본값: 0.6)
    hoverColor?: string; // 호버 시 색상 (기본값: color 동일)
    hoverOpacity?: number; // 호버 시 투명도 (기본값: 1.0)
}

// track 관련 설정
export interface TrackConfig {
    width?: number; // 호버 영역인 트랙의 너비 (기본값: 16px)
    color?: string; // 트랙 배경 색상 (기본값: "rgba(128, 128, 128, 0.1)")
    visible?: boolean; // 트랙 배경 표시 여부 (기본값: true)
    alignment?: "center" | "outside"; // 트랙 정렬 (기본값: "center", "outside"는 오른쪽/아래 끝에 붙음)
    radius?: number; // 트랙 배경의 border-radius (기본값: thumb.radius 또는 4px)
    margin?: number; // 트랙 상하 마진 (기본값: 4px)
}

// arrows 관련 설정
export interface ArrowsConfig {
    visible?: boolean; // 화살표 표시 여부 (기본값: false)
    step?: number; // 화살표 클릭시 스크롤 이동 거리 (기본값: 50px)
    color?: string; // 화살표 색상 (기본값: "#808080")
    opacity?: number; // 기본 투명도 (기본값: 0.6)
    hoverColor?: string; // 호버 시 색상 (기본값: color 동일)
    hoverOpacity?: number; // 호버 시 투명도 (기본값: 1.0)
}

// 드래그 스크롤 관련 설정
export interface DragScrollConfig {
    enabled?: boolean; // 드래그 스크롤 활성화 여부 (기본값: true)
    excludeClasses?: string[]; // 드래그 스크롤을 제외할 추가 클래스들 (자신 또는 부모 요소 확인, 최대 5단계)
    excludeSelectors?: string[]; // 드래그 스크롤을 제외할 추가 CSS 셀렉터들 (element.matches() 사용)
}

// 자동 숨김 관련 설정
export interface AutoHideConfig {
    enabled?: boolean; // 자동 숨김 활성화 여부 (기본값: true)
    delay?: number; // 기본 자동 숨김 시간 (기본값: 1500ms)
    delayOnWheel?: number; // 휠 스크롤 후 자동 숨김 시간 (기본값: 700ms)
    initialDelay?: number; // 마운트 후 스크롤바 표시 지연 시간 (기본값: 200ms, 0보다 크면 초기 스크롤 시 스크롤바 숨김)
}

export interface OverlayScrollbarProps {
    className?: string;
    style?: React.CSSProperties; // wrapper div에 적용할 스타일
    containerStyle?: React.CSSProperties; // 스크롤 컨테이너 div에 적용할 스타일
    contentStyle?: React.CSSProperties; // 내부 content div에 적용할 스타일
    children: ReactNode;
    onScroll?: (event: Event) => void;

    // 그룹화된 설정 객체들
    thumb?: ThumbConfig; // 썸 관련 설정
    track?: TrackConfig; // 트랙 관련 설정
    arrows?: ArrowsConfig; // 화살표들 관련 설정
    dragScroll?: DragScrollConfig; // 드래그 스크롤 관련 설정
    autoHide?: AutoHideConfig; // 자동 숨김 관련 설정

    // 기타 설정들
    showScrollbar?: boolean; // 스크롤바 표시 여부 (기본값: true)
    detectInnerScroll?: boolean; // children 내부의 스크롤 요소 감지 여부 (기본값: false, 가상 테이블 등에 사용)
}

// OverlayScrollbar가 노출할 메서드들
export interface OverlayScrollbarRef {
    getScrollContainer: () => HTMLDivElement | null;
    scrollTo: (options: ScrollToOptions) => void;
    scrollTop: number;
    scrollHeight: number;
    clientHeight: number;
}

// 기본 설정 객체들을 상수로 선언 (재렌더링 시 동일한 참조 유지)
export const DEFAULT_THUMB_CONFIG: ThumbConfig = {};
export const DEFAULT_TRACK_CONFIG: TrackConfig = {};
export const DEFAULT_ARROWS_CONFIG: ArrowsConfig = {};
export const DEFAULT_DRAG_SCROLL_CONFIG: DragScrollConfig = {};
export const DEFAULT_AUTO_HIDE_CONFIG: AutoHideConfig = {};
