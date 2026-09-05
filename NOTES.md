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
import { getEngine, initGUI } from "../store/engineStore";
import { MeshRenderer, PrimitiveMesh, BlinnPhongMaterial } from "@galacean/engine";
import { PlayerController } from "../scripts/PlayerController";

export function loadMainLevel() {
  const engine = getEngine();
  const scene = engine.sceneManager.activeScene;
  const root = scene.createRootEntity("LevelRoot");

  // 1. Create a game object (Entity)
  const playerEntity = root.createChild("PlayerCube");
  
  // 2. Add visual components
  const renderer = playerEntity.addComponent(MeshRenderer);
  renderer.mesh = PrimitiveMesh.createCuboid(engine, 1, 1, 1);
  
  const material = new BlinnPhongMaterial(engine);
  renderer.setMaterial(material);

  // 3. Add your custom behavior script (Unity style!)
  const controller = playerEntity.addComponent(PlayerController);

  // 4. Hook up your data directly to your GUI for real-time adjustments
  initGUI(
    { speed: controller.moveSpeed }, 
    [
      {
        label: "Movement Speed",
        bindPath: "speed",
        type: "Slider" as any,
        min: 1,
        max: 20,
        onChange(value: number) {
          // Adjust your live game state directly on the engine instance script
          controller.moveSpeed = value;
        }
      }
    ]
  );
}
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