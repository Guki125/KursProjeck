import React, { useState } from 'react';

const Toolbar = () => {
    const [activeTool, setActiveTool] = useState('Add'); // Початковий стан

    const handleToolClick = (toolId) => {
        setActiveTool(toolId);
        console.log(`Обрано інструмент: ${toolId}`);
    };

    return (
        <div className="graph-canvas__toolbar">
            <button
                id="Add"
                className={`graph-canvas__tool ${activeTool === 'Add' ? 'graph-canvas__tool--active' : ''}`}
                onClick={() => handleToolClick('Add')}
            >
                ✏️
            </button>
            <button
                id="Clear"
                className={`graph-canvas__tool ${activeTool === 'Clear' ? 'graph-canvas__tool--active' : ''}`}
                onClick={() => handleToolClick('Clear')}
            >
                🧽
            </button>
        </div>
    );
};

export default Toolbar;