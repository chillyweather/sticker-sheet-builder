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
  value: string
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
