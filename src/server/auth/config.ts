import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/prisma";

import { prisma } from "@/server/db/client";

export const auth = betterAuth({
  database: prismaAdapter(prisma),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 12
  },
  email: {
    sendVerificationEmail: async ({ email, url }) => {
      console.info(`Verification email for ${email}: ${url}`);
    }
  }
});
