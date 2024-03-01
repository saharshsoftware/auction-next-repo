import { IRouteInterface } from "@/interfaces/RouteInterface";
import { STRING_DATA } from "@/shared/Constants";
import { ROUTE_CONSTANTS } from "@/shared/Routes";

export const PUBLIC_ROUTES: IRouteInterface[] = [
  {
    path: ROUTE_CONSTANTS.DASHBOARD,
    title: STRING_DATA.DASHBOARD,
  },
  {
    path: ROUTE_CONSTANTS.AUCTION,
    title: STRING_DATA.AUCTION,
  },
  {
    path: ROUTE_CONSTANTS.AUCTION_DETAIL + STRING_DATA.ID_SLASH,
    title: STRING_DATA.AUCTION_DETAIL,
  },
  {
    path: ROUTE_CONSTANTS.PROFILE,
    title: STRING_DATA.PROFILE,
  },
  {
    path: ROUTE_CONSTANTS.SETTINGS,
    title: STRING_DATA.SETTINGS,
  },
];
