const ROLES = {
  ADMIN: "ADMIN",
  USER: "USER",
  GUEST: "GUEST",
};

const ROUTES = {
  ADMIN: {
    INDEX: "/admin",
    NEWS: "/news",
    NETWORKING: "/networking",
    EVENTS: "/events",
    OPPORTUNITIES: "/opportunities",
    PLANNING: "/planning",
    ID: "/:id",
  },

  USER: {
    INDEX: "/user",
    PROFILE: "profile",
    NEWS: "/news",
    SPACE: "/space",
    NETWORKING: "/networking",
    QUESTIONS: "/questions",
    PLANNING: "/planning",
    EVENTS: "/events",
    CHATS: "/chats",
    OPPORTUNITIES: "/opportunities",
    ID: "/:id",
  },
};

export { ROUTES, ROLES };
