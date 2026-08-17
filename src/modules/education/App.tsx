import { Routes, Route, Navigate } from 'react-router-dom';
import './styles/global.css';

import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { StudentsPage } from './pages/StudentsPage';
import { StudentFormPage } from './pages/StudentFormPage';
import { StudentProfilePage } from './pages/StudentProfilePage';
import { TeachersPage } from './pages/TeachersPage';
import { ClassesPage } from './pages/ClassesPage';
import { SubjectsPage } from './pages/SubjectsPage';
import { FinancePage } from './pages/FinancePage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { GradesPage } from './pages/GradesPage';
import { GradesEntryPage } from './pages/GradesEntryPage';
import { ReportsPage } from './pages/ReportsPage';
import { AcademicYearsPage } from './pages/AcademicYearsPage';
import { AcademicYearEventsPage } from './pages/AcademicYearEventsPage';
import { AcademicCalendarPage } from './pages/AcademicCalendarPage';
import { PresencesPage } from './pages/PresencesPage';
import { AuditLogPage } from './pages/AuditLogPage';
import { SettingsPage } from './pages/SettingsPage';
import { HelpPage } from './pages/HelpPage';
import { ErrorToaster } from './components/ErrorToaster';
// Note: We bypass layouts because WorkspaceShell handles it.

export default function EducationModuleRoutes() {
    return (
        <div style={{ height: '100%', overflowY: 'auto' }}>
            <ErrorToaster />
            <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/legacy-home" element={<HomePage />} />
                <Route path="/students" element={<StudentsPage />} />
                <Route path="/students/new" element={<StudentFormPage />} />
                <Route path="/students/:id" element={<StudentProfilePage />} />
                <Route path="/students/:id/edit" element={<StudentFormPage />} />
                <Route path="/teachers" element={<TeachersPage />} />
                <Route path="/classes" element={<ClassesPage />} />
                <Route path="/subjects" element={<SubjectsPage />} />
                <Route path="/finance" element={<FinancePage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/grades" element={<GradesPage />} />
                <Route path="/grades/entry" element={<GradesEntryPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/academic-years" element={<AcademicYearsPage />} />
                <Route path="/academic-calendar" element={<AcademicCalendarPage />} />
                <Route path="/academic-years/:id/events" element={<AcademicYearEventsPage />} />
                <Route path="/presences" element={<PresencesPage />} />
                <Route path="/audit" element={<AuditLogPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/help" element={<HelpPage />} />
                
                {/* Fallback route */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </div>
    );
}
