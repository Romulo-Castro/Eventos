import React from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

const ToastMessage = ({ show, onClose, message, variant = 'success', position = 'top-end' }) => {
  return (
    <ToastContainer position={position} className="p-3">
      <Toast show={show} onClose={onClose} delay={3000} autohide>
        <Toast.Header>
          <strong className="me-auto">Notificação</strong>
        </Toast.Header>
        <Toast.Body className={`text-${variant}`}>
          {message || 'Operação realizada com sucesso!'}
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default ToastMessage;
