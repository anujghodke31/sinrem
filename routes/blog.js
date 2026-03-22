// ============================================================
// routes/blog.js
// ============================================================
import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import validateId      from '../middleware/validateId.js';
import {
  getAllPosts,
  getPostBySlug,
  getAllPostsAdmin,
  createPost,
  updatePost,
  deletePost,
} from '../controllers/blogController.js';

const router = Router();

// Public routes — order matters: /admin/all must be before /:slug
router.get('/',           getAllPosts);
router.get('/admin/all',  authMiddleware, getAllPostsAdmin);
router.get('/:slug',      getPostBySlug);

// Protected admin routes
router.post('/',          authMiddleware, createPost);
router.put('/:id',        authMiddleware, validateId, updatePost);
router.delete('/:id',     authMiddleware, validateId, deletePost);

export default router;
