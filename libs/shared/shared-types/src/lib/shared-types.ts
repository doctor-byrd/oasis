export function sharedTypes(): string {
  return 'shared-types';
}

/**
 * Single source of truth for all scene identifiers across the application.
 */
export enum SceneId {
  EMPTY_SCENE = "EMPTY",
  LOADING = "LOADING",
  SCENE_ONE = "SCENE_ONE",
  SCENE_TWO = "SCENE_TWO",
}