import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Home from './components/home/Home';
import Login from './components/home/pages/Login';
import Register from './components/home/pages/Register';
import Forgot from './components/home/pages/Forgot';
// Admin
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminUsers from './components/admin/AdminUsers';
import AdminSites from './components/admin/AdminSites';
import AdminRequests from './components/admin/AdminRequests';
import AdminPayments from './components/admin/AdminPayments';
import AdminReports from './components/admin/AdminReports';
import AdminProfile from './components/admin/AdminProfile';
import AdminRoute from './components/admin/AdminRoute';
// Visitor
import VisitorDashboard from './components/visitor/VisitorDashboard';
import ExploreSites from './components/visitor/ExploreSites';
import SiteDetails from './components/visitor/SiteDetails';
import RequestGuide from './components/visitor/RequestGuide';
import VisitorPayments from './components/visitor/VisitorPayments';
import VisitorHistory from './components/visitor/VisitorHistory';
import VisitorProfile from './components/visitor/VisitorProfile';
import VisitorRoute from './components/visitor/VisitorRoute';
// Researcher
import ResearcherDashboard from './components/researcher/ResearcherDashboard';
import ResearcherSites from './components/researcher/ResearcherSites';
import ResearcherProfile from './components/researcher/ResearcherProfile';
import ResearcherRoute from './components/researcher/ResearcherRoute';
// Guide
import GuideDashboard from './components/guide/GuideDashboard';
import GuideRequests from './components/guide/GuideRequests';
import GuideSchedule from './components/guide/GuideSchedule';
import GuideReports from './components/guide/GuideReports';
import GuideProfile from './components/guide/GuideProfile';
import GuideRoute from './components/guide/GuideRoute';
import './App.css';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot" element={<Forgot />} />

            {/* Admin routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
            <Route path="/admin/sites" element={<AdminRoute><AdminSites /></AdminRoute>} />
            <Route path="/admin/requests" element={<AdminRoute><AdminRequests /></AdminRoute>} />
            <Route path="/admin/payments" element={<AdminRoute><AdminPayments /></AdminRoute>} />
            <Route path="/admin/reports" element={<AdminRoute><AdminReports /></AdminRoute>} />
            <Route path="/admin/profile" element={<AdminRoute><AdminProfile /></AdminRoute>} />

            {/* Researcher routes */}
            <Route path="/researcher/dashboard" element={<ResearcherRoute><ResearcherDashboard /></ResearcherRoute>} />
            <Route path="/researcher/sites" element={<ResearcherRoute><ResearcherSites /></ResearcherRoute>} />
            <Route path="/researcher/profile" element={<ResearcherRoute><ResearcherProfile /></ResearcherRoute>} />

            {/* Guide routes */}
            <Route path="/guide/dashboard" element={<GuideRoute><GuideDashboard /></GuideRoute>} />
            <Route path="/guide/requests" element={<GuideRoute><GuideRequests /></GuideRoute>} />
            <Route path="/guide/schedule" element={<GuideRoute><GuideSchedule /></GuideRoute>} />
            <Route path="/guide/reports" element={<GuideRoute><GuideReports /></GuideRoute>} />
            <Route path="/guide/profile" element={<GuideRoute><GuideProfile /></GuideRoute>} />

            {/* Visitor routes */}
            <Route path="/visitor/dashboard" element={<VisitorRoute><VisitorDashboard /></VisitorRoute>} />
            <Route path="/visitor/sites" element={<VisitorRoute><ExploreSites /></VisitorRoute>} />
            <Route path="/visitor/sites/:id" element={<VisitorRoute><SiteDetails /></VisitorRoute>} />
            <Route path="/visitor/request-guide/:siteId" element={<VisitorRoute><RequestGuide /></VisitorRoute>} />
            <Route path="/visitor/payments" element={<VisitorRoute><VisitorPayments /></VisitorRoute>} />
            <Route path="/visitor/history" element={<VisitorRoute><VisitorHistory /></VisitorRoute>} />
            <Route path="/visitor/profile" element={<VisitorRoute><VisitorProfile /></VisitorRoute>} />
          </Routes>
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;