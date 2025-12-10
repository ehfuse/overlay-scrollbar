import OverlayScrollbar from "@/OverlayScrollbar";
import { EhfuseEditor } from "@ehfuse/editor";
import { useState } from "react";

export default function EditorTest() {
    const [content, setContent] = useState(
        "<p>에디터 테스트 내용입니다...</p>"
    );

    return (
        <div style={{ display: "flex", gap: "20px", height: "100%" }}>
            {/* 왼쪽: OverlayScrollbar 안에 EhfuseEditor */}
            <div style={{ flex: 1 }}>
                <h3>OverlayScrollbar + EhfuseEditor</h3>
                <OverlayScrollbar
                    style={{
                        height: "300px",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                    }}
                >
                    <EhfuseEditor
                        defaultValue={content}
                        locale="ko"
                        autoHeight={false}
                        containerStyle={{ height: "100%" }}
                        onChange={setContent}
                        toolbarOptions={{
                            left: [
                                ["font", "size"],
                                ["bold", "italic", "underline", "strike"],
                                ["color", "bgcolor"],
                                ["align"],
                                ["bulletList", "numberList"],
                                ["link", "image"],
                                ["undo", "redo"],
                            ],
                            right: ["fullScreen"],
                        }}
                    />
                </OverlayScrollbar>
            </div>

            {/* 오른쪽: HTML 미리보기 */}
            <div style={{ flex: 1 }}>
                <h3>HTML 미리보기</h3>
                <OverlayScrollbar
                    style={{
                        height: "500px",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        padding: "10px",
                    }}
                >
                    <pre
                        style={{
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word",
                            margin: 0,
                            fontSize: "12px",
                        }}
                    >
                        {content}
                    </pre>
                </OverlayScrollbar>
            </div>
        </div>
    );
}
