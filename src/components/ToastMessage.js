import React from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

const ToastMessage = ({ show, onClose, message, variant = 'success' }) => {
  return (
    <ToastContainer position="top-end" className="p-3">
      <Toast show={show} onClose={onClose} delay={3000} autohide>
        <Toast.Header>
          <strong className="me-auto">Notificação</strong>
        </Toast.Header>
        <Toast.Body className={`text-${variant}`}>
          {message}
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default ToastMessage;
