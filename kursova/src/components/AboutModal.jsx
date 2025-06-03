import React from 'react';
import '../styles/AboutModal.scss';

const AboutModal = ({ isOpen, onClose }) => {
    const aboutText = "Про проект: створив <a href='https://github.com/Guki125' target='_blank'>Buchi.q</a>, це перший мій великий проєкт та я надіюсь він має файний вигляд.";

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h3>Про проект</h3>
                <p dangerouslySetInnerHTML={{ __html: aboutText }} />
                <button onClick={onClose}>Закрити</button>
            </div>
        </div>
    );
};

export default AboutModal;