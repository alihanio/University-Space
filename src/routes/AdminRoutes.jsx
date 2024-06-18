import { Suspense, lazy } from "react";
import { Navigate } from "react-router-dom";
import { ROUTES } from "./routes";
import Events from "../components/user/events/Events";
import EventsInner from "../components/user/events/EventsInner";
import Planning from "../components/admin/planning/Planning";
import InnerPlanning from "../components/user/planning/InnerPlanning";
import Chat from "../components/user/chats/Chat";
import Chats from "../components/user/chats/Chats";
import Networking from "../components/user/networking/Networking";
import InnerNetworking from "../components/user/networking/InnerNetworking";

const News = lazy(() => import("../components/admin/news/News"));
const InnerNews = lazy(() => import("../components/user/news/InnerNews"));
const Possibilities = lazy(() =>
  import("../components/user/possibilities/Possibilities")
);

const InnerPossibilities = lazy(() =>
  import("../components/user/possibilities/InnerPossibilities")
);

export const ADMIN_ROUTES = [
  {
    path: `${ROUTES.ADMIN.INDEX}`,
    element: <Navigate to={`${ROUTES.ADMIN.INDEX}${ROUTES.ADMIN.NEWS}`} />,
  },

  {
    path: `${ROUTES.ADMIN.INDEX}${ROUTES.ADMIN.NEWS}`,
    element: (
      <Suspense>
        <News />
      </Suspense>
    ),
  },

  {
    path: `${ROUTES.ADMIN.INDEX}${ROUTES.ADMIN.NEWS}${ROUTES.ADMIN.ID}`,
    element: (
      <Suspense>
        <InnerNews />
      </Suspense>
    ),
  },

  {
    path: `${ROUTES.ADMIN.INDEX}${ROUTES.ADMIN.EVENTS}`,
    element: (
      <Suspense>
        <Events />
      </Suspense>
    ),
  },

  {
    path: `${ROUTES.ADMIN.INDEX}${ROUTES.ADMIN.EVENTS}${ROUTES.ADMIN.ID}`,
    element: (
      <Suspense>
        <EventsInner />
      </Suspense>
    ),
  },

  {
    path: `${ROUTES.ADMIN.INDEX}${ROUTES.ADMIN.PLANNING}`,
    element: (
      <Suspense>
        <Planning />
      </Suspense>
    ),
  },

  {
    path: `${ROUTES.ADMIN.INDEX}${ROUTES.ADMIN.PLANNING}${ROUTES.ADMIN.ID}`,
    element: (
      <Suspense>
        <InnerPlanning />
      </Suspense>
    ),
  },

  {
    path: `${ROUTES.ADMIN.INDEX}${ROUTES.ADMIN.OPPORTUNITIES}`,
    element: (
      <Suspense>
        <Possibilities />
      </Suspense>
    ),
  },

  {
    path: `${ROUTES.ADMIN.INDEX}${ROUTES.ADMIN.OPPORTUNITIES}${ROUTES.ADMIN.ID}`,
    element: (
      <Suspense>
        <InnerPossibilities />
      </Suspense>
    ),
  },
  {
    path: `${ROUTES.ADMIN.INDEX}/chats/:id`,
    element: (
      <Suspense>
        <Chat />
      </Suspense>
    ),
  },
  {
    path: `${ROUTES.ADMIN.INDEX}/chats`,
    element: (
      <Suspense>
        <Chats />
      </Suspense>
    ),
  },
  {
    path: `${ROUTES.ADMIN.INDEX}${ROUTES.ADMIN.NETWORKING}`,
    element: (
      <Suspense>
        <Networking />
      </Suspense>
    ),
  },
  {
    path: `${ROUTES.ADMIN.INDEX}${ROUTES.ADMIN.NETWORKING}${ROUTES.ADMIN.ID}`,
    element: (
      <Suspense>
        <InnerNetworking />
      </Suspense>
    ),
  },
];
