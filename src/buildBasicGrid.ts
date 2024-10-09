import { buildAutoLayoutFrame, setVariantProps } from "./utilityFunctions";
export default function buildBasicGrid(
  node: any,
  [statePropName, { variantOptions: stateOptions }]: any,
  [typePropName, { variantOptions: typeOptions }]: any
) {
  if (!node) return;
  const basicGrid = buildTypes(
    typePropName,
    typeOptions,
    statePropName,
    stateOptions,
    node
  );
  return basicGrid;
}

function buildTypes(
  typePropName: string,
  typeOptions: string[],
  statePropName: string,
  stateOptions: string[],
  node: any
) {
  const workingNode = node.createInstance();
  const typeFrame = createNormalizedFrame("type-frame", "VERTICAL", 0, 0, 36);
  for (const type of typeOptions) {
    const stateFrame = buildStates(
      typePropName,
      type,
      statePropName,
      stateOptions,
      workingNode
    );
    typeFrame.appendChild(stateFrame);
  }
  workingNode.remove();
  return typeFrame;
}

function buildStates(
  typePropName: string,
  currentType: string,
  statePropName: string,
  stateOptions: string[],
  node: any
) {
  setVariantProps(node, typePropName, currentType);
  const stateWithTitle = createNormalizedFrame(
    "state-frame",
    "VERTICAL",
    0,
    0,
    20
  );
  const title = figma.createText();
  title.fontSize = 14;
  title.fontName = { family: "Inter", style: "Medium" };
  title.characters = capitalizeFirstLetter(currentType);
  stateWithTitle.appendChild(title);
  const elementsFrame = createNormalizedFrame(
    "elements-frame",
    "HORIZONTAL",
    0,
    0,
    16
  );
  stateWithTitle.appendChild(elementsFrame);
  for (const state of stateOptions) {
    const nodeWithLabel = createNormalizedFrame(
      "one-state-frame",
      "VERTICAL",
      0,
      0,
      8
    );
    const cloNode = node.clone();
    setVariantProps(cloNode, statePropName, state);
    nodeWithLabel.appendChild(cloNode);
    const label = figma.createText();
    label.characters = state;
    nodeWithLabel.appendChild(label);
    nodeWithLabel.counterAxisAlignItems = "CENTER";
    elementsFrame.appendChild(nodeWithLabel);
  }
  return stateWithTitle;
}

function normalizeFrame(typeFrame: FrameNode) {
  typeFrame.fills = [];
  typeFrame.clipsContent = false;
}

function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
function createNormalizedFrame(
  name: string,
  direction: "VERTICAL" | "HORIZONTAL",
  paddingHorizontal: number,
  paddingVertical: number,
  spacing: number
): FrameNode {
  const frame = buildAutoLayoutFrame(
    name,
    direction,
    paddingHorizontal,
    paddingVertical,
    spacing
  );
  normalizeFrame(frame);
  return frame;
}
