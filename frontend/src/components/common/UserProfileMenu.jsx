import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import './UserProfileMenu.css';

export default function UserProfileMenu({ userType = 'visitor' }) {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);
    const [user, setUser] = useState({ name: 'User', image: null });

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        let name = 'User';
        let image = null;

        try {
            if (userType === 'admin') {
                const u = JSON.parse(localStorage.getItem('admin_user') || '{}');
                name = u.first_name ? `${u.first_name} ${u.last_name}` : (u.username || 'Admin');
            } else if (userType === 'researcher') {
                const u = JSON.parse(localStorage.getItem('researcher_user') || localStorage.getItem('user') || '{}');
                name = u.full_name || (u.first_name ? `${u.first_name} ${u.last_name}` : (u.username || 'Researcher'));
            } else if (userType === 'guide') {
                const u = JSON.parse(localStorage.getItem('user') || '{}');
                name = u.full_name || (u.first_name ? `${u.first_name} ${u.last_name}` : (u.username || 'Guide'));
            } else {
                const u = JSON.parse(localStorage.getItem('visitor_user') || localStorage.getItem('user') || '{}');
                name = u.full_name || (u.first_name ? `${u.first_name} ${u.last_name}` : (u.username || 'Visitor'));
            }
        } catch (e) {
            console.error('Error loading user data for menu', e);
        }

        // Fallback if name is empty
        if (!name || name.trim() === '') name = userType.charAt(0).toUpperCase() + userType.slice(1);

        setUser({ name, image });
    }, [userType]);

    const handleLogout = (e) => {
        e.preventDefault();
        if (userType === 'admin') {
            localStorage.removeItem('admin_token');
            localStorage.removeItem('admin_user');
            navigate('/login');
        } else if (userType === 'researcher') {
            localStorage.removeItem('researcher_token');
            localStorage.removeItem('researcher_user');
            navigate('/login');
        } else {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
        }
    };

    const getProfileLink = () => {
        return `/${userType}/profile`;
    };

    return (
        <div className="user-menu-container" ref={menuRef}>
            <button className="avatar-btn" onClick={() => setIsOpen(!isOpen)} title={user.name}>
                {user.image ? (
                    <img src={user.image} alt="Profile" />
                ) : (
                    <div className="avatar-placeholder">{user.name.charAt(0).toUpperCase()}</div>
                )}
            </button>

            {isOpen && (
                <div className="user-menu-dropdown">
                    <div className="user-info">
                        <div className="user-name">{user.name}</div>
                        <a href="#" onClick={(e) => { e.preventDefault(); navigate(getProfileLink()); setIsOpen(false); }} className="profile-link">
                            {t('lbl_go_to_profile')}
                        </a>
                    </div>
                    <hr className="nav-divider" />
                    <ul className="menu-items">
                        <li>
                            <a href="#" onClick={(e) => { e.preventDefault(); /* Settings implementation */ setIsOpen(false); }}>
                                <span className="icon">⚙️</span> {t('lbl_settings')}
                            </a>
                        </li>
                        <li>
                            <a href="#" onClick={(e) => { e.preventDefault(); /* Help implementation */ setIsOpen(false); }}>
                                <span className="icon">❓</span> {t('lbl_help')}
                            </a>
                        </li>
                        <li>
                            <a href="#" onClick={handleLogout}>
                                <span className="icon">🚪</span> {t('lbl_logout')}
                            </a>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
}
