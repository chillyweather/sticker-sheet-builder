import { on, showUI } from "@create-figma-plugin/utilities";

import { GetHandler } from "./types";
import buildOneSticker from "./getOneElementVariants";

export default function () {
  on<GetHandler>("CLOSE", function () {
    const selection = figma.currentPage.selection;
    if (!selection.length) return;
    for (const node of selection) {
      if (
        node.type === "COMPONENT" ||
        node.type === "COMPONENT_SET" ||
        node.type === "INSTANCE"
      ) {
        buildOneSticker(node);
      } else {
        figma.notify("Please select an instance, component, or component set", {
          error: true,
        });
      }
    }
  });
  showUI({
    height: 72,
    width: 240,
  });
}
