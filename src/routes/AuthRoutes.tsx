import { IRouteInterface } from "@/interfaces/RouteInterface";
import { STRING_DATA } from "../shared/Constants";
import { ROUTE_CONSTANTS } from "../shared/Routes";

export const AUTH_ROUTES: IRouteInterface[] = [
  {
    path: ROUTE_CONSTANTS.LOGIN,
    title: STRING_DATA.LOGIN,
  },
  {
    path: ROUTE_CONSTANTS.REGISTER,
    title: STRING_DATA.REGISTER,
  },
];
