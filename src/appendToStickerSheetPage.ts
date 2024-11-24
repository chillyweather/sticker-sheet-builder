import { addToIndex } from "./buildOneSticker";
import { lockStickers } from "./lockStickers";
import { placeResultTopRight } from "./utilityFunctions";
import { buildAutoLayoutFrame } from "./utilityFunctions";

export function appendToStickerSheetPage(
  stickerSheetPage: PageNode,
  stickerFrame: FrameNode,
  element: ComponentNode | ComponentSetNode,
  raster: FrameNode
) {
  figma.currentPage = stickerSheetPage;

  addToIndex(stickerSheetPage, element.name, stickerFrame, raster);

  const currentSectionName = findCurrentSectionName(element);
  const currentSectionFrame =
    findOrCreateCurrentSectionFrame(currentSectionName);
  currentSectionFrame.appendChild(stickerFrame);

  // placeResultTopRight(stickerFrame, stickerSheetPage);
  lockStickers(stickerFrame);
}

function findOrCreateAllSectionsFrame() {
  //
}

function findOrCreateCurrentSectionFrame(sectionName: string): FrameNode {
  const foundSection = figma.currentPage.findOne(
    (node): node is FrameNode =>
      node.type === "FRAME" && node.name === sectionName
  );

  if (foundSection && foundSection.type === "FRAME") {
    return foundSection;
  }

  const newSection = buildAutoLayoutFrame(
    sectionName,
    "HORIZONTAL",
    12,
    12,
    12
  );
  newSection.name = sectionName;
  figma.currentPage.appendChild(newSection);

  return newSection;
}

function findCurrentSectionName(
  node: ComponentNode | ComponentSetNode
): string {
  const descriptionArray = node.description.split("\n");
  const docIndex = descriptionArray.findIndex((line) => line.startsWith("🗂️"));
  const currentSection = descriptionArray[docIndex + 1];
  return currentSection;
}
