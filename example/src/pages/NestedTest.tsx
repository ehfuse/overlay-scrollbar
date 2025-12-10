import { useState } from "react";
import OverlayScrollbar from "@/OverlayScrollbar";

function NestedTest() {
    const [outerCount, setOuterCount] = useState(0);
    const [innerCount, setInnerCount] = useState(0);
    const [showOuterContent, setShowOuterContent] = useState(false);

    // 외부 스크롤바용 긴 콘텐츠 생성
    const generateOuterContent = () => {
        const items = [];
        for (let i = 0; i < 30; i++) {
            items.push(
                <div
                    key={`outer-${i}`}
                    style={{
                        padding: "15px",
                        marginBottom: "10px",
                        backgroundColor: "#ffebee",
                        borderRadius: "4px",
                        border: "1px solid #ffcdd2",
                    }}
                >
                    <h4 style={{ margin: "0 0 5px 0", color: "#c62828" }}>
                        외부 콘텐츠 항목 #{i + 1}
                    </h4>
                    <p style={{ margin: "0", fontSize: "14px", color: "#666" }}>
                        외부 OverlayScrollbar의 스크롤 콘텐츠입니다. 토글
                        버튼으로 스크롤 가능 여부를 테스트할 수 있습니다.
                    </p>
                </div>
            );
        }
        return items;
    };

    // 내부 스크롤바용 긴 콘텐츠 생성
    const generateInnerContent = () => {
        const items = [];
        for (let i = 0; i < 50; i++) {
            items.push(
                <div
                    key={i}
                    style={{
                        padding: "10px",
                        borderBottom: "1px solid #ddd",
                        backgroundColor: i % 2 === 0 ? "#f9f9f9" : "#fff",
                    }}
                >
                    <h4 style={{ margin: "0 0 5px 0", color: "#0066cc" }}>
                        내부 항목 #{i + 1}
                    </h4>
                    <p style={{ margin: "0", fontSize: "14px", color: "#666" }}>
                        이것은 내부 OverlayScrollbar의 스크롤 콘텐츠입니다. 내부
                        스크롤바만 자신의 영역을 제어합니다.
                    </p>
                    {i === 10 && (
                        <button
                            onClick={() => setInnerCount(innerCount + 1)}
                            style={{
                                marginTop: "5px",
                                padding: "5px 10px",
                                backgroundColor: "#0066cc",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                            }}
                        >
                            내부 버튼 클릭: {innerCount}
                        </button>
                    )}
                </div>
            );
        }
        return items;
    };

    return (
        <div
            style={{
                width: "100%",
                height: "90vh",
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#f0f0f0",
            }}
        >
            <div
                style={{
                    padding: "20px",
                    backgroundColor: "#333",
                    color: "white",
                }}
            >
                <h1 style={{ margin: "0 0 10px 0" }}>
                    중첩된 OverlayScrollbar 테스트
                </h1>
                <p style={{ margin: "0", fontSize: "14px", opacity: 0.8 }}>
                    외부 영역에는 스크롤이 없고, 내부 파란색 박스에만 스크롤이
                    있습니다.
                </p>
            </div>

            {/* 외부 OverlayScrollbar - 스크롤 있음 */}
            <div style={{ flex: 1, padding: "20px", overflow: "hidden" }}>
                <div style={{ height: "100%" }}>
                    <OverlayScrollbar
                        thumb={{
                            width: 10,
                            color: "#ff6b6b",
                            opacity: 0.7,
                            hoverColor: "#ff5252",
                            hoverOpacity: 1.0,
                        }}
                        track={{
                            width: 20,
                            color: "rgba(255, 107, 107, 0.1)",
                            visible: true,
                        }}
                        showScrollbar={true}
                    >
                        <div
                            style={{
                                padding: "20px",
                                backgroundColor: "#fff",
                                borderRadius: "8px",
                            }}
                        >
                            <h2 style={{ marginTop: 0, color: "#333" }}>
                                외부 OverlayScrollbar 영역
                            </h2>
                            <p style={{ color: "#666" }}>
                                {showOuterContent
                                    ? "스크롤 가능한 상태입니다. 빨간색 스크롤바가 표시됩니다."
                                    : "스크롤이 없는 상태입니다. 버튼을 눌러 콘텐츠를 추가하세요."}
                            </p>

                            <div
                                style={{
                                    display: "flex",
                                    gap: "10px",
                                    marginBottom: "20px",
                                }}
                            >
                                <button
                                    onClick={() =>
                                        setShowOuterContent(!showOuterContent)
                                    }
                                    style={{
                                        padding: "10px 20px",
                                        backgroundColor: "#ff6b6b",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "4px",
                                        cursor: "pointer",
                                    }}
                                >
                                    {showOuterContent
                                        ? "콘텐츠 숨기기"
                                        : "콘텐츠 표시"}
                                </button>
                                <button
                                    onClick={() =>
                                        setOuterCount(outerCount + 1)
                                    }
                                    style={{
                                        padding: "10px 20px",
                                        backgroundColor: "#ff8a80",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "4px",
                                        cursor: "pointer",
                                    }}
                                >
                                    외부 버튼 클릭: {outerCount}
                                </button>
                            </div>

                            {/* 외부 스크롤 콘텐츠 */}
                            {showOuterContent && (
                                <div style={{ marginBottom: "20px" }}>
                                    {generateOuterContent()}
                                </div>
                            )}

                            {/* 내부 OverlayScrollbar - 스크롤 있음 */}
                            <div
                                style={{
                                    border: "3px solid #0066cc",
                                    borderRadius: "8px",
                                    padding: "10px",
                                    backgroundColor: "#e3f2fd",
                                }}
                            >
                                <h3
                                    style={{
                                        marginTop: 0,
                                        color: "#0066cc",
                                        padding: "10px",
                                        backgroundColor: "white",
                                        borderRadius: "4px",
                                    }}
                                >
                                    내부 OverlayScrollbar 영역 (스크롤 가능)
                                </h3>

                                <div
                                    style={{
                                        height: "400px",
                                        marginTop: "10px",
                                    }}
                                >
                                    <OverlayScrollbar
                                        thumb={{
                                            width: 8,
                                            color: "#0066cc",
                                            opacity: 0.7,
                                            hoverColor: "#0052a3",
                                            hoverOpacity: 1.0,
                                        }}
                                        track={{
                                            width: 16,
                                            color: "rgba(0, 102, 204, 0.1)",
                                            visible: true,
                                        }}
                                        arrows={{
                                            visible: true,
                                            color: "#0066cc",
                                            opacity: 0.7,
                                            hoverOpacity: 1.0,
                                        }}
                                        showScrollbar={true}
                                    >
                                        <div
                                            style={{
                                                backgroundColor: "white",
                                                borderRadius: "4px",
                                                padding: "10px",
                                            }}
                                        >
                                            {generateInnerContent()}
                                        </div>
                                    </OverlayScrollbar>
                                </div>

                                <div
                                    style={{
                                        marginTop: "20px",
                                        padding: "15px",
                                        backgroundColor: "white",
                                        borderRadius: "4px",
                                    }}
                                >
                                    <h4 style={{ marginTop: 0 }}>
                                        ✅ 테스트 포인트
                                    </h4>
                                    <ul
                                        style={{
                                            margin: "10px 0",
                                            paddingLeft: "20px",
                                        }}
                                    >
                                        <li>
                                            외부 영역은 빨간색 스크롤바가
                                            표시되어야 합니다
                                        </li>
                                        <li>
                                            내부 파란색 박스는 파란색 스크롤바가
                                            표시되어야 합니다
                                        </li>
                                        <li>
                                            내부 스크롤바만 화살표 버튼이 있어야
                                            합니다
                                        </li>
                                        <li>
                                            외부와 내부 스크롤바가 서로
                                            독립적으로 작동해야 합니다
                                        </li>
                                        <li>
                                            각 버튼 클릭 시 포커스가 유지되어야
                                            합니다
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </OverlayScrollbar>
                </div>
            </div>
        </div>
    );
}

export default NestedTest;
