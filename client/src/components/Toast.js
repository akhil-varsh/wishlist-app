import React, { useState, useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose, autoClose = 3000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, autoClose);

      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  if (!isVisible) return null;

  const bgColor = type === 'success' ? 'bg-success' : 
                  type === 'error' ? 'bg-danger' : 
                  type === 'warning' ? 'bg-warning' : 'bg-info';

  const icon = type === 'success' ? 'bi-check-circle-fill' :
               type === 'error' ? 'bi-exclamation-triangle-fill' :
               type === 'warning' ? 'bi-exclamation-circle-fill' : 'bi-info-circle-fill';

  return (
    <div 
      className={`position-fixed bottom-0 end-0 p-3 toast-container`} 
      style={{ zIndex: 1050 }}
    >
      <div 
        className={`toast show ${bgColor} text-white`} 
        role="alert" 
        aria-live="assertive" 
        aria-atomic="true"
      >
        <div className="toast-header d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <i className={`bi ${icon} me-2`}></i>
            <strong className="me-auto">Notification</strong>
          </div>
          <button 
            type="button" 
            className="btn-close btn-close-white" 
            aria-label="Close"
            onClick={handleClose} 
          ></button>
        </div>
        <div className="toast-body">
          {message}
        </div>
      </div>
    </div>
  );
};

export default Toast;
