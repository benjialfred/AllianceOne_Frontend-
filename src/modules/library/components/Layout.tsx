import React from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Book, LayoutDashboard, Settings } from 'lucide-react';
import logoUrl from '../../education/assets/LOGO.bmp';

const navItems = [
    { section: 'APERÇU', items: [
        { path: '/', label: 'Tableau de bord', icon: LayoutDashboard }
    ]},
    { section: 'CATALOGUE', items: [
        { path: '/books', label: 'Ouvrages', icon: Book }
    ]},
    { section: 'SYSTÈME', items: [
        { path: '/settings', label: 'Paramètres', icon: Settings }
    ]}
];

export const Layout = () => {
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <div className="app-shell">
            <aside className="sidebar">
                <div className="sidebar-header">
                    {/* Assuming we can reuse the generic logo or no logo */}
                    <div style={{width: 32, height: 32, background: 'var(--color-primary-500)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'}}>
                        <Book size={20} />
                    </div>
                    <div>
                        <h1>Bibliothèque</h1>
                        <p>Alliance One</p>
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
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flex: 1 }}>
                                            <Icon className="nav-icon" size={14} />
                                            <span>{item.label}</span>
                                        </div>
                                    </NavLink>
                                );
                            })}
                        </div>
                    ))}
                </nav>
            </aside>
            <main className="main-content">
                <header className="topbar">
                    <div className="breadcrumbs">Accueil / Bibliothèque</div>
                </header>
                <div className="scrollable-content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
