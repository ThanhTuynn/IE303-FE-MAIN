import React, { useEffect } from "react";

const TOAST_TYPES = {
    SUCCESS: {
        icon: "✅",
        backgroundColor: "#f0fdf4",
        borderColor: "#22c55e",
        color: "#14532d",
    },
    ERROR: {
        icon: "❌",
        backgroundColor: "#fef2f2",
        borderColor: "#ef4444",
        color: "#991b1b",
    },
    WARNING: {
        icon: "⚠️",
        backgroundColor: "#fffbeb",
        borderColor: "#f59e0b",
        color: "#92400e",
    },
    INFO: {
        icon: "ℹ️",
        backgroundColor: "#eff6ff",
        borderColor: "#3b82f6",
        color: "#1e40af",
    },
};

// DOM-based toast system
let toastId = 0;
let toastContainer = null;

// Create container if it doesn't exist
const getToastContainer = () => {
    if (!toastContainer) {
        toastContainer = document.createElement("div");
        toastContainer.id = "toast-container";
        toastContainer.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 999999;
            pointer-events: none;
        `;
        document.body.appendChild(toastContainer);
    }
    return toastContainer;
};

const createToastElement = (message, type) => {
    const id = ++toastId;
    const toastStyle = TOAST_TYPES[type];

    const toastDiv = document.createElement("div");
    toastDiv.id = `toast-${id}`;
    toastDiv.style.cssText = `
        display: flex;
        align-items: center;
        background-color: ${toastStyle.backgroundColor};
        color: ${toastStyle.color};
        border-left: 4px solid ${toastStyle.borderColor};
        border-radius: 8px;
        padding: 12px 16px;
        margin-bottom: 8px;
        min-width: 300px;
        max-width: 400px;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        pointer-events: auto;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;

    toastDiv.innerHTML = `
        <span style="font-size: 18px; margin-right: 10px;">${toastStyle.icon}</span>
        <span style="flex: 1; line-height: 1.4;">${message}</span>
        <button onclick="this.parentElement.remove()" style="
            margin-left: 12px;
            font-size: 18px;
            background: none;
            border: none;
            cursor: pointer;
            color: inherit;
            font-weight: bold;
            opacity: 0.7;
        ">×</button>
    `;

    const container = getToastContainer();
    container.appendChild(toastDiv);

    // Trigger animation
    setTimeout(() => {
        toastDiv.style.opacity = "1";
        toastDiv.style.transform = "translateX(0)";
    }, 10);

    // Auto remove
    setTimeout(() => {
        if (toastDiv.parentElement) {
            toastDiv.style.opacity = "0";
            toastDiv.style.transform = "translateX(100%)";
            setTimeout(() => {
                if (toastDiv.parentElement) {
                    toastDiv.remove();
                }
            }, 300);
        }
    }, 4000);

    return id;
};

// Toast Container Component - ensures container exists
export const ToastContainer = () => {
    useEffect(() => {
        getToastContainer();

        return () => {
            // Cleanup on unmount
            if (toastContainer && toastContainer.parentElement) {
                toastContainer.remove();
                toastContainer = null;
            }
        };
    }, []);

    return null;
};

// Export toast functions
export const toast = {
    success: (message) => createToastElement(message, "SUCCESS"),
    error: (message) => createToastElement(message, "ERROR"),
    warning: (message) => createToastElement(message, "WARNING"),
    info: (message) => createToastElement(message, "INFO"),
};

export default ToastContainer;
