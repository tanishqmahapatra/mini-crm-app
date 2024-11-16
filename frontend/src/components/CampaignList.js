// src/components/CampaignList.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CampaignList = ({ campaigns }) => {
    const [stats, setStats] = useState({ audienceSize: 0, sentCount: 0, failedCount: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get('https://mini-crm-app-backend.onrender.com/api/campaigns/stats');
                setStats(response.data);
            } catch (error) {
                console.error('Error fetching campaign stats:', error);
            }
        };

        fetchStats();
    }, [campaigns]);

    return (
        <div className="card">
            {campaigns.length > 0 ? (
                <>
                    <table className="campaign-table">
                        <thead>
                            <tr>
                                <th>Campaign Name</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Audience Size</th>
                            </tr>
                        </thead>
                        <tbody>
                            {campaigns.map((campaign) => (
                                <tr key={campaign._id}>
                                    <td>{campaign.name}</td>
                                    <td>{new Date(campaign.createdAt).toLocaleDateString()}</td>
                                    <td>Completed</td> {/* You can dynamically set status if needed */}
                                    <td>{campaign.audienceSize}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Display the actual database stats */}
                    <div className="stats">
                        <div>
                            <h3>Total Audience Size</h3>
                            <p>{stats.audienceSize}</p>
                        </div>
                        <div>
                            <h3>Messages Sent</h3>
                            <p>{stats.sentCount}</p>
                        </div>
                        <div>
                            <h3>Messages Failed</h3>
                            <p>{stats.failedCount}</p>
                        </div>
                    </div>
                </>
            ) : (
                <p className="no-campaigns">No campaigns found.</p>
            )}
        </div>
    );
};

export default CampaignList;
