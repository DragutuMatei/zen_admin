import React from "react";
import { Navigate, Route } from "react-router-dom";

const PrivateRoute = ({ element: Component, path }) => {
  const isAuthenticated = !!localStorage.getItem("auth");

  return (
    <Route
      path={path}
      element={isAuthenticated ? <Component /> : <Navigate to="/" />}
    />
  );
};

export default PrivateRoute;
