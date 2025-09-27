import React from "react";
import OverlayScrollbar from "@/OverlayScrollbar";

const SimpleTest = () => {
    return (
        <div>
            <h3>Simple OverlayScrollbar Test</h3>
            <div
                style={{
                    width: "800px",
                    height: "600px",
                    border: "1px solid #ccc",
                    margin: "20px",
                }}
            >
                <OverlayScrollbar>
                    <div style={{ padding: "20px" }}>
                        {Array.from({ length: 50 }, (_, i) => (
                            <div
                                key={i}
                                style={{
                                    padding: "10px",
                                    borderBottom: "1px solid #eee",
                                    marginBottom: "5px",
                                }}
                            >
                                테스트 아이템 {i + 1} - 이것은 스크롤 테스트를
                                위한 내용입니다.
                            </div>
                        ))}
                    </div>
                </OverlayScrollbar>
            </div>
        </div>
    );
};

export default SimpleTest;
