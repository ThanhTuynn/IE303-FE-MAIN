import React, { createContext, useContext, useState, useCallback } from "react";
import Toast from "./Toast";

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = "info", duration = 5000) => {
        const id = Date.now() + Math.random();
        const newToast = {
            id,
            message,
            type,
            duration,
        };

        setToasts((prev) => {
            // Limit to 5 toasts max
            const updated = [...prev, newToast];
            return updated.slice(-5);
        });

        return id;
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    // Convenience methods
    const showSuccess = useCallback(
        (message, duration) => {
            return addToast(message, "success", duration);
        },
        [addToast]
    );

    const showError = useCallback(
        (message, duration) => {
            return addToast(message, "error", duration);
        },
        [addToast]
    );

    const showWarning = useCallback(
        (message, duration) => {
            return addToast(message, "warning", duration);
        },
        [addToast]
    );

    const showInfo = useCallback(
        (message, duration) => {
            return addToast(message, "info", duration);
        },
        [addToast]
    );

    const clearAll = useCallback(() => {
        setToasts([]);
    }, []);

    const value = {
        addToast,
        removeToast,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        clearAll,
        toasts,
    };

    return (
        <ToastContext.Provider value={value}>
            {children}
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </ToastContext.Provider>
    );
};

const ToastContainer = ({ toasts, onRemove }) => {
    return (
        <div
            className="toast-container"
            style={{
                position: "fixed",
                bottom: "0",
                right: "0",
                zIndex: "9999",
                pointerEvents: "none",
                width: "auto",
                height: "auto",
            }}
        >
            {toasts.map((toast, index) => (
                <div
                    key={toast.id}
                    style={{
                        position: "relative",
                        marginBottom: "12px",
                        marginRight: "20px",
                        marginTop: index === 0 ? "20px" : "0",
                        pointerEvents: "auto",
                        transform: `translateY(-${index * 80}px)`,
                        zIndex: 9999 + index,
                    }}
                >
                    <Toast
                        id={toast.id}
                        message={toast.message}
                        type={toast.type}
                        duration={toast.duration}
                        onClose={onRemove}
                    />
                </div>
            ))}
        </div>
    );
};

export default ToastContainer;
