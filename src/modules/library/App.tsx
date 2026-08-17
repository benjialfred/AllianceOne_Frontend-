import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LibraryPage } from './pages/LibraryPage';
import { ErrorToaster } from '../education/components/ErrorToaster'; // Reusing ErrorToaster

export default function LibraryModuleRoutes() {
    return (
        <div style={{ height: '100%', overflowY: 'auto' }}>
            <ErrorToaster />
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" element={<LibraryPage />} />
                    <Route path="/books" element={<LibraryPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
            </Routes>
        </div>
    );
}
