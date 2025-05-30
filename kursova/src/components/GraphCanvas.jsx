import React, { useState, useEffect } from 'react';
import Toolbar from './Toolbar';
import '../styles/GraphCanvas.scss';

const GraphCanvas = () => {
    const [activeTool, setActiveTool] = useState(null);
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [tempEdge, setTempEdge] = useState(null);
    const [adjMatrix, setAdjMatrix] = useState([]);
    const [matrixInput, setMatrixInput] = useState('');

    const handleCanvasClick = (e) => {
        const svg = e.currentTarget;
        const pt = svg.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
        const cursorpt = pt.matrixTransform(svg.getScreenCTM().inverse());
        const { x, y } = cursorpt;

        if (activeTool === 'circle') {
            const newNode = {
                id: Date.now(),
                x,
                y,
                label: `V${nodes.length + 1}`
            };
            setNodes(prev => [...prev, newNode]);

            setAdjMatrix(prev => {
                const newSize = prev.length + 1;
                const newMatrix = prev.map(row => [...row, 0]);
                newMatrix.push(new Array(newSize).fill(0));
                return newMatrix;
            });
        } else if (activeTool === 'line') {
            const clickedNode = nodes.find(
                node => Math.hypot(node.x - x, node.y - y) < 20
            );
            if (clickedNode) {
                if (!tempEdge) {
                    setTempEdge(clickedNode);
                } else {
                    setEdges(prev => [
                        ...prev,
                        {
                            from: tempEdge.id,
                            to: clickedNode.id,
                            label: `e${edges.length + 1}`
                        }
                    ]);

                    const fromIndex = nodes.findIndex(n => n.id === tempEdge.id);
                    const toIndex = nodes.findIndex(n => n.id === clickedNode.id);
                    setAdjMatrix(prev => {
                        const newMatrix = prev.map(row => [...row]);
                        newMatrix[fromIndex][toIndex] = 1;
                        return newMatrix;
                    });

                    setTempEdge(null);
                }
            }
        }
    };

    const findNodeById = id => nodes.find(n => n.id === id);

    const createGraphFromMatrix = (matrix) => {
        const newNodes = matrix.map((_, i) => ({
            id: Date.now() + i,
            x: 100 + i * 100,
            y: 200,
            label: `V${i + 1}`
        }));

        const newEdges = [];
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++) {
                if (matrix[i][j]) {
                    newEdges.push({
                        from: newNodes[i].id,
                        to: newNodes[j].id,
                        label: `e${newEdges.length + 1}`
                    });
                }
            }
        }

        setNodes(newNodes);
        setEdges(newEdges);
        setAdjMatrix(matrix);
        setTempEdge(null);
    };

    const parseMatrixInput = () => {
        const rows = matrixInput.trim().split('\n');
        const matrix = rows.map(row =>
            row.trim().split(/\s+/).map(num => parseInt(num, 10))
        );

        const isValid = matrix.every(row => row.length === matrix.length && row.every(n => !isNaN(n)));
        if (isValid) {
            createGraphFromMatrix(matrix);
        } else {
            alert('Невірний формат матриці. Переконайтесь, що це квадратна числова матриця.');
        }
    };

    useEffect(() => {
        console.log('Матриця суміжності:', adjMatrix);
    }, [adjMatrix]);

    return (
        <div className="graph-canvas">
            <svg className="graph-canvas__svg" onClick={handleCanvasClick}>
                <defs>
                    <marker id="arrow" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto">
                        <path d="M0,0 L10,5 L0,10 Z" fill="black" />
                    </marker>
                </defs>

                {edges.map((edge, i) => {
                    const from = findNodeById(edge.from);
                    const to = findNodeById(edge.to);
                    if (!from || !to) return null;

                    if (from.id === to.id) {
                        // Петля
                        return (
                            <g key={i}>
                                <path
                                    d={`
                        M ${from.x} ${from.y - 20}
                        a 20 20 0 1 1 1 0.1
                    `}
                                    stroke="black"
                                    fill="none"
                                    markerEnd="url(#arrow)"
                                />
                                <text
                                    x={from.x}
                                    y={from.y - 45}
                                    textAnchor="middle"
                                    fontSize="12"
                                    fill="black"
                                >
                                    {edge.label}
                                </text>
                            </g>
                        );
                    }

                    // Звичайна стрілка
                    const dx = to.x - from.x;
                    const dy = to.y - from.y;
                    const length = Math.hypot(dx, dy);
                    const normX = dx / length;
                    const normY = dy / length;

                    const startX = from.x + normX * 20;
                    const startY = from.y + normY * 20;
                    const endX = to.x - normX * 20;
                    const endY = to.y - normY * 20;

                    return (
                        <g key={i}>
                            <line
                                x1={startX}
                                y1={startY}
                                x2={endX}
                                y2={endY}
                                stroke="black"
                                strokeWidth="2"
                                markerEnd="url(#arrow)"
                            />
                            <text
                                x={(startX + endX) / 2 - 10 * normY}
                                y={(startY + endY) / 2 + 10 * normX}
                                textAnchor="middle"
                                fontSize="12"
                                fill="black"
                            >
                                {edge.label}
                            </text>
                        </g>
                    );
                })}


                {nodes.map(node => (
                    <g key={node.id}>
                        <circle
                            cx={node.x}
                            cy={node.y}
                            r="20"
                            className="graph-canvas__node"
                        />
                        <text
                            x={node.x}
                            y={node.y + 5}
                            textAnchor="middle"
                            fontSize="14"
                            fill="black"
                        >
                            {node.label}
                        </text>
                    </g>
                ))}
            </svg>

            <Toolbar activeTool={activeTool} setActiveTool={setActiveTool} persistent={true} />

            <div className="matrix-input">
                <textarea
                    rows="5"
                    placeholder="Введіть матрицю суміжності, напр.:
0 1 0
0 0 1
1 0 0"
                    value={matrixInput}
                    onChange={(e) => setMatrixInput(e.target.value)}
                />
                <button onClick={parseMatrixInput}>Побудувати граф із введеної матриці</button>
            </div>
        </div>
    );
};

export default GraphCanvas;
