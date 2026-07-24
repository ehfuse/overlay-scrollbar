/**
 * useCoarsePointer.ts
 * 주 입력장치가 터치(coarse pointer)인지 감지하는 훅.
 *
 * 터치 우선 기기(모바일/태블릿)에서는 커스텀 스크롤바 트랙/thumb·드래그 스크롤이 불필요하고
 * 오히려 네이티브 스크롤·PTR 제스처와 충돌할 수 있어, 이 값으로 커스텀 UI 를 끄는 판단에 쓴다.
 * `pointer: coarse` 미디어쿼리 기준(마우스=fine 는 false). SSR 등 matchMedia 미지원 환경은 false.
 *
 * @copyright 2025 KIM YOUNG JIN (ehfuse@gmail.com)
 */

import { useEffect, useState } from "react";

/** 주 입력장치가 터치(coarse pointer)면 true 를 반환한다. */
export function useCoarsePointer(): boolean {
    const [coarse, setCoarse] = useState<boolean>(() => {
        if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
            return false;
        }
        return window.matchMedia("(pointer: coarse)").matches;
    });

    useEffect(() => {
        if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
            return;
        }
        const mql = window.matchMedia("(pointer: coarse)");
        /** 미디어쿼리 매치 변화를 상태에 반영한다. */
        const handleChange = (event: MediaQueryListEvent) => setCoarse(event.matches);
        // 초기값 동기화(마운트 시점의 실제 값으로 보정).
        setCoarse(mql.matches);
        // 구형 사파리 호환: addEventListener 가 없으면 addListener 로 폴백.
        if (typeof mql.addEventListener === "function") {
            mql.addEventListener("change", handleChange);
            return () => mql.removeEventListener("change", handleChange);
        }
        mql.addListener(handleChange);
        return () => mql.removeListener(handleChange);
    }, []);

    return coarse;
}
