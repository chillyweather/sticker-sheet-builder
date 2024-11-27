import { on, emit, showUI } from "@create-figma-plugin/utilities";

import buildOneSticker from "./buildOneSticker";
import {
  findAtomPages,
  getComponentsFromPage,
  getStickerSheetPage,
} from "./findAtomPages";
import { findStickerSheetPage } from "./findAtomPages";
import { loadFonts } from "./loadFonts";
import { lockStickers } from "./lockStickers";

export default async function () {
  await loadFonts();

  figma.on("run", () => {
    checkAndReportStickerPage;
    reportSelection(isValidSelection);
  });
  figma.on("currentpagechange", checkAndReportStickerPage);
  figma.on("selectionchange", () => {
    reportSelection(isValidSelection);
  });

  function isValidSelection() {
    const selection = figma.currentPage.selection;
    if (selection.length === 1) {
      const node = selection[0];
      if (
        node.type === "COMPONENT" ||
        node.type === "COMPONENT_SET" ||
        node.type === "INSTANCE"
      ) {
        return true;
      }
    }
    return false;
  }

  const stickers: FrameNode[] = [];

  on("BUILD_ONE", async function () {
    const selection = figma.currentPage.selection;
    if (!selection.length) return;
    for (const node of selection) {
      if (
        node.type === "COMPONENT" ||
        node.type === "COMPONENT_SET" ||
        node.type === "INSTANCE"
      ) {
        await buildOneSticker(node);
      } else {
        figma.notify("Please select an instance, component, or component set", {
          error: true,
        });
      }
    }
    const stickerSheetPage = getStickerSheetPage();
    const sections = stickerSheetPage?.findChild(
      (frame) => frame.name === "Sections"
    );
    // if (sections) {
    //   lockStickers(sections as FrameNode);
    // }
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

    const sections = stickerSheetPage?.findChild(
      (frame) => frame.name === "Sections"
    );
    if (sections) {
      lockStickers(sections as FrameNode);
    }
    emit("BUILT");
  });
}
showUI({
  height: 252,
  width: 240,
});
function reportSelection(isValidSelection: () => boolean) {
  if (isValidSelection()) {
    emit("VALID_SELECTION");
  } else {
    emit("INVALID_SELECTION");
  }
}

function checkAndReportStickerPage() {
  const stickerSheetPage = findStickerSheetPage();
  if (stickerSheetPage) {
    emit("STICKERSHEET_EXISTS");
  } else {
    emit("NO_STICKERSHEET");
  }
  return stickerSheetPage;
}
