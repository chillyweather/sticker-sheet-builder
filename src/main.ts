import { on, emit, showUI } from "@create-figma-plugin/utilities";

import buildOneSticker from "./buildOneSticker";
import {
  findAtomPages,
  getComponentsFromPage,
  getStickerSheetPage,
} from "./findAtomPages";
import { findStickerSheetPage } from "./findAtomPages";
import { loadFonts } from "./loadFonts";

export default async function () {
  await loadFonts();

  figma.on("run", checkAndReportStickerPage);
  figma.on("currentpagechange", checkAndReportStickerPage);

  on("BUILD_ONE", function () {
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
    emit("BUILT");
  });

  on("BUILD_ALL", async function () {
    const stickerSheetPage = getStickerSheetPage();
    stickerSheetPage?.children.forEach((child) => child.remove());
    const atomPages = findAtomPages();
    const foundComponents = getComponentsFromPage(atomPages);
    for (const comp of foundComponents) {
      await buildOneSticker(comp);
    }
    emit("BUILT");
  });
}
showUI({
  height: 252,
  width: 240,
});
function checkAndReportStickerPage() {
  const stickerSheetPage = findStickerSheetPage();
  if (stickerSheetPage) {
    emit("STICKERSHEET_EXISTS");
  } else {
    emit("NO_STICKERSHEET");
  }
  return stickerSheetPage;
}
