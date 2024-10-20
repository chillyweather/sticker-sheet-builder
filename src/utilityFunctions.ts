import { computeMaximumBounds } from "@create-figma-plugin/utilities";

export async function findMasterComponent(node: InstanceNode) {
  const immediateMaster = await node.getMainComponentAsync();
  const masterParent = immediateMaster?.parent;
  const trueMaster =
    masterParent?.type === "COMPONENT_SET" ? masterParent : immediateMaster;
  return trueMaster;
}

export function setVariantProps(
  node: InstanceNode,
  name: string,
  value: string,
  fallbackValue?: string
) {
  const propList = node.componentProperties;
  for (const property in propList) {
    if (property.includes(`${name}`) && propList[property].type === "VARIANT") {
      try {
        const newProps: { [key: string]: string } = {};
        newProps[property] = value;
        node.setProperties(newProps);
      } catch (error) {
        console.log(
          `error :>> node with property ${property} and value ${value} doesn't exist on node ${node}`
        );
      }
    }
  }
}

export function setBooleanProps(
  element: InstanceNode,
  name: string,
  value: boolean
) {
  const propList = element.componentProperties;
  for (const property in propList) {
    if (property.includes(`${name}`)) {
      try {
        const newProps: any = {};
        newProps[property] = value;
        element.setProperties(newProps);
      } catch (error) {
        console.log(
          `error :>> node with property ${property} and value ${value} doesn't exist on node ${element}`
        );
      }
    }
  }
}

export function buildAutoLayoutFrame(
  name: string,
  direction: "NONE" | "HORIZONTAL" | "VERTICAL",
  paddingHorizontal = 20,
  paddingVertical = 20,
  itemSpacing = 10
): FrameNode {
  const frame = figma.createFrame();
  frame.layoutMode = direction;
  frame.paddingBottom = paddingVertical;
  frame.paddingLeft = paddingHorizontal;
  frame.paddingRight = paddingHorizontal;
  frame.paddingTop = paddingVertical;
  frame.itemSpacing = itemSpacing;
  frame.counterAxisSizingMode = "AUTO";
  frame.name = name;
  return frame;
}

export function placeResultTopRight(
  resultFrame: FrameNode,
  page: PageNode = figma.currentPage
) {
  const bounds = computeMaximumBounds(Array.from(page.children));
  page.appendChild(resultFrame);
  resultFrame.x = bounds[1].x + 100;
  resultFrame.y = bounds[0].y;

  figma.viewport.scrollAndZoomIntoView([resultFrame]);
}
