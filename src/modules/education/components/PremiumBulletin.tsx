import React from 'react';
import logoUrl from '../assets/LOGO.bmp';

export const PremiumBulletin = React.forwardRef<HTMLDivElement, { data: any }>(({ data }, ref) => {
    if (!data) return null;

    const groupNames: Record<string, string> = {
        '1': 'Enseignements Scientifiques',
        '2': 'Enseignements Littéraires',
        '3': 'Langues & Autres',
    };

    return (
        <div ref={ref} className="print-only" style={{ 
            fontFamily: '"Times New Roman", Times, serif', 
            padding: '2cm', 
            width: '210mm', 
            minHeight: '297mm', 
            backgroundColor: 'white',
            color: 'black',
            margin: '0 auto'
        }}>
            {/* Styles for printing */}
            <style dangerouslySetInnerHTML={{__html: `
                @media print {
                    @page { margin: 0; size: A4; }
                    body { -webkit-print-color-adjust: exact; margin: 0; background: white; }
                    .print-only { display: block !important; }
                    .no-print { display: none !important; }
                    .watermark {
                        position: fixed;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%) rotate(-45deg);
                        font-size: 150px;
                        color: rgba(0, 0, 0, 0.03);
                        z-index: 0;
                        white-space: nowrap;
                    }
                    .content-z { position: relative; z-index: 1; }
                }
                .print-only { display: none; } /* Hidden on screen */
                table.bulletin-table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; }
                table.bulletin-table th, table.bulletin-table td { border: 1px solid #000; padding: 4px 8px; text-align: center; }
                table.bulletin-table th { background-color: #f0f0f0; font-weight: bold; }
                .text-left { text-align: left !important; }
                .group-header { background-color: #e0e0e0 !important; font-weight: bold; text-align: left !important; padding-left: 10px !important; }
            `}} />

            <div className="watermark">ALLIANCE ONE</div>

            <div className="content-z">
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #000', paddingBottom: '10px' }}>
                    <div style={{ textAlign: 'center', width: '30%' }}>
                        <div style={{ fontWeight: 'bold' }}>RÉPUBLIQUE DU CAMEROUN</div>
                        <div style={{ fontSize: '10px' }}>Paix - Travail - Patrie</div>
                        <div style={{ marginTop: '10px', fontWeight: 'bold' }}>MINISTÈRE DES ENSEIGNEMENTS SECONDAIRES</div>
                    </div>
                    <div style={{ width: '20%', textAlign: 'center' }}>
                        <img src={logoUrl} alt="Logo" style={{ width: '80px', height: '80px', objectFit: 'contain' }} />
                    </div>
                    <div style={{ textAlign: 'center', width: '30%' }}>
                        <div style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>{data.school_name || 'Alliance One Education'}</div>
                        <div style={{ fontSize: '10px' }}>Année Scolaire: {data.academic_year_id}</div>
                        <div style={{ fontSize: '10px' }}>Séquence: {data.sequence.toUpperCase()}</div>
                    </div>
                </div>

                {/* Title */}
                <div style={{ textAlign: 'center', margin: '20px 0' }}>
                    <h2 style={{ textTransform: 'uppercase', border: '1px solid #000', display: 'inline-block', padding: '10px 20px', backgroundColor: '#f0f0f0' }}>
                        BULLETIN DE NOTES
                    </h2>
                </div>

                {/* Student Info */}
                <div style={{ display: 'flex', border: '1px solid #000', padding: '10px', marginBottom: '20px', borderRadius: '5px' }}>
                    <div style={{ flex: 1 }}>
                        <div><strong>Nom de l'élève :</strong> <span style={{ textTransform: 'uppercase' }}>{data.student_full_name}</span></div>
                        <div><strong>Matricule :</strong> {data.student_matricule}</div>
                        <div><strong>Né(e) le :</strong> {data.student_date_of_birth} <strong>à</strong> {data.student_place_of_birth}</div>
                        <div><strong>Sexe :</strong> {data.student_sex}</div>
                    </div>
                    <div style={{ flex: 1 }}>
                        <div><strong>Classe :</strong> {data.student_class_name}</div>
                        <div><strong>Effectif :</strong> {data.class_total_students} élèves</div>
                        <div><strong>Professeur Principal :</strong> {data.head_teacher_name}</div>
                    </div>
                </div>

                {/* Grades Table */}
                <table className="bulletin-table">
                    <thead>
                        <tr>
                            <th className="text-left" style={{ width: '30%' }}>Matière / Professeur</th>
                            <th>Coef.</th>
                            <th>Note /20</th>
                            <th>Total</th>
                            <th>Appréciation</th>
                            <th>Signature</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[1, 2, 3].map(groupId => {
                            const group = data.groups?.[groupId];
                            if (!group || group.subjects.length === 0) return null;
                            
                            return (
                                <React.Fragment key={groupId}>
                                    <tr>
                                        <td colSpan={6} className="group-header">
                                            {groupNames[groupId] || `Groupe ${groupId}`}
                                        </td>
                                    </tr>
                                    {group.subjects.map((sub: any) => (
                                        <tr key={sub.subject_id}>
                                            <td className="text-left">
                                                <strong>{sub.subject_name}</strong><br/>
                                                <span style={{ fontSize: '10px', fontStyle: 'italic' }}>{sub.teacher_name}</span>
                                            </td>
                                            <td>{sub.coefficient}</td>
                                            <td><strong>{sub.average}</strong></td>
                                            <td>{sub.total}</td>
                                            <td>{sub.appreciation}</td>
                                            <td></td>
                                        </tr>
                                    ))}
                                    {/* Group Subtotal */}
                                    <tr style={{ backgroundColor: '#f9f9f9', fontWeight: 'bold' }}>
                                        <td className="text-left" style={{ paddingLeft: '20px' }}>Total {groupNames[groupId] || `Groupe ${groupId}`}</td>
                                        <td>{group.total_coef}</td>
                                        <td>{group.average}</td>
                                        <td>{group.total_points}</td>
                                        <td colSpan={2}>{group.appreciation}</td>
                                    </tr>
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>

                {/* Summary & Signatures */}
                <div style={{ display: 'flex', marginTop: '20px', gap: '20px' }}>
                    <div style={{ flex: 1, border: '1px solid #000', padding: '10px' }}>
                        <h4 style={{ margin: '0 0 10px 0', borderBottom: '1px solid #ccc' }}>RÉSUMÉ DU TRAVAIL</h4>
                        <div><strong>Total Points :</strong> {data.total_points}</div>
                        <div><strong>Total Coef :</strong> {data.total_coef}</div>
                        <div style={{ fontSize: '16px', marginTop: '10px' }}><strong>MOYENNE : {data.general_average}/20</strong></div>
                        <div style={{ marginTop: '10px' }}><strong>Rang :</strong> {data.rank_label}</div>
                        <div style={{ marginTop: '5px' }}><strong>Absences :</strong> {data.absences_count} h</div>
                    </div>
                    
                    <div style={{ flex: 1, border: '1px solid #000', padding: '10px' }}>
                        <h4 style={{ margin: '0 0 10px 0', borderBottom: '1px solid #ccc' }}>STATISTIQUES CLASSE</h4>
                        <div><strong>Moy. Classe :</strong> {data.class_average}/20</div>
                        <div><strong>Moy. Max :</strong> {data.class_max}/20</div>
                        <div><strong>Moy. Min :</strong> {data.class_min}/20</div>
                    </div>
                </div>

                {/* Decisions */}
                <div style={{ display: 'flex', marginTop: '20px', gap: '20px' }}>
                    <div style={{ flex: 1, border: '1px solid #000', padding: '10px', height: '100px' }}>
                        <strong>Avis du Professeur Principal :</strong>
                    </div>
                    <div style={{ flex: 1, border: '1px solid #000', padding: '10px', height: '100px' }}>
                        <strong>Décision du Conseil :</strong>
                        <div style={{ marginTop: '10px', fontStyle: 'italic', fontSize: '14px' }}>
                            {data.decision}
                        </div>
                    </div>
                    <div style={{ flex: 1, border: '1px solid #000', padding: '10px', height: '100px', textAlign: 'center' }}>
                        <strong>Le Chef d'Établissement</strong>
                        <div style={{ marginTop: '40px', fontSize: '10px', color: '#666' }}>[Signature & Cachet]</div>
                    </div>
                </div>

                <div style={{ marginTop: '30px', textAlign: 'center', fontSize: '10px', color: '#666' }}>
                    Bulletin généré électroniquement par Alliance One - {new Date().toLocaleDateString()}
                </div>
            </div>
        </div>
    );
});
