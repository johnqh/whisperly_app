import type { ReactNode } from "react";
import { Navigate, useLocation, useParams } from "react-router-dom";
import { useAuthStatus } from "@sudobility/auth-components";
import Loading from "../Loading";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuthStatus();
  const location = useLocation();
  const { lang } = useParams<{ lang: string }>();

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    // Redirect to login with return URL
    const returnUrl = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/${lang || "en"}/login?returnUrl=${returnUrl}`} replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
