import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/user/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/login');
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleEditProfileClick = () => {
    navigate("/editprofile");
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: "url(/ai.jpg)",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        backgroundBlendMode: "overlay",
      }}
    >
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-3xl font-bold text-purple-900 mb-6 text-center">
          User Profile
        </h2>
        <div className="mb-4">
          <p className="text-lg">
            <strong>Name:</strong> {user?.name}
          </p>
          <p className="text-lg">
            <strong>Email:</strong> {user?.email}
          </p>
          <p className="text-lg">
            <strong>Phone:</strong> {user?.phone}
          </p>
        </div>
        <button
          onClick={handleEditProfileClick}
          className="w-full bg-purple-900 text-white px-4 py-2 rounded-md shadow-lg hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default Profile;