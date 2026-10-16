import { createBrowserRouter } from 'react-router';
import { PublicLayout } from '@/app/layouts/PublicLayout';
import { AppLayout } from '@/app/layouts/AppLayout';
import { AdminLayout } from '@/app/layouts/AdminLayout';
import { ExamLayout } from '@/app/layouts/ExamLayout';
import { RequireAuth, RequireGuest, RequireRole } from '@/app/router/guards';

// Public Pages
import { LandingPage } from '@/features/dashboard/pages/LandingPage';
import { SubjectsPage } from '@/features/subjects/pages/SubjectsPage';
import { LeaderboardPage } from '@/features/leaderboard/pages/LeaderboardPage';
import { TermsPage } from '@/features/dashboard/pages/TermsPage';
import { PrivacyPage } from '@/features/dashboard/pages/PrivacyPage';
import { ExamsListPage, ExamTakePage } from '@/features/exams';

// Auth Pages
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { RegisterPage } from '@/features/auth/pages/RegisterPage';
import { ForgotPasswordPage } from '@/features/auth/pages/ForgotPasswordPage';
import { ResetPasswordPage } from '@/features/auth/pages/ResetPasswordPage';

// App Pages (RequireAuth)
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage';
import { PracticePage } from '@/features/practice';
import { ArenaLobbyPage } from '@/features/arena/pages/ArenaLobbyPage';
import { ProfilePage } from '@/features/profile/pages/ProfilePage';
import { SettingsPage } from '@/features/settings/pages/SettingsPage';

// Admin Pages (RequireRole: editor / admin)
import {
  AdminOverviewPage,
  AdminSubjectsPage,
  AdminQuestionsPage,
  AdminQuestionFormPage,
  AdminImportPage,
  AdminUsersPage,
  AdminAuditPage,
} from '@/features/admin';

// System Pages
import { NotFoundPage } from '@/features/dashboard/pages/NotFoundPage';
import { ForbiddenPage } from '@/features/dashboard/pages/ForbiddenPage';
import { RouteErrorElement } from '@/components/shared/RouteErrorElement';

export const router = createBrowserRouter([
  // Public Landing, Learning, and info pages (No login required)
  {
    path: '/',
    element: <PublicLayout />,
    errorElement: <RouteErrorElement />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'subjects', element: <SubjectsPage /> },
      { path: 'practice', element: <PracticePage /> },
      { path: 'exams', element: <ExamsListPage /> },
      { path: 'leaderboard', element: <LeaderboardPage /> },
      { path: 'terms', element: <TermsPage /> },
      { path: 'privacy', element: <PrivacyPage /> },
    ],
  },

  // Auth pages (accessible only by guests)
  {
    path: '/login',
    element: (
      <RequireGuest>
        <LoginPage />
      </RequireGuest>
    ),
  },
  {
    path: '/register',
    element: (
      <RequireGuest>
        <RegisterPage />
      </RequireGuest>
    ),
  },
  {
    path: '/forgot-password',
    element: (
      <RequireGuest>
        <ForgotPasswordPage />
      </RequireGuest>
    ),
  },
  {
    path: '/reset-password',
    element: <ResetPasswordPage />,
  },

  // Battle Rank & User Account (RequireAuth)
  {
    path: '/',
    element: (
      <RequireAuth>
        <AppLayout />
      </RequireAuth>
    ),
    children: [
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'arena', element: <ArenaLobbyPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },

  // Solo Exam session (Distraction-free ExamLayout, No login required!)
  {
    path: '/exams/:id',
    element: <ExamLayout />,
    errorElement: <RouteErrorElement />,
    children: [
      {
        index: true,
        element: <ExamTakePage />,
      },
    ],
  },

  // Battle Rank & Realtime Arena Match session (RequireAuth!)
  {
    path: '/arena/room/:code',
    element: (
      <RequireAuth>
        <ExamLayout />
      </RequireAuth>
    ),
    children: [
      {
        index: true,
        element: <ArenaLobbyPage />,
      },
    ],
  },

  // Admin Studio (RequireRole: editor or admin)
  {
    path: '/admin',
    element: (
      <RequireRole role="editor">
        <AdminLayout />
      </RequireRole>
    ),
    children: [
      { index: true, element: <AdminOverviewPage /> },
      { path: 'subjects', element: <AdminSubjectsPage /> },
      { path: 'questions', element: <AdminQuestionsPage /> },
      { path: 'questions/new', element: <AdminQuestionFormPage /> },
      { path: 'questions/:questionId', element: <AdminQuestionFormPage /> },
      { path: 'import', element: <AdminImportPage /> },
      {
        path: 'users',
        element: (
          <RequireRole role="admin">
            <AdminUsersPage />
          </RequireRole>
        ),
      },
      {
        path: 'audit',
        element: (
          <RequireRole role="admin">
            <AdminAuditPage />
          </RequireRole>
        ),
      },
    ],
  },

  // System pages
  {
    path: '/403',
    element: <ForbiddenPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
