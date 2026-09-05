import { WebGLEngine } from "@galacean/engine";

/**
 * Single source of truth for all scene identifiers across the application.
 */
export enum SceneId {
  EMPTY_SCENE = "EMPTY",
  SCENE_ONE = "SCENE_ONE",
  SCENE_TWO = "SCENE_TWO",
}


export interface GameScene {
  id: SceneId;
  name: string;
  /** Fires when swapping into this scene. Pass the engine reference explicitly. */
  load: (engine: WebGLEngine) => void;
  /** Optional: Clean up custom intervals, listeners, or DOM elements before dropping the scene. */
  unload?: () => void;
}
