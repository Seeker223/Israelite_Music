import ImageKit from "imagekit";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { ensureUser } from "../lib/ensureUser.js";

export const getPosts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 2;

  const query = {};

  console.log(req.query);

  const cat = req.query.cat;
  const author = req.query.author;
  const searchQuery = req.query.search;
  const sortQuery = req.query.sort;
  const featured = req.query.featured;

  if (cat) {
    query.category = cat;
  }

  if (searchQuery) {
    query.title = { $regex: searchQuery, $options: "i" };
  }

  if (author) {
    const user = await User.findOne({ username: author }).select("_id");

    if (!user) {
      return res.status(404).json("No post found!");
    }

    query.user = user._id;
  }

  let sortObj = { createdAt: -1 };

  if (sortQuery) {
    switch (sortQuery) {
      case "newest":
        sortObj = { createdAt: -1 };
        break;
      case "oldest":
        sortObj = { createdAt: 1 };
        break;
      case "popular":
        sortObj = { visit: -1 };
        break;
      case "trending":
        sortObj = { visit: -1 };
        query.createdAt = {
          $gte: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
        };
        break;
      default:
        break;
    }
  }

  if (featured) {
    query.isFeatured = true;
  }

  const posts = await Post.find(query)
    .populate("user", "username")
    .sort(sortObj)
    .limit(limit)
    .skip((page - 1) * limit);

  const totalPosts = await Post.countDocuments(query);
  const hasMore = page * limit < totalPosts;

  res.status(200).json({ posts, hasMore });
};

export const getPost = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug }).populate(
      "user",
      "username img"
    );

    if (!post) {
      return res.status(404).json("Post not found!");
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json("Failed to fetch post!");
  }
};

export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "user",
      "username img"
    );

    if (!post) {
      return res.status(404).json("Post not found!");
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json("Failed to fetch post!");
  }
};

export const createPost = async (req, res) => {
  const clerkUserId = req.auth.userId;

  console.log(req.headers);

  if (!clerkUserId) {
    return res.status(401).json("Not authenticated!");
  }

  if (!req.body.title || !req.body.title.trim()) {
    return res.status(400).json("Title is required!");
  }

  const user = req.dbUser || (await ensureUser(clerkUserId));

  if (!user) {
    return res.status(404).json("User not found!");
  }

  // Route is protected by ensureAdmin middleware.

  let slug = req.body.title.replace(/ /g, "-").toLowerCase();

  let existingPost = await Post.findOne({ slug });

  let counter = 2;

  while (existingPost) {
    slug = `${slug}-${counter}`;
    existingPost = await Post.findOne({ slug });
    counter++;
  }

  const newPost = new Post({ user: user._id, slug, ...req.body });

  const post = await newPost.save();
  res.status(200).json(post);
};

export const deletePost = async (req, res) => {
  const clerkUserId = req.auth.userId;

  if (!clerkUserId) {
    return res.status(401).json("Not authenticated!");
  }

  const user = req.dbUser || (await ensureUser(clerkUserId));

  if (!user) {
    return res.status(404).json("User not found!");
  }

  // Route is protected by ensureAdmin middleware.
  await Post.findByIdAndDelete(req.params.id);

  res.status(200).json("Post has been deleted");
};

export const updatePost = async (req, res) => {
  const clerkUserId = req.auth.userId;
  const postId = req.params.id;

  if (!clerkUserId) {
    return res.status(401).json("Not authenticated!");
  }

  const user = req.dbUser || (await ensureUser(clerkUserId));

  if (!user) {
    return res.status(404).json("User not found!");
  }

  // Route is protected by ensureAdmin middleware.
  const post = await Post.findById(postId);

  if (!post) {
    return res.status(404).json("Post not found!");
  }

  const nextTitle =
    typeof req.body?.title === "string" ? req.body.title.trim() : post.title;

  if (!nextTitle) {
    return res.status(400).json("Title is required!");
  }

  const nextCategory =
    typeof req.body?.category === "string" && req.body.category.trim()
      ? req.body.category.trim()
      : post.category;

  const nextDesc =
    typeof req.body?.desc === "string" ? req.body.desc : post.desc;

  const nextContent =
    typeof req.body?.content === "string" && req.body.content.trim()
      ? req.body.content
      : post.content;

  const nextImg = typeof req.body?.img === "string" ? req.body.img : post.img;

  if (!nextContent || !nextContent.trim()) {
    return res.status(400).json("Content is required!");
  }

  if (nextTitle !== post.title) {
    let slug = nextTitle.replace(/ /g, "-").toLowerCase();

    let existingPost = await Post.findOne({ slug, _id: { $ne: post._id } });
    let counter = 2;

    while (existingPost) {
      slug = `${slug}-${counter}`;
      existingPost = await Post.findOne({ slug, _id: { $ne: post._id } });
      counter++;
    }

    post.slug = slug;
  }

  post.title = nextTitle;
  post.category = nextCategory;
  post.desc = nextDesc;
  post.content = nextContent;
  post.img = nextImg;

  const updated = await post.save();
  res.status(200).json(updated);
};

export const featurePost = async (req, res) => {
  const clerkUserId = req.auth.userId;
  const postId = req.body.postId;

  if (!clerkUserId) {
    return res.status(401).json("Not authenticated!");
  }

  const user = req.dbUser || (await ensureUser(clerkUserId));

  if (!user) {
    return res.status(404).json("User not found!");
  }

  // Route is protected by ensureAdmin middleware.

  const post = await Post.findById(postId);

  if (!post) {
    return res.status(404).json("Post not found!");
  }

  const isFeatured = post.isFeatured;

  const updatedPost = await Post.findByIdAndUpdate(
    postId,
    {
      isFeatured: !isFeatured,
    },
    { new: true }
  );

  res.status(200).json(updatedPost);
};

let imagekit;

const getImageKit = () => {
  if (!imagekit) {
    imagekit = new ImageKit({
      urlEndpoint: process.env.IK_URL_ENDPOINT,
      publicKey: process.env.IK_PUBLIC_KEY,
      privateKey: process.env.IK_PRIVATE_KEY,
    });
  }
  return imagekit;
};

export const uploadAuth = async (req, res) => {
  // Route is protected by ensureAdmin middleware.
  const ik = getImageKit();
  const result = ik.getAuthenticationParameters();
  res.send(result);
};
