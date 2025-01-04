import React, { useEffect, useState } from 'react';
import './Notification.css';

interface Notification {
    id: number;
    title: string;
    message: string;
}

const Notification: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            const data: Notification[] = [
                { id: 1, title: 'Welcome!', message: 'Thank you for joining our platform!' },
                { id: 2, title: 'Update Available', message: 'A new update has been released. Please update your app.' },
                { id: 3, title: 'Reminder', message: 'Don’t forget to complete your profile.' },
            ];
            setNotifications(data);
        };

        fetchNotifications();
    }, []);

    return (
        <div className="notification">
            <div className="notification-header">
                <h1>Notifications</h1>
            </div>
            <div className="notification-main">
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
