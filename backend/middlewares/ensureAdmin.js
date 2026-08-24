import { ensureUser } from "../lib/ensureUser.js";

export const ensureAdmin = async (req, res, next) => {
  const clerkUserId = req.auth?.userId;

  if (!clerkUserId) {
    return res.status(401).json("Not authenticated!");
  }

  const user = await ensureUser(clerkUserId);

  if (!user) {
    return res.status(404).json("User not found!");
  }

  if (user.role !== "admin") {
    return res.status(403).json("Admins only!");
  }

  req.dbUser = user;
  next();
};

