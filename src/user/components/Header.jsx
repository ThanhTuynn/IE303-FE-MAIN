import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell, User, ShoppingBag, Phone, Heart, Search } from "lucide-react";
import axios from "axios";

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [cartItemCount, setCartItemCount] = useState(0);
    const [userId, setUserId] = useState(null);

    // Check login status and get user info
    useEffect(() => {
        const checkLoginStatus = () => {
            const token = localStorage.getItem("jwtToken");
            const userData = localStorage.getItem("userData");

            setIsLoggedIn(!!token);

            if (userData && token) {
                try {
                    const user = JSON.parse(userData);
                    setUserId(user.id || user._id);
                } catch (e) {
                    console.error("Failed to parse user data:", e);
                    // Clear invalid data
                    localStorage.removeItem("jwtToken");
                    localStorage.removeItem("userData");
                    setIsLoggedIn(false);
                    setUserId(null);
                }
            } else {
                setUserId(null);
            }
        };

        // Initial check
        checkLoginStatus();

        // Listen for login/logout events
        const handleAuthChange = () => {
            checkLoginStatus();
        };

        // Listen for storage changes and custom events
        window.addEventListener("storage", checkLoginStatus);
        window.addEventListener("userLoggedIn", handleAuthChange);
        window.addEventListener("userLoggedOut", handleAuthChange);

        return () => {
            window.removeEventListener("storage", checkLoginStatus);
            window.removeEventListener("userLoggedIn", handleAuthChange);
            window.removeEventListener("userLoggedOut", handleAuthChange);
        };
    }, []);

    // Fetch cart item count
    useEffect(() => {
        const fetchCartItemCount = async () => {
            if (!isLoggedIn || !userId) {
                setCartItemCount(0);
                return;
            }

            try {
                const token = localStorage.getItem("jwtToken");
                const response = await axios.get(`http://localhost:8080/api/carts/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.data && response.data.items) {
                    // Calculate total quantity of all items
                    const totalCount = response.data.items.reduce((total, item) => total + item.quantity, 0);
                    setCartItemCount(totalCount);
                } else {
                    setCartItemCount(0);
                }
            } catch (error) {
                console.error("Error fetching cart:", error);
                setCartItemCount(0);
            }
        };

        fetchCartItemCount();

        // Set up interval to refresh cart count every 30 seconds
        const interval = setInterval(fetchCartItemCount, 30000);

        return () => clearInterval(interval);
    }, [isLoggedIn, userId]);

    // Listen for storage events to update cart count when items are added
    useEffect(() => {
        const handleStorageChange = () => {
            if (isLoggedIn && userId) {
                fetchCartItemCount();
            }
        };

        const fetchCartItemCount = async () => {
            try {
                const token = localStorage.getItem("jwtToken");
                const response = await axios.get(`http://localhost:8080/api/carts/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.data && response.data.items) {
                    const totalCount = response.data.items.reduce((total, item) => total + item.quantity, 0);
                    setCartItemCount(totalCount);
                } else {
                    setCartItemCount(0);
                }
            } catch (error) {
                console.error("Error fetching cart:", error);
                setCartItemCount(0);
            }
        };

        // Listen for custom cart update events
        window.addEventListener("cartUpdated", handleStorageChange);

        return () => {
            window.removeEventListener("cartUpdated", handleStorageChange);
        };
    }, [isLoggedIn, userId]);

    const isActive = (path) => location.pathname === path;

    const handleLogin = () => {
        navigate("/login");
    };

    const handleLogout = () => {
        // Clear all user-related data from localStorage
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("userData");

        // Reset all states
        setIsLoggedIn(false);
        setUserId(null);
        setCartItemCount(0);

        // Dispatch custom event to notify other components
        window.dispatchEvent(new Event("userLoggedOut"));

        // Navigate to home page
        navigate("/");

        console.log("User logged out successfully");
    };

    return (
        <header className="w-full font-kanit sticky top-0 z-50 bg-white">
            {/* Main Header */}
            <div className="bg-white py-2 px-4 md:px-6 lg:px-8 flex items-center justify-between">
                <Link to="/" className="flex items-center">
                    <img
                        src="https://res.cloudinary.com/dbr85jktp/image/upload/v1747726195/Blue_White_Bold_Playful_Kids_Clothing_Logo_1000_x_500_px_2_g7qika.png"
                        alt="Logo"
                        className="h-24 w-auto mr-2"
                    />
                </Link>

                <nav className="hidden md:flex space-x-8 flex-1 justify-center">
                    <Link
                        to="/"
                        className={`text-2xl font-semibold hover:text-red-600 ${
                            isActive("/") ? "text-red-600 border-b-2 border-red-600" : "text-black"
                        }`}
                    >
                        TRANG CHỦ
                    </Link>

                    <Link
                        to="/menu"
                        className={`text-2xl font-semibold hover:text-red-600 ${
                            isActive("/menu") ? "text-red-600 border-b-2 border-red-600" : "text-black"
                        }`}
                    >
                        THỰC ĐƠN
                    </Link>

                    <Link
                        to="/promotions"
                        className={`text-2xl font-semibold hover:text-red-600 ${
                            isActive("/promotions") ? "text-red-600 border-b-2 border-red-600" : "text-black"
                        }`}
                    >
                        KHUYẾN MÃI
                    </Link>

                    <Link
                        to="/about-us"
                        className={`text-2xl font-semibold hover:text-red-600 ${
                            isActive("/about-us") ? "text-red-600 border-b-2 border-red-600" : "text-black"
                        }`}
                    >
                        VỀ CHÚNG TÔI
                    </Link>
                </nav>

                <div className="flex space-x-4">
                    {isLoggedIn ? (
                        <>
                            {/* User icons and Logout */}
                            <Link to="/favourite">
                                <Heart
                                    className={`h-6 w-6 cursor-pointer transition-colors duration-200 ${
                                        isActive("/favourite") ? "text-red-600" : "text-black"
                                    }`}
                                />
                            </Link>
                            <Link to="/notifications">
                                <Bell
                                    className={`h-6 w-6 cursor-pointer transition-colors duration-200 ${
                                        isActive("/notifications") ? "text-red-600" : "text-black"
                                    }`}
                                />
                            </Link>
                            <Link to="/profile">
                                <User
                                    className={`h-6 w-6 cursor-pointer transition-colors duration-200 ${
                                        isActive("/profile") ? "text-red-600" : "text-black"
                                    }`}
                                />
                            </Link>
                            <Link to="/cart" className="relative">
                                <ShoppingBag
                                    className={`h-6 w-6 cursor-pointer transition-colors duration-200 ${
                                        isActive("/cart") ? "text-red-600" : "text-black"
                                    }`}
                                />
                                {/* Cart Item Count Badge */}
                                {cartItemCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[20px] px-1">
                                        {cartItemCount > 99 ? "99+" : cartItemCount}
                                    </span>
                                )}
                            </Link>
                            {/* Logout Button */}
                            <button
                                onClick={handleLogout}
                                className="text-black hover:text-red-600 transition-colors duration-200 text-base font-semibold"
                            >
                                Đăng xuất
                            </button>
                        </>
                    ) : (
                        // Login/Signup Button
                        <button
                            onClick={handleLogin}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200"
                        >
                            ĐĂNG NHẬP / ĐĂNG KÝ
                        </button>
                    )}
                </div>
            </div>

            {/* Hotline */}
            <div className="bg-black text-white py-2 px-4 flex justify-center">
                <div className="bg-red-600 rounded-full py-1 px-6 flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-white" />
                    <span className="font-medium">Hotline: 0382868383</span>
                </div>
            </div>
        </header>
    );
};

export default Header;
