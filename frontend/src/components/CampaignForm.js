// src/components/CampaignForm.js

import React, { useState } from 'react';
import axios from 'axios';

const CampaignForm = ({ onCampaignCreated }) => {
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:3001/api/campaigns', {
                name,
                message,
                segmentConditions: { totalSpending: { $gt: 10000 } }, // Example condition
                audienceSize: 50, // Example audience size
            });
            console.log('Campaign created:', response.data);

            // Reset form fields and notify parent to refresh the campaign list
            setName('');
            setMessage('');
            onCampaignCreated();
        } catch (error) {
            console.error('Error creating campaign:', error);
        }
    };

    return (
        <div className="card">
            <form onSubmit={handleSubmit} className="form-container">
                <div className="form-group">
                    <label htmlFor="campaign-name">Campaign Name:</label>
                    <input
                        type="text"
                        id="campaign-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="campaign-message">Message:</label>
                    <input
                        type="text"
                        id="campaign-message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        className="form-control"
                    />
                </div>
                <button type="submit" className="btn submit-btn">Create Campaign</button>
            </form>
        </div>
    );
};

export default CampaignForm;
