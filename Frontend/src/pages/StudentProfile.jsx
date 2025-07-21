import React, { useRef, useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function StudentProfile({ user }) {
    const fileInputRef = useRef(null);
    const [profileImage, setProfileImage] = useState("https://i.pravatar.cc/150?u=a042581f4e29026704d");
    const [bio, setBio] = useState("Passionate learner with a keen interest in science and technology. Actively involved in the school's coding club and science fair competitions.");

    const handlePictureChangeClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <section id="profile">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="md:col-span-1">
                    <div className="bg-white rounded-2xl shadow-xl p-6 text-center">
                        <div className="relative inline-block">
                            <img
                                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
                                src={profileImage}
                                alt="Profile Picture"
                            />
                            <button
                                onClick={handlePictureChangeClick}
                                className="absolute bottom-1 right-1 bg-indigo-600 text-white rounded-full p-2 hover:bg-indigo-700 transition"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 6.732z" />
                                </svg>
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                className="hidden"
                            />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 mt-4">{user?.name || 'John Doe'}</h2>
                        <p className="text-gray-500">Grade 10</p>
                        <div className="mt-6 space-y-3 text-left">
                            <div className="flex items-center text-gray-600">
                                <Mail className="w-5 h-5 mr-3 text-indigo-500" />
                                <span>{user?.email || 'john.doe@example.com'}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <Phone className="w-5 h-5 mr-3 text-indigo-500" />
                                <span>+1 234 567 890</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <MapPin className="w-5 h-5 mr-3 text-indigo-500" />
                                <span>New York, USA</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="md:col-span-2">
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <h3 className="text-xl font-bold text-gray-700 mb-4">About Me</h3>
                        <p className="text-gray-600">
                            {bio}
                        </p>

                        <hr className="my-6" />

                        <h3 className="text-xl font-bold text-gray-700 mb-4">Academic Information</h3>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <strong className="text-gray-500">Class:</strong>
                                <p className="text-lg font-semibold">10th A</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <strong className="text-gray-500">Roll No:</strong>
                                <p className="text-lg font-semibold">23</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <strong className="text-gray-500">Attendance:</strong>
                                <p className="text-lg font-semibold text-green-600">95%</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <strong className="text-gray-500">GPA:</strong>
                                <p className="text-lg font-semibold">3.8</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}