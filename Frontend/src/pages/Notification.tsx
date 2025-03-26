import React, { useEffect, useState } from 'react';
import './Notification.css';

interface NotificationData {
    id: number;
    title: string;
    message: string;
}

const Notification: React.FC = () => {
    const [notifications, setNotifications] = useState<NotificationData[]>([]);
    const [loading, setLoading] = useState<boolean>(true); // Loading state
    const [error, setError] = useState<string | null>(null); // Error state

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                setLoading(true); // Start loading
                // Simulating a fetch with a delay
                const data: NotificationData[] = [
                    { id: 1, title: 'Welcome!', message: 'Thank you for joining our platform!' },
                    { id: 2, title: 'Update Available', message: 'A new update has been released. Please update your app.' },
                    { id: 3, title: 'Reminder', message: 'Don’t forget to complete your profile.' },
                ];
                setNotifications(data);
            } catch (err) {
                setError('Failed to fetch notifications.');
            } finally {
                setLoading(false); // End loading
            }
        };

        fetchNotifications();
    }, []);

    return (
        <div className="notification">
            <div className="notification-header">
                <h1>Notifications</h1>
            </div>
            <div className="notification-main">
                {loading && <p>Loading...</p>} {/* Show loading message */}
                {error && <p className="error">{error}</p>} {/* Show error message */}
                {notifications.length === 0 && !loading && <p>No new notifications</p>} {/* No notifications */}
                {notifications.map((notification) => (
                    <div key={notification.id} className="notification-item">
                        <h2>{notification.title}</h2>
                        <p>{notification.message}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Notification;
