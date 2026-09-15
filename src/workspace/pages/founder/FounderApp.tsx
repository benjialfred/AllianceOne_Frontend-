import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { FounderProfilePage } from './FounderProfilePage';
import { FounderCVViewer } from './FounderCVViewer';
import { FounderAnalytics } from './FounderAnalytics';

export default function FounderAppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<FounderProfilePage />} />
      <Route path="/cv" element={<FounderCVViewer />} />
      <Route path="/analytics" element={<FounderAnalytics />} />
    </Routes>
  );
}
