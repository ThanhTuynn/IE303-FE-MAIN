// Utility functions for localStorage operations

export const getUserFromLocalStorage = () => {
    try {
        const userData = localStorage.getItem("userData");
        if (!userData || userData === "undefined" || userData === "null") {
            return null;
        }
        return JSON.parse(userData);
    } catch (error) {
        console.error("Failed to parse user data from localStorage:", error);
        // Clear invalid data
        localStorage.removeItem("userData");
        localStorage.removeItem("jwtToken");
        return null;
    }
};

export const setUserToLocalStorage = (user) => {
    try {
        localStorage.setItem("userData", JSON.stringify(user));
        return true;
    } catch (error) {
        console.error("Failed to save user data to localStorage:", error);
        return false;
    }
};

export const clearUserFromLocalStorage = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("jwtToken");
};

export const getTokenFromLocalStorage = () => {
    return localStorage.getItem("jwtToken");
};

export const setTokenToLocalStorage = (token) => {
    localStorage.setItem("jwtToken", token);
}; 