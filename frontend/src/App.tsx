import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import DashboardPage from './pages/DashboardPage';
import ClassesPage from './pages/ClassesPage';
import ClassDetailPage from './pages/ClassDetailPage';
import StudentProfilePage from './pages/StudentProfilePage';
import AssessmentsPage from './pages/AssessmentsPage';
import NewAssessmentPage from './pages/NewAssessmentPage';
import AssessmentDetailPage from './pages/AssessmentDetailPage';
import DigitalDeliveryPage from './pages/DigitalDeliveryPage';
import AssessmentResultsPage from './pages/AssessmentResultsPage';
import GroupsPage from './pages/GroupsPage';
import GroupDetailPage from './pages/GroupDetailPage';
import InterventionPage from './pages/InterventionPage';
import QuickCheckPage from './pages/QuickCheckPage';
import ActivitiesPage from './pages/ActivitiesPage';
import ProgressPage from './pages/ProgressPage';
import RulesPage from './pages/RulesPage';
import LoginPage from './pages/LoginPage';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="classes" element={<ClassesPage />} />
          <Route path="classes/:id" element={<ClassDetailPage />} />
          <Route path="students" element={<Navigate to="/students/1" replace />} />
          <Route path="students/:id" element={<StudentProfilePage />} />
          <Route path="assessments" element={<AssessmentsPage />} />
          <Route path="assessments/new" element={<NewAssessmentPage />} />
          <Route path="assessments/:id" element={<AssessmentDetailPage />} />
          <Route path="assessments/:id/deliver/digital" element={<DigitalDeliveryPage />} />
          <Route path="assessments/:id/results" element={<AssessmentResultsPage />} />
          <Route path="groups" element={<GroupsPage />} />
          <Route path="groups/:id" element={<GroupDetailPage />} />
          <Route path="groups/:id/intervention" element={<InterventionPage />} />
          <Route path="groups/:id/quick-check" element={<QuickCheckPage />} />
          <Route path="activities" element={<ActivitiesPage />} />
          <Route path="progress" element={<ProgressPage />} />
          <Route path="rules" element={<RulesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;