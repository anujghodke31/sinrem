// ============================================================
// controllers/blogController.js — Blog post CRUD
// ============================================================

import BlogPost from '../models/BlogPost.js';

// ── Get all PUBLISHED posts (public) ─────────────────────────
export const getAllPosts = async (req, res) => {
  try {
    let { category, tag, page = 1, limit = 6 } = req.query;
    
    // Bounds and sanitization
    page = Math.max(1, parseInt(page, 10) || 1);
    limit = Math.min(50, Math.max(1, parseInt(limit, 10) || 6));
    
    const filter = { isPublished: true };
    if (category) filter.category = String(category);
    if (tag)      filter.tags = String(tag);

    const skip  = (page - 1) * limit;
    const total = await BlogPost.countDocuments(filter);
    const posts = await BlogPost.find(filter)
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-content'); // Don't send full content in list view

    res.json({
      success: true,
      total,
      pages: Math.ceil(total / limit),
      page,
      data:  posts,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── Get single post by slug (public) ─────────────────────────
export const getPostBySlug = async (req, res) => {
  try {
    // Sanitise the slug input (forces string)
    const slug = String(req.params.slug);
    
    const post = await BlogPost.findOne({
      slug,
      isPublished: true,
    });
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    res.json({ success: true, data: post });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── Get ALL posts including drafts (admin) ────────────────────
export const getAllPostsAdmin = async (req, res) => {
  try {
    let { page = 1, limit = 50 } = req.query;
    page = Math.max(1, parseInt(page, 10) || 1);
    limit = Math.min(200, Math.max(1, parseInt(limit, 10) || 50));
    
    const skip = (page - 1) * limit;
    const total = await BlogPost.countDocuments();
    
    const posts = await BlogPost.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-content');
      
    res.json({ 
      success: true, 
      total,
      pages: Math.ceil(total / limit),
      page,
      data: posts 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── Allowlist helper ──────────────────────────────────────────
const extractPostData = (body) => {
  const { title, excerpt, content, category, tags, isPublished, author, coverImage } = body;
  return { 
    ...(title !== undefined && { title: String(title) }),
    ...(excerpt !== undefined && { excerpt: String(excerpt) }),
    ...(content !== undefined && { content: String(content) }),
    ...(category !== undefined && { category: String(category) }),
    ...(tags !== undefined && { tags: Array.isArray(tags) ? tags.map(String) : [String(tags)] }),
    ...(isPublished !== undefined && { isPublished: Boolean(isPublished) }),
    ...(author !== undefined && { author: String(author) }),
    ...(coverImage !== undefined && { coverImage: String(coverImage) })
  };
};

// ── Create post (admin) ───────────────────────────────────────
export const createPost = async (req, res) => {
  try {
    // Prevent mass assignment via strict allowlisting
    const postData = extractPostData(req.body);

    const post = await BlogPost.create(postData);
    res.status(201).json({ success: true, data: post });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'A post with this title already exists' });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── Update post (admin) ───────────────────────────────────────
export const updatePost = async (req, res) => {
  try {
    // Prevent mass assignment via strict allowlisting
    const updateData = extractPostData(req.body);
    updateData.updatedAt = new Date();

    // Set publishedAt if publishing for first time
    if (updateData.isPublished) {
      const existing = await BlogPost.findById(req.params.id);
      if (existing && !existing.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }

    const post = await BlogPost.findByIdAndUpdate(req.params.id, updateData, {
      new:           true,
      runValidators: true,
    });
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    res.json({ success: true, data: post });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'A post with this title already exists' });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── Delete post (admin) ───────────────────────────────────────
export const deletePost = async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    res.json({ success: true, message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
