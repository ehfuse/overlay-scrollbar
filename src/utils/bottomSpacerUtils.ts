import type React from "react";

/**
 * 스크롤 컨테이너의 `padding-bottom` 은 내용이 넘칠 때 브라우저가 스크롤 가능 영역(scrollHeight)에
 * 포함시키지 않는다. `padding-top` 은 반영되지만 bottom 만 무시되는 블록/플렉스 오버플로 동작이라,
 * 사용자가 `containerStyle`/`contentStyle` 에 `paddingBottom` 을 줘도 스크롤 끝에서 여백이 사라진다.
 *
 * 그래서 이 컴포넌트는 지정된 하단 padding 을 스타일에서 걷어내고, 같은 높이의 spacer 엘리먼트를
 * content 맨 끝에 렌더해 동일한 여백을 실제 레이아웃 높이로 만들어 준다.
 */

/** CSS 길이 값을 px 숫자로 바꾼다. px/숫자만 지원하고 그 외 단위(%, em 등)는 null 을 반환한다. */
export const toPixelLength = (
    value: string | number | undefined,
): number | null => {
    if (value === undefined || value === null) return null;
    if (typeof value === "number") return Number.isFinite(value) ? value : null;

    const trimmed = value.trim();
    if (trimmed === "") return null;

    // 숫자만 있거나 px 단위인 경우만 안전하게 변환한다.
    const match = /^(-?\d*\.?\d+)(px)?$/.exec(trimmed);
    if (!match) return null;

    const parsed = Number.parseFloat(match[1]);
    return Number.isFinite(parsed) ? parsed : null;
};

/** 축약형 `padding` 문자열에서 bottom 값을 추출한다(1~4개 값 규칙). */
const readShorthandPaddingBottom = (
    padding: string | number | undefined,
): string | number | undefined => {
    if (padding === undefined || padding === null) return undefined;
    // 숫자 축약형은 네 방향이 같은 값이다.
    if (typeof padding === "number") return padding;

    const parts = padding.trim().split(/\s+/);
    if (parts.length === 0 || parts[0] === "") return undefined;
    // padding: a | a b | a b c | a b c d → bottom 은 각각 a | a | c | c
    if (parts.length === 1) return parts[0];
    if (parts.length === 2) return parts[0];
    return parts[2];
};

/** 축약형 `padding` 문자열에서 bottom 만 0 으로 바꾼다. */
const withShorthandPaddingBottomRemoved = (
    padding: string | number,
): string => {
    const parts =
        typeof padding === "number"
            ? [`${padding}px`]
            : padding.trim().split(/\s+/);

    // 각 축약형을 4값 형태로 펼친 뒤 bottom 만 0 으로 만든다.
    const [top, right = top, bottom = top, left = right] = parts;
    void bottom;
    return `${top} ${right} 0 ${left}`;
};

/** paddingBottom 을 걷어낸 스타일과, spacer 로 옮길 높이(px)를 함께 반환한다. */
export interface ExtractedBottomPadding {
    style: React.CSSProperties | undefined; // 하단 padding 을 제거한 스타일
    spacerHeight: number; // spacer 로 만들어야 할 높이(px, 0 이면 불필요)
}

/**
 * 스타일에서 하단 padding 을 분리한다.
 * px 로 환산 가능한 값만 spacer 로 옮기고, %/em 같이 환산 불가한 값은 원래 스타일에 그대로 둔다.
 */
export const extractBottomPadding = (
    style: React.CSSProperties | undefined,
): ExtractedBottomPadding => {
    if (!style) return { style, spacerHeight: 0 };

    const hasLonghand = style.paddingBottom !== undefined;
    const hasShorthand = style.padding !== undefined;
    if (!hasLonghand && !hasShorthand) return { style, spacerHeight: 0 };

    // longhand(paddingBottom)가 축약형(padding)보다 우선한다.
    const rawBottom = hasLonghand
        ? style.paddingBottom
        : readShorthandPaddingBottom(style.padding);

    const pixels = toPixelLength(rawBottom as string | number | undefined);
    // 환산 불가하거나 0 이하면 건드리지 않는다(사용자 의도 보존).
    if (pixels === null || pixels <= 0) return { style, spacerHeight: 0 };

    const nextStyle: React.CSSProperties = { ...style };
    if (hasShorthand && style.padding !== undefined) {
        nextStyle.padding = withShorthandPaddingBottomRemoved(
            style.padding as string | number,
        );
    }
    if (hasLonghand) {
        nextStyle.paddingBottom = 0;
    }

    return { style: nextStyle, spacerHeight: pixels };
};
