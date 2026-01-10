import { Link, useLocation } from 'react-router-dom';
import { Home, Tag, LogOut, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import styles from '../../styles/components/sidebar.module.css';

export const Sidebar = () => {
    const location = useLocation();
    const { user, logout } = useAuth();

    const navItems = [
        { path: '/tasks', icon: Home, label: 'My Tasks' },
        { path: '/categories', icon: Tag, label: 'Categories' },
    ];

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logo}>
                <div className={styles.logoIcon}>
                    <span>📋</span>
                </div>
                <h1>TaskFlow</h1>
            </div>

            <nav className={styles.nav}>
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`${styles.navItem} ${location.pathname === item.path ? styles.active : ''
                            }`}
                    >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                    </Link>
                ))}
            </nav>

            <div className={styles.userSection}>
                <div className={styles.userInfo}>
                    <div className={styles.userAvatar}>
                        <User size={20} />
                    </div>
                    <div className={styles.userDetails}>
                        <p className={styles.userName}>{user?.user_name}</p>
                        <p className={styles.userEmail}>{user?.user_mail}</p>
                    </div>
                </div>
                <button onClick={logout} className={styles.logoutButton}>
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};