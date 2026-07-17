import { eq } from "drizzle-orm";
import { db } from "@repo/database";
import { usersTable } from "@repo/database/schema";
import { signSessionToken } from "../auth/jwt";
import { env } from "../env";
import { googleOAuth2Client } from "../clients/google-oauth";
import { GetAuthenticationMethodOutputSchema } from "./model";

const GUEST_EMAIL = "demo@zenithform.com";
const GUEST_NAME = "Demo User";

class UserService {
  public async getAuthenticationMethods(): Promise<
    ReadonlyArray<GetAuthenticationMethodOutputSchema>
  > {
    const supportedAuthenticationProviders: GetAuthenticationMethodOutputSchema[] = [];

    const isGoogleConfigured = !!(env.GOOGLE_OAUTH_CLIENT_ID && env.GOOGLE_OAUTH_CLIENT_SECRET);

    if (isGoogleConfigured) {
      const url = googleOAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: ["openid", "email", "profile"],
      });
      supportedAuthenticationProviders.push({
        provider: "GOOGLE_OAUTH",
        displayName: "Google",
        displayText: "Signin with Google",
        authUrl: url,
      });
    }

    return supportedAuthenticationProviders;
  }

  public async loginWithGoogleCode(code: string) {
    const { tokens } = await googleOAuth2Client.getToken(code);

    if (!tokens.id_token) {
      throw new Error("Google did not return an id_token");
    }

    const ticket = await googleOAuth2Client.verifyIdToken({
      idToken: tokens.id_token,
      audience: env.GOOGLE_OAUTH_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    const email = payload?.email;

    if (!email) {
      throw new Error("Google profile did not contain an email");
    }

    const fullName = payload.name?.trim() || email.split("@")[0] || email;

    const [existingUser] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    const user =
      existingUser ??
      (
        await db
          .insert(usersTable)
          .values({
            fullName,
            email,
            emailVerified: payload.email_verified ?? false,
            profileImageUrl: payload.picture,
          })
          .returning()
      )[0];

    if (!user) {
      throw new Error("Failed to create Google user");
    }

    const sessionToken = signSessionToken({
      userId: user.id,
      email: user.email,
    });

    return { user, sessionToken };
  }

  public async loginAsGuest() {
    const [existingGuest] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, GUEST_EMAIL))
      .limit(1);

    const guestUser =
      existingGuest ??
      (
        await db
          .insert(usersTable)
          .values({
            fullName: GUEST_NAME,
            email: GUEST_EMAIL,
            emailVerified: true,
          })
          .returning()
      )[0];

    if (!guestUser) {
      throw new Error("Failed to create guest user");
    }

    const sessionToken = signSessionToken({
      userId: guestUser.id,
      email: guestUser.email,
    });

    return { user: guestUser, sessionToken };
  }
}

export default UserService;
