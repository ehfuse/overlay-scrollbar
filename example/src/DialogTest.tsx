import OverlayScrollbar from "@/OverlayScrollbar";

// 섹션 데이터 타입 정의
interface Section {
    content: string;
}

// FormSection 시뮬레이션
const SectionsContainer = ({ sections }: { sections: Section[] }) => (
    <div className="sections-container">
        {sections.map((section: Section, index: number) => (
            <div
                key={index}
                style={{
                    padding: "15px",
                    borderBottom: "1px solid #eee",
                    marginBottom: "8px",
                    backgroundColor: index % 2 === 0 ? "#f9f9f9" : "white",
                }}
            >
                <h4>섹션 {index + 1}</h4>
                {section.content}
            </div>
        ))}
    </div>
);

const DialogTest = () => {
    // 테스트용 섹션 데이터
    const sections = Array.from({ length: 15 }, (_, i) => ({
        content: `테스트 섹션 ${
            i + 1
        } 내용입니다. OverlayScrollbar가 올바르게 동작하는지 확인해보세요.`,
    }));

    return (
        <div style={{ padding: "20px" }}>
            <h3>OverlayScrollbar 기본 스타일 테스트</h3>

            {/* 1. 기본 테스트 - 상위가 flex인 경우 */}
            <div style={{ marginBottom: "40px" }}>
                <h4>1. 상위가 flex 컨테이너인 경우 (정상 동작)</h4>
                <div
                    style={{
                        width: "600px",
                        height: "400px",
                        border: "2px solid #4CAF50",
                        backgroundColor: "white",
                        display: "flex", // flex 컨테이너
                        flexDirection: "column",
                    }}
                >
                    <OverlayScrollbar>
                        <div style={{ padding: "20px" }}>
                            <SectionsContainer sections={sections} />
                        </div>
                    </OverlayScrollbar>
                </div>
                <p
                    style={{
                        color: "#4CAF50",
                        fontSize: "14px",
                        marginTop: "5px",
                    }}
                >
                    ✅ flex: "1 1 0%" 가 적용되어 올바른 크기로 조절됨
                </p>
            </div>

            {/* 2. 상위가 flex가 아닌 경우 */}
            <div style={{ marginBottom: "40px" }}>
                <h4>2. 상위가 일반 block 컨테이너인 경우</h4>
                <div
                    style={{
                        width: "600px",
                        height: "400px",
                        border: "2px solid #FF9800",
                        backgroundColor: "white",
                        position: "relative",
                    }}
                >
                    <OverlayScrollbar>
                        <div style={{ padding: "20px" }}>
                            <SectionsContainer sections={sections} />
                        </div>
                    </OverlayScrollbar>
                </div>
                <p
                    style={{
                        color: "#FF9800",
                        fontSize: "14px",
                        marginTop: "5px",
                    }}
                >
                    ⚠️ height: "100%" 를 명시적으로 지정해야 함
                </p>
            </div>

            {/* 3. 상위가 flex가 아니고 height도 지정하지 않은 경우 */}
            <div style={{ marginBottom: "40px" }}>
                <h4>3. 상위가 block이고 height 미지정인 경우 (문제 상황)</h4>
                <div
                    style={{
                        width: "600px",
                        height: "400px",
                        border: "2px solid #F44336",
                        backgroundColor: "white",
                        // display: flex 없음, height도 지정하지 않음
                        position: "relative",
                    }}
                >
                    <OverlayScrollbar>
                        <div style={{ padding: "20px" }}>
                            <SectionsContainer sections={sections} />
                        </div>
                    </OverlayScrollbar>
                </div>
                <p
                    style={{
                        color: "#F44336",
                        fontSize: "14px",
                        marginTop: "5px",
                    }}
                >
                    ❌ OverlayScrollbar가 컨테이너 크기를 벗어남 (flex: "1 1 0%"
                    무시됨)
                </p>
            </div>
        </div>
    );
};

export default DialogTest;
