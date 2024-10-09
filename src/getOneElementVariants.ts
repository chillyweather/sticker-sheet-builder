import { buildAutoLayoutFrame } from "./utilityFunctions";
import { getProps } from "./getBaseProps";
import { getComponentProps } from "./getComponentProps";
import { getMainComponent } from "./getMainComponent";
import buildBasicGrid from "./buildBasicGrid";
import buildSizes from "./buildSizes";

const loadFonts = async (font?: any) => {
  await figma.loadFontAsync(
    font ? font : { family: "Inter", style: "Regular" }
  );
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  await figma.loadFontAsync({ family: "Inter", style: "Bold" });
  await figma.loadFontAsync({ family: "Inter", style: "Semi Bold" });
  await figma.loadFontAsync({ family: "Inter", style: "Medium" });
};

export default async function buildOneSticker(
  node: InstanceNode | ComponentNode | ComponentSetNode
) {
  await loadFonts();
  const mainComponent = await getMainComponent(node);

  if (!mainComponent) {
    figma.notify("MAIN COMPONENT IS NOT FOUND", { error: true });
    return null;
  }
  const componentProps = getComponentProps(mainComponent);
  const { stateProps, typeProps, sizeProps, binaryProps, otherProps } =
    getProps(componentProps);

  let defaultVariant: ComponentNode;
  if (mainComponent.type === "COMPONENT") {
    defaultVariant = mainComponent;
  } else {
    defaultVariant = mainComponent.defaultVariant;
  }
  const sizeFrame = buildSizes(defaultVariant, sizeProps);
  const basicGrid = buildBasicGrid(defaultVariant, stateProps, typeProps);

  const stickerFrame = buildStickerFrame();
  stickerFrame.appendChild(sizeFrame);
  if (basicGrid) stickerFrame.appendChild(basicGrid);
}
function buildStickerFrame() {
  const frame = buildAutoLayoutFrame("REPLACE ME!!!", "VERTICAL", 60, 60, 60);
  return frame;
}
