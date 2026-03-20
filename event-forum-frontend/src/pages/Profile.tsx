import React, { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile } from '../services/api';

const Profile: React.FC = () => {
    const [user, setUser] = useState({ name: '', email: '', bio: '' });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchUserProfile = async () => {
            const profileData = await getUserProfile();
            setUser(profileData);
        };
        fetchUserProfile();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await updateUserProfile(user);
        setIsEditing(false);
    };

    return (
        <div className="profile">
            <h1>User Profile</h1>
            {isEditing ? (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Name:</label>
                        <input type="text" name="name" value={user.name} onChange={handleChange} />
                    </div>
                    <div>
                        <label>Email:</label>
                        <input type="email" name="email" value={user.email} onChange={handleChange} />
                    </div>
                    <div>
                        <label>Bio:</label>
                        <textarea name="bio" value={user.bio} onChange={handleChange} />
                    </div>
                    <button type="submit">Save</button>
                </form>
            ) : (
                <div>
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Bio:</strong> {user.bio}</p>
                    <button onClick={() => setIsEditing(true)}>Edit Profile</button>
                </div>
            )}
        </div>
    );
};

export default Profile;