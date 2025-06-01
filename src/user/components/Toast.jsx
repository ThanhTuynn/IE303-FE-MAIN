import React, { useState, useEffect } from "react";
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";

const Toast = ({ id, message, type = "info", duration = 5000, onClose, position = "top-right" }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);

    useEffect(() => {
        // Show animation
        setTimeout(() => setIsVisible(true), 10);

        // Auto dismiss
        if (duration > 0) {
            const timer = setTimeout(() => {
                handleClose();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [duration]);

    const handleClose = () => {
        setIsLeaving(true);
        setTimeout(() => {
            setIsVisible(false);
            onClose(id);
        }, 300);
    };

    const getToastConfig = () => {
        switch (type) {
            case "success":
                return {
                    bgColor: "bg-green-50",
                    borderColor: "border-green-200",
                    textColor: "text-green-800",
                    icon: CheckCircle,
                    iconColor: "text-green-500",
                };
            case "error":
                return {
                    bgColor: "bg-red-50",
                    borderColor: "border-red-200",
                    textColor: "text-red-800",
                    icon: AlertCircle,
                    iconColor: "text-red-500",
                };
            case "warning":
                return {
                    bgColor: "bg-yellow-50",
                    borderColor: "border-yellow-200",
                    textColor: "text-yellow-800",
                    icon: AlertTriangle,
                    iconColor: "text-yellow-500",
                };
            case "info":
            default:
                return {
                    bgColor: "bg-blue-50",
                    borderColor: "border-blue-200",
                    textColor: "text-blue-800",
                    icon: Info,
                    iconColor: "text-blue-500",
                };
        }
    };

    const config = getToastConfig();
    const IconComponent = config.icon;

    const getPositionClasses = () => {
        switch (position) {
            case "top-left":
                return "top-4 left-4";
            case "top-center":
                return "top-4 left-1/2 transform -translate-x-1/2";
            case "top-right":
            default:
                return "top-4 right-4";
            case "bottom-left":
                return "bottom-4 left-4";
            case "bottom-center":
                return "bottom-4 left-1/2 transform -translate-x-1/2";
            case "bottom-right":
                return "bottom-4 right-4";
        }
    };

    return (
        <div
            className={`
                transition-all duration-300 ease-in-out
                ${isVisible && !isLeaving ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-2 scale-95"}
            `}
            style={{
                width: "100%",
                marginBottom: "8px",
            }}
        >
            <div
                className={`
                    ${config.bgColor} ${config.borderColor} ${config.textColor}
                    border-l-4 rounded-lg shadow-lg p-4
                    flex items-start gap-3
                    hover:shadow-xl transition-shadow duration-200
                    min-w-[300px] max-w-[400px]
                `}
            >
                <IconComponent className={`w-5 h-5 ${config.iconColor} flex-shrink-0 mt-0.5`} />

                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-5 break-words">{message}</p>
                </div>

                <button
                    onClick={handleClose}
                    className={`
                        flex-shrink-0 ml-2 p-1 rounded-full
                        hover:bg-gray-200 hover:bg-opacity-50
                        transition-colors duration-150
                        ${config.textColor} hover:${config.textColor}
                    `}
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default Toast;
