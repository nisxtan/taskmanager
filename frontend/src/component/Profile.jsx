import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import userService from "../api/userServices";
import ChangePasswordSection from "./ChangePasswordSection";
import { setCredentials } from "../redux/slices/authSlice";

const Profile = () => {
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ username: "", email: "" });
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await userService.getCurrentUser();
      setProfile(response.data);
      setFormData({
        username: response.data.username,
        email: response.data.email,
      });
    } catch (error) {
      setMessage(error.message || "Error loading profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await userService.updateProfile(formData);

      // ✅ FIX: Proper nested structure for setCredentials
      dispatch(
        setCredentials({
          token: token,
          user: {
            id: user.id,
            username: response.data.username,
            email: response.data.email,
            isAdmin: user.isAdmin,
            permissions: user.permissions,
            role: user.role,
          },
        })
      );

      setMessage("Profile updated successfully.");
      setEditing(false);
      fetchProfile();
    } catch (error) {
      setMessage(error.message || "Failed updating profile");
    }
  };

  const handleBackToTasks = () => {
    navigate("/tasks");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header with back button */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleBackToTasks}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {/* ✅ FIX: Corrected SVG path */}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Tasks
          </button>
          <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
          <div className="w-20"></div> {/* Space for alignment */}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          {message && (
            <div
              className={`p-4 rounded-lg mb-6 ${
                message.includes("Error") || message.includes("Failed")
                  ? "bg-red-50 text-red-700"
                  : "bg-green-50 text-green-700"
              }`}
            >
              {message}
            </div>
          )}

          {!editing ? (
            // View mode
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Username
                  </label>
                  <p className="text-lg text-gray-900 bg-gray-50 p-3 rounded-lg">
                    {profile?.username}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Email
                  </label>
                  <p className="text-lg text-gray-900 bg-gray-50 p-3 rounded-lg">
                    {profile?.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Role
                  </label>
                  <p className="text-lg text-gray-900 bg-gray-50 p-3 rounded-lg">
                    {profile?.role?.name || "No Role Assigned"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Member Since
                  </label>
                  <p className="text-lg text-gray-900 bg-gray-50 p-3 rounded-lg">
                    {new Date(profile?.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                  onClick={() => setEditing(true)}
                >
                  Edit Profile
                </button>
              </div>
            </div>
          ) : (
            // Edit mode
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Username *
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    setFormData({
                      username: profile.username,
                      email: profile.email,
                    });
                    setMessage("");
                  }}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Change password section */}
        <ChangePasswordSection />
      </div>
    </div>
  );
};

export default Profile;
