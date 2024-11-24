import { addToIndex } from "./buildOneSticker";
import { lockStickers } from "./lockStickers";
import { placeResultTopRight } from "./utilityFunctions";

export function appendToStickerSheetPage(
  stickerSheetPage: PageNode,
  stickerFrame: FrameNode,
  element: ComponentNode | ComponentSetNode,
  raster: FrameNode
) {
  stickerSheetPage.appendChild(stickerFrame);
  figma.currentPage = stickerSheetPage;

  addToIndex(stickerSheetPage, element.name, stickerFrame, raster);

  const currentSection = findCurrentSection(element);

  placeResultTopRight(stickerFrame, stickerSheetPage);
  lockStickers(stickerFrame);
}

function findCurrentSection(node: ComponentNode | ComponentSetNode): string {
  const descriptionArray = node.description.split("\n");
  const docIndex = descriptionArray.findIndex((line) => line.startsWith("🗂️"));
  const currentSection = descriptionArray[docIndex + 1];
  return currentSection;
}
