// ============================================================
// controllers/projectController.js — Portfolio project CRUD
// ============================================================

import mongoose from 'mongoose';
import Project from '../models/Project.js';

// ── Get all projects (public) ─────────────────────────────────
export const getAllProjects = async (req, res) => {
  try {
    const filter = {};
    if (req.query.featured === 'true') filter.featured = true;

    const projects = await Project.find(filter)
      .sort({ order: 1, createdAt: -1 });

    res.json({ success: true, data: projects });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── Allowlist helper ──────────────────────────────────────────
const extractProjectData = (body) => {
  const { title, description, content, liveUrl, techStack, type, featured } = body;
  
  let tags = techStack;
  if (typeof techStack === 'string') {
    tags = techStack.split(',').map((t) => t.trim()).filter(Boolean);
  } else if (Array.isArray(techStack)) {
    tags = techStack.map(String).filter(Boolean);
  }

  return { 
    ...(title !== undefined && { title: String(title).trim() }),
    ...(description !== undefined && { description: String(description).trim() }),
    ...(content !== undefined && { content: String(content) }),
    ...(liveUrl !== undefined && { liveUrl: String(liveUrl).trim() }),
    ...(type !== undefined && { type: String(type).trim() }),
    ...(tags !== undefined && { techStack: tags }),
    ...(featured !== undefined && { featured: Boolean(featured) })
  };
};

// ── Create project (admin) ────────────────────────────────────
export const createProject = async (req, res) => {
  try {
    const projectData = extractProjectData(req.body);
    
    // Automatically stick it at the end of the order
    const projectCount = await Project.countDocuments();
    projectData.order = projectCount;

    const project = await Project.create(projectData);
    res.status(201).json({ success: true, data: project });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── Update project (admin) ────────────────────────────────────
export const updateProject = async (req, res) => {
  try {
    const updateData = extractProjectData(req.body);
    updateData.updatedAt = new Date();

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, data: project });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── Delete project (admin) ────────────────────────────────────
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── Reorder projects (admin) ──────────────────────────────────
export const reorderProjects = async (req, res) => {
  try {
    const { ids } = req.body; // Array of project IDs in desired order
    if (!Array.isArray(ids)) {
      return res.status(400).json({ success: false, message: 'ids must be an array' });
    }

    // Validate that ALL elements are valid ObjectIds before trying any DB operations
    const areValid = ids.every(id => mongoose.Types.ObjectId.isValid(id));
    if (!areValid) {
       return res.status(400).json({ success: false, message: 'One or more invalid IDs in array' });
    }

    const updates = ids.map((id, index) =>
      Project.findByIdAndUpdate(id, { order: index })
    );

    await Promise.all(updates);
    res.json({ success: true, message: 'Projects reordered' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
