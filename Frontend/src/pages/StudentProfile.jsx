import React, { useRef, useState } from 'react';

export default function StudentProfile({ user }) {
  const fileInputRef = useRef(null);
  const [profileImage, setProfileImage] = useState("https://i.pravatar.cc/150?u=a042581f4e29026704d"); // Initial default image

  const handlePictureChangeClick = () => {
    fileInputRef.current.click(); // Programmatically click the hidden file input
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result); // Set the selected image as the profile photo
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  };

  return (
    <section id="profile">
      <h2 className="text-3xl font-bold mb-6 text-gray-700">My Profile</h2>
      <div className="bg-white rounded-xl shadow-lg p-8 transition duration-300 hover:shadow-2xl flex flex-col md:flex-row items-center gap-8">
        <div className="flex-shrink-0 flex flex-col items-center gap-4">
          <img
            className="w-32 h-32 rounded-full object-cover border-4 border-blue-200"
            src={profileImage} // Use the state variable for the image source
            alt="Profile Picture"
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*" // Accept any image type
            className="hidden" // Hide the input element
          />
          <button
            className="px-4 py-2 text-sm font-semibold bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            onClick={handlePictureChangeClick} // Attach the click handler
          >
            Change Picture
          </button>
        </div>
        <div className="w-full border-t md:border-t-0 md:border-l border-gray-200 pt-6 md:pt-0 md:pl-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <strong className="text-gray-500">Name:</strong>
              <p className="text-lg">{user?.name || 'John Doe'}</p>
            </div>
            <div>
              <strong className="text-gray-500">Class:</strong>
              <p className="text-lg">10th A</p>
            </div>
            <div>
              <strong className="text-gray-500">Roll No:</strong>
              <p className="text-lg">23</p>
            </div>
            <div>
              <strong className="text-gray-500">Email:</strong>
              <p className="text-lg">{user?.email || 'john.doe@example.com'}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}