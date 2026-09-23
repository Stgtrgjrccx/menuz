import {
  Restaurant,
  RestaurantTable,
  MenuCategory,
  MenuItem,
  RestaurantAiQuestionnaire,
  CustomerReview,
  ReviewChallenge,
  ChallengeRedemption,
  PosIntegrationConfig,
} from '../types';

/**
 * ─────────────────────────────────────────────────────────────
 * PRODUCTION SEED DATA
 * ─────────────────────────────────────────────────────────────
 * Clean, empty defaults for production.
 * No demo restaurants, no fake reviews, no placeholder content.
 * All data is created via the Admin dashboard onboarding flow.
 * ─────────────────────────────────────────────────────────────
 */

export const SEED_RESTAURANTS: Restaurant[] = [];

export const SEED_RESTAURANT: Restaurant | null = null;

export const SEED_TABLES: RestaurantTable[] = [];

export const SEED_CATEGORIES: MenuCategory[] = [];

export const SEED_MENU_ITEMS: MenuItem[] = [];

export const SEED_QUESTIONNAIRES: Record<string, RestaurantAiQuestionnaire> = {};

export const SEED_REVIEWS: CustomerReview[] = [];

export const SEED_CHALLENGES: ReviewChallenge[] = [];

export const SEED_REDEMPTIONS: ChallengeRedemption[] = [];

export const SEED_POS_CONFIGS: Record<string, PosIntegrationConfig> = {};
