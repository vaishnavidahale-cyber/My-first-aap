import React, { useEffect, useState } from 'react';
import { CommunityPost, fetchCommunityPosts } from '../services/api';

const CommunityHub: React.FC = () => {
    const [posts, setPosts] = useState<CommunityPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadPosts = async () => {
            try {
                const data = await fetchCommunityPosts();
                setPosts(data);
            } catch (err) {
                setError('Failed to load posts');
            } finally {
                setLoading(false);
            }
        };

        loadPosts();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h1>Community Hub</h1>
            <ul>
                {posts.map((post) => (
                    <li key={post.id}>
                        <h2>{post.title}</h2>
                        <p>{post.content}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CommunityHub;