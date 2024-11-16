// src/components/CampaignLogs.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CampaignLogs = ({ campaignId }) => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/campaign/${campaignId}/logs`);
                setLogs(response.data);
            } catch (error) {
                console.error(`Error fetching logs for campaign ${campaignId}:`, error);
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, [campaignId]);

    if (loading) {
        return <p>Loading log entries...</p>;
    }

    return (
        <div>
            <h3>Communication Logs</h3>
            {logs.length > 0 ? (
                logs.map((log) => (
                    <div key={log._id} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ccc' }}>
                        <p><strong>Customer ID:</strong> {log.customerId}</p>
                        <p><strong>Message:</strong> {log.message}</p>
                        <p><strong>Status:</strong> {log.status}</p>
                        <p><strong>Sent At:</strong> {new Date(log.sentAt).toLocaleString()}</p>
                    </div>
                ))
            ) : (
                <p>No logs found for this campaign.</p>
            )}
        </div>
    );
};

export default CampaignLogs;
