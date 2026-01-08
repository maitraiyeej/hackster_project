import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        location: '',
        organization: '', // Required by your schema
        techStack: '', 
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    
    const navigate = useNavigate();

    // 1. Capture input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 2. Submit to your protected backend route
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Get user info from localStorage to get the token
            const userInfo = JSON.parse(localStorage.getItem('user'));
            
            if (!userInfo || userInfo.role !== 'Admin') {
                setError('Access denied. Admins only.');
                return;
            }

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`, // Your "Key"
                },
            };

            // Convert techStack string to Array for the database
            const finalData = {
                ...formData,
                techStack: formData.techStack.split(',').map(item => item.trim())
            };

            await axios.post('http://localhost:5000/api/hackathons', finalData, config);
            
            setSuccess(true);
            setTimeout(() => navigate('/'), 2000); // Redirect to home to see the card

        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create hackathon');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={containerStyle}>
            <h2>Admin: Create Hackathon</h2>
            {error && <div style={errorStyle}>{error}</div>}
            {success && <div style={successStyle}>Hackathon created! Redirecting...</div>}
            
            <form onSubmit={handleSubmit} style={formStyle}>
                <input type="text" name="name" placeholder="Name" required onChange={handleChange} style={inputStyle} />
                <textarea name="description" placeholder="Description" required onChange={handleChange} style={inputStyle} />
                <input type="date" name="startDate" required onChange={handleChange} style={inputStyle} />
                <input type="date" name="endDate" required onChange={handleChange} style={inputStyle} />
                <input type="text" name="location" placeholder="Location" required onChange={handleChange} style={inputStyle} />
                <input type="text" name="organization" placeholder="Organization" required onChange={handleChange} style={inputStyle} />
                <input type="text" name="techStack" placeholder="Tech Stack (React, Node, etc.)" onChange={handleChange} style={inputStyle} />
                
                <button type="submit" disabled={loading} style={buttonStyle}>
                    {loading ? 'Processing...' : 'Create Hackathon'}
                </button>
            </form>
        </div>
    );
};

// Simple Styles
const containerStyle = { maxWidth: '500px', margin: '40px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '10px' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '10px' };
const inputStyle = { padding: '10px', borderRadius: '5px', border: '1px solid #ccc' };
const buttonStyle = { padding: '10px', backgroundColor: '#000', color: '#fff', cursor: 'pointer', border: 'none' };
const errorStyle = { color: 'red', marginBottom: '10px' };
const successStyle = { color: 'green', marginBottom: '10px' };

export default AdminDashboard;