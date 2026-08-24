import { clerkClient } from "@clerk/express";
import User from "../models/user.model.js";

const getRoleFromClerk = (clerkUser) => {
  const role =
    clerkUser?.publicMetadata?.role ||
    clerkUser?.unsafeMetadata?.role ||
    clerkUser?.privateMetadata?.role;

  return role === "admin" ? "admin" : "user";
};

const getPrimaryEmail = (clerkUser) => {
  return (
    clerkUser.emailAddresses?.find(
      (e) => e.id === clerkUser.primaryEmailAddressId
    )?.emailAddress ||
    clerkUser.emailAddresses?.[0]?.emailAddress ||
    null
  );
};

export const ensureUser = async (clerkUserId) => {
  if (!clerkUserId) return null;

  const existing = await User.findOne({ clerkUserId });
  if (existing) {
    const clerkUser = await clerkClient.users.getUser(clerkUserId);
    const role = getRoleFromClerk(clerkUser);

    if (existing.role !== role) {
      existing.role = role;
      await existing.save();
    }

    return existing;
  }

  const clerkUser = await clerkClient.users.getUser(clerkUserId);
  const primaryEmail = getPrimaryEmail(clerkUser);

  const user = await User.create({
    clerkUserId,
    username: clerkUser.username || primaryEmail || clerkUser.id,
    email: primaryEmail || `${clerkUserId}@users.local`,
    img: clerkUser.imageUrl || clerkUser.profileImageUrl || null,
    role: getRoleFromClerk(clerkUser),
  });

  return user;
};
