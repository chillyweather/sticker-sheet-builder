import { on, showUI } from "@create-figma-plugin/utilities";

import buildOneSticker from "./buildOneSticker";

export default function () {
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
  });
  on("BUILD_All", function () {
    const atomPages = findAtomPages();
    const foundComponents = getComponentsFromPage(atomPages);
    foundComponents.forEach((comp: any) => buildOneSticker(comp));
  });
  showUI({
    height: 112,
    width: 240,
  });
}
function getComponentsFromPage(atomPages: PageNode[]) {
  const components: any = [];
  atomPages.forEach((page) => {
    console.log(page.name);
  });
  for (const page of atomPages) {
    const componentsAndSets = page.findAllWithCriteria({
      types: ["COMPONENT", "COMPONENT_SET"],
    });
    componentsAndSets.forEach((item) => {
      if (
        !item.name.startsWith(".") &&
        item.description.toLowerCase().includes("misprint")
      ) {
        components.push(item);
      }
    });
  }
  return components;
}

function findAtomPages() {
  const pages = figma.root.children;
  const atomsTitleIndex = pages.findIndex((page) =>
    page.name.startsWith("⚛️ Atoms")
  );
  const moleculesTitleIndex = pages.findIndex((page) =>
    page.name.startsWith("🧬 Molecules")
  );
  const atomPages = pages.slice(atomsTitleIndex + 1, moleculesTitleIndex);
  return atomPages;
}
