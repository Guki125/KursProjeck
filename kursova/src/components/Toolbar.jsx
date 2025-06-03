import React from 'react';
import penImage from '../image/image1.jpg';
import lastImage from '../image/image2.jpg';
import circleImage from '../image/Ellipse3.jpg';
import backImage from '../image/image3.jpg';
import lineImage from '../image/image4.jpg';
import clrLineImage from '../image/Group1.jpg';
import clrCircelImage from '../image/Group2.jpg';

const Toolbar = ({ activeTool, setActiveTool }) => {
    const handleBackClick = () => {
        setActiveTool(null);
        console.log('Повернення до головної панелі');
    };

    return (
        <div className="graph-canvas__toolbar">
            {(activeTool === 'Add' || activeTool === 'circle' || activeTool === 'line') ? (
                <div className="toolbar--add-mode">
                    <button className="tool-btn" onClick={handleBackClick}>
                        <img src={backImage} alt="Назад" />
                    </button>
                    <button
                        className={`tool-btn ${activeTool === 'circle' ? 'active' : ''}`}
                        onClick={() => setActiveTool('circle')}
                    >
                        <img src={circleImage} alt="Додати коло" />
                    </button>
                    <button
                        className={`tool-btn ${activeTool === 'line' ? 'active' : ''}`}
                        onClick={() => setActiveTool('line')}
                    >
                        <img src={lineImage} alt="Додати стрілку" />
                    </button>
                </div>
            ) : (activeTool === 'Clear' || activeTool === 'clrCircle' || activeTool === 'clrLine') ? (
                <div className="toolbar--clear-mode">
                    <button className="tool-btn" onClick={handleBackClick}>
                        <img src={backImage} alt="Назад" />
                    </button>
                    <button
                        className={`tool-btn ${activeTool === 'clrCircle' ? 'active' : ''}`}
                        onClick={() => setActiveTool('clrCircle')}
                    >
                        <img src={clrCircelImage} alt="Видалити коло" />
                    </button>
                    <button
                        className={`tool-btn ${activeTool === 'clrLine' ? 'active' : ''}`}
                        onClick={() => setActiveTool('clrLine')}
                    >
                        <img src={clrLineImage} alt="Видалити стрілку" />
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