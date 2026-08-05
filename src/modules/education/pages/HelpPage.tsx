import React, { useState } from 'react';
import { Card } from '../components';
import { 
    HelpCircle, Users, GraduationCap, BookOpen, BookMarked, 
    Calendar, FileText, Shield, Settings, ChevronDown, ChevronRight,
    ArrowRight, Link2, Lightbulb, AlertTriangle, Home, DollarSign
} from 'lucide-react';
import { PageHeader } from '../components';
import { motion } from 'framer-motion';

// ─────────────────────────────────────
// Types
// ─────────────────────────────────────

interface HelpSection {
    id: string;
    icon: any;
    title: string;
    color: string;
    pourquoi: string;
    comment: string[];
    liens: string[];
    astuces: string[];
}

// ─────────────────────────────────────
// Help Data
// ─────────────────────────────────────

const helpSections: HelpSection[] = [
    {
        id: 'accueil',
        icon: Home,
        title: 'Accueil & Tableau de Bord',
        color: '#6366f1',
        pourquoi: "La page d'accueil vous donne une vue synthétique de l'état de votre établissement en temps réel : nombre d'élèves inscrits, d'enseignants, de classes actives, etc. C'est votre point de départ quotidien pour piloter l'école.",
        comment: [
            "Connectez-vous avec vos identifiants (rôle Directeur, Censeur ou Secrétaire).",
            "La page d'accueil affiche automatiquement les statistiques clés de l'année académique en cours.",
            "La vue analytique (Analytics) offre des graphiques détaillés sur les effectifs et les performances.",
        ],
        liens: [
            "Le tableau de bord tire ses données de tous les modules : élèves, classes, notes, enseignants.",
            "L'année académique active dans les Paramètres détermine les données affichées.",
        ],
        astuces: [
            "Consultez le tableau de bord chaque matin pour repérer rapidement les anomalies (classes sans titulaire, etc.).",
        ]
    },
    {
        id: 'eleves',
        icon: Users,
        title: 'Gestion des Élèves',
        color: '#10b981',
        pourquoi: "Le module Élèves est le cœur du système. Chaque élève inscrit possède un dossier complet (identité, scolarité, responsable légal). Le matricule unique garantit la traçabilité tout au long du parcours scolaire.",
        comment: [
            "Créer un élève : Cliquez sur « Nouvel Élève » et suivez l'assistant en 4 étapes (Identité → Scolarité → Responsable → Vérification).",
            "Le matricule est généré automatiquement au format ANNÉE-NUMÉRO (ex: 2026-00001).",
            "Vous pouvez importer en masse via un fichier Excel (.xlsx) contenant les colonnes requises.",
            "Supprimer un élève le place dans une « corbeille » (archivage doux). Vous pouvez le restaurer à tout moment.",
            "Chaque élève est obligatoirement rattaché à une classe. Changez la classe directement depuis son profil.",
        ],
        liens: [
            "Un élève DOIT être affecté à une Classe (module Classes). Sans classe, pas de bulletin.",
            "Les Notes (module Notes) sont liées à l'élève par son identifiant.",
            "L'import Excel crée automatiquement les élèves et les rattache à la classe indiquée.",
            "La photo est utilisée dans la Carte Scolaire PDF.",
        ],
        astuces: [
            "Utilisez l'export Excel pour obtenir une liste complète de vos élèves à partager avec les parents.",
            "Avant l'année scolaire, utilisez l'Assistant de Promotion (module Classes) pour déplacer les élèves vers leurs nouvelles classes.",
            "La recherche filtre par matricule, nom, prénom et responsable.",
        ]
    },
    {
        id: 'enseignants',
        icon: GraduationCap,
        title: 'Gestion des Enseignants',
        color: '#f59e0b',
        pourquoi: "Ce module centralise les informations du corps professoral. Chaque enseignant reçoit un code unique et peut être désigné comme titulaire d'une classe. Les enseignants avec un compte utilisateur accèdent à leur propre espace pour saisir les notes.",
        comment: [
            "Créer un enseignant : Renseignez nom, prénom, sexe, spécialité, téléphone et email.",
            "Un code unique (ex: ENS-A3B2C1) est généré automatiquement.",
            "Vous pouvez modifier ou supprimer un enseignant à tout moment (attention : la suppression impacte les classes où il est titulaire).",
        ],
        liens: [
            "Un enseignant peut être désigné Titulaire d'une Classe (module Classes). Son nom apparaît alors sur les bulletins.",
            "Les Notes sont liées à l'enseignant qui les a saisies — c'est lui qui apparaît sur le bulletin de l'élève.",
            "Si vous créez un compte utilisateur avec le rôle 'enseignant' et l'associez à un enseignant, il peut se connecter et saisir ses notes depuis l'Espace Enseignant.",
        ],
        astuces: [
            "Renseignez toujours l'email pour faciliter la communication.",
            "Un enseignant peut avoir plusieurs spécialités s'il enseigne différentes matières.",
        ]
    },
    {
        id: 'classes',
        icon: BookOpen,
        title: 'Classes & Organisation',
        color: '#3b82f6',
        pourquoi: "Les classes structurent l'organisation pédagogique. Chaque classe appartient à une section (Primaire ou Collège), possède un niveau, un professeur titulaire et un programme de matières. C'est l'unité de base pour la génération des bulletins.",
        comment: [
            "Créer une classe : Choisissez un nom (ex: '6e A'), la section, le niveau, l'année académique, le titulaire et cochez les matières du programme.",
            "L'assistant de promotion permet de déplacer en masse les élèves d'une classe vers une autre en fin d'année.",
            "Chaque classe est liée à une année académique précise.",
        ],
        liens: [
            "Les Élèves sont affectés à une classe — l'effectif se calcule automatiquement.",
            "Les Matières cochées déterminent ce qui apparaîtra sur le bulletin de la classe.",
            "Le Titulaire (module Enseignants) signe le bulletin.",
            "L'Année Académique (module Années) cadre la période de validité des données.",
        ],
        astuces: [
            "Créez d'abord les matières et les années académiques AVANT de créer les classes.",
            "L'assistant de promotion est idéal en fin d'année : sélectionnez les élèves admis et envoyez-les vers la classe N+1.",
            "Vous pouvez avoir plusieurs classes du même niveau (ex: 6e A, 6e B) pour gérer les effectifs.",
        ]
    },
    {
        id: 'matieres',
        icon: BookMarked,
        title: 'Matières',
        color: '#8b5cf6',
        pourquoi: "Les matières définissent le programme académique. Chaque matière a un coefficient (importance dans la moyenne), un niveau d'enseignement et un groupe (pour l'organisation du bulletin en groupes I, II et III selon le système camerounais).",
        comment: [
            "Créer une matière : Renseignez le nom (ex: 'Mathématiques'), le coefficient (ex: 4), le niveau (ex: '6e'), et le groupe (1, 2 ou 3).",
            "Un code unique est généré automatiquement (ex: MAT-A3B2C1).",
            "Les matières sont ensuite affectées aux classes via le formulaire de création/modification de classe.",
        ],
        liens: [
            "Les matières sont liées aux Classes via le programme (matières cochées lors de la création de la classe).",
            "Les Notes sont saisies pour une matière précise — le coefficient impacte directement la moyenne.",
            "Le groupe (1, 2 ou 3) organise le bulletin en sections thématiques.",
        ],
        astuces: [
            "Groupe 1 = Langues & Littérature, Groupe 2 = Sciences, Groupe 3 = Activités pratiques & EPS.",
            "Le coefficient reflète l'importance de la matière dans la moyenne générale. Plus il est élevé, plus la matière pèse.",
            "Créez les matières par niveau pour pouvoir les affecter correctement aux classes.",
        ]
    },
    {
        id: 'annees',
        icon: Calendar,
        title: 'Années Scolaires',
        color: '#ec4899',
        pourquoi: "L'année académique est le cadre temporel de toutes les données. Notes, classes, bulletins, présences — tout est rattaché à une année. Seule une année peut être active à la fois, ce qui permet d'archiver les données passées sans les perdre.",
        comment: [
            "Créer une année : Définissez un libellé (ex: '2025-2026'), les dates de début et fin, et cochez 'Active' si c'est l'année en cours.",
            "Quand vous activez une nouvelle année, l'ancienne est automatiquement désactivée.",
            "Les données des années précédentes restent consultables mais ne sont plus modifiables une fois archivées.",
        ],
        liens: [
            "Toutes les Classes sont rattachées à une année académique.",
            "Les Notes sont saisies pour une année et une séquence donnée.",
            "Les Bulletins sont générés pour une année + séquence combinée.",
            "Les Absences sont comptabilisées par année et par séquence.",
        ],
        astuces: [
            "Créez toujours la nouvelle année AVANT la rentrée pour pouvoir créer les nouvelles classes.",
            "Ne supprimez jamais une année passée — archivez-la. Cela préserve l'historique complet.",
        ]
    },
    {
        id: 'notes',
        icon: FileText,
        title: 'Notes & Saisie',
        color: '#ef4444',
        pourquoi: "Le module de notes est au cœur de l'évaluation. Il permet la saisie individuelle ou par lot, supporte 4 types d'évaluation (Séquentielle, CC, TD, Examen), et intègre un système de verrouillage pour sécuriser les données après délibération. Toute modification nécessite un motif obligatoire, assurant une traçabilité totale.",
        comment: [
            "Saisie individuelle : Sélectionnez l'année, l'élève, la matière, l'enseignant, la séquence, le type d'évaluation et la note (/20).",
            "Saisie par lot (Batch) : Depuis l'espace enseignant, saisissez les notes de toute une classe d'un coup.",
            "Modification : Toute modification d'une note existante exige un motif obligatoire. L'ancienne et la nouvelle valeur sont archivées.",
            "Verrouillage : Le Directeur ou le Censeur peut verrouiller une séquence pour une classe, empêchant toute modification ultérieure.",
        ],
        liens: [
            "Les notes déterminent la Moyenne Générale, le Rang et la Mention qui apparaissent sur le Bulletin.",
            "Le calcul de la moyenne pondère : Séquentielle × 70% + CC × 30% (si les deux sont présentes).",
            "L'historique des modifications est consultable dans le Journal d'Activité.",
            "L'export Excel permet de partager les notes avec les conseils de classe.",
        ],
        astuces: [
            "Verrouillez toujours la séquence APRÈS les délibérations pour éviter les modifications non autorisées.",
            "Utilisez la saisie par lot pour gagner du temps — c'est 10× plus rapide que la saisie individuelle.",
            "Les notes doivent être sur 20. Le système rejette les valeurs en dehors de cette plage.",
        ]
    },
    {
        id: 'bulletins',
        icon: FileText,
        title: 'Bulletins & Impressions',
        color: '#0ea5e9',
        pourquoi: "Le module Bulletins génère des documents PDF professionnels conformes aux standards du système éducatif camerounais. Chaque bulletin inclut le logo de l'école, la devise, les notes détaillées par groupe, le rang, les moyennes de la classe, et les signatures. Vous pouvez imprimer un bulletin individuel ou tous ceux d'une classe en un clic.",
        comment: [
            "Sélectionnez l'année académique, la section, la classe et la séquence.",
            "Pour un bulletin individuel, sélectionnez aussi un élève — un aperçu s'affiche avant impression.",
            "Cliquez sur 'Imprimer pour toute la classe' pour générer un PDF contenant tous les bulletins (un par page).",
            "Le PDF inclut automatiquement : en-tête bilingue, logo, devise, tableau des notes par groupe, récapitulatif (rang, moyenne classe, min, max), discipline, décision du conseil et zone de signatures.",
        ],
        liens: [
            "Les Notes (module Notes) alimentent directement le contenu du bulletin.",
            "Le Logo et la Devise proviennent des Paramètres de l'école.",
            "Le Titulaire de la classe apparaît sur le bulletin (module Classes).",
            "Les Absences comptabilisées apparaissent dans la section Discipline.",
            "Les Cartes Scolaires sont aussi générées depuis cette page.",
        ],
        astuces: [
            "Configurez d'abord le logo et la devise dans les Paramètres avant de générer vos premiers bulletins.",
            "L'aperçu permet de vérifier les données AVANT de lancer l'impression — évitez le gaspillage de papier !",
            "Imprimez les cartes scolaires en début d'année et les bulletins à la fin de chaque trimestre.",
        ]
    },
    {
        id: 'finances',
        icon: DollarSign,
        title: 'Finances & Pensions',
        color: '#14b8a6',
        pourquoi: "Le module Finance permet de suivre avec précision les versements de chaque élève, de calculer automatiquement le reste à payer, et d'éditer les reçus de paiement officiels.",
        comment: [
            "L'enregistrement du paiement se fait directement depuis la page Élèves : sélectionnez un élève, puis cliquez sur 'Enregistrer Paiement'.",
            "Si c'est le tout premier paiement de l'année, le système demandera de renseigner le montant total de la pension.",
            "Ensuite, dans le module Finances & Pensions, vous pouvez visualiser tout l'historique : montant attendu, total payé et reste à payer.",
            "Imprimez un reçu PDF professionnel pour tout versement enregistré, d'un simple clic sur 'Imprimer PDF' dans l'historique.",
        ],
        liens: [
            "Les paiements sont liés au profil financier de l'élève pour l'année académique active.",
            "L'impression PDF utilise le même en-tête et logo que les bulletins, configurés dans les Paramètres.",
        ],
        astuces: [
            "Le reçu généré est au format A5 paysage, idéal pour impression et signature.",
            "Inutile de chercher la fiche financière : tout est centralisé. Un simple clic sur l'élève dans l'historique vous montre sa jauge de paiement.",
        ]
    },
    {
        id: 'securite',
        icon: Shield,
        title: 'Sécurité & Audit',
        color: '#64748b',
        pourquoi: "La traçabilité est essentielle dans un établissement scolaire. Chaque action (création, modification, suppression) est enregistrée avec l'identité de l'utilisateur, l'heure, l'adresse IP et le détail des changements. Le système de rôles garantit que seuls les utilisateurs autorisés accèdent aux fonctionnalités sensibles.",
        comment: [
            "Le Journal d'Activité liste chronologiquement toutes les actions sur la plateforme.",
            "Vous pouvez filtrer par utilisateur, type de ressource ou date.",
            "Les rôles disponibles sont : Directeur (accès total), Censeur (gestion académique), Secrétaire (saisie et consultation), Enseignant (saisie des notes uniquement).",
        ],
        liens: [
            "Chaque modification de Note est doublement tracée : dans l'historique de la note ET dans le journal d'audit.",
            "Les comptes utilisateurs sont gérés depuis l'administration Django.",
            "Le verrouillage des séquences (module Notes) est une mesure de sécurité enregistrée dans l'audit.",
        ],
        astuces: [
            "Consultez régulièrement le journal d'audit pour repérer les actions inhabituelles.",
            "Créez un compte par utilisateur — ne partagez jamais les identifiants.",
            "Le rôle Enseignant ne peut voir que ses propres notes et celles de ses classes.",
        ]
    },
    {
        id: 'parametres',
        icon: Settings,
        title: 'Paramètres & Administration',
        color: '#a855f7',
        pourquoi: "Les paramètres centralisent la configuration globale de l'école : nom, devise, logo, signatures numériques. Ces informations sont utilisées partout dans la plateforme, notamment dans les bulletins PDF et les cartes scolaires. La fonctionnalité de sauvegarde permet de télécharger une copie de la base de données.",
        comment: [
            "Modifiez le nom de l'école, la devise, l'adresse et le téléphone depuis la page Paramètres.",
            "Le logo et les signatures apparaissent automatiquement sur les documents PDF générés.",
            "Téléchargez une sauvegarde complète de la base de données à tout moment pour vos archives.",
        ],
        liens: [
            "Le Nom et la Devise apparaissent dans l'en-tête des Bulletins PDF.",
            "Le Logo est affiché au centre de l'en-tête bilingue.",
            "La Signature du directeur est intégrée dans la zone de signature du bulletin.",
            "L'Année Académique active par défaut peut être configurée ici.",
        ],
        astuces: [
            "Effectuez une sauvegarde chaque semaine, surtout pendant les périodes de saisie des notes.",
            "Utilisez un logo de bonne qualité (PNG ou JPG) pour un rendu optimal sur les documents imprimés.",
            "La sauvegarde est un fichier SQLite que vous pouvez conserver sur une clé USB.",
        ]
    },
];

// ─────────────────────────────────────
// Accordion component
// ─────────────────────────────────────

const Accordion = ({ title, icon: Icon, color, children, defaultOpen = false }: { title: string; icon: any; color: string; children: React.ReactNode; defaultOpen?: boolean }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    
    return (
        <div style={{ 
            border: '1px solid var(--border-subtle)', 
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            backgroundColor: 'var(--bg-surface)',
            transition: 'box-shadow var(--transition-fast)',
            boxShadow: isOpen ? 'var(--shadow-md)' : 'var(--shadow-sm)',
        }}>
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-3)',
                    padding: 'var(--space-4) var(--space-5)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-primary)',
                    fontSize: 'var(--text-base)',
                    fontWeight: 'var(--font-semibold)',
                    textAlign: 'left',
                }}
            >
                <div style={{
                    width: '36px', height: '36px', borderRadius: 'var(--radius-md)',
                    backgroundColor: color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                }}>
                    <Icon size={18} color={color} />
                </div>
                <span style={{ flex: 1 }}>{title}</span>
                {isOpen ? <ChevronDown size={18} color="var(--text-tertiary)" /> : <ChevronRight size={18} color="var(--text-tertiary)" />}
            </button>
            {isOpen && (
                <div style={{ padding: '0 var(--space-5) var(--space-5)', borderTop: '1px solid var(--border-subtle)' }}>
                    {children}
                </div>
            )}
        </div>
    );
};

// ─────────────────────────────────────
// Section Content Block
// ─────────────────────────────────────

const SectionContent = ({ section }: { section: HelpSection }) => {
    const blockStyle: React.CSSProperties = {
        padding: 'var(--space-4)',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'var(--bg-app)',
        marginTop: 'var(--space-4)',
    };

    const blockTitleStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        fontWeight: 'var(--font-bold)',
        fontSize: 'var(--text-sm)',
        marginBottom: 'var(--space-3)',
        color: section.color,
    };

    const listStyle: React.CSSProperties = {
        margin: 0,
        paddingLeft: 'var(--space-5)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-2)',
        fontSize: 'var(--text-sm)',
        color: 'var(--text-secondary)',
        lineHeight: '1.6',
    };

    return (
        <div>
            {/* Pourquoi */}
            <div style={blockStyle}>
                <div style={blockTitleStyle}>
                    <AlertTriangle size={14} /> Pourquoi ce module ?
                </div>
                <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                    {section.pourquoi}
                </p>
            </div>

            {/* Comment ça marche */}
            <div style={blockStyle}>
                <div style={blockTitleStyle}>
                    <ArrowRight size={14} /> Comment ça marche ?
                </div>
                <ol style={listStyle}>
                    {section.comment.map((item, i) => <li key={i}>{item}</li>)}
                </ol>
            </div>

            {/* Liens avec les autres modules */}
            <div style={blockStyle}>
                <div style={blockTitleStyle}>
                    <Link2 size={14} /> Liens avec les autres modules
                </div>
                <ul style={listStyle}>
                    {section.liens.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
            </div>

            {/* Astuces */}
            <div style={{ ...blockStyle, backgroundColor: section.color + '08', border: `1px solid ${section.color}25` }}>
                <div style={blockTitleStyle}>
                    <Lightbulb size={14} /> Astuces & Bonnes Pratiques
                </div>
                <ul style={listStyle}>
                    {section.astuces.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
            </div>
        </div>
    );
};

// ─────────────────────────────────────
// Main Page
// ─────────────────────────────────────

export const HelpPage = () => {
    return (
        <motion.div className="page-transition-wrapper">
            <PageHeader
                title="Centre d'Aide"
                subtitle="Guide complet pour comprendre et maîtriser chaque fonctionnalité de la plateforme Emergence."
                icon={HelpCircle}
            />

            {/* Introduction card */}
            <Card>
                <div style={{ display: 'flex', gap: 'var(--space-6)', alignItems: 'center' }}>
                    <div style={{
                        width: '64px', height: '64px', borderRadius: 'var(--radius-lg)',
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                    }}>
                        <HelpCircle size={32} color="white" />
                    </div>
                    <div>
                        <h3 style={{ margin: '0 0 var(--space-2) 0' }}>Bienvenue dans le Centre d'Aide</h3>
                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', lineHeight: '1.6' }}>
                            Cette page vous explique le fonctionnement de chaque module de la plateforme Emergence ERP. 
                            Cliquez sur une section ci-dessous pour découvrir <strong>pourquoi</strong> elle existe, 
                            <strong> comment</strong> elle fonctionne et <strong>comment</strong> elle est connectée aux autres parties du système.
                            L'ordre des sections suit le flux logique de configuration d'un établissement.
                        </p>
                    </div>
                </div>
            </Card>

            {/* Quick start */}
            <Card>
                <h3 style={{ margin: '0 0 var(--space-4) 0', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <ArrowRight size={18} color="var(--color-accent)" />
                    Ordre recommandé pour configurer l'école
                </h3>
                <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                    {[
                        { step: '1', label: 'Paramètres', desc: 'Nom, logo, devise' },
                        { step: '2', label: 'Années Scolaires', desc: 'Créer l\'année active' },
                        { step: '3', label: 'Matières', desc: 'Créer le programme' },
                        { step: '4', label: 'Enseignants', desc: 'Ajouter le corps prof.' },
                        { step: '5', label: 'Classes', desc: 'Organiser les sections' },
                        { step: '6', label: 'Élèves', desc: 'Inscrire les élèves' },
                        { step: '7', label: 'Notes', desc: 'Saisir les évaluations' },
                        { step: '8', label: 'Bulletins', desc: 'Imprimer les résultats' },
                    ].map((item, i) => (
                        <div key={i} style={{
                            display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
                            padding: 'var(--space-2) var(--space-3)',
                            backgroundColor: 'var(--bg-app)',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border-subtle)',
                            fontSize: 'var(--text-sm)',
                        }}>
                            <div style={{
                                width: '24px', height: '24px', borderRadius: 'var(--radius-full)',
                                backgroundColor: 'var(--color-accent)',
                                color: 'white',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 'var(--text-xs)', fontWeight: 'var(--font-bold)',
                                flexShrink: 0,
                            }}>
                                {item.step}
                            </div>
                            <div>
                                <div style={{ fontWeight: 'var(--font-semibold)' }}>{item.label}</div>
                                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{item.desc}</div>
                            </div>
                            {i < 7 && <ArrowRight size={14} color="var(--text-tertiary)" style={{ marginLeft: 'var(--space-1)' }} />}
                        </div>
                    ))}
                </div>
            </Card>

            {/* Sections */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {helpSections.map((section, idx) => (
                    <Accordion
                        key={section.id}
                        title={section.title}
                        icon={section.icon}
                        color={section.color}
                        defaultOpen={idx === 0}
                    >
                        <SectionContent section={section} />
                    </Accordion>
                ))}
            </div>

            {/* Footer */}
            <Card>
                <div style={{ textAlign: 'center', padding: 'var(--space-4)', color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)' }}>
                    <p style={{ margin: 0 }}>
                        <strong>Emergence ERP</strong> — Plateforme de Gestion Scolaire · v1.0
                    </p>
                    <p style={{ margin: 'var(--space-1) 0 0 0' }}>
                        Pour toute question technique, contactez l'administrateur de votre établissement.
                    </p>
                </div>
            </Card>
        </motion.div>
    );
};
