/**
 * useScrollbarConfig.ts
 * 스크롤바 설정 계산 로직
 *
 * @copyright 2025 KIM YOUNG JIN (ehfuse@gmail.com)
 */

import { useMemo } from "react";
import {
    ThumbConfig,
    TrackConfig,
    ArrowsConfig,
    DragScrollConfig,
    AutoHideConfig,
} from "../types";

interface UseScrollbarConfigProps {
    thumb: ThumbConfig;
    track: TrackConfig;
    arrows: ArrowsConfig;
    dragScroll: DragScrollConfig;
    autoHide: AutoHideConfig;
}

export const useScrollbarConfig = ({
    thumb,
    track,
    arrows,
    dragScroll,
    autoHide,
}: UseScrollbarConfigProps) => {
    // Thumb 설정
    const finalThumbConfig = useMemo(() => {
        const baseColor = thumb.color ?? "#606060";
        return {
            width: thumb.width ?? 8,
            minHeight: thumb.minHeight ?? 50,
            radius: thumb.radius ?? (thumb.width ?? 8) / 2,
            color: baseColor,
            opacity: thumb.opacity ?? 0.6,
            hoverColor: thumb.hoverColor ?? baseColor,
            hoverOpacity: thumb.hoverOpacity ?? 1.0,
        };
    }, [thumb]);

    // Track 설정
    const finalTrackConfig = useMemo(
        () => ({
            width: track.width ?? 16,
            color: track.color ?? "rgba(128, 128, 128, 0.1)",
            visible: track.visible ?? true,
            alignment: track.alignment ?? "center",
            radius: track.radius ?? finalThumbConfig.radius ?? 4,
            margin: track.margin ?? 4,
        }),
        [track, finalThumbConfig.radius]
    );

    // Arrows 설정
    const finalArrowsConfig = useMemo(() => {
        const baseColor = arrows.color ?? "#808080";
        return {
            visible: arrows.visible ?? false,
            step: arrows.step ?? 50,
            color: baseColor,
            opacity: arrows.opacity ?? 0.6,
            hoverColor: arrows.hoverColor ?? baseColor,
            hoverOpacity: arrows.hoverOpacity ?? 1.0,
        };
    }, [arrows]);

    // DragScroll 설정
    const finalDragScrollConfig = useMemo(
        () => ({
            enabled: dragScroll.enabled ?? true,
            excludeClasses: dragScroll.excludeClasses ?? [],
            excludeSelectors: dragScroll.excludeSelectors ?? [],
        }),
        [dragScroll]
    );

    // AutoHide 설정
    const finalAutoHideConfig = useMemo(
        () => ({
            enabled: autoHide.enabled ?? true,
            delay: autoHide.delay ?? 1500,
            delayOnWheel: autoHide.delayOnWheel ?? 700,
        }),
        [autoHide]
    );

    return {
        finalThumbConfig,
        finalTrackConfig,
        finalArrowsConfig,
        finalDragScrollConfig,
        finalAutoHideConfig,
    };
};
