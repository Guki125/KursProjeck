import React from 'react';
import Toolbar from './Toolbar';
import '../styles/GraphCanvas.scss';

const GraphCanvas = () => {
    return (
        <>
        <div className="graph-canvas">
            <svg className="graph-canvas__svg">
                {/* Вершини */}
                <circle cx="200" cy="150" r="20" className="graph-canvas__node" />
                <circle cx="350" cy="150" r="20" className="graph-canvas__node" />

                {/* Стрілка */}
                <defs>
                    <marker id="arrow" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto">
                        <path d="M0,0 L10,5 L0,10 Z" fill="black" />
                    </marker>
                </defs>
                <path
                    d="M220,150 C250,140 300,140 330,150"
                    className="graph-canvas__edge"
                    markerEnd="url(#arrow)"
                />
            </svg>
            <Toolbar />
        </div>
    </>
    );
};

export default GraphCanvas;
