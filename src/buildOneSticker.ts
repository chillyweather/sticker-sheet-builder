import { buildAutoLayoutFrame } from "./utilityFunctions";
import { getProps } from "./getBaseProps";
import { getComponentProps } from "./getComponentProps";
import { getMainComponent } from "./getMainComponent";
import buildBasicGrid from "./buildBasicGrid";
import buildSizes from "./buildSizes";
import buildBinariesGrids from "./buildBinariesGrid";
import buildOtherVariants from "./buildOterVariants";
import buildHeader from "./buildHeader";

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

  const stickerFrame = buildStickerFrame();
  const headerFrame = buildHeader();

  stickerFrame.appendChild(headerFrame);
  headerFrame.layoutSizingHorizontal = "FILL";
  const sizeFrame = buildSizes(defaultVariant, sizeProps);
  const binaryFrames = buildBinariesGrids(defaultVariant, binaryProps);
  const basicGrid = buildBasicGrid(defaultVariant, stateProps, typeProps);
  let otherVariantsFrame: FrameNode | undefined;

  if (otherProps.length && basicGrid) {
    otherVariantsFrame = buildOtherVariants(basicGrid, otherProps);
  }

  stickerFrame.appendChild(sizeFrame);
  if (binaryFrames.length) {
    for (const frame of binaryFrames) {
      stickerFrame.appendChild(frame);
    }
  }
  if (otherVariantsFrame) {
    stickerFrame.appendChild(otherVariantsFrame);
  } else {
    if (basicGrid) stickerFrame.appendChild(basicGrid);
  }
}
function buildStickerFrame() {
  const frame = buildAutoLayoutFrame("REPLACE ME!!!", "VERTICAL", 60, 60, 60);
  frame.paddingTop = 24;
  frame.cornerRadius = 40;
  return frame;
}
