import { useState } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import OverlayScrollbar from "@/OverlayScrollbar";
import SimpleTest from "./SimpleTest";
import DialogTest from "./DialogTest";
import NestedTest from "./NestedTest";
import "./App.css";

// Original Test 컴포넌트 분리
function OriginalTest() {
    const [count, setCount] = useState(0);
    const [showScrollbar, setShowScrollbar] = useState(true);

    // Original Test 옵션들
    const [thumbWidth, setThumbWidth] = useState(8);
    const [thumbColor, setThumbColor] = useState("#606060");
    const [thumbOpacity, setThumbOpacity] = useState(0.6);
    const [thumbHoverColor, setThumbHoverColor] = useState("#606060");
    const [thumbHoverOpacity, setThumbHoverOpacity] = useState(1.0);
    const [thumbRadius, setThumbRadius] = useState(4);
    const [trackWidth, setTrackWidth] = useState(16);
    const [trackColor, setTrackColor] = useState("#808080");
    const [trackOpacity, setTrackOpacity] = useState(0.1);
    const [trackRadius, setTrackRadius] = useState(4);
    const [trackMargin, setTrackMargin] = useState(4);
    const [trackAlignment, setTrackAlignment] = useState<"center" | "right">(
        "center"
    );
    const [showArrows, setShowArrows] = useState(false);
    const [arrowStep, setArrowStep] = useState(50);
    const [arrowColor, setArrowColor] = useState("#808080");
    const [arrowOpacity, setArrowOpacity] = useState(0.6);
    const [arrowHoverColor, setArrowHoverColor] = useState("#808080");
    const [arrowActiveOpacity, setArrowActiveOpacity] = useState(1.0);
    const [dragScrollEnabled, setDragScrollEnabled] = useState(true);
    const [autoHideEnabled, setAutoHideEnabled] = useState(true);
    const [autoHideDelay, setAutoHideDelay] = useState(1500);
    const [autoHideDelayOnWheel, setAutoHideDelayOnWheel] = useState(700);

    // 테스트용 긴 콘텐츠 생성
    const generateLongContent = () => {
        const items = [];
        for (let i = 0; i < 30; i++) {
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
        <div>
            <div style={{ marginBottom: "10px" }}>
                <button onClick={() => setCount((count) => count + 1)}>
                    클릭 횟수: {count}
                </button>
            </div>

            {/* 옵션 조정 UI */}
            <div
                style={{
                    marginBottom: "20px",
                    padding: "20px",
                    backgroundColor: "#f5f5f5",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                    maxWidth: "1300px",
                    margin: "0 auto 20px auto",
                }}
            >
                <h3 style={{ marginTop: 0, marginBottom: "15px" }}>
                    스크롤바 옵션
                </h3>

                {/* 카테고리별 세로 컬럼 */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(5, 1fr)",
                        gap: "15px",
                    }}
                >
                    {/* 색상 설정 */}
                    <div
                        style={{
                            padding: "15px",
                            backgroundColor: "white",
                            borderRadius: "6px",
                            border: "2px solid #9c27b0",
                        }}
                    >
                        <h4
                            style={{
                                marginTop: 0,
                                marginBottom: "15px",
                                color: "#9c27b0",
                            }}
                        >
                            색상 (Colors)
                        </h4>

                        <div style={{ marginBottom: "15px" }}>
                            <label
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    cursor: "pointer",
                                    fontWeight: "bold",
                                    marginBottom: "10px",
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={showScrollbar}
                                    onChange={(e) =>
                                        setShowScrollbar(e.target.checked)
                                    }
                                    style={{ transform: "scale(1.2)" }}
                                />
                                <span>스크롤바 표시</span>
                            </label>
                        </div>

                        <div style={{ marginBottom: "15px" }}>
                            <label
                                style={{
                                    display: "block",
                                    marginBottom: "5px",
                                    fontWeight: "bold",
                                }}
                            >
                                썸 색상
                            </label>
                            <input
                                type="color"
                                value={thumbColor}
                                onChange={(e) => setThumbColor(e.target.value)}
                                style={{ width: "100%", height: "35px" }}
                            />
                        </div>

                        <div style={{ marginBottom: "15px" }}>
                            <label
                                style={{
                                    display: "block",
                                    marginBottom: "5px",
                                    fontWeight: "bold",
                                }}
                            >
                                썸 호버 색상
                            </label>
                            <input
                                type="color"
                                value={thumbHoverColor}
                                onChange={(e) =>
                                    setThumbHoverColor(e.target.value)
                                }
                                style={{ width: "100%", height: "35px" }}
                            />
                        </div>

                        <div style={{ marginBottom: "15px" }}>
                            <label
                                style={{
                                    display: "block",
                                    marginBottom: "5px",
                                    fontWeight: "bold",
                                }}
                            >
                                트랙 색상
                            </label>
                            <input
                                type="color"
                                value={trackColor}
                                onChange={(e) => setTrackColor(e.target.value)}
                                style={{ width: "100%", height: "35px" }}
                            />
                        </div>

                        <div style={{ marginBottom: "15px" }}>
                            <label
                                style={{
                                    display: "block",
                                    marginBottom: "5px",
                                    fontWeight: "bold",
                                }}
                            >
                                화살표 색상
                            </label>
                            <input
                                type="color"
                                value={arrowColor}
                                onChange={(e) => setArrowColor(e.target.value)}
                                style={{ width: "100%", height: "35px" }}
                            />
                        </div>

                        <div>
                            <label
                                style={{
                                    display: "block",
                                    marginBottom: "5px",
                                    fontWeight: "bold",
                                }}
                            >
                                화살표 호버 색상
                            </label>
                            <input
                                type="color"
                                value={arrowHoverColor}
                                onChange={(e) =>
                                    setArrowHoverColor(e.target.value)
                                }
                                style={{ width: "100%", height: "35px" }}
                            />
                        </div>
                    </div>

                    {/* 썸 설정 */}
                    <div
                        style={{
                            padding: "15px",
                            backgroundColor: "white",
                            borderRadius: "6px",
                            border: "2px solid #007bff",
                        }}
                    >
                        <h4
                            style={{
                                marginTop: 0,
                                marginBottom: "15px",
                                color: "#007bff",
                            }}
                        >
                            썸 (Thumb)
                        </h4>

                        <div style={{ marginBottom: "15px" }}>
                            <label
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    cursor: "pointer",
                                    fontWeight: "bold",
                                    marginBottom: "10px",
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={dragScrollEnabled}
                                    onChange={(e) =>
                                        setDragScrollEnabled(e.target.checked)
                                    }
                                    style={{ transform: "scale(1.2)" }}
                                />
                                <span>드래그 스크롤</span>
                            </label>
                        </div>

                        <div style={{ marginBottom: "15px" }}>
                            <label
                                style={{
                                    display: "block",
                                    marginBottom: "5px",
                                    fontWeight: "bold",
                                }}
                            >
                                너비: {thumbWidth}px
                            </label>
                            <input
                                type="range"
                                min="4"
                                max="20"
                                value={thumbWidth}
                                onChange={(e) =>
                                    setThumbWidth(Number(e.target.value))
                                }
                                style={{ width: "100%" }}
                            />
                        </div>

                        <div style={{ marginBottom: "15px" }}>
                            <label
                                style={{
                                    display: "block",
                                    marginBottom: "5px",
                                    fontWeight: "bold",
                                }}
                            >
                                투명도: {thumbOpacity.toFixed(2)}
                            </label>
                            <input
                                type="range"
                                min="0.1"
                                max="1"
                                step="0.1"
                                value={thumbOpacity}
                                onChange={(e) =>
                                    setThumbOpacity(Number(e.target.value))
                                }
                                style={{ width: "100%" }}
                            />
                        </div>

                        <div style={{ marginBottom: "15px" }}>
                            <label
                                style={{
                                    display: "block",
                                    marginBottom: "5px",
                                    fontWeight: "bold",
                                }}
                            >
                                호버 투명도: {thumbHoverOpacity.toFixed(2)}
                            </label>
                            <input
                                type="range"
                                min="0.1"
                                max="1"
                                step="0.1"
                                value={thumbHoverOpacity}
                                onChange={(e) =>
                                    setThumbHoverOpacity(Number(e.target.value))
                                }
                                style={{ width: "100%" }}
                            />
                        </div>

                        <div>
                            <label
                                style={{
                                    display: "block",
                                    marginBottom: "5px",
                                    fontWeight: "bold",
                                }}
                            >
                                굴곡: {thumbRadius}px
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="20"
                                value={thumbRadius}
                                onChange={(e) =>
                                    setThumbRadius(Number(e.target.value))
                                }
                                style={{ width: "100%" }}
                            />
                        </div>
                    </div>

                    {/* 트랙 설정 */}
                    <div
                        style={{
                            padding: "15px",
                            backgroundColor: "white",
                            borderRadius: "6px",
                            border: "2px solid #28a745",
                        }}
                    >
                        <h4
                            style={{
                                marginTop: 0,
                                marginBottom: "15px",
                                color: "#28a745",
                            }}
                        >
                            트랙 (Track)
                        </h4>

                        <div style={{ marginBottom: "15px" }}>
                            <label
                                style={{
                                    display: "block",
                                    marginBottom: "5px",
                                    fontWeight: "bold",
                                }}
                            >
                                너비: {trackWidth}px
                            </label>
                            <input
                                type="range"
                                min="8"
                                max="30"
                                value={trackWidth}
                                onChange={(e) =>
                                    setTrackWidth(Number(e.target.value))
                                }
                                style={{ width: "100%" }}
                            />
                        </div>

                        <div style={{ marginBottom: "15px" }}>
                            <label
                                style={{
                                    display: "block",
                                    marginBottom: "5px",
                                    fontWeight: "bold",
                                }}
                            >
                                투명도: {trackOpacity.toFixed(2)}
                            </label>
                            <input
                                type="range"
                                min="0.05"
                                max="0.5"
                                step="0.05"
                                value={trackOpacity}
                                onChange={(e) =>
                                    setTrackOpacity(Number(e.target.value))
                                }
                                style={{ width: "100%" }}
                            />
                        </div>

                        <div style={{ marginBottom: "15px" }}>
                            <label
                                style={{
                                    display: "block",
                                    marginBottom: "5px",
                                    fontWeight: "bold",
                                }}
                            >
                                굴곡: {trackRadius}px
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="20"
                                value={trackRadius}
                                onChange={(e) =>
                                    setTrackRadius(Number(e.target.value))
                                }
                                style={{ width: "100%" }}
                            />
                        </div>

                        <div style={{ marginBottom: "15px" }}>
                            <label
                                style={{
                                    display: "block",
                                    marginBottom: "5px",
                                    fontWeight: "bold",
                                }}
                            >
                                마진: {trackMargin}px
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="20"
                                value={trackMargin}
                                onChange={(e) =>
                                    setTrackMargin(Number(e.target.value))
                                }
                                style={{ width: "100%" }}
                            />
                        </div>

                        <div>
                            <label
                                style={{
                                    display: "block",
                                    marginBottom: "5px",
                                    fontWeight: "bold",
                                }}
                            >
                                정렬
                            </label>
                            <select
                                value={trackAlignment}
                                onChange={(e) =>
                                    setTrackAlignment(
                                        e.target.value as "center" | "right"
                                    )
                                }
                                style={{
                                    width: "100%",
                                    padding: "8px",
                                    fontSize: "14px",
                                }}
                            >
                                <option value="center">중앙</option>
                                <option value="right">오른쪽</option>
                            </select>
                        </div>
                    </div>

                    {/* 화살표 설정 */}
                    <div
                        style={{
                            padding: "15px",
                            backgroundColor: "white",
                            borderRadius: "6px",
                            border: "2px solid #ffc107",
                        }}
                    >
                        <h4
                            style={{
                                marginTop: 0,
                                marginBottom: "15px",
                                color: "#ffc107",
                            }}
                        >
                            화살표 (Arrows)
                        </h4>

                        <div style={{ marginBottom: "15px" }}>
                            <label
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    cursor: "pointer",
                                    fontWeight: "bold",
                                    marginBottom: "10px",
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={showArrows}
                                    onChange={(e) =>
                                        setShowArrows(e.target.checked)
                                    }
                                    style={{ transform: "scale(1.2)" }}
                                />
                                <span>화살표 표시</span>
                            </label>
                        </div>

                        <div style={{ marginBottom: "15px" }}>
                            <label
                                style={{
                                    display: "block",
                                    marginBottom: "5px",
                                    fontWeight: "bold",
                                }}
                            >
                                스텝: {arrowStep}px
                            </label>
                            <input
                                type="range"
                                min="10"
                                max="200"
                                step="10"
                                value={arrowStep}
                                onChange={(e) =>
                                    setArrowStep(Number(e.target.value))
                                }
                                style={{ width: "100%" }}
                            />
                        </div>

                        <div style={{ marginBottom: "15px" }}>
                            <label
                                style={{
                                    display: "block",
                                    marginBottom: "5px",
                                    fontWeight: "bold",
                                }}
                            >
                                투명도: {arrowOpacity.toFixed(2)}
                            </label>
                            <input
                                type="range"
                                min="0.1"
                                max="1"
                                step="0.1"
                                value={arrowOpacity}
                                onChange={(e) =>
                                    setArrowOpacity(Number(e.target.value))
                                }
                                style={{ width: "100%" }}
                            />
                        </div>

                        <div>
                            <label
                                style={{
                                    display: "block",
                                    marginBottom: "5px",
                                    fontWeight: "bold",
                                }}
                            >
                                호버 투명도: {arrowActiveOpacity.toFixed(2)}
                            </label>
                            <input
                                type="range"
                                min="0.1"
                                max="1"
                                step="0.1"
                                value={arrowActiveOpacity}
                                onChange={(e) =>
                                    setArrowActiveOpacity(
                                        Number(e.target.value)
                                    )
                                }
                                style={{ width: "100%" }}
                            />
                        </div>
                    </div>

                    {/* 자동 숨김 설정 */}
                    <div
                        style={{
                            padding: "15px",
                            backgroundColor: "white",
                            borderRadius: "6px",
                            border: "2px solid #dc3545",
                        }}
                    >
                        <h4
                            style={{
                                marginTop: 0,
                                marginBottom: "15px",
                                color: "#dc3545",
                            }}
                        >
                            자동 숨김 (Auto Hide)
                        </h4>

                        <div style={{ marginBottom: "15px" }}>
                            <label
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    cursor: "pointer",
                                    fontWeight: "bold",
                                    marginBottom: "10px",
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={autoHideEnabled}
                                    onChange={(e) =>
                                        setAutoHideEnabled(e.target.checked)
                                    }
                                    style={{ transform: "scale(1.2)" }}
                                />
                                <span>자동 숨김</span>
                            </label>
                        </div>

                        <div style={{ marginBottom: "15px" }}>
                            <label
                                style={{
                                    display: "block",
                                    marginBottom: "5px",
                                    fontWeight: "bold",
                                }}
                            >
                                지연: {autoHideDelay}ms
                            </label>
                            <input
                                type="range"
                                min="500"
                                max="5000"
                                step="100"
                                value={autoHideDelay}
                                onChange={(e) =>
                                    setAutoHideDelay(Number(e.target.value))
                                }
                                style={{ width: "100%" }}
                                disabled={!autoHideEnabled}
                            />
                        </div>

                        <div>
                            <label
                                style={{
                                    display: "block",
                                    marginBottom: "5px",
                                    fontWeight: "bold",
                                }}
                            >
                                휠 후 지연: {autoHideDelayOnWheel}ms
                            </label>
                            <input
                                type="range"
                                min="100"
                                max="3000"
                                step="100"
                                value={autoHideDelayOnWheel}
                                onChange={(e) =>
                                    setAutoHideDelayOnWheel(
                                        Number(e.target.value)
                                    )
                                }
                                style={{ width: "100%" }}
                                disabled={!autoHideEnabled}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <p>아래는 OverlayScrollbar 컴포넌트를 사용한 스크롤 영역입니다.</p>

            <OverlayScrollbar
                showScrollbar={showScrollbar}
                autoHide={{
                    enabled: autoHideEnabled,
                    delay: autoHideDelay,
                    delayOnWheel: autoHideDelayOnWheel,
                }}
                thumb={{
                    width: thumbWidth,
                    radius: thumbRadius,
                    color: thumbColor,
                    opacity: thumbOpacity,
                    hoverColor: thumbHoverColor,
                    hoverOpacity: thumbHoverOpacity,
                }}
                track={{
                    width: trackWidth,
                    color: `${trackColor}${Math.round(trackOpacity * 255)
                        .toString(16)
                        .padStart(2, "0")}`,
                    radius: trackRadius,
                    margin: trackMargin,
                    alignment: trackAlignment,
                }}
                arrows={{
                    visible: showArrows,
                    step: arrowStep,
                    color: arrowColor,
                    opacity: arrowOpacity,
                    hoverColor: arrowHoverColor,
                    hoverOpacity: arrowActiveOpacity,
                }}
                dragScroll={{
                    enabled: dragScrollEnabled,
                }}
                style={{
                    padding: "20px",
                    height: "600px",
                    border: "1px solid #ddd",
                    backgroundColor: "#fff",
                }}
            >
                <div style={{ padding: "20px" }}>{generateLongContent()}</div>
            </OverlayScrollbar>
        </div>
    );
}

function App() {
    const location = useLocation();
    const currentPath = location.pathname;

    const navStyle = (path: string) => ({
        margin: "5px",
        padding: "10px",
        backgroundColor: currentPath === path ? "#007bff" : "#f0f0f0",
        color: currentPath === path ? "white" : "black",
        border: "none",
        cursor: "pointer",
        textDecoration: "none",
        display: "inline-block",
    });

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
                    <Link to="/" style={navStyle("/")}>
                        Original Test
                    </Link>
                    <Link to="/simple" style={navStyle("/simple")}>
                        Simple Test
                    </Link>
                    <Link to="/dialog" style={navStyle("/dialog")}>
                        Dialog Test
                    </Link>
                    <Link to="/nested" style={navStyle("/nested")}>
                        Nested Test
                    </Link>
                </div>
            </header>

            <div style={{ flex: 1, padding: "20px" }}>
                <Routes>
                    <Route path="/" element={<OriginalTest />} />
                    <Route path="/simple" element={<SimpleTest />} />
                    <Route path="/dialog" element={<DialogTest />} />
                    <Route path="/nested" element={<NestedTest />} />
                </Routes>
            </div>
        </div>
    );
}

export default App;
