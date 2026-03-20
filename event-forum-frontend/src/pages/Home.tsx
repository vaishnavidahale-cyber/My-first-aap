import React from 'react';

const Home: React.FC = () => {
    return (
        <div className="home">
            <h1>Welcome to the One-stop Event Forum and Community Hub!</h1>
            <p>Explore events, connect with fellow students, and stay updated with reminders.</p>
            <nav>
                <ul>
                    <li><a href="/events">View Events</a></li>
                    <li><a href="/community">Join the Community</a></li>
                    <li><a href="/profile">Your Profile</a></li>
                </ul>
            </nav>
        </div>
    );
};

export default Home;