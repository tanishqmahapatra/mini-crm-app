// src/components/CampaignAudiencePage.js

import React from 'react';
import AudienceSegmentForm from './AudienceSegmentForm';
import CampaignForm from './CampaignForm';
import CampaignList from './CampaignList';
import CampaignDetail from './CampaignDetail';

const CampaignAudiencePage = () => {
    return (
        <div>
            <h2>Campaign and Audience Management</h2>

            {/* Audience Segment Creation */}
            <AudienceSegmentForm />

            {/* Campaign Creation */}
            <CampaignForm />

            {/* List of Campaigns */}
            <CampaignList />

            {/* Campaign Details */}
            <CampaignDetail />
        </div>
    );
};

export default CampaignAudiencePage;
