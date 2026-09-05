import { initGUI } from "../engine/galeaceanEngine";
import { BlinnPhongMaterial, Camera } from "@galacean/engine";
import { type GUIItemConfig } from "@galacean/gui";

export function setupDebugPanel(cameraEntity: Camera, materials: BlinnPhongMaterial[]) {
  const guiState = {
    baseColor: { r: 1, g: 1, b: 1, a: 1 },
    shininess: 64,
    position: { x: 0, y: 0, z: 0 }
  };

  const guiConfig: GUIItemConfig[] = [
    {
      label: "Base Color",
      bindPath: "baseColor",
      type: "Color" as any, // Cast to any if your build setup complains about GUIItemTypeEnum vs raw strings
      onChange(value: any) {
        materials.forEach((m) => m.specularColor.set(value.r, value.g, value.b, value.a));
      },
    },
    {
      bindPath: "shininess",
      type: "Slider" as any,
      min: 0,
      max: 100,
      onChange(value: number) {
        materials.forEach((m) => (m.shininess = value));
      },
    }
  ];

  // Fire up the instance (handles creation and calling .render() internally)
  const gui = initGUI(guiState, guiConfig);

  // Use the type-safe addGroup method from your declaration file
  gui.addGroup("Transform Offset", [
    {
      bindPath: "position",
      type: "Vector3" as any,
      onChange(value: any) {
        cameraEntity.entity.transform.setPosition(value.x, value.y, value.z);
      },
    },
  ]);
}
