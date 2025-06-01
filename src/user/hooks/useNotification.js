import { useToast } from '../components/ToastContainer';

export const useNotification = () => {
    const toast = useToast();

    return {
        // Success notifications (green)
        success: (message, duration = 4000) => {
            return toast.showSuccess(message, duration);
        },

        // Error notifications (red)
        error: (message, duration = 6000) => {
            return toast.showError(message, duration);
        },

        // Warning notifications (yellow)
        warning: (message, duration = 5000) => {
            return toast.showWarning(message, duration);
        },

        // Info notifications (blue)
        info: (message, duration = 4000) => {
            return toast.showInfo(message, duration);
        },

        // Clear all notifications
        clearAll: () => {
            return toast.clearAll();
        },

        // Custom notification with full control
        custom: (message, type, duration) => {
            return toast.addToast(message, type, duration);
        }
    };
};

export default useNotification; 