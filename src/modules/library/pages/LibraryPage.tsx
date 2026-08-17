import React, { useState, useEffect } from 'react';
import { Book, Plus, Search, BookOpen, Clock, Calendar } from 'lucide-react';
// import { api } from '../services/api'; // On pourra ajouter api.ts propre à library plus tard

export const LibraryPage = () => {
    const [books, setBooks] = useState<any[]>([]);
    const [loans, setLoans] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Pour l'instant nous mockons
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="page-container">
            <header className="page-header">
                <div>
                    <h1>Bibliothèque & CDI</h1>
                    <p>Gestion du fonds documentaire et des prêts aux élèves</p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-primary">
                        <Plus size={16} />
                        Nouveau Livre
                    </button>
                    <button className="btn btn-outline">
                        <BookOpen size={16} />
                        Nouveau Prêt
                    </button>
                </div>
            </header>

            <div className="kpi-grid" style={{ marginBottom: 'var(--space-6)' }}>
                <div className="kpi-card">
                    <div className="kpi-icon"><Book size={20} /></div>
                    <div className="kpi-content">
                        <h3>Total Ouvrages</h3>
                        <p className="kpi-value">0</p>
                    </div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-icon"><Clock size={20} /></div>
                    <div className="kpi-content">
                        <h3>Prêts en cours</h3>
                        <p className="kpi-value">0</p>
                    </div>
                </div>
                <div className="kpi-card error">
                    <div className="kpi-icon"><Calendar size={20} /></div>
                    <div className="kpi-content">
                        <h3>Retards de retour</h3>
                        <p className="kpi-value">0</p>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <h2>Catalogue récent</h2>
                    <div className="search-bar">
                        <Search size={16} />
                        <input type="text" placeholder="Chercher un livre, auteur, ISBN..." />
                    </div>
                </div>
                {loading ? (
                    <div style={{ padding: 'var(--space-6)', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        Chargement...
                    </div>
                ) : books.length > 0 ? (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Titre</th>
                                <th>Auteur</th>
                                <th>ISBN</th>
                                <th>Disponibilité</th>
                            </tr>
                        </thead>
                        <tbody>
                            {books.map(b => (
                                <tr key={b.id}>
                                    <td><strong>{b.title}</strong></td>
                                    <td>{b.author}</td>
                                    <td>{b.isbn}</td>
                                    <td>
                                        <span className={`badge ${b.available_quantity > 0 ? 'success' : 'error'}`}>
                                            {b.available_quantity} / {b.total_quantity}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="empty-state">
                        <Book size={48} />
                        <h3>Aucun ouvrage</h3>
                        <p>Le catalogue de la bibliothèque est vide.</p>
                        <button className="btn btn-primary" style={{ marginTop: 'var(--space-4)' }}>
                            <Plus size={16} /> Ajouter un livre
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
