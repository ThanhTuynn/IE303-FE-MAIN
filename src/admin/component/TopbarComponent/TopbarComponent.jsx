import React, { useState, useEffect } from "react";
import { BellOutlined } from "@ant-design/icons";
import "./TopbarComponent.css";
import Avatar from "../../asset/AvatarUser.jpg";
import axios from "axios";

const TopbarComponent = ({ title }) => {
  const [user, setUser] = useState({
    avatar: Avatar,
    name: "Loading...",
    role: "Loading...",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUserData = localStorage.getItem('userData');
        const jwtToken = localStorage.getItem('jwtToken');

        if (!storedUserData || !jwtToken) {
          console.error('User data or token not found');
          return;
        }

        const currentUser = JSON.parse(storedUserData);
        const userId = currentUser.id || currentUser._id;

        if (!userId) {
          console.error('User ID not found');
          return;
        }

        const response = await axios.get(`http://localhost:8080/api/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${jwtToken}`
          }
        });

        const userData = response.data;
        setUser({
          avatar: userData.profilePicture || Avatar,
          name: userData.fullName || userData.username || 'User',
          role: userData.role || 'User',
        });
      } catch (err) {
        console.error('Error fetching user data:', err);
        setUser({
          avatar: Avatar,
          name: 'Error loading user',
          role: 'Error',
        });
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="topbar-container">
      <h2 className="topbar-title">{title}</h2>
      <div className="topbar-actions">
        <div className="user-info">
          <img 
            src={user.avatar} 
            alt="User Avatar" 
            className="user-avatar"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = Avatar;
            }}
          />
          <div className="user-details">
            <span className="user-name">{user.name}</span>
            <span className="user-role">{user.role}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopbarComponent;
