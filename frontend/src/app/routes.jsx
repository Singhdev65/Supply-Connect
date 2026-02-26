import { Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { routeConfig } from "./routeConfig";
import Loader from "@/shared/ui/Loader";
import ProtectedRoute from "@/utils/ProtectedRoute";
import PublicRoute from "@/utils/PublicRoute";

const RouteFallback = () => (
  <div className="flex min-h-[40vh] items-center justify-center">
    <p className="text-sm text-gray-500">Loading...</p>
  </div>
);

const withSuspense = (node) => (
  <Suspense fallback={<RouteFallback />}>{node}</Suspense>
);

function createRoutes(routes) {
  return routes.map((route, index) => {
    const Component = route.element;
    let element = null;

    // Handle redirect routes
    if (route.redirect) {
      element = <Navigate to={route.redirect} replace />;
    }
    // Handle layout routes
    else if (route.isLayout) {
      element = withSuspense(<Component />);
    }
    // Handle protected routes with specific roles
    else if (route.roles) {
      element = (
        <ProtectedRoute roles={route.roles}>
          {withSuspense(<Component />)}
        </ProtectedRoute>
      );
    }
    // Handle public routes
    else if (route.isPublic) {
      element = (
        <PublicRoute>
          {withSuspense(<Component />)}
        </PublicRoute>
      );
    }
    // Default component rendering
    else {
      element = withSuspense(<Component />);
    }

    // If it has children, render as parent route
    if (route.children) {
      return (
        <Route key={index} path={route.path} element={element}>
          {createRoutes(route.children)}
        </Route>
      );
    }

    // Otherwise render as leaf route
    return (
      <Route
        key={index}
        path={route.path}
        index={route.index}
        element={element}
      />
    );
  });
}

export const AppShell = () => {
  return (
    <>
      <Loader />
      <Router>
        <Routes>{createRoutes(routeConfig)}</Routes>
      </Router>
    </>
  );
};
