import React, { useState, useEffect, useRef } from "react";
import { X, MessageCircle, User, Bot, Send, RefreshCw } from "lucide-react";
import {
    API_CONFIG,
    buildApiUrl,
    generateSessionId,
    getStoredSessionId,
    setStoredSessionId,
    clearStoredSessionId,
} from "../../utils/config";
import { useNavigate } from "react-router-dom";
import {
    getConversationMessages,
    startConversation as startChatConversation,
    sendMessage as sendChatMessage,
} from "../services/chatService";

const ChatBotWidget = () => {
    const [open, setOpen] = useState(false);
    const [chatType, setChatType] = useState(null); // 'admin' | 'chatbot'
    const [conversationId, setConversationId] = useState(null);
    const [chatbotSessionId, setChatbotSessionId] = useState(null); // Unique session ID for chatbot
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [typing, setTyping] = useState(false);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    const chatbotIcon = "https://res.cloudinary.com/dbr85jktp/image/upload/v1747658202/chatboticx_btdz3t.webp";

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Load stored sessionId when component mounts
    useEffect(() => {
        if (chatType === "chatbot" && !chatbotSessionId) {
            const storedSessionId = getStoredSessionId(chatType);
            if (storedSessionId) {
                setChatbotSessionId(storedSessionId);
                setConversationId(storedSessionId);
                console.log("🔄 Loaded stored sessionId:", storedSessionId);
            }
        }
    }, [chatType, chatbotSessionId]);

    // Polling for new messages when chatting with admin
    useEffect(() => {
        if (chatType === "admin" && conversationId) {
            const interval = setInterval(() => {
                fetchNewMessages();
            }, 3000); // Poll every 3 seconds
            return () => clearInterval(interval);
        }
    }, [chatType, conversationId]);

    const fetchNewMessages = async () => {
        if (!conversationId || chatType !== "admin") return;

        try {
            const newMessages = await getConversationMessages(conversationId);
            // Only update if we have new messages (compare by length or timestamp)
            if (newMessages.length > messages.length) {
                setMessages(newMessages);
            }
        } catch (error) {
            console.error("Error fetching new messages:", error);
            // Don't show error for polling failures to avoid spam
        }
    };

    const startConversation = async (type) => {
        try {
            setLoading(true);
            setError(null);

            // Generate new sessionId for chatbot type
            if (type === "chatbot") {
                // Check if there's already a stored session for this chat type
                let sessionId = getStoredSessionId(type);

                // Always create a new session when starting a new conversation
                sessionId = generateSessionId();
                setChatbotSessionId(sessionId);
                setStoredSessionId(type, sessionId);

                console.log("🆔 Generated new chatbot sessionId:", sessionId);

                // For chatbot, we don't need to call backend startChatConversation
                // We'll use the generated sessionId directly
                setChatType(type);
                setConversationId(sessionId); // Use sessionId as conversationId for consistency
            } else {
                // For admin chat, use the existing backend logic
                const data = await startChatConversation({ chatType: type });
                setConversationId(data.conversationId);
                setChatType(type);
            }

            // Set initial welcome message
            const welcomeMessage =
                type === "admin"
                    ? "Xin chào! Bạn đã kết nối với bộ phận hỗ trợ UniFoodie. Chúng tôi sẽ hỗ trợ bạn trong thời gian sớm nhất."
                    : "Xin chào! Tôi là chatbot của UniFoodie. Tôi có thể giúp bạn:\n• Tìm kiếm món ăn\n• Các thông tin về UniFoodie\nBạn cần hỗ trợ gì?";

            setMessages([
                {
                    id: Date.now(),
                    content: welcomeMessage,
                    isUser: false,
                    timestamp: new Date().toISOString(),
                },
            ]);
        } catch (error) {
            console.error("Error starting conversation:", error);
            setError("Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng và thử lại.");
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async () => {
        if (!input.trim() || !conversationId || loading) return;

        if (input.length > API_CONFIG.CHAT_CONFIG.MAX_MESSAGE_LENGTH) {
            setError(`Tin nhắn không được vượt quá ${API_CONFIG.CHAT_CONFIG.MAX_MESSAGE_LENGTH} ký tự.`);
            return;
        }

        const userMessage = {
            id: Date.now(),
            content: input.trim(),
            isUser: true,
            timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);
        setTyping(true);
        setError(null);

        try {
            // Gọi trực tiếp n8n webhook cho chatbot
            if (chatType === "chatbot") {
                console.log("=== N8N REQUEST DEBUG ===");
                console.log("N8N URL:", API_CONFIG.N8N_WEBHOOK_URL);

                const payload = {
                    sessionId: chatbotSessionId || conversationId || generateSessionId(),
                    action: "sendMessage",
                    chatInput: userMessage.content,
                };
                console.log("Request payload:", JSON.stringify(payload, null, 2));

                try {
                    console.log("Sending fetch request...");
                    const response = await fetch(API_CONFIG.N8N_WEBHOOK_URL, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(payload),
                    });

                    console.log("N8n response received:");
                    console.log("- Status:", response.status);
                    console.log("- Status Text:", response.statusText);
                    console.log("- Headers:", Object.fromEntries(response.headers.entries()));

                    if (!response.ok) {
                        throw new Error(`N8n HTTP error! status: ${response.status} ${response.statusText}`);
                    }

                    // Đọc response text trước
                    const responseText = await response.text();
                    console.log("Raw response text:", responseText);
                    console.log("Response length:", responseText.length);

                    let data = {};
                    if (responseText && responseText.trim()) {
                        try {
                            data = JSON.parse(responseText);
                            if (Array.isArray(data)) data = data[0];
                            // Nếu có trường output là string và có markdown JSON bên trong
                            if (typeof data.output === "string") {
                                // Ưu tiên tìm trong markdown ```json ... ```
                                const mdMatch = data.output.match(/```json([\s\S]*?)```/i);
                                let jsonStr = null;
                                if (mdMatch) {
                                    jsonStr = mdMatch[1];
                                } else {
                                    // Nếu không có markdown, tìm đoạn mảng hoặc object JSON
                                    const arrMatch = data.output.match(/\[([\s\S]*?)\]/);
                                    if (arrMatch) jsonStr = `[${arrMatch[1]}]`;
                                    else {
                                        const objMatch = data.output.match(/{[\s\S]*}/);
                                        if (objMatch) jsonStr = objMatch[0];
                                    }
                                }
                                if (jsonStr) {
                                    try {
                                        const extracted = JSON.parse(jsonStr);
                                        // Nếu là mảng món ăn (dạng gợi ý), set vào food_suggestions
                                        if (
                                            Array.isArray(extracted) &&
                                            extracted[0] &&
                                            (extracted[0]["Tên món"] || extracted[0]["name"])
                                        ) {
                                            data = {
                                                ...data,
                                                food_suggestions: extracted,
                                            };
                                        } else {
                                            // Gộp lại: giữ cả output text và suggested_items
                                            data = {
                                                ...data,
                                                ...extracted,
                                            };
                                        }
                                    } catch (e) {
                                        // Nếu parse lỗi thì giữ nguyên output text
                                    }
                                }
                            }
                        } catch (parseError) {
                            data = { output: responseText };
                        }
                    }

                    setTimeout(() => {
                        setMessages((prev) => [
                            ...prev,
                            data.food_suggestions
                                ? {
                                      id: Date.now() + 1,
                                      food_suggestions: data.food_suggestions,
                                      content: data.output,
                                      isUser: false,
                                      timestamp: new Date().toISOString(),
                                  }
                                : data.suggested_items
                                ? {
                                      id: Date.now() + 1,
                                      suggested_items: data.suggested_items,
                                      content: data.output,
                                      isUser: false,
                                      timestamp: new Date().toISOString(),
                                  }
                                : {
                                      id: Date.now() + 1,
                                      content:
                                          data.output ||
                                          data.response ||
                                          data.message ||
                                          "Cảm ơn bạn đã liên hệ! Tôi sẽ cố gắng giúp bạn.",
                                      isUser: false,
                                      timestamp: new Date().toISOString(),
                                  },
                        ]);
                        setTyping(false);
                    }, API_CONFIG.CHAT_CONFIG.TYPING_DELAY);
                } catch (fetchError) {
                    console.error("=== N8N FETCH ERROR ===");
                    console.error("Error type:", fetchError.name);
                    console.error("Error message:", fetchError.message);
                    console.error("Full error:", fetchError);

                    // Fallback response khi có lỗi
                    setTimeout(() => {
                        setMessages((prev) => [
                            ...prev,
                            {
                                id: Date.now() + 1,
                                content:
                                    "Xin lỗi, chatbot hiện không khả dụng. Vui lòng thử lại sau hoặc liên hệ nhân viên hỗ trợ.",
                                isUser: false,
                                timestamp: new Date().toISOString(),
                            },
                        ]);
                        setTyping(false);
                    }, API_CONFIG.CHAT_CONFIG.TYPING_DELAY);
                }
            } else {
                // Gọi backend API cho admin chat
                console.log("Calling backend API:", buildApiUrl(API_CONFIG.ENDPOINTS.CHAT.SEND));

                const data = await sendChatMessage({
                    conversationId,
                    message: userMessage.content,
                });

                console.log("Backend response data:", data);

                setTimeout(() => {
                    setTyping(false);
                }, API_CONFIG.CHAT_CONFIG.TYPING_DELAY);
            }
        } catch (error) {
            console.error("Error sending message:", error);
            setError(`Lỗi kết nối: ${error.message}`);

            setTimeout(() => {
                setMessages((prev) => [
                    ...prev,
                    {
                        id: Date.now() + 1,
                        content:
                            chatType === "admin"
                                ? "Xin lỗi, hiện tại không có nhân viên hỗ trợ trực tuyến. Vui lòng thử lại sau hoặc chọn AI Chatbot để được hỗ trợ ngay."
                                : "Xin lỗi, chatbot đang gặp sự cố. Vui lòng thử lại sau hoặc liên hệ nhân viên hỗ trợ.",
                        isUser: false,
                        timestamp: new Date().toISOString(),
                    },
                ]);
                setTyping(false);
            }, API_CONFIG.CHAT_CONFIG.TYPING_DELAY);
        } finally {
            setLoading(false);
        }
    };

    const resetChat = () => {
        // Clear stored session for the current chat type
        if (chatType) {
            clearStoredSessionId(chatType);
        }

        setChatType(null);
        setConversationId(null);
        setChatbotSessionId(null);
        setMessages([]);
        setError(null);
        setTyping(false);
        setLoading(false);
    };

    const startNewChatSession = () => {
        if (chatType === "chatbot") {
            // Generate new sessionId and reset messages
            const newSessionId = generateSessionId();
            setChatbotSessionId(newSessionId);
            setConversationId(newSessionId);
            setStoredSessionId(chatType, newSessionId);

            console.log("🆔 Started new chatbot session:", newSessionId);

            // Reset messages with welcome message
            setMessages([
                {
                    id: Date.now(),
                    content:
                        "Xin chào! Tôi là chatbot của UniFoodie. Tôi có thể giúp bạn:\n• Tìm kiếm món ăn\n• Các thông tin về UniFoodie\nBạn cần hỗ trợ gì?",
                    isUser: false,
                    timestamp: new Date().toISOString(),
                },
            ]);

            setError(null);
            setTyping(false);
            setLoading(false);
        } else {
            // For admin chat, just reset to selection screen
            resetChat();
        }
    };

    const closeChat = () => {
        setOpen(false);
        // Keep chat state when closing, don't reset
    };

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 font-kanit">
            {/* Chat Button */}
            {!open && (
                <button
                    onClick={() => setOpen(true)}
                    className="w-14 h-14 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
                >
                    <MessageCircle className="w-7 h-7 text-white" />
                </button>
            )}

            {/* Chat Window */}
            {open && (
                <div className="mt-3 w-[380px] h-[520px] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 animate-slide-up">
                    {/* Header */}
                    <div className="bg-red-600 text-white px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <img src={chatbotIcon} className="w-8 h-8 rounded-full" alt="UniFoodie" />
                            <div>
                                <div className="font-bold text-sm">UniFoodie Support</div>
                                <div className="text-xs opacity-90">
                                    {chatType === "admin"
                                        ? "Nhân viên hỗ trợ"
                                        : chatType === "chatbot"
                                        ? "AI Assistant"
                                        : "Chọn loại hỗ trợ"}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {/* New Chat Session Button - Only show for chatbot */}
                            {chatType === "chatbot" && (
                                <button
                                    onClick={startNewChatSession}
                                    className="hover:bg-red-700 p-1 rounded transition-colors"
                                    title="Tạo phiên chat mới"
                                >
                                    <RefreshCw size={16} />
                                </button>
                            )}
                            <button onClick={closeChat} className="hover:bg-red-700 p-1 rounded transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-400 p-3">
                            <div className="text-sm text-red-700">{error}</div>
                            <button
                                onClick={() => setError(null)}
                                className="text-xs text-red-500 hover:text-red-700 mt-1"
                            >
                                Đóng
                            </button>
                        </div>
                    )}

                    {/* Chat Type Selection */}
                    {!chatType && (
                        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gray-50">
                            <h3 className="text-lg font-semibold text-gray-800 mb-6 text-center">Chọn loại hỗ trợ</h3>

                            <div className="space-y-4 w-full">
                                <button
                                    onClick={() => startConversation("admin")}
                                    disabled={loading}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg flex items-center gap-3 transition-colors disabled:opacity-50"
                                >
                                    <User className="w-5 h-5" />
                                    <div className="text-left">
                                        <div className="font-semibold">Nhân viên hỗ trợ</div>
                                        <div className="text-sm opacity-90">Chat với nhân viên thực</div>
                                    </div>
                                </button>

                                <button
                                    onClick={() => startConversation("chatbot")}
                                    disabled={loading}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg flex items-center gap-3 transition-colors disabled:opacity-50"
                                >
                                    <Bot className="w-5 h-5" />
                                    <div className="text-left">
                                        <div className="font-semibold">AI Chatbot</div>
                                        <div className="text-sm opacity-90">Trả lời tự động 24/7</div>
                                    </div>
                                </button>
                            </div>

                            {loading && (
                                <div className="mt-4 text-sm text-gray-600 flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-gray-300 border-t-red-600 rounded-full animate-spin"></div>
                                    Đang kết nối...
                                </div>
                            )}
                        </div>
                    )}

                    {/* Chat Messages */}
                    {chatType && (
                        <>
                            <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-gray-50">
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
                                    >
                                        <div
                                            className={`max-w-[80%] px-4 py-2 rounded-lg text-sm ${
                                                message.isUser
                                                    ? "bg-red-600 text-white rounded-br-sm"
                                                    : "bg-white text-gray-800 rounded-bl-sm shadow-sm"
                                            }`}
                                        >
                                            {message.food_suggestions ? (
                                                <div className="grid grid-cols-1 gap-3">
                                                    {message.food_suggestions.map((item, idx) => {
                                                        // Use regular id for food cart
                                                        const foodId = item.id;
                                                        console.log("🍔 Food suggestion item:", item);
                                                        console.log("🆔 Extracted food ID:", foodId);

                                                        const handleFoodClick = async () => {
                                                            if (foodId && foodId !== "undefined" && foodId !== "null") {
                                                                // We have a valid id, navigate directly
                                                                const navigateUrl = `/food/${foodId}`;
                                                                console.log(
                                                                    "🚀 Navigating with food ID to:",
                                                                    navigateUrl
                                                                );
                                                                navigate(navigateUrl);
                                                            } else {
                                                                // No valid id, try to find food by name
                                                                console.log(
                                                                    "⚠️ No valid ID found, trying to find food by name:",
                                                                    item["Tên món"] || item.name
                                                                );
                                                                try {
                                                                    const response = await fetch(
                                                                        "http://localhost:8080/api/foods"
                                                                    );
                                                                    const foods = await response.json();
                                                                    const foodName = item["Tên món"] || item.name;
                                                                    const foundFood = foods.find(
                                                                        (food) =>
                                                                            food.name.toLowerCase() ===
                                                                            foodName.toLowerCase()
                                                                    );

                                                                    if (foundFood) {
                                                                        console.log(
                                                                            "✅ Found food by name:",
                                                                            foundFood
                                                                        );
                                                                        // Use id for navigation
                                                                        const objectId = foundFood.id;
                                                                        if (objectId) {
                                                                            const navigateUrl = `/food/${objectId}`;
                                                                            console.log(
                                                                                "🚀 Navigating with found ID to:",
                                                                                navigateUrl
                                                                            );
                                                                            navigate(navigateUrl);
                                                                        } else {
                                                                            console.log(
                                                                                "❌ Found food but no id:",
                                                                                foundFood
                                                                            );
                                                                            alert(
                                                                                `Không tìm thấy ID cho món "${foodName}"`
                                                                            );
                                                                        }
                                                                    } else {
                                                                        console.log(
                                                                            "❌ Food not found by name:",
                                                                            foodName
                                                                        );
                                                                        alert(
                                                                            `Không tìm thấy thông tin chi tiết cho món "${foodName}"`
                                                                        );
                                                                    }
                                                                } catch (error) {
                                                                    console.error(
                                                                        "❌ Error finding food by name:",
                                                                        error
                                                                    );
                                                                    alert(
                                                                        "Có lỗi khi tìm thông tin món ăn. Vui lòng thử lại."
                                                                    );
                                                                }
                                                            }
                                                        };

                                                        return (
                                                            <div
                                                                key={(item["Tên món"] || item.name) + idx}
                                                                className="border rounded-lg p-3 mb-2 shadow hover:bg-gray-50 cursor-pointer transition flex items-center gap-3"
                                                                onClick={handleFoodClick}
                                                            >
                                                                <img
                                                                    src={
                                                                        item.image ||
                                                                        item["Hình ảnh"] ||
                                                                        "https://via.placeholder.com/64x64?text=No+Image"
                                                                    }
                                                                    alt={item["Tên món"] || item.name}
                                                                    className="w-16 h-16 object-cover rounded-md border"
                                                                    onError={(e) => {
                                                                        e.target.src =
                                                                            "https://via.placeholder.com/64x64?text=No+Image";
                                                                    }}
                                                                />
                                                                <div className="flex-1">
                                                                    <div className="font-bold text-base text-red-600">
                                                                        {item["Tên món"] || item.name}
                                                                    </div>

                                                                    {/* Mô tả sản phẩm */}
                                                                    {(item["Mô tả"] || item.description) && (
                                                                        <div className="text-xs text-gray-600 mb-2 line-clamp-2">
                                                                            {item["Mô tả"] || item.description}
                                                                        </div>
                                                                    )}

                                                                    {/* Giá và category */}
                                                                    <div className="flex items-center justify-between mb-2">
                                                                        <div className="text-sm font-bold text-orange-600">
                                                                            {item["Giá"] || item.price} VNĐ
                                                                        </div>
                                                                        {(item["Danh mục"] || item.category) && (
                                                                            <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                                                                {item["Danh mục"] || item.category}
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                    {/* Nguyên liệu */}
                                                                    {(item["Nguyên liệu"] || item.ingredients) && (
                                                                        <div className="text-xs text-gray-500 mb-2">
                                                                            <span className="font-medium">
                                                                                Nguyên liệu:{" "}
                                                                            </span>
                                                                            {Array.isArray(
                                                                                item["Nguyên liệu"] || item.ingredients
                                                                            )
                                                                                ? (
                                                                                      item["Nguyên liệu"] ||
                                                                                      item.ingredients
                                                                                  ).join(", ")
                                                                                : item["Nguyên liệu"] ||
                                                                                  item.ingredients}
                                                                        </div>
                                                                    )}

                                                                    {/* Rating nếu có */}
                                                                    {(item.rating || item["Đánh giá"]) && (
                                                                        <div className="flex items-center gap-1 mb-2">
                                                                            <span className="text-yellow-500">⭐</span>
                                                                            <span className="text-xs text-gray-600">
                                                                                {item.rating || item["Đánh giá"]} / 5
                                                                            </span>
                                                                        </div>
                                                                    )}

                                                                    {/* Thời gian chuẩn bị nếu có */}
                                                                    {(item["Thời gian chuẩn bị"] || item.prepTime) && (
                                                                        <div className="text-xs text-gray-500 mb-2">
                                                                            <span className="font-medium">
                                                                                🕒 Thời gian:{" "}
                                                                            </span>
                                                                            {item["Thời gian chuẩn bị"] ||
                                                                                item.prepTime}
                                                                        </div>
                                                                    )}

                                                                    {foodId &&
                                                                    foodId !== "undefined" &&
                                                                    foodId !== "null" ? (
                                                                        <div className="text-xs text-green-600">
                                                                            ✅ ID: {foodId}
                                                                        </div>
                                                                    ) : (
                                                                        <div className="text-xs text-orange-500"></div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            ) : message.suggested_items ? (
                                                <div className="grid grid-cols-1 gap-3">
                                                    {message.suggested_items.map((item, idx) => {
                                                        // Use regular id for food cart
                                                        const foodId = item.id;
                                                        console.log("🍽️ Suggested item:", item);
                                                        console.log("🆔 Extracted food ID:", foodId);

                                                        const handleFoodClick = async () => {
                                                            if (foodId && foodId !== "undefined" && foodId !== "null") {
                                                                // We have a valid id, navigate directly
                                                                const navigateUrl = `/food/${foodId}`;
                                                                console.log(
                                                                    "🚀 Navigating with food ID to:",
                                                                    navigateUrl
                                                                );
                                                                navigate(navigateUrl);
                                                            } else {
                                                                // No valid id, try to find food by name
                                                                console.log(
                                                                    "⚠️ No valid ID found, trying to find food by name:",
                                                                    item.name
                                                                );
                                                                try {
                                                                    const response = await fetch(
                                                                        "http://localhost:8080/api/foods"
                                                                    );
                                                                    const foods = await response.json();
                                                                    const foundFood = foods.find(
                                                                        (food) =>
                                                                            food.name.toLowerCase() ===
                                                                            item.name.toLowerCase()
                                                                    );

                                                                    if (foundFood) {
                                                                        console.log(
                                                                            "✅ Found food by name:",
                                                                            foundFood
                                                                        );
                                                                        // Use id for navigation
                                                                        const objectId = foundFood.id;
                                                                        if (objectId) {
                                                                            const navigateUrl = `/food/${objectId}`;
                                                                            console.log(
                                                                                "🚀 Navigating with found ID to:",
                                                                                navigateUrl
                                                                            );
                                                                            navigate(navigateUrl);
                                                                        } else {
                                                                            console.log(
                                                                                "❌ Found food but no id:",
                                                                                foundFood
                                                                            );
                                                                            alert(
                                                                                `Không tìm thấy ID cho món "${item.name}"`
                                                                            );
                                                                        }
                                                                    } else {
                                                                        console.log(
                                                                            "❌ Food not found by name:",
                                                                            item.name
                                                                        );
                                                                        alert(
                                                                            `Không tìm thấy thông tin chi tiết cho món "${item.name}"`
                                                                        );
                                                                    }
                                                                } catch (error) {
                                                                    console.error(
                                                                        "❌ Error finding food by name:",
                                                                        error
                                                                    );
                                                                    alert(
                                                                        "Có lỗi khi tìm thông tin món ăn. Vui lòng thử lại."
                                                                    );
                                                                }
                                                            }
                                                        };

                                                        return (
                                                            <div
                                                                key={item.name + idx}
                                                                className="border rounded-lg p-3 mb-2 shadow hover:bg-gray-50 cursor-pointer transition flex items-center gap-3"
                                                                onClick={handleFoodClick}
                                                            >
                                                                <img
                                                                    src={
                                                                        item.image ||
                                                                        item.imageUrl ||
                                                                        "https://via.placeholder.com/64x64?text=No+Image"
                                                                    }
                                                                    alt={item.name}
                                                                    className="w-16 h-16 object-cover rounded-md border"
                                                                    onError={(e) => {
                                                                        e.target.src =
                                                                            "https://via.placeholder.com/64x64?text=No+Image";
                                                                    }}
                                                                />
                                                                <div className="flex-1">
                                                                    <div className="font-bold text-base text-red-600">
                                                                        {item.name}
                                                                    </div>

                                                                    {/* Mô tả sản phẩm */}
                                                                    {item.description && (
                                                                        <div className="text-xs text-gray-600 mb-2 line-clamp-2">
                                                                            {item.description}
                                                                        </div>
                                                                    )}

                                                                    {/* Giá và category */}
                                                                    <div className="flex items-center justify-between mb-2">
                                                                        <div className="text-sm font-bold text-orange-600">
                                                                            {item.price} VNĐ
                                                                        </div>
                                                                        {item.category && (
                                                                            <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                                                                {item.category}
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                    {/* Nguyên liệu */}
                                                                    {item.ingredients && (
                                                                        <div className="text-xs text-gray-500 mb-2">
                                                                            <span className="font-medium">
                                                                                Nguyên liệu:{" "}
                                                                            </span>
                                                                            {Array.isArray(item.ingredients)
                                                                                ? item.ingredients.join(", ")
                                                                                : item.ingredients}
                                                                        </div>
                                                                    )}

                                                                    {/* Rating nếu có */}
                                                                    {item.rating && (
                                                                        <div className="flex items-center gap-1 mb-2">
                                                                            <span className="text-yellow-500">⭐</span>
                                                                            <span className="text-xs text-gray-600">
                                                                                {item.rating} / 5
                                                                            </span>
                                                                        </div>
                                                                    )}

                                                                    {/* Calories nếu có */}
                                                                    {item.calories && (
                                                                        <div className="text-xs text-gray-500 mb-2">
                                                                            <span className="font-medium">
                                                                                🔥 Calories:{" "}
                                                                            </span>
                                                                            {item.calories} kcal
                                                                        </div>
                                                                    )}

                                                                    {/* Thời gian chuẩn bị nếu có */}
                                                                    {item.prepTime && (
                                                                        <div className="text-xs text-gray-500 mb-2">
                                                                            <span className="font-medium">
                                                                                🕒 Thời gian:{" "}
                                                                            </span>
                                                                            {item.prepTime}
                                                                        </div>
                                                                    )}

                                                                    {/* Độ cay nếu có */}
                                                                    {item.spiceLevel && (
                                                                        <div className="text-xs text-gray-500 mb-2">
                                                                            <span className="font-medium">
                                                                                🌶️ Độ cay:{" "}
                                                                            </span>
                                                                            {item.spiceLevel}
                                                                        </div>
                                                                    )}

                                                                    {foodId &&
                                                                    foodId !== "undefined" &&
                                                                    foodId !== "null" ? (
                                                                        <div className="text-xs text-green-600">
                                                                            ✅ ID: {foodId}
                                                                        </div>
                                                                    ) : (
                                                                        <div className="text-xs text-orange-500">
                                                                            ⚠️ Sẽ tìm theo tên món (không có id)
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            ) : (
                                                <div className="whitespace-pre-wrap">{message.content}</div>
                                            )}
                                            <div
                                                className={`text-xs mt-1 ${
                                                    message.isUser ? "text-red-200" : "text-gray-500"
                                                }`}
                                            >
                                                {formatTime(message.timestamp)}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {typing && (
                                    <div className="flex justify-start">
                                        <div className="bg-white px-4 py-2 rounded-lg rounded-bl-sm shadow-sm">
                                            <div className="flex space-x-1">
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                                <div
                                                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                                    style={{ animationDelay: "0.1s" }}
                                                ></div>
                                                <div
                                                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                                    style={{ animationDelay: "0.2s" }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <div className="p-3 border-t bg-white">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                        placeholder="Nhập tin nhắn..."
                                        disabled={loading}
                                        maxLength={API_CONFIG.CHAT_CONFIG.MAX_MESSAGE_LENGTH}
                                        className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-red-500 disabled:opacity-50"
                                    />
                                    <button
                                        onClick={sendMessage}
                                        disabled={loading || !input.trim()}
                                        className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Send className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="flex justify-between items-center mt-2">
                                    <button
                                        onClick={resetChat}
                                        className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                                    >
                                        Bắt đầu cuộc trò chuyện mới
                                    </button>
                                    <div className="text-xs text-gray-400">
                                        {input.length}/{API_CONFIG.CHAT_CONFIG.MAX_MESSAGE_LENGTH}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default ChatBotWidget;
