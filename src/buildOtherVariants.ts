import { createNormalizedFrame } from "./buildBasicGrid";
import { createSectionSetTitle, createSectionTitle } from "./textUtils";
import { setVariantProps } from "./utilityFunctions";
export default function buildOtherVariants(
  basicGrid: FrameNode,
  otherProps: any[]
) {
  const allVariantsFrame = createNormalizedFrame(
    "all-variants-frame",
    "VERTICAL",
    0,
    0,
    60
  );
  for (const [sizePropName, { variantOptions }] of otherProps) {
    console.log("sizePropName", sizePropName);
    const sectionSetTitle = createSectionSetTitle(sizePropName);
    const oneVariantFrame = createNormalizedFrame(
      `${sizePropName}-frame`,
      "VERTICAL",
      0,
      0,
      60
    );
    oneVariantFrame.appendChild(sectionSetTitle);
    for (const option of variantOptions) {
      const oneOptionFrame = createNormalizedFrame(
        `${sizePropName}-${option}-frame`,
        "VERTICAL",
        0,
        0,
        12
      );
      console.log(
        "🛑 🔵 🛑 option, value",
        otherProps,
        option,
        variantOptions[option]
      );
      const sectionTitle = createSectionTitle(option);
      const workingGrid = basicGrid.clone();

      const elements = workingGrid.findAll((node) => node.type === "INSTANCE");
      for (const element of elements) {
        try {
          setVariantProps(element as InstanceNode, sizePropName, option);
        } catch (error) {
          //
        }
      }

      oneOptionFrame.appendChild(sectionTitle);
      oneOptionFrame.appendChild(workingGrid);
      oneVariantFrame.appendChild(oneOptionFrame);
    }

    allVariantsFrame.appendChild(oneVariantFrame);
  }
  basicGrid.remove();
  return allVariantsFrame;
}
