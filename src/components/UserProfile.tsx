'use client';

import { useState } from "react";
import { useRouter } from 'next/navigation';

const UserProfile = ({ user }) => {
  const [showProfile, setShowProfile] = useState(false);
  const router = useRouter();

  const toggleProfile = () => setShowProfile(!showProfile);

  return (
    <>
      {/* User Profile Icon */}
      <div 
        className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center cursor-pointer hover:shadow-xl transform hover:scale-105 transition-all duration-300"
        onClick={toggleProfile}
      >
        <span className="text-2xl">👤</span>
      </div>

      {/* Profile Modal */}
      {showProfile && (
        <div className="absolute top-20 right-4 bg-white p-6 shadow-2xl rounded-2xl w-80 z-50 border border-gray-100 transform transition-all duration-300">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">User Profile</h2>
          <div className="space-y-3 text-gray-800">
            <p><strong>Name:</strong> {user.fullName}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phoneNumber}</p>
            <p><strong>Birth Date:</strong> {user.birthDate}</p>
            <p><strong>English Level:</strong> {user.englishLevel}</p>
          </div>
          <div className="mt-6 space-y-2">
            <button
              className="w-full py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
              onClick={() => router.push('/edit-profile')}
            >
              Edit Profile
            </button>
            <button
              className="w-full py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
              onClick={toggleProfile}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default UserProfile;
