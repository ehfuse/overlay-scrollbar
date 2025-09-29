import { useState } from "react";
import OverlayScrollbar from "@/OverlayScrollbar";
import SimpleTest from "./SimpleTest";
import DialogTest from "./DialogTest";
import "./App.css";

function App() {
    const [count, setCount] = useState(0);
    const [currentTest, setCurrentTest] = useState("original"); // original, simple, dialog
    const [showScrollbar, setShowScrollbar] = useState(true); // showScrollbar 제어

    // 테스트용 긴 콘텐츠 생성
    const generateLongContent = () => {
        const items = [];
        for (let i = 0; i < 100; i++) {
            items.push(
                <div
                    key={i}
                    style={{ padding: "10px", borderBottom: "1px solid #eee" }}
                >
                    <h3>항목 #{i + 1}</h3>
                    <p>
                        이것은 스크롤 테스트를 위한 긴 콘텐츠입니다.
                        OverlayScrollbar 컴포넌트가 제대로 작동하는지 확인할 수
                        있습니다.
                    </p>
                    {i === 50 && (
                        <div
                            style={{
                                padding: "20px",
                                backgroundColor: "#f0f8ff",
                                border: "1px solid #87ceeb",
                            }}
                        >
                            <h4>중간 지점 표시</h4>
                            <p>
                                여기는 리스트의 중간 지점입니다. 스크롤이 잘
                                작동하고 있나요?
                            </p>
                        </div>
                    )}
                </div>
            );
        }
        return items;
    };

    return (
        <div
            style={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <header style={{ padding: "20px", borderBottom: "1px solid #eee" }}>
                <h1>OverlayScrollbar 테스트</h1>

                <div style={{ marginBottom: "20px" }}>
                    <button
                        onClick={() => setCurrentTest("original")}
                        style={{
                            margin: "5px",
                            padding: "10px",
                            backgroundColor:
                                currentTest === "original"
                                    ? "#007bff"
                                    : "#f0f0f0",
                            color:
                                currentTest === "original" ? "white" : "black",
                            border: "none",
                            cursor: "pointer",
                        }}
                    >
                        Original Test
                    </button>
                    <button
                        onClick={() => setCurrentTest("simple")}
                        style={{
                            margin: "5px",
                            padding: "10px",
                            backgroundColor:
                                currentTest === "simple"
                                    ? "#007bff"
                                    : "#f0f0f0",
                            color: currentTest === "simple" ? "white" : "black",
                            border: "none",
                            cursor: "pointer",
                        }}
                    >
                        Simple Test
                    </button>
                    <button
                        onClick={() => setCurrentTest("dialog")}
                        style={{
                            margin: "5px",
                            padding: "10px",
                            backgroundColor:
                                currentTest === "dialog"
                                    ? "#007bff"
                                    : "#f0f0f0",
                            color: currentTest === "dialog" ? "white" : "black",
                            border: "none",
                            cursor: "pointer",
                        }}
                    >
                        Dialog Test
                    </button>
                </div>

                {/* showScrollbar 스위치 */}
                <div style={{ marginTop: "10px" }}>
                    <label
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                        }}
                    >
                        <input
                            type="checkbox"
                            checked={showScrollbar}
                            onChange={(e) => setShowScrollbar(e.target.checked)}
                            style={{
                                transform: "scale(1.2)",
                                cursor: "pointer",
                            }}
                        />
                        <span style={{ fontSize: "16px", cursor: "pointer" }}>
                            스크롤바 표시 ({showScrollbar ? "ON" : "OFF"})
                        </span>
                    </label>
                </div>
            </header>

            <div style={{ flex: 1, padding: "20px" }}>
                {currentTest === "original" && (
                    <div>
                        <div style={{ marginBottom: "10px" }}>
                            <button
                                onClick={() => setCount((count) => count + 1)}
                            >
                                클릭 횟수: {count}
                            </button>
                        </div>
                        <p>
                            아래는 OverlayScrollbar 컴포넌트를 사용한 스크롤
                            영역입니다.
                        </p>

                        <OverlayScrollbar
                            showScrollbar={showScrollbar}
                            showArrows={true}
                            style={{
                                height: "600px",
                                border: "1px solid #ddd",
                                backgroundColor: "#fff",
                            }}
                        >
                            <div style={{ padding: "20px" }}>
                                {generateLongContent()}
                            </div>
                        </OverlayScrollbar>
                    </div>
                )}

                {currentTest === "simple" && <SimpleTest />}
                {currentTest === "dialog" && <DialogTest />}
            </div>
        </div>
    );
}

export default App;
