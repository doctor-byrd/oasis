import { Store } from '@tanstack/store';
import { WebGLEngine } from '@galacean/engine';
import { GUI } from '@galacean/gui';
import { GameScene, SceneId } from '../games/types/scene';

interface EngineState {
  engine: WebGLEngine | null;
  gui: GUI | null;
  isReady: boolean;
  scenes?: Record<SceneId, GameScene>; // Hashmap of available scenes
  activeSceneId?: string | null;      // Track what is currently running
}

export const engineStore = new Store<EngineState>({
  engine: null,
  gui: null,
  isReady: false,
});

/**
 * Synchronous imperative getter for scripts.
 */
export function getEngine(): WebGLEngine {
  const { engine } = engineStore.state;
  if (!engine) {
    throw new Error("Galacean Engine has not been initialized yet.");
  }
  return engine;
}

/**
 * Synchronous imperative getter for GUI.
 */
export function getGUI(): GUI {
  const { gui } = engineStore.state;
  if (!gui) {
    throw new Error("GUI has not been initialized yet.");
  }
  return gui;
}

/**
 * Completely tears down the global engine lifecycle, destroys WebGL contexts, 
 * disposes of DOM wrappers, and resets the TanStack Store states.
 */
export function destroyEngine(): void {
  const { engine, gui } = engineStore.state;

  // 1. Wipe and unmount GUI rendering layer
  if (gui) {
    try {
      gui.dispose();
    } catch (err) {
      console.warn("Failed to dispose Galacean GUI:", err);
    }
  }

  // 2. Destruct the underlying engine instance and clear GPU cache pools
  if (engine) {
    try {
      engine.destroy();
    } catch (err) {
      console.warn("Failed to destroy Galacean WebGLEngine:", err);
    }
  }

  // 3. Reset state parameters back to blank baseline configurations
  engineStore.setState(() => ({
    engine: null,
    gui: null,
    isReady: false,
  }));
}

/**
 * Register available layout templates into your global runtime map. By default, it will automatically launch the very first scene in the array.
 */
export function registerScenes(sceneList: GameScene[]): void {
  if (sceneList.length === 0) return;

  engineStore.setState((state) => {
    const updatedScenes = { ...state.scenes };
    sceneList.forEach((s) => {
      updatedScenes[s.id] = s;
    });
    return { ...state, scenes: updatedScenes };
  });

  // If no scene is running yet, automatically boot up the first scene in the sequence
  if (!engineStore.state.activeSceneId) {
    switchScene(sceneList[0].id);
  }
}

/**
 * Sweeps the previous entity tree, disposes the old GUI panel,
 * and launches the loading lifecycle of the target scene registry.
 */
export function switchScene(sceneId: SceneId): void {
  const { engine, scenes, activeSceneId, gui } = engineStore.state;
  if (!engine) throw new Error("Cannot switch scenes before engine initialization.");

  const targetScene = scenes[sceneId];
  if (!targetScene) throw new Error(`Scene with ID "${sceneId}" is not registered.`);

  // 1. Fire unload callback on existing scene
  if (activeSceneId && scenes[activeSceneId]?.unload) {
    scenes[activeSceneId].unload!();
  }

  // 2. Wipe active debug panels
  if (gui) {
    gui.dispose();
    engineStore.setState((state) => ({ ...state, gui: null }));
  }

  // 3. Clear existing runtime scene entities
  const activeContext = engine.sceneManager.activeScene;
  for (let i = activeContext.rootEntitiesCount - 1; i >= 0; i--) {
    activeContext.getRootEntity(i)?.destroy();
  }

  // 4. Initialize the new code-driven target environment
  targetScene.load(engine);

  // 5. Update global store index
  engineStore.setState((state) => ({
    ...state,
    activeSceneId: sceneId,
  }));
}
