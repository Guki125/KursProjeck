import React, { useState } from 'react';
import AboutModal from './AboutModal';
import '../styles/Menu.scss';

const menuItems = [
    { id: 1, label: 'Про проект', type: 'about' },
    { id: 2, label: 'Ввести матрицю', type: 'matrix' },
    { id: 3, label: 'Граф → матриця', type: 'exportMatrix' }, // новий пункт
];

const Menu = ({
                  matrixInput,
                  setMatrixInput,
                  parseMatrixInput,
                  exportCurrentMatrix // новий проп
              }) => {
    const [open, setOpen] = useState(false);
    const [showMatrixInput, setShowMatrixInput] = useState(false);
    const [showAboutModal, setShowAboutModal] = useState(false);
    const [showExportMatrix, setShowExportMatrix] = useState(false);
    const [matrixString, setMatrixString] = useState('');
    const placeholderMatrix = "0 1 0\n0 0 1\n1 0 0";

    return (
        <div className={`graph-menu${open ? ' graph-menu--open' : ''}`}>
            <button
                className={`graph-menu__toggle${open ? ' graph-menu__toggle--open' : ''}`}
                onClick={() => setOpen(o => !o)}
                aria-label={open ? "Закрити меню" : "Відкрити меню"}
            >
                <span />
                <span />
                <span />
            </button>
            <div className="graph-menu__panel">
                <div className="graph-menu__items">
                    {menuItems.map(item => (
                        <button
                            key={item.id}
                            className="graph-menu__item"
                            onClick={() => {
                                if (item.type === 'matrix') setShowMatrixInput(true);
                                else if (item.type === 'about') setShowAboutModal(true);
                                else if (item.type === 'exportMatrix') {
                                    if (typeof exportCurrentMatrix === 'function') {
                                        setMatrixString(exportCurrentMatrix());
                                        setShowExportMatrix(true);
                                    }
                                }
                            }}
                            tabIndex={open ? 0 : -1}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>
            {showMatrixInput && (
                <div className="matrix-panel__overlay" onClick={() => setShowMatrixInput(false)}>
                    <div className="matrix-panel" onClick={e => e.stopPropagation()}>
                        <h3>Введіть матрицю суміжності</h3>
                        <textarea
                            rows="5"
                            placeholder={placeholderMatrix}
                            value={matrixInput}
                            onChange={e => setMatrixInput(e.target.value)}
                        />
                        <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                            <button
                                onClick={() => {
                                    parseMatrixInput();
                                    setShowMatrixInput(false);
                                }}
                            >
                                Створити граф
                            </button>
                            <button onClick={() => setShowMatrixInput(false)}>Закрити</button>
                        </div>
                    </div>
                </div>
            )}
            {showExportMatrix && (
                <div className="matrix-panel__overlay" onClick={() => setShowExportMatrix(false)}>
                    <div className="matrix-panel" onClick={e => e.stopPropagation()}>
                        <h3>Матриця суміжності графа</h3>
                        <textarea
                            value={matrixString}
                            readOnly
                            rows="5"
                            style={{ width: '100%' }}
                        />
                        <div style={{ marginTop: 8 }}>
                            <button onClick={() => setShowExportMatrix(false)}>Закрити</button>
                        </div>
                    </div>
                </div>
            )}
            {showAboutModal && (
                <AboutModal
                    isOpen={showAboutModal}
                    onClose={() => setShowAboutModal(false)}
                />
            )}
        </div>
    );
};

export default Menu;