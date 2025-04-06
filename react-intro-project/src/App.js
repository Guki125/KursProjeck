import React, { useState } from "react";
import "./App.css";

const GraphEditor = () => {
    const [mode, setMode] = useState("draw");

    return (
        <div className="graph-editor">
            <div className="canvas">
                <svg className="graph-svg">
                    <circle cx="100" cy="100" r="20" className="node" />
                    <circle cx="200" cy="100" r="20" className="node" />
                    <path d="M 120 100 Q 150 80, 180 100" className="edge" markerEnd="url(#arrow)" />
                    <defs>
                        <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                            <path d="M0,0 L0,6 L9,3 z" fill="#000" />
                        </marker>
                    </defs>
                </svg>
            </div>

            <div className="toolbar">
                <button className={mode === "draw" ? "active" : ""} onClick={() => setMode("draw")}>
                    ✏️
                </button>
                <button className={mode === "erase" ? "active" : ""} onClick={() => setMode("erase")}>
                    🧽
                </button>
            </div>

            <div className="sections">
                <div className="section">
                    <span>Section 1</span>
                    <button>❌</button>
                    <button>⭕</button>
                    <button>↗</button>
                </div>
                <div className="section">
                    <span>Section 2</span>
                    <button>❌</button>
                    <button>🔄</button>
                    <button>↗</button>
                </div>
            </div>
        </div>
    );
};

export default GraphEditor;
