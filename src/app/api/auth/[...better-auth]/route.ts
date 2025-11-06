import { createAuthRouteHandler } from "@better-auth/next";

import { auth } from "@/server/auth/config";

export const { GET, POST } = createAuthRouteHandler(auth);
