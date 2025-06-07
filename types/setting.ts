export type Setting = {
  id?: string;
  type?: string;
  enabled?: boolean; // whether the setting is enabled
  name?: string;
  appliesTo?: string[]; // e.g., ids of categories or tasks (in category.ts)
  urls?: string[]; // e.g., URLs for web settings
  limit?: number; // in hours
  conditions?: {
    tabIdleMinutes?: number;
  };
};
