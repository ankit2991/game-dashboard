import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DevRoleSwitcher } from './components/common/DevRoleSwitcher';
import { RequireRole, RequireOperatorApproval } from './components/auth/RouteGuards';
import { AccessDenied } from './modules/common/pages/AccessDenied';
import { OperatorPendingApproval } from './modules/operator/pages/OperatorPendingApproval';

// Admin Imports
import { AdminLayout } from './layouts/AdminLayout';
import { AdminLogin } from './modules/admin/pages/AdminLogin';
import { AdminDashboard } from './modules/admin/pages/AdminDashboard';
import { UserManagement } from './modules/admin/pages/UserManagement';
import { OperatorManagement } from './modules/admin/pages/OperatorManagement';
import { ProviderManagement } from './modules/admin/pages/ProviderManagement';
import { GameManagement } from './modules/admin/pages/GameManagement';
import { ApiKeyManagement } from './modules/admin/pages/ApiKeyManagement';
import { TransactionManagement } from './modules/admin/pages/TransactionManagement';
import { AnalyticsReports } from './modules/admin/pages/AnalyticsReports';
import { SystemSettings } from './modules/admin/pages/SystemSettings';

// Operator Imports
import { OperatorLayout } from './layouts/OperatorLayout';
import { OperatorLanding } from './modules/operator/pages/OperatorLanding';
import { OperatorAuth } from './modules/operator/pages/OperatorAuth';
import { OperatorDashboard } from './modules/operator/pages/OperatorDashboard';
import { OperatorCatalog } from './modules/operator/pages/OperatorCatalog';
import { OperatorMyGames } from './modules/operator/pages/OperatorMyGames';
import { OperatorCredentials } from './modules/operator/pages/OperatorCredentials';
import { OperatorDocs } from './modules/operator/pages/OperatorDocs';
import { OperatorIntegration } from './modules/operator/pages/OperatorIntegration';
import { OperatorLogs } from './modules/operator/pages/OperatorLogs';
import { OperatorWebhooks } from './modules/operator/pages/OperatorWebhooks';
import { OperatorTransactions } from './modules/operator/pages/OperatorTransactions';
import { OperatorTeam } from './modules/operator/pages/OperatorTeam';

// B2C Imports
import { B2CLayout } from './layouts/B2CLayout';
import { B2CHomepage } from './modules/b2c/pages/B2CHomepage';
import { B2CGamesLobby } from './modules/b2c/pages/B2CGamesLobby';
import { B2CGamePlayer } from './modules/b2c/pages/B2CGamePlayer';
import { B2CAuth } from './modules/b2c/pages/B2CAuth';
import { B2CPromotions } from './modules/b2c/pages/B2CPromotions';
import { B2CLeaderboard } from './modules/b2c/pages/B2CLeaderboard';

// Player Dashboard Imports
import { PlayerDashboardLayout } from './layouts/PlayerDashboardLayout';
import { PlayerOverview } from './modules/b2c/pages/PlayerOverview';
import { PlayerWallet } from './modules/b2c/pages/PlayerWallet';
import { PlayerTransactions } from './modules/b2c/pages/PlayerTransactions';
import { UnavailablePlayerFeature } from './modules/b2c/pages/UnavailablePlayerFeature';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DevRoleSwitcher />
        <Routes>
          {/* Access Denied Common Page */}
          <Route path="/access-denied" element={<AccessDenied />} />

          {/* B2C Public Gaming Website */}
          <Route path="/login" element={<B2CAuth initialMode="login" />} />
          <Route path="/register" element={<B2CAuth initialMode="register" />} />

          <Route path="/" element={<B2CLayout />}>
            <Route index element={<B2CHomepage />} />
            <Route path="games" element={<B2CGamesLobby />} />
            <Route path="play/:id" element={<B2CGamePlayer />} />
            <Route path="promotions" element={<B2CPromotions />} />
            <Route path="leaderboard" element={<B2CLeaderboard />} />
          </Route>

          {/* Dedicated Player Account Dashboard - Protected for 'player' role only */}
          <Route
            path="/player"
            element={
              <RequireRole allowedRoles={['player']}>
                <PlayerDashboardLayout />
              </RequireRole>
            }
          >
            <Route index element={<Navigate to="/player/profile" replace />} />
            <Route path="profile" element={<PlayerOverview />} />
            <Route path="wallet" element={<PlayerWallet />} />
            <Route path="transactions" element={<PlayerTransactions />} />
            <Route path="favorites" element={<UnavailablePlayerFeature feature="favorites" />} />
            <Route path="security" element={<UnavailablePlayerFeature feature="security" />} />
          </Route>

          {/* Super Admin Module - Protected for 'super_admin' role only */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <RequireRole allowedRoles={['super_admin']}>
                <AdminLayout />
              </RequireRole>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="operators" element={<OperatorManagement />} />
            <Route path="providers" element={<ProviderManagement />} />
            <Route path="games" element={<GameManagement />} />
            <Route path="api-keys" element={<ApiKeyManagement />} />
            <Route path="transactions" element={<TransactionManagement />} />
            <Route path="analytics" element={<AnalyticsReports />} />
            <Route path="settings" element={<SystemSettings />} />
          </Route>

          {/* B2B Operator Module */}
          <Route path="/operator" element={<OperatorLanding />} />
          <Route path="/operator/login" element={<OperatorAuth initialMode="login" />} />
          <Route path="/operator/register" element={<OperatorAuth initialMode="register" />} />
          <Route
            path="/operator/pending-approval"
            element={
              <RequireRole allowedRoles={['operator']}>
                <OperatorPendingApproval />
              </RequireRole>
            }
          />
          <Route
            path="/operator"
            element={
              <RequireRole allowedRoles={['operator']}>
                <RequireOperatorApproval>
                  <OperatorLayout />
                </RequireOperatorApproval>
              </RequireRole>
            }
          >
            <Route path="dashboard" element={<OperatorDashboard />} />
            <Route path="catalog" element={<OperatorCatalog />} />
            <Route path="my-games" element={<OperatorMyGames />} />
            <Route path="credentials" element={<OperatorCredentials />} />
            <Route path="integration" element={<OperatorIntegration />} />
            <Route path="docs" element={<OperatorDocs />} />
            <Route path="logs" element={<OperatorLogs />} />
            <Route path="webhooks" element={<OperatorWebhooks />} />
            <Route path="transactions" element={<OperatorTransactions />} />
            <Route path="team" element={<OperatorTeam />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
