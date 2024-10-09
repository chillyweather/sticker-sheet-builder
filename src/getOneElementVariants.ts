import { buildAutoLayoutFrame } from "./utilityFunctions";
import { getProps } from "./getBaseProps";
import { getComponentProps } from "./getComponentProps";
import { getMainComponent } from "./getMainComponent";
import buildBasicGrid from "./buildBasicGrid";

const loadFonts = async (font?: any) => {
  await figma.loadFontAsync(
    font ? font : { family: "Inter", style: "Regular" }
  );
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  await figma.loadFontAsync({ family: "Inter", style: "Bold" });
  await figma.loadFontAsync({ family: "Inter", style: "Semi Bold" });
  await figma.loadFontAsync({ family: "Inter", style: "Medium" });
};

export default async function getOneElementVariants(
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
  console.log("stateProps", stateProps);
  console.log("typeProps", typeProps);
  console.log("sizeProps", sizeProps);
  console.log("binaryProps", binaryProps);
  console.log("otherProps", otherProps);

  let defaultVariant = null;
  if (mainComponent.type === "COMPONENT") {
    defaultVariant = mainComponent;
  } else {
    defaultVariant = mainComponent.defaultVariant;
  }
  const basicGrid = buildBasicGrid(defaultVariant, stateProps, typeProps);
}
function buildStickerFrame() {
  const frame = buildAutoLayoutFrame("REPLACE ME!!!", "VERTICAL", 60, 60, 60);
}
