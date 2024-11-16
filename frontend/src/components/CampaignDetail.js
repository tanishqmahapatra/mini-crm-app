// src/components/CampaignDetail.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CampaignDetail = ({ campaign }) => {
    const [stats, setStats] = useState(null);
    const [logs, setLogs] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get(`https://mini-crm-app-backend.onrender.com/api/campaigns/${campaign._id}/stats`);
                setStats(response.data);
                console.log('Stats loaded successfully:', response.data);
            } catch (error) {
                console.error(`Error fetching stats for campaign ${campaign._id}:`, error);
                setError('Failed to load stats.');
            }
        };

        const fetchLogs = async () => {
            try {
                const response = await axios.get(`https://mini-crm-app-backend.onrender.com/api/campaigns/${campaign._id}/logs`);
                setLogs(response.data);
                console.log('Logs loaded successfully:', response.data);
            } catch (error) {
                console.error(`Error fetching logs for campaign ${campaign._id}:`, error);
            }
        };

        fetchStats();
        fetchLogs();
    }, [campaign._id]);

    return (
        <div style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ddd' }}>
            <h3>{campaign.name}</h3>
            <p><strong>Message:</strong> {campaign.message}</p>
            {error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : stats ? (
                <div>
                    <p><strong>Audience Size:</strong> {stats.audienceSize}</p>
                    <p><strong>Messages Sent:</strong> {stats.sentCount}</p>
                    <p><strong>Messages Failed:</strong> {stats.failedCount}</p>
                </div>
            ) : (
                <p>Loading stats...</p>
            )}
            <p><strong>Created At:</strong> {new Date(campaign.createdAt).toLocaleString()}</p>

            {logs.length > 0 && (
                <div>
                    <h4>Communication Logs</h4>
                    {logs.map((log) => (
                        <div key={log._id} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ccc' }}>
                            <p><strong>Customer ID:</strong> {log.customerId}</p>
                            <p><strong>Message:</strong> {log.message}</p>
                            <p><strong>Status:</strong> {log.status}</p>
                            <p><strong>Sent At:</strong> {new Date(log.sentAt).toLocaleString()}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CampaignDetail;
