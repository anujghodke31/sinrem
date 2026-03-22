// ============================================================
// routes/projects.js
// ============================================================
import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import validateId      from '../middleware/validateId.js';
import {
  getAllProjects,
  createProject,
  updateProject,
  deleteProject,
  reorderProjects,
} from '../controllers/projectController.js';

const router = Router();

router.get('/',            getAllProjects);

// IMPORTANT: /reorder must be before /:id to avoid being caught as an ID
router.put('/reorder',     authMiddleware, reorderProjects);
router.post('/',           authMiddleware, createProject);
router.put('/:id',         authMiddleware, validateId, updateProject);
router.delete('/:id',      authMiddleware, validateId, deleteProject);

export default router;
