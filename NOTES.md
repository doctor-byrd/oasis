# Mini App

### Workflow

Creating a script
```ts
import { Script, Keys, Vector3 } from "@galacean/engine";

export class PlayerController extends Script {
  public moveSpeed: number = 5;
  private _tempVelocity = new Vector3();

  // Runs automatically every single frame inside the engine loop
  onUpdate(deltaTime: number): void {
    const inputManager = this.engine.inputManager;
    this._tempVelocity.set(0, 0, 0);

    // Grab standard imperative inputs
    if (inputManager.isKeyHeldDown(Keys.W)) this._tempVelocity.z -= 1;
    if (inputManager.isKeyHeldDown(Keys.S)) this._tempVelocity.z += 1;
    if (inputManager.isKeyHeldDown(Keys.A)) this._tempVelocity.x -= 1;
    if (inputManager.isKeyHeldDown(Keys.D)) this._tempVelocity.x += 1;

    if (this._tempVelocity.length() > 0) {
      this._tempVelocity.normalize().scale(this.moveSpeed * deltaTime);
      this.entity.transform.translate(this._tempVelocity);
    }
  }
}
```

Creating a scene:
```ts
import { GameScene, SceneId } from "../types/scene";
import { AssetType, Camera, DirectLight, Vector3 } from "@galacean/engine";

export const gltfScene: GameScene = {
  id: SceneId.SCENE_ONE,
  name: "Heavy GLTF Level",
  
  // State your asset needs explicitly
  assets: [
    {
      type: AssetType.GLTF,
      url: "https://alipayobjects.com",
    }
  ],

  load(engine, loadedResources) {
    const scene = engine.sceneManager.activeScene;
    const root = scene.createRootEntity("GLTFRoot");

    // Grab the pre-loaded GLTF asset directly from the typed array index!
    const gltfResource = loadedResources[0];
    const { defaultSceneRoot } = gltfResource;
    root.addChild(defaultSceneRoot);

    // Setup typical environment properties boilerplate
    const cam = root.createChild("Cam");
    cam.transform.setPosition(0, 5, 15);
    cam.transform.lookAt(new Vector3(0, 0, 0));
    cam.addComponent(Camera);

    const light = root.createChild("Light");
    light.addComponent(DirectLight);
    light.transform.lookAt(new Vector3(-1, -1, -1));
  }
};
```

### Frontend
Run frontend:
```sh
npx nx dev frontend
```
Build production frontend:
```sh
npx nx build frontend
```
Preview production build:
```sh
npx nx preview frontend
```

### Backend