import { BrowserRouter, Navigate, useRoutes } from "react-router-dom";
import { PUBLIC_ROUTES } from "./PublicRoute";
import { PRIVATE_ROUTES } from "./PrivateRoute";
import { AUTH_ROUTES } from "./AuthRoutes";
import { ROUTE_CONSTANTS } from "../shared/Routes";
import { IRouteInterface } from "../interfaces/RouteInterface";
import PublicLayout from "../components/layouts/PublicLayout";
import PrivateLayout from "../components/layouts/PrivateLayout";
import AppLayout from "../components/layouts/AppLayout";
import { useGlobalStore } from "../zustandStore/store";

const DEFAULT_AUTHENTICATED_ROUTE = ROUTE_CONSTANTS.DASHBOARD;
const DEFAULT_GUEST_ROUTE = ROUTE_CONSTANTS.DASHBOARD;

const GuestRoutes = () => {
  const routes: IRouteInterface[] = AUTH_ROUTES.concat(PUBLIC_ROUTES);
  const defaultGuestRoute = {
    path: "*",
    element: <Navigate to={DEFAULT_GUEST_ROUTE} replace />,
    title: "Home",
  };
  routes.push(defaultGuestRoute);
  const routing = useRoutes(routes);
  return <PublicLayout>{routing}</PublicLayout>;
};

const AuthenticatedRoutes = () => {
  const routes: IRouteInterface[] = PUBLIC_ROUTES.concat(PRIVATE_ROUTES as []);

  const defaultRoute = {
    path: "*",
    element: <Navigate to={DEFAULT_AUTHENTICATED_ROUTE} replace />,
    title: "Home",
  };
  routes.push(defaultRoute);
  const routing = useRoutes(routes);
  return <PrivateLayout>{routing}</PrivateLayout>;
};

const RootRouter = () => {
  const { isAuthenticated } = useGlobalStore();

  console.log(isAuthenticated);
  return (
    <BrowserRouter basename={""}>
      <AppLayout>
        {isAuthenticated ? <AuthenticatedRoutes /> : <GuestRoutes />}
      </AppLayout>
    </BrowserRouter>
  );
};

export default RootRouter;
