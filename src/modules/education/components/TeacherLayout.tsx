import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, Users, GraduationCap, 
    BookOpen, FileText, Settings, LogOut 
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import logoUrl from '../assets/LOGO.bmp';

const navItems = [
    { section: 'MON ESPACE', items: [
        { path: '/teacher-dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
        { path: '/my-classes', label: 'Mes Classes', icon: BookOpen },
        { path: '/teacher-grades', label: 'Saisie des Notes', icon: FileText }
    ]}
];

export const TeacherLayout = () => {
    const location = useLocation();
    const { user, logout } = useAuth();

    const getBreadcrumbs = () => {
        const path = location.pathname;
        if (path === '/teacher-dashboard') return 'Espace Enseignant / Tableau de bord';
        if (path.startsWith('/my-classes')) return 'Espace Enseignant / Mes Classes';
        if (path.startsWith('/teacher-grades')) return 'Espace Enseignant / Saisie des Notes';
        return 'Espace Enseignant';
    };

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="app-shell">
            {/* Sidebar Enseignant */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <img src={logoUrl} alt="Alliance One Logo" style={{ width: '36px', height: '36px', objectFit: 'contain', borderRadius: '8px' }} />
                    <div>
                        <h1 style={{ fontSize: '15px', fontWeight: 800, letterSpacing: '0.02em', margin: 0 }}>Alliance One</h1>
                        <p style={{ fontSize: '9px', fontWeight: 700, color: '#d97706', letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0 }}>Espace Enseignant</p>
                    </div>
                </div>
                
                <nav className="nav-list">
                    {navItems.map((group, idx) => (
                        <div key={idx}>
                            <div className="nav-section-title">{group.section}</div>
                            {group.items.map(item => {
                                const Icon = item.icon;
                                return (
                                    <NavLink 
                                        key={item.path} 
                                        to={item.path} 
                                        className={({ isActive }) => `nav-link ${isActive && item.path !== '/' || (item.path === '/' && location.pathname === '/') ? 'active' : ''}`}
                                    >
                                        <Icon className="nav-icon" size={18} />
                                        {item.label}
                                    </NavLink>
                                );
                            })}
                        </div>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <div className="main-wrapper">
                {/* Topbar */}
                <header className="topbar">
                    <div className="topbar-left">
                        <div className="breadcrumb">
                            <span className="breadcrumb-current">{getBreadcrumbs()}</span>
                        </div>
                    </div>
                    
                    <div className="topbar-right">
                        <div className="user-profile" onClick={handleLogout} title="Se déconnecter">
                            <div className="user-avatar">{user?.first_name?.[0] || 'P'}{user?.last_name?.[0] || ''}</div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)' }}>{user?.first_name} {user?.last_name}</span>
                                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Déconnexion</span>
                            </div>
                            <LogOut size={16} color="var(--color-error)" style={{ marginLeft: 'var(--space-2)' }} />
                        </div>
                    </div>
                </header>

                {/* Outlet for nested routes */}
                <main className="page-content animate-fade-in">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
