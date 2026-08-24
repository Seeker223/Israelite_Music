import Category from "../models/category.model.js";

const slugify = (value = "") => {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
};

const getUniqueCategorySlug = async (name, excludeId = null) => {
  const baseSlug = slugify(name) || "category";
  let slug = baseSlug;
  let counter = 2;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const query = excludeId
      ? { slug, _id: { $ne: excludeId } }
      : { slug };

    const existing = await Category.findOne(query).select("_id");
    if (!existing) return slug;

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
};

export const getCategories = async (req, res) => {
  const categories = await Category.find().sort({ name: 1 });
  res.status(200).json(categories);
};

export const createCategory = async (req, res) => {
  const name = req.body?.name || "";

  if (!name.trim()) {
    return res.status(400).json("Name is required!");
  }

  const slug = await getUniqueCategorySlug(name);
  const category = await Category.create({
    name: name.trim(),
    slug,
    createdBy: req.dbUser._id,
  });

  res.status(201).json(category);
};

export const updateCategory = async (req, res) => {
  const id = req.params.id;
  const name = req.body?.name || "";

  if (!name.trim()) {
    return res.status(400).json("Name is required!");
  }

  const category = await Category.findById(id);
  if (!category) {
    return res.status(404).json("Category not found!");
  }

  category.name = name.trim();
  category.slug = await getUniqueCategorySlug(category.name, category._id);

  const updated = await category.save();
  res.status(200).json(updated);
};

export const deleteCategory = async (req, res) => {
  const id = req.params.id;

  const deleted = await Category.findByIdAndDelete(id);
  if (!deleted) {
    return res.status(404).json("Category not found!");
  }

  res.status(200).json("Category deleted");
};

