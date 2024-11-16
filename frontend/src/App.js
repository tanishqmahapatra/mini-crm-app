import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import AudienceSegmentForm from './components/AudienceSegmentForm';
import CampaignForm from './components/CampaignForm';
import CampaignList from './components/CampaignList';
import { auth, googleProvider } from '../firebase'; // import firebase functions


const App = () => {
    const [user, setUser] = useState(null);
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch authentication status

    const handleGoogleLogin = async () => {
        try {
            const result = await auth.signInWithPopup(googleProvider);
            const user = result.user;
            setUser(user); // Store the logged-in user
        } catch (error) {
            console.error(error.message);
        }
    };

    const handleLogout = async () => {
        await auth.signOut();
        setUser(null); // Clear the user state
    };
    // Fetch campaigns
    const fetchCampaigns = async () => {
        try {
            const response = await axios.get('https://mini-crm-app-backend.onrender.com/api/campaigns');
            setCampaigns(response.data);
        } catch (error) {
            console.error('Error fetching campaigns:', error);
        }
    };

    useEffect(() => {
        if (user) {
            fetchCampaigns();
        }
    }, [user]);

    // Render loading screen while checking authentication
    if (loading) {
        return <div className="loading-screen">Loading...</div>;
    }

    return (
        <div>
            <header>
                <h1>Mini CRM & Campaign Management</h1>
                {user && (
                    <nav>
                        <p>Welcome, {user.displayName}!</p>
                        <button
                            onClick={handleLogout
                            }
                        >
                            Logout
                        </button>
                    </nav>
                )}
            </header>

            <div className="container">
                {user ? (
                    <>
                        <div className="card">
                            <h2>Create Audience Segment</h2>
                            <AudienceSegmentForm />
                        </div>
                        <div className="card">
                            <h2>Create a New Campaign</h2>
                            <CampaignForm onCampaignCreated={fetchCampaigns} />
                        </div>
                        <div className="card">
                            <h2>Campaign History & Statistics</h2>
                            <CampaignList campaigns={campaigns} />
                        </div>
                    </>
                ) : (
                    <div className="login-container">
                       <button onClick={handleGoogleLogin}>
                           Login with Google
                       </button>
 
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;