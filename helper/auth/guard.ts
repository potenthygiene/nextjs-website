import { getAuthSession, isAdminUser } from "@/helper/auth/session";

// Every function in a "use server" file can be called from any browser, so
// anything that reads private data or changes the store checks the caller
// here first. Never rely on the page alone.

/** The signed-in admin, or an error for anyone else. */
export async function requireAdmin() {
  const session = await getAuthSession({ persistRefresh: false });
  if (!session.authenticated || !isAdminUser(session.user)) {
    throw new Error("Only Potent Hygiene admins can do this.");
  }
  return session.user!;
}

/** Whether the signed-in person is an admin (for pages that redirect). */
export async function isAdminSession() {
  const session = await getAuthSession({ persistRefresh: false });
  return session.authenticated && isAdminUser(session.user);
}

/**
 * The signed-in customer's id. When a userId is passed in, it must be theirs,
 * so nobody can act on another customer's account by sending a different id.
 */
export async function requireSelf(userId?: string | null) {
  const session = await getAuthSession({ persistRefresh: false });
  const me = session.authenticated ? session.user?.userId : null;
  if (!me || (userId && userId !== me)) {
    throw new Error("Please sign in again to continue.");
  }
  return me;
}
