// Toolbar.jsx
import React from 'react';
import penImage from '../image/image1.jpg';
import lastImage from '../image/image2.jpg';
import circleImage from '../image/Ellipse3.jpg';
import backImage from '../image/image3.jpg';
import lineImage from '../image/image4.jpg';
import clrLineImage from '../image/Group1.jpg';

const Toolbar = ({ activeTool, setActiveTool }) => {
    const handleBackClick = () => {
        setActiveTool(null);
        console.log('Повернення до головної панелі');
    };

    return (
        <div className="graph-canvas__toolbar">
            {activeTool === 'Add' ? (
                <div className="toolbar--add-mode">
                    <button className="tool-btn" onClick={handleBackClick}>
                        <img src={backImage} alt="Назад" />
                    </button>
                    <button className="tool-btn" onClick={() => setActiveTool('circle')}>
                        <img src={circleImage} alt="Додати коло" />
                    </button>
                    <button className="tool-btn" onClick={() => setActiveTool('line')}>
                        <img src={lineImage} alt="Додати стрілку" />
                    </button>
                </div>
            ) : activeTool === 'Clear' ? (
                <div className="toolbar--clear-mode">
                    <button className="tool-btn" onClick={handleBackClick}>
                        <img src={backImage} alt="Назад" />
                    </button>
                    <button className="tool-btn">
                        <img src={clrLineImage} alt="Видалити коло" />
                    </button>
                    <button className="tool-btn">
                        <img src="#" alt="Видалити стрілку" />
                    </button>
                </div>
            ) : (
                <>
                    <button
                        id="Add"
                        className={`graph-canvas__tool ${activeTool === 'Add' ? 'graph-canvas__tool--active' : ''}`}
                        onClick={() => setActiveTool('Add')}
                    >
                        <img src={penImage} alt="Add tool" />
                    </button>
                    <button
                        id="Clear"
                        className={`graph-canvas__tool ${activeTool === 'Clear' ? 'graph-canvas__tool--active' : ''}`}
                        onClick={() => setActiveTool('Clear')}
                    >
                        <img src={lastImage} alt="Clear tool" />
                    </button>
                </>
            )}
        </div>
    );
};

export default Toolbar;