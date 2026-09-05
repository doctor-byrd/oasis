import { GameScene, SceneId } from "../types/scene";
import { Camera, MeshRenderer, PrimitiveMesh, BlinnPhongMaterial, Vector3, Color } from "@galacean/engine";
import { Rotate } from "../scripts/rotate";
import { initGUI } from "../engine/galeaceanEngine";

export const boxScene: GameScene = {
  id: SceneId.SCENE_ONE,
  name: "Rotating Box Lab",
  load(engine) {
    const scene = engine.sceneManager.activeScene;
    const root = scene.createRootEntity("BoxRoot");

    const cam = root.createChild("Cam");
    cam.transform.setPosition(0, 3, 6);
    cam.transform.lookAt(new Vector3(0, 0, 0));
    cam.addComponent(Camera);

    const box = root.createChild("MeshCube");
    const r = box.addComponent(MeshRenderer);
    r.mesh = PrimitiveMesh.createCuboid(engine, 1.5, 1.5, 1.5);
    const mat = new BlinnPhongMaterial(engine);
    mat.baseColor = new Color(0.1, 0.5, 0.9, 1);
    r.setMaterial(mat);

    box.addComponent(Rotate);

    initGUI({ name: "Box Lab Control" }, []);
  }
};
