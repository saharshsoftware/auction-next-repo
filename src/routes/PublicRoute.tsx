import { IRouteInterface } from "../interfaces/RouteInterface";
import { STRING_DATA } from "../shared/Constants";
import { ROUTE_CONSTANTS } from "../shared/Routes";
import Auction from "../views/Auction";
import AuctionDetail from "../views/AuctionDetail";
import Dashboard from "../views/Dashboard";
import Profile from "../views/Profile";
import Settings from "../views/Settings";

export const PUBLIC_ROUTES: IRouteInterface[] = [
  {
    path: ROUTE_CONSTANTS.DASHBOARD,
    element: <Dashboard />,
    title: STRING_DATA.DASHBOARD,
  },
  {
    path: ROUTE_CONSTANTS.AUCTION,
    element: <Auction />,
    title: STRING_DATA.AUCTION,
  },
  {
    path: ROUTE_CONSTANTS.AUCTION_DETAIL + STRING_DATA.ID_SLASH,
    element: <AuctionDetail />,
    title: STRING_DATA.AUCTION_DETAIL,
  },
  {
    path: ROUTE_CONSTANTS.PROFILE,
    element: <Profile />,
    title: STRING_DATA.PROFILE,
  },
  {
    path: ROUTE_CONSTANTS.SETTINGS,
    element: <Settings />,
    title: STRING_DATA.SETTINGS,
  },
];
