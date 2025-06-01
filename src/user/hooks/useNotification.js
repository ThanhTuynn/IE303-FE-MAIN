import { useToast } from "../components/ToastContainer";

const useNotification = () => {
    const { showSuccess, showError, showWarning, showInfo, clearAll } = useToast();

    return {
        success: showSuccess,
        error: showError,
        warning: showWarning,
        info: showInfo,
        clearAll,
    };
};

export default useNotification; 