import { buildAutoLayoutFrame } from "./utilityFunctions";
import { getProps } from "./getAllVariantProps";
import { getComponentProps } from "./getComponentProps";
import { getMainComponent } from "./getMainComponent";
import buildBasicGrid from "./buildBasicGrid";
import buildSizes from "./buildSizes";
import buildBinariesGrids from "./buildBinariesGrid";
import buildOtherVariants from "./buildOterVariants";
import buildHeader from "./buildHeader";
import { getBaseProps } from "./getBaseProps";

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
  const { stateProps, typeProps, sizeProps, binaryProps, allOtherProps } =
    getProps(componentProps);
  const baseProps = getBaseProps(typeProps, stateProps, allOtherProps);
  console.log("baseProps", baseProps);

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

  const sizeFrame = sizeProps.length
    ? buildSizes(defaultVariant, sizeProps)
    : null;

  const binaryFrames = binaryProps.length
    ? buildBinariesGrids(defaultVariant, binaryProps)
    : null;

  const basicGrid = baseProps
    ? buildBasicGrid(
        defaultVariant,
        baseProps?.firstProp,
        baseProps?.secondProp
      )
    : null;

  let otherVariantsFrame: FrameNode | undefined;

  if (baseProps && baseProps.otherProps?.length && basicGrid) {
    otherVariantsFrame = buildOtherVariants(basicGrid, baseProps.otherProps);
  }

  if (sizeFrame) stickerFrame.appendChild(sizeFrame);

  if (binaryFrames) {
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
