import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Card, Table } from '../components';
import type { Column } from '../components';;

export const MyClassesPage = () => {
    const { user } = useAuth();
    const [classes, setClasses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClasses = async () => {
            if (!user?.teacher_id) return;
            try {
                // Pour l'instant, on récupère toutes les classes et on filtre côté client
                // Idéalement, l'API devrait supporter un filtre ?head_teacher=ID
                const response = await api.get('/classes/');
                const myClasses = response.filter((c: any) => c.head_teacher === user.teacher_id);
                setClasses(myClasses);
            } catch (error) {
                console.error("Erreur de récupération des classes", error);
            } finally {
                setLoading(false);
            }
        };

        fetchClasses();
    }, [user]);

    const columns: Column<any>[] = [
        { header: 'Nom de la classe', accessor: 'name' },
        { header: 'Niveau', accessor: 'level' },
        { header: 'Section', accessor: 'section' },
    ];

    return (
        <div>
            <div className="page-header">
                <div>
                    <h2>Mes Classes</h2>
                    <p>Liste des classes dont vous êtes titulaire.</p>
                </div>
            </div>

            <Card>
                <Table 
                    columns={columns} 
                    data={classes} 
                    loading={loading}
                    keyExtractor={(item) => item.id}
                    emptyMessage="Vous n'êtes titulaire d'aucune classe."
                />
            </Card>
        </div>
    );
};
