// src/App.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Ensure this imports the updated CSS you provided earlier
import AudienceSegmentForm from './components/AudienceSegmentForm';
import CampaignForm from './components/CampaignForm';
import CampaignList from './components/CampaignList';

const App = () => {
    const [user, setUser] = useState(null);
    const [campaigns, setCampaigns] = useState([]);

    useEffect(() => {
        const fetchAuthStatus = async () => {
            try {
                const response = await axios.get('http://localhost:3001/auth/status', { withCredentials: true });
                if (response.data.loggedIn) {
                    setUser(response.data.user);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error('Error checking auth status:', error);
            }
        };

        fetchAuthStatus();
    }, []);

    const fetchCampaigns = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/campaigns');
            setCampaigns(response.data);
        } catch (error) {
            console.error('Error fetching campaigns:', error);
        }
    };

    useEffect(() => {
        fetchCampaigns();
    }, []);

    return (
        <div>
            <header>
                <h1>Mini CRM & Campaign Management</h1>
                {user && (
                    <nav>
                        <p>Welcome, {user.displayName}!</p>
                        <button onClick={() => axios.get('http://localhost:3001/auth/logout', { withCredentials: true }).then(() => setUser(null))}>
                            Logout
                        </button>
                    </nav>
                )}
            </header>

            <div className="container">
                {user ? (
                    <>
                        {/* Audience Segment Form */}
                        <div className="card">
                            <h2>Create Audience Segment</h2>
                            <AudienceSegmentForm />
                        </div>

                        {/* Campaign Form */}
                        <div className="card">
                            <h2>Create a New Campaign</h2>
                            <CampaignForm onCampaignCreated={fetchCampaigns} />
                        </div>

                        {/* Campaign History */}
                        <div className="card">
                            <h2>Campaign History & Statistics</h2>
                            <CampaignList campaigns={campaigns} />
                        </div>
                    </>
                ) : (
                    <div className="login-container">
                        <button className="btn" onClick={() => (window.location.href = 'http://localhost:3001/auth/google')}>
                            Login with Google
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;
