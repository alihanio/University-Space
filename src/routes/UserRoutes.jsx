import { Suspense, lazy } from "react";
import { ROUTES } from "./routes";
import { Navigate } from "react-router-dom";
import Chat from "../components/user/chats/Chat";
import Chats from "../components/user/chats/Chats";
import InnerPlanning from "../components/user/planning/InnerPlanning";
import Planning from "../components/admin/planning/Planning";

const InnerNetworking = lazy(() =>
  import("../components/user/networking/InnerNetworking")
);
const Networking = lazy(() =>
  import("../components/user/networking/Networking")
);
const InnerNews = lazy(() => import("../components/user/news/InnerNews"));
const Space = lazy(() => import("../components/user/space/Space"));
const News = lazy(() => import("../components/user/news/News"));
const Profile = lazy(() => import("../pages/user/Profile"));
const Events = lazy(() => import("../components/user/events/Events"));
const EventsInner = lazy(() => import("../components/user/events/EventsInner"));

const Possibilities = lazy(() =>
  import("../components/user/possibilities/Possibilities")
);

const InnerPossibilities = lazy(() =>
  import("../components/user/possibilities/InnerPossibilities")
);

export const USER_ROUTES = [
  {
    path: `${ROUTES.USER.INDEX}`,
    element: <Navigate to={`${ROUTES.USER.INDEX}/${ROUTES.USER.PROFILE}`} />,
  },

  {
    path: `${ROUTES.USER.INDEX}/${ROUTES.USER.PROFILE}`,
    element: (
      <Suspense>
        <Profile />
      </Suspense>
    ),
  },

  {
    path: `${ROUTES.USER.INDEX}${ROUTES.USER.NETWORKING}`,
    element: (
      <Suspense>
        <Networking />
      </Suspense>
    ),
  },

  {
    path: `${ROUTES.USER.INDEX}${ROUTES.USER.NEWS}`,
    element: (
      <Suspense>
        <News />
      </Suspense>
    ),
  },

  {
    path: `${ROUTES.USER.INDEX}${ROUTES.USER.NEWS}${ROUTES.USER.ID}`,
    element: (
      <Suspense>
        <InnerNews />
      </Suspense>
    ),
  },

  {
    path: `${ROUTES.USER.INDEX}${ROUTES.USER.EVENTS}`,
    element: (
      <Suspense>
        <Events />
      </Suspense>
    ),
  },

  {
    path: `${ROUTES.USER.INDEX}${ROUTES.USER.EVENTS}${ROUTES.USER.ID}`,
    element: (
      <Suspense>
        <EventsInner />
      </Suspense>
    ),
  },

  {
    path: `${ROUTES.USER.INDEX}${ROUTES.USER.NETWORKING}${ROUTES.USER.ID}`,
    element: (
      <Suspense>
        <InnerNetworking />
      </Suspense>
    ),
  },

  {
    path: `${ROUTES.USER.INDEX}${ROUTES.USER.SPACE}`,
    element: (
      <Suspense>
        <Space />
      </Suspense>
    ),
  },

  {
    path: `${ROUTES.USER.INDEX}${ROUTES.USER.CHATS}${ROUTES.USER.ID}`,
    element: (
      <Suspense>
        <Chat />
      </Suspense>
    ),
  },
  {
    path: `${ROUTES.USER.INDEX}${ROUTES.USER.CHATS}`,
    element: (
      <Suspense>
        <Chats />
      </Suspense>
    ),
  },

  {
    path: `${ROUTES.USER.INDEX}${ROUTES.USER.PLANNING}`,
    element: (
      <Suspense>
        <Planning />
      </Suspense>
    ),
  },

  {
    path: `${ROUTES.USER.INDEX}${ROUTES.USER.PLANNING}${ROUTES.USER.ID}`,
    element: (
      <Suspense>
        <InnerPlanning />
      </Suspense>
    ),
  },

  {
    path: `${ROUTES.USER.INDEX}${ROUTES.USER.OPPORTUNITIES}`,
    element: (
      <Suspense>
        <Possibilities />
      </Suspense>
    ),
  },

  {
    path: `${ROUTES.USER.INDEX}${ROUTES.USER.OPPORTUNITIES}${ROUTES.USER.ID}`,
    element: (
      <Suspense>
        <InnerPossibilities />
      </Suspense>
    ),
  },
];
