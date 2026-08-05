import React from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
    LayoutDashboard, Users, GraduationCap, 
    BookOpen, BookMarked, FileText, 
    Calendar, Settings, Search, LogOut, Library, HelpCircle, DollarSign,
    Bell, Command
} from 'lucide-react';
import logoUrl from '../assets/LOGO.bmp';

const navItems = [
    { section: 'APERÇU', items: [
        { path: '/', label: 'Tableau de bord', icon: LayoutDashboard, shortcut: '⌘ 1' }
    ]},
    { section: 'ACADÉMIQUE', items: [
        { path: '/students', label: 'Élèves', icon: Users, shortcut: '⌘ 2' },
        { path: '/teachers', label: 'Enseignants', icon: GraduationCap },
        { path: '/classes', label: 'Classes', icon: BookOpen },
        { path: '/subjects', label: 'Matières', icon: BookMarked },
    ]},
    { section: 'ÉVALUATION & DOCS', items: [
        { path: '/grades', label: 'Notes', icon: FileText, badge: '3' },
        { path: '/reports', label: 'Bulletins & Rapports', icon: FileText },
        { path: '/cards', label: 'Cartes Scolaires', icon: Users },
    ]},
    { section: 'GESTION', items: [
        { path: '/finance', label: 'Revenus & Finances', icon: DollarSign, badge: 'Nouv.' },
        { path: '/academic-years', label: 'Années Scolaires', icon: Calendar },
    ]},
    { section: 'SYSTÈME', items: [
        { path: '/settings', label: 'Paramètres', icon: Settings }
    ]}
];

export const Layout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
    };

    const getBreadcrumbs = () => {
        const path = location.pathname;
        if (path === '/') return 'Accueil';
        if (path.startsWith('/students')) return 'Accueil / Élèves';
        if (path.startsWith('/teachers')) return 'Accueil / Enseignants';
        if (path.startsWith('/classes')) return 'Accueil / Classes';
        if (path.startsWith('/subjects')) return 'Accueil / Matières';
        if (path.startsWith('/grades')) return 'Accueil / Notes';
        if (path.startsWith('/reports')) return 'Accueil / Bulletins';
        if (path.startsWith('/finance')) return 'Accueil / Finances';
        if (path.startsWith('/academic-years')) return 'Accueil / Années Scolaires';
        if (path.startsWith('/teacher-dashboard')) return 'Accueil / Espace Enseignant';
        if (path.startsWith('/analytics')) return 'Accueil / Analytique';
        if (path.startsWith('/help')) return 'Accueil / Centre d\'Aide';
        return 'Accueil';
    };

    return (
        <div className="app-shell">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <img src={logoUrl} alt="Emergence Logo" />
                    <div>
                        <h1>Alliance One</h1>
                        <p>Workspace</p>
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
                                        {item.shortcut && <span className="nav-shortcut">{item.shortcut}</span>}
                                        {item.badge && <span className="nav-badge">{item.badge}</span>}
                                    </NavLink>
                                );
                            })}
                        </div>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <div className="status-indicator">
                        <span className="status-dot"></span>
                        <span>Système Opérationnel</span>
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginTop: '4px' }}>Alliance OS v2.0.1</div>
                </div>
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
                        <button className="topbar-icon-button" title="Recherche globale (⌘K)">
                            <Search size={16} />
                        </button>
                        <button className="topbar-icon-button" title="Notifications">
                            <Bell size={16} />
                        </button>
                        
                        <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-subtle)', margin: '0 var(--space-2)' }}></div>

                        <div style={{ position: 'relative' }}>
                            <div className="user-profile" onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} title="Mon Espace">
                                <div className="user-avatar">A</div>
                                <div style={{ display: 'flex', flexDirection: 'column', marginRight: 'var(--space-2)' }}>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' }}>Admin</span>
                                </div>
                            </div>

                            {/* Vercel-style User / Workspace Menu */}
                            {isUserMenuOpen && (
                                <div style={{
                                    position: 'absolute',
                                    top: '110%',
                                    right: 0,
                                    width: '240px',
                                    backgroundColor: 'var(--bg-surface)',
                                    border: '1px solid var(--border-subtle)',
                                    borderRadius: 'var(--radius-md)',
                                    boxShadow: 'var(--shadow-lg)',
                                    zIndex: 50,
                                    padding: 'var(--space-2) 0',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}>
                                    <div style={{ padding: 'var(--space-2) var(--space-4)', borderBottom: '1px solid var(--border-subtle)', marginBottom: 'var(--space-2)' }}>
                                        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>Alliance One</div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>admin@alliance-one.com</div>
                                    </div>
                                    
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '0 var(--space-2)' }}>
                                        <button className="nav-link" style={{ width: '100%' }}>Mon espace</button>
                                        <button className="nav-link" style={{ width: '100%' }}>Modules actifs</button>
                                        <button className="nav-link" style={{ width: '100%' }}>Mes achats</button>
                                        <button className="nav-link" style={{ width: '100%' }}>Changer d'école</button>
                                    </div>
                                    
                                    <div style={{ margin: 'var(--space-2) 0', borderTop: '1px solid var(--border-subtle)' }}></div>
                                    
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '0 var(--space-2)' }}>
                                        <button className="nav-link" onClick={handleLogout} style={{ width: '100%', color: 'var(--color-error)' }}>Déconnexion</button>
                                    </div>
                                </div>
                            )}
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
