// src/components/AudienceSegmentForm.js

import React, { useState } from 'react';
import axios from 'axios';

const AudienceSegmentForm = () => {
    const [conditions, setConditions] = useState([{ field: '', operator: '', value: '', logic: 'AND' }]);
    const [audienceSize, setAudienceSize] = useState(null);

    // Handle adding a new condition row
    const handleAddCondition = () => {
        setConditions([...conditions, { field: '', operator: '', value: '', logic: 'AND' }]);
    };

    // Handle changes in a specific condition
    const handleConditionChange = (index, field, value) => {
        const newConditions = [...conditions];
        newConditions[index][field] = value;
        setConditions(newConditions);
    };

    // Function to preview audience size
    const previewAudienceSize = async () => {
        try {
            const response = await axios.post('http://localhost:3001/api/audience/preview', { conditions });
            setAudienceSize(response.data.audienceSize);
        } catch (error) {
            console.error('Error calculating audience size:', error);
        }
    };

    return (
        <div className="card">
            <div className="form-container">
                {conditions.map((condition, index) => (
                    <div key={index} className="condition-row">
                        <select
                            value={condition.field}
                            onChange={(e) => handleConditionChange(index, 'field', e.target.value)}
                            className="form-control"
                        >
                            <option value="">Select Field</option>
                            <option value="totalSpending">Total Spending</option>
                            <option value="visits">Visits</option>
                            <option value="lastVisit">Last Visit</option>
                        </select>

                        <select
                            value={condition.operator}
                            onChange={(e) => handleConditionChange(index, 'operator', e.target.value)}
                            className="form-control"
                        >
                            <option value="">Select Operator</option>
                            <option value="gt">{'>'}</option>
                            <option value="lt">{'<'}</option>
                            <option value="eq">=</option>
                            <option value="lte">{'<='}</option>
                            <option value="gte">{'>='}</option>
                        </select>

                        <input
                            type="text"
                            value={condition.value}
                            onChange={(e) => handleConditionChange(index, 'value', e.target.value)}
                            placeholder="Value"
                            className="form-control"
                        />

                        {index > 0 && (
                            <select
                                value={condition.logic}
                                onChange={(e) => handleConditionChange(index, 'logic', e.target.value)}
                                className="form-control"
                            >
                                <option value="AND">AND</option>
                                <option value="OR">OR</option>
                            </select>
                        )}
                    </div>
                ))}

                <div className="button-group">
                    <button className="btn add-btn" onClick={handleAddCondition}>Add Condition</button>
                    <button className="btn preview-btn" onClick={previewAudienceSize}>Preview Audience Size</button>
                </div>
            </div>

            {audienceSize !== null && <p className="audience-size">Audience Size: {audienceSize}</p>}
        </div>
    );
};

export default AudienceSegmentForm;
