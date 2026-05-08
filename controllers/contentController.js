// ============================================================
// controllers/contentController.js — Public content read APIs
// ============================================================

import SiteSettings from '../models/SiteSettings.js';
import Page from '../models/Page.js';
import HomepageSection from '../models/HomepageSection.js';
import Service from '../models/Service.js';

const MAX_SECTIONS = 50;
const MAX_SERVICES = 50;
const MAX_LIST_ITEMS = 20;
const MAX_TEXT_LEN = 400;

const clampText = (value, maxLen = MAX_TEXT_LEN) =>
  typeof value === 'string' ? value.slice(0, maxLen) : value;

const sanitizeService = (service) => ({
  slug: clampText(service.slug, 80),
  title: clampText(service.title, 120),
  subtitle: clampText(service.subtitle, 220),
  category: clampText(service.category, 80),
  icon: clampText(service.icon, 120),
  mediaUrl: clampText(service.mediaUrl, 320),
  detailList: Array.isArray(service.detailList)
    ? service.detailList.slice(0, MAX_LIST_ITEMS).map((item) => clampText(item, 160))
    : [],
  modalContent: clampText(service.modalContent, 1200),
  cta: service.cta
    ? {
        label: clampText(service.cta.label, 80),
        href: clampText(service.cta.href, 200),
      }
    : undefined,
  sortOrder: service.sortOrder,
  isPublished: service.isPublished,
  updatedAt: service.updatedAt,
});

export const getSiteSettings = async (req, res) => {
  try {
    const settings = await SiteSettings.findOne(
      { singletonKey: 'default' },
      'siteName brandShortName logoPrimaryUrl logoAltUrl email phone whatsapp address social defaultSeo updatedAt'
    ).lean();
    if (!settings) {
      return res.status(404).json({ success: false, message: 'Site settings not found' });
    }
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch site settings' });
  }
};

export const getPageBySlug = async (req, res) => {
  try {
    const slug = String(req.params.slug || '').trim().toLowerCase();
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return res.status(400).json({ success: false, message: 'Invalid page slug' });
    }
    const page = await Page.findOne(
      { slug, isPublished: true },
      'slug title metaDescription canonicalPath ogImage robots jsonLdType isPublished publishedAt updatedAt'
    ).lean();
    if (!page) {
      return res.status(404).json({ success: false, message: 'Page content not found' });
    }
    res.json({ success: true, data: page });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch page content' });
  }
};

// Placeholders for next batch
export const getHomepageSections = async (req, res) => {
  try {
    const sections = await HomepageSection.find(
      { enabled: true },
      'key title enabled sortOrder payload updatedAt'
    )
      .sort({ sortOrder: 1, key: 1 })
      .limit(MAX_SECTIONS)
      .lean();
    res.json({ success: true, data: sections });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch homepage sections' });
  }
};

export const getServices = async (req, res) => {
  try {
    const services = await Service.find(
      { isPublished: true },
      'slug title subtitle category icon mediaUrl detailList modalContent cta sortOrder isPublished updatedAt'
    )
      .sort({ sortOrder: 1, title: 1 })
      .limit(MAX_SERVICES)
      .lean();
    res.json({ success: true, data: services.map(sanitizeService) });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch services' });
  }
};
export const getClients = async (req, res) =>
  res.status(501).json({ success: false, message: 'Not implemented yet' });
export const getTestimonials = async (req, res) =>
  res.status(501).json({ success: false, message: 'Not implemented yet' });
export const getTechCategories = async (req, res) =>
  res.status(501).json({ success: false, message: 'Not implemented yet' });
export const getNavigation = async (req, res) =>
  res.status(501).json({ success: false, message: 'Not implemented yet' });
export const getFooterConfig = async (req, res) =>
  res.status(501).json({ success: false, message: 'Not implemented yet' });
