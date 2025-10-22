#!/usr/bin/env node
import fs from "fs";
import path from "path";

const configPath = path.resolve(process.cwd(), "lt.config.js");

if (fs.existsSync(configPath)) {
  console.log("✅ lt.config.js already exists.");
  process.exit(0);
}

const defaultConfig = `export const TRANSLATION_CONFIG = {
  AVAILABLE_LANGUAGES: ['en', 'ar', 'fr'],
  DEFAULT_LANGUAGE: 'en',
  RTL_LANGUAGES: ['ar'],
  ENABLE_CACHING: true,
  API_ENDPOINT: '/api/translations',
  LANGUAGE_NAMES: { en: 'English', ar: 'العربية', fr: 'Français' }
};
`;

fs.writeFileSync(configPath, defaultConfig);
console.log("✅ lt.config.js created successfully!");
