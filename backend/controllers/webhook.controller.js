import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import Comment from "../models/comment.model.js";
import { Webhook } from "svix";

const getRoleFromEvent = (evtData) => {
  const role =
    evtData?.public_metadata?.role ||
    evtData?.unsafe_metadata?.role ||
    evtData?.private_metadata?.role ||
    evtData?.metadata?.role;

  return role === "admin" ? "admin" : "user";
};

export const clerkWebHook = async (req, res) => {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("Webhook secret needed!");
  }

  const payload = req.body;
  const headers = req.headers;

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt;
  try {
    evt = wh.verify(payload, headers);
  } catch (err) {
    return res.status(400).json({
      message: "Webhook verification failed!",
    });
  }

  // console.log(evt.data);

  if (evt.type === "user.created") {
    const primaryEmail =
      evt.data.email_addresses?.find(
        (e) => e.id === evt.data.primary_email_address_id
      )?.email_address || null;

    const newUser = new User({
      clerkUserId: evt.data.id,
      username:
        evt.data.username ||
        primaryEmail ||
        evt.data.id,
      email: primaryEmail || "unknown@example.com",
      img: evt.data.image_url || evt.data.profile_image_url || null,
      role: getRoleFromEvent(evt.data),
    });

    await newUser.save();
  }

  if (evt.type === "user.updated") {
    await User.findOneAndUpdate(
      { clerkUserId: evt.data.id },
      {
        role: getRoleFromEvent(evt.data),
      }
    );
  }

  if (evt.type === "user.deleted") {
    const deletedUser = await User.findOneAndDelete({
      clerkUserId: evt.data.id,
    });

    if (deletedUser) {
      await Post.deleteMany({ user: deletedUser._id });
      await Comment.deleteMany({ user: deletedUser._id });
    }
  }

  return res.status(200).json({
    message: "Webhook received",
  });
};
