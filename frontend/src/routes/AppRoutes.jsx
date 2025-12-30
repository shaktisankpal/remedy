import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import AdminDashboard from "../pages/admin/AdminDashboard";
import ClientDashboard from "../pages/client/ClientDashboard";
import SupportDashboard from "../pages/support/SupportDashboard";
import DeveloperDashboard from "../pages/developer/DeveloperDashboard";

import ProtectedRoute from "../components/common/ProtectedRoute";
import RoleRoute from "../components/common/RoleRoute";

import Unauthorized from "../pages/Unauthorized";
import CreateComplaint from "../pages/client/CreateComplaint";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        {/* Admin */}
        <Route element={<RoleRoute allowedRoles={["ADMIN"]} />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        {/* Client */}
        <Route element={<RoleRoute allowedRoles={["CLIENT"]} />}>
          <Route path="/client" element={<ClientDashboard />} />
          <Route path="/client/create" element={<CreateComplaint />} />
        </Route>

        {/* Support L1 */}
        <Route element={<RoleRoute allowedRoles={["SUPPORT_L1"]} />}>
          <Route path="/support" element={<SupportDashboard />} />
        </Route>

        {/* Developer L2 */}
        <Route element={<RoleRoute allowedRoles={["DEVELOPER_L2"]} />}>
          <Route path="/developer" element={<DeveloperDashboard />} />
        </Route>
      </Route>

      {/* Unauthorized */}
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
