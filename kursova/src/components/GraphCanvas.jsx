import React, { useState, useEffect } from 'react';
import Toolbar from './Toolbar';
import Menu from './Menu';
import '../styles/GraphCanvas.scss';

const GraphCanvas = () => {
    const [activeTool, setActiveTool] = useState(null);
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [tempEdge, setTempEdge] = useState(null);
    const [adjMatrix, setAdjMatrix] = useState([]);
    const [matrixInput, setMatrixInput] = useState('');

    // Додаємо вузол
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

    // Видалення вузла
    const handleNodeClick = (nodeId) => {
        if (activeTool === 'clrCircle') {
            setNodes(prev => prev.filter(node => node.id !== nodeId));
            setEdges(prev => prev.filter(edge => edge.from !== nodeId && edge.to !== nodeId));
            setAdjMatrix(prev => {
                const idx = nodes.findIndex(n => n.id === nodeId);
                if (idx === -1) return prev;
                const newMatrix = prev.filter((_, i) => i !== idx).map(row => row.filter((_, i) => i !== idx));
                return newMatrix;
            });
        }
    };

    // Видалення ребра
    const handleEdgeClick = (edgeIdx) => {
        if (activeTool === 'clrLine') {
            setEdges(prev => prev.filter((_, i) => i !== edgeIdx));
            setAdjMatrix(prev => {
                const edge = edges[edgeIdx];
                if (!edge) return prev;
                const fromIdx = nodes.findIndex(n => n.id === edge.from);
                const toIdx = nodes.findIndex(n => n.id === edge.to);
                if (fromIdx === -1 || toIdx === -1) return prev;
                const newMatrix = prev.map(row => [...row]);
                newMatrix[fromIdx][toIdx] = 0;
                return newMatrix;
            });
        }
    };

    // Пошук вузла по id
    const findNodeById = id => nodes.find(n => n.id === id);

    // Контрольна точка для кривої
    const calculateControlPoint = (from, to, edgeIndex) => {
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const midX = (from.x + to.x) / 2;
        const midY = (from.y + to.y) / 2;
        const offset = 50 + (edgeIndex % 3) * 15;
        const perpX = -dy / Math.sqrt(dx * dx + dy * dy) * offset;
        const perpY = dx / Math.sqrt(dx * dx + dy * dy) * offset;
        return {
            x: midX + perpX,
            y: midY + perpY
        };
    };

    //створити матрицю з графу
    const exportCurrentMatrix = () => {
        if (!adjMatrix || !adjMatrix.length) return '';
        return adjMatrix.map(row => row.join(' ')).join('\n');
    };

    // Створити граф з матриці
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

    // Розбір матриці з textarea
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
            {/* Меню */}
            <Menu
                matrixInput={matrixInput}
                setMatrixInput={setMatrixInput}
                parseMatrixInput={parseMatrixInput}
                exportCurrentMatrix={exportCurrentMatrix} // Додаємо проп тут!
            />
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

                    // Self-loop
                    if (from.id === to.id) {
                        const r = 20;
                        const loopRadius = 22;
                        const angleOffset = Math.PI / 6;
                        const centerAngle = -Math.PI / 2;
                        const startAngle = centerAngle - angleOffset;
                        const endAngle = centerAngle + angleOffset;
                        const startX = from.x + r * Math.cos(startAngle);
                        const startY = from.y + r * Math.sin(startAngle);
                        const endX = from.x + r * Math.cos(endAngle);
                        const endY = from.y + r * Math.sin(endAngle);
                        const labelAngle = centerAngle;
                        const labelRadius = r + loopRadius - 5;
                        const labelX = from.x + labelRadius * Math.cos(labelAngle);
                        const labelY = from.y + labelRadius * Math.sin(labelAngle);

                        return (
                            <g key={i}
                               style={{ cursor: activeTool === 'clrLine' ? 'pointer' : 'default' }}
                               onClick={activeTool === 'clrLine' ? (e) => { e.stopPropagation(); handleEdgeClick(i); } : undefined}
                            >
                                <path
                                    d={`
                                        M ${startX} ${startY}
                                        A ${loopRadius} ${loopRadius} 0 1 1 ${endX} ${endY}
                                    `}
                                    stroke="black"
                                    strokeWidth="2"
                                    fill="none"
                                    markerEnd="url(#arrow)"
                                />
                                <text
                                    x={labelX}
                                    y={labelY}
                                    textAnchor="middle"
                                    fontSize="12"
                                    fill="black"
                                    alignmentBaseline="baseline"
                                >
                                    {edge.label}
                                </text>
                            </g>
                        );
                    }

                    // Звичайна стрілка
                    const dx = to.x - from.x;
                    const dy = to.y - from.y;
                    const angle = Math.atan2(dy, dx);
                    const startX = from.x + 20 * Math.cos(angle);
                    const startY = from.y + 20 * Math.sin(angle);

                    // Контрольна точка для кривої
                    const control = calculateControlPoint(from, to, i);

                    // Обрізка кінця кривої по межі вершини
                    const r = 15;
                    const k = 0.8;
                    const bx = (1 - k) * (1 - k) * startX + 2 * (1 - k) * k * control.x + k * k * to.x;
                    const by = (1 - k) * (1 - k) * startY + 2 * (1 - k) * k * control.y + k * k * to.y;
                    const vecX = bx - to.x;
                    const vecY = by - to.y;
                    const len = Math.hypot(vecX, vecY);
                    const EndX = to.x + (vecX / len) * r;
                    const EndY = to.y + (vecY / len) * r;

                    // Позиція підпису ближче до голови
                    const t = 0.75;
                    const labelX = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * control.x + t * t * EndX;
                    const labelY = (1 - t) * (1 - t) * startY + 2 * (1 - t) * t * control.y + t * t * EndY;

                    return (
                        <g key={i}
                           style={{ cursor: activeTool === 'clrLine' ? 'pointer' : 'default' }}
                           onClick={activeTool === 'clrLine' ? (e) => { e.stopPropagation(); handleEdgeClick(i); } : undefined}
                        >
                            <path
                                d={`M ${startX} ${startY} Q ${control.x} ${control.y} ${EndX} ${EndY}`}
                                stroke="black"
                                strokeWidth="2"
                                fill="none"
                                markerEnd="url(#arrow)"
                            />
                            <text
                                x={labelX}
                                y={labelY - 5}
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
                    <g key={node.id}
                       style={{ cursor: activeTool === 'clrCircle' ? 'pointer' : 'default' }}
                       onClick={activeTool === 'clrCircle' ? (e) => { e.stopPropagation(); handleNodeClick(node.id); } : undefined}
                    >
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
            <Toolbar
                activeTool={activeTool}
                setActiveTool={tool => {
                    if (activeTool === tool) setActiveTool(null);
                    else setActiveTool(tool);
                }}
                persistent={true}
            />
        </div>
    );
};

export default GraphCanvas;