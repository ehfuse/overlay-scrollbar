import React, { useRef } from "react";
import OverlayScrollbar from "@/OverlayScrollbar";
import type { OverlayScrollbarRef } from "@/types";

const HorizontalVerticalTest = () => {
    const scrollbarRef = useRef<OverlayScrollbarRef>(null);

    // 그리드 아이템 생성 (가로 세로 모두 충분한 콘텐츠)
    const generateGridContent = () => {
        const rows = 50;
        const cols = 10;
        const items = [];

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                items.push(
                    <div
                        key={`${row}-${col}`}
                        style={{
                            width: "150px",
                            height: "80px",
                            padding: "10px",
                            border: "1px solid #ddd",
                            borderRadius: "4px",
                            backgroundColor: `hsl(${
                                (row * 10 + col * 12) % 360
                            }, 70%, 85%)`,
                            textAlign: "center",
                            fontSize: "12px",
                            fontWeight: "bold",
                            color: "#333",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxSizing: "border-box",
                        }}
                    >
                        Row {row + 1} Col {col + 1}
                    </div>
                );
            }
        }
        return items;
    };

    return (
        <div>
            <h3>Horizontal & Vertical Scroll Test</h3>
            <p
                style={{
                    color: "#666",
                    fontSize: "14px",
                    marginBottom: "20px",
                }}
            >
                이 예제는 가로세로 모두 스크롤이 필요한 그리드 레이아웃을
                보여줍니다. 마우스 휠과 터치 드래그로 수평/수직 스크롤이
                가능합니다.
            </p>

            {/* 컨테이너 */}
            <div
                style={{
                    width: "1000px",
                    height: "600px",
                    border: "2px solid #333",
                    margin: "20px",
                    borderRadius: "8px",
                    overflow: "hidden",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
            >
                <OverlayScrollbar
                    ref={scrollbarRef}
                    thumb={{
                        width: 10,
                        color: "#3498db",
                        opacity: 0.6,
                        hoverColor: "#2980b9",
                        hoverOpacity: 1.0,
                        radius: 5,
                    }}
                    track={{
                        alignment: "outside",
                        width: 16,
                        color: "#ecf0f1",
                        radius: 5,
                        margin: 3,
                    }}
                    dragScroll={{
                        enabled: true,
                    }}
                    autoHide={{
                        enabled: true,
                        delay: 1500,
                    }}
                >
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(10, 150px)",
                            padding: "20px",
                            backgroundColor: "#f9f9f9",
                            gap: "0",
                        }}
                    >
                        {generateGridContent()}
                    </div>
                </OverlayScrollbar>
            </div>

            {/* 테이블 형식 예제 */}
            <div style={{ marginTop: "40px" }}>
                <h3>Table with Horizontal & Vertical Scroll</h3>
                <p
                    style={{
                        color: "#666",
                        fontSize: "14px",
                        marginBottom: "20px",
                    }}
                >
                    테이블 형식의 데이터로 가로세로 스크롤을 테스트합니다.
                </p>

                <div
                    style={{
                        width: "1000px",
                        height: "400px",
                        border: "2px solid #333",
                        margin: "20px",
                        borderRadius: "8px",
                        overflow: "hidden",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                >
                    <OverlayScrollbar
                        thumb={{
                            width: 10,
                            color: "#2ecc71",
                            opacity: 0.6,
                            hoverColor: "#27ae60",
                            hoverOpacity: 1.0,
                            radius: 5,
                        }}
                        track={{
                            width: 16,
                            color: "#ecf0f1",
                            radius: 5,
                            margin: 3,
                        }}
                        dragScroll={{
                            enabled: true,
                        }}
                        autoHide={{
                            enabled: true,
                            delay: 1500,
                        }}
                    >
                        <table
                            style={{
                                width: "100%",
                                borderCollapse: "collapse",
                                backgroundColor: "white",
                            }}
                        >
                            <thead>
                                <tr
                                    style={{
                                        backgroundColor: "#34495e",
                                        color: "white",
                                        position: "sticky",
                                        top: 0,
                                    }}
                                >
                                    <th
                                        style={{
                                            padding: "12px",
                                            border: "1px solid #ddd",
                                            minWidth: "100px",
                                        }}
                                    >
                                        ID
                                    </th>
                                    {Array.from({ length: 20 }, (_, i) => (
                                        <th
                                            key={`header-${i}`}
                                            style={{
                                                padding: "12px",
                                                border: "1px solid #ddd",
                                                minWidth: "120px",
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            Column {i + 1}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {Array.from({ length: 50 }, (_, rowIdx) => (
                                    <tr
                                        key={`row-${rowIdx}`}
                                        style={{
                                            backgroundColor:
                                                rowIdx % 2 === 0
                                                    ? "#ecf0f1"
                                                    : "white",
                                        }}
                                    >
                                        <td
                                            style={{
                                                padding: "12px",
                                                border: "1px solid #ddd",
                                                fontWeight: "bold",
                                                backgroundColor:
                                                    rowIdx % 2 === 0
                                                        ? "#d5dbdb"
                                                        : "#f5f5f5",
                                                position: "sticky",
                                                left: 0,
                                                zIndex: 1,
                                            }}
                                        >
                                            Row {rowIdx + 1}
                                        </td>
                                        {Array.from(
                                            { length: 20 },
                                            (_, colIdx) => (
                                                <td
                                                    key={`cell-${rowIdx}-${colIdx}`}
                                                    style={{
                                                        padding: "12px",
                                                        border: "1px solid #ddd",
                                                        textAlign: "center",
                                                    }}
                                                >
                                                    Data {rowIdx + 1}-
                                                    {colIdx + 1}
                                                </td>
                                            )
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </OverlayScrollbar>
                </div>
            </div>

            {/* 정보 박스 */}
            <div
                style={{
                    marginTop: "30px",
                    padding: "20px",
                    backgroundColor: "#e8f4f8",
                    borderLeft: "4px solid #3498db",
                    borderRadius: "4px",
                    margin: "20px",
                }}
            >
                <h4 style={{ marginTop: 0 }}>팁:</h4>
                <ul style={{ margin: "10px 0" }}>
                    <li>마우스 휠로 수직 스크롤</li>
                    <li>Shift + 마우스 휠로 수평 스크롤</li>
                    <li>
                        터치 드래그로 자유롭게 스크롤 (드래그 스크롤 활성화 시)
                    </li>
                    <li>스크롤바는 자동으로 숨겨집니다 (1500ms 지연)</li>
                </ul>
            </div>
        </div>
    );
};

export default HorizontalVerticalTest;
