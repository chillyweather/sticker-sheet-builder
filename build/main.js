var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/@create-figma-plugin/utilities/lib/events.js
function on(name, handler) {
  const id = `${currentId}`;
  currentId += 1;
  eventHandlers[id] = { handler, name };
  return function() {
    delete eventHandlers[id];
  };
}
function invokeEventHandler(name, args) {
  let invoked = false;
  for (const id in eventHandlers) {
    if (eventHandlers[id].name === name) {
      eventHandlers[id].handler.apply(null, args);
      invoked = true;
    }
  }
  if (invoked === false) {
    throw new Error(`No event handler with name \`${name}\``);
  }
}
var eventHandlers, currentId;
var init_events = __esm({
  "node_modules/@create-figma-plugin/utilities/lib/events.js"() {
    eventHandlers = {};
    currentId = 0;
    if (typeof window === "undefined") {
      figma.ui.onmessage = function(args) {
        if (!Array.isArray(args)) {
          return;
        }
        const [name, ...rest] = args;
        if (typeof name !== "string") {
          return;
        }
        invokeEventHandler(name, rest);
      };
    } else {
      window.onmessage = function(event) {
        if (typeof event.data.pluginMessage === "undefined") {
          return;
        }
        const args = event.data.pluginMessage;
        if (!Array.isArray(args)) {
          return;
        }
        const [name, ...rest] = event.data.pluginMessage;
        if (typeof name !== "string") {
          return;
        }
        invokeEventHandler(name, rest);
      };
    }
  }
});

// node_modules/@create-figma-plugin/utilities/lib/ui.js
function showUI(options, data) {
  if (typeof __html__ === "undefined") {
    throw new Error("No UI defined");
  }
  const html = `<div id="create-figma-plugin"></div><script>document.body.classList.add('theme-${figma.editorType}');const __FIGMA_COMMAND__='${typeof figma.command === "undefined" ? "" : figma.command}';const __SHOW_UI_DATA__=${JSON.stringify(typeof data === "undefined" ? {} : data)};${__html__}</script>`;
  figma.showUI(html, __spreadProps(__spreadValues({}, options), {
    themeColors: typeof options.themeColors === "undefined" ? true : options.themeColors
  }));
}
var init_ui = __esm({
  "node_modules/@create-figma-plugin/utilities/lib/ui.js"() {
  }
});

// node_modules/@create-figma-plugin/utilities/lib/index.js
var init_lib = __esm({
  "node_modules/@create-figma-plugin/utilities/lib/index.js"() {
    init_events();
    init_ui();
  }
});

// src/utilityFunctions.ts
async function findMasterComponent(node) {
  const immediateMaster = await node.getMainComponentAsync();
  const masterParent = immediateMaster == null ? void 0 : immediateMaster.parent;
  const trueMaster = (masterParent == null ? void 0 : masterParent.type) === "COMPONENT_SET" ? masterParent : immediateMaster;
  return trueMaster;
}
function setVariantProps(node, name, value) {
  const propList = node.componentProperties;
  for (const property in propList) {
    if (property.includes(`${name}`) && propList[property].type === "VARIANT") {
      try {
        const newProps = {};
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
function buildAutoLayoutFrame(name, direction, paddingHorizontal = 20, paddingVertical = 20, itemSpacing = 10) {
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
var init_utilityFunctions = __esm({
  "src/utilityFunctions.ts"() {
    "use strict";
  }
});

// src/getBaseProps.ts
function getProps(componentProps) {
  const stateProps = [];
  const typeProps = [];
  const sizeProps = [];
  const binaryProps = [];
  const otherProps = [];
  const variantProps = componentProps.variant;
  const binaryOptions = ["true", "false", "on", "off"];
  const stateOptions = ["hover", "idle", "pressed"];
  const typeOptions = ["primary", "secondary"];
  for (const prop in variantProps) {
    const lowerProp = prop.toLowerCase();
    const variantOptions = variantProps[prop].variantOptions.map(
      (option) => option.toLowerCase()
    );
    if (lowerProp === "state") {
      stateProps.push(prop), stateProps.push(variantProps[prop]);
    } else if (lowerProp === "size") {
      sizeProps.push(prop), sizeProps.push(variantProps[prop]);
    } else if (variantOptions.some((option) => stateOptions.includes(option))) {
      stateProps.push(prop), stateProps.push(variantProps[prop]);
    } else if (variantOptions.some((option) => typeOptions.includes(option))) {
      typeProps.push(prop), typeProps.push(variantProps[prop]);
    } else if (variantOptions.length === 2 && (binaryOptions.includes(variantOptions[0]) || binaryOptions.includes(variantOptions[1]))) {
      binaryProps.push([prop, variantProps[prop]]);
    } else {
      otherProps.push([prop, variantProps[prop]]);
    }
  }
  return { stateProps, typeProps, sizeProps, binaryProps, otherProps };
}
var init_getBaseProps = __esm({
  "src/getBaseProps.ts"() {
    "use strict";
  }
});

// src/getComponentProps.ts
function getComponentProps(mainComponent) {
  const componentProps = {
    variant: {},
    boolean: {},
    text: {},
    instanceSwap: {}
  };
  const props = mainComponent.componentPropertyDefinitions;
  for (const prop in props) {
    switch (props[prop].type) {
      case "VARIANT":
        componentProps.variant[prop] = props[prop];
        break;
      case "BOOLEAN":
        componentProps.boolean[prop] = props[prop];
        break;
      case "TEXT":
        componentProps.text[prop] = props[prop];
        break;
      case "INSTANCE_SWAP":
        componentProps.instanceSwap[prop] = props[prop];
        break;
      default:
        console.log(`Unhandled property type: ${props[prop].type}`);
    }
  }
  return componentProps;
}
var init_getComponentProps = __esm({
  "src/getComponentProps.ts"() {
    "use strict";
  }
});

// src/getMainComponent.ts
async function getMainComponent(node) {
  let mainComponent = null;
  switch (node.type) {
    case "COMPONENT":
      if (node.parent && node.parent.type === "COMPONENT_SET") {
        mainComponent = node.parent;
      } else {
        mainComponent = node;
      }
      break;
    case "COMPONENT_SET":
      mainComponent = node;
      break;
    case "INSTANCE":
      mainComponent = await findMasterComponent(node);
      break;
    default:
      console.log("unknown");
  }
  return mainComponent;
}
var init_getMainComponent = __esm({
  "src/getMainComponent.ts"() {
    "use strict";
    init_utilityFunctions();
  }
});

// src/buildBasicGrid.ts
function buildBasicGrid(node, [statePropName, { variantOptions: stateOptions }], [typePropName, { variantOptions: typeOptions }]) {
  if (!node)
    return;
  const basicGrid = buildTypes(
    typePropName,
    typeOptions,
    statePropName,
    stateOptions,
    node
  );
  return basicGrid;
}
function buildTypes(typePropName, typeOptions, statePropName, stateOptions, node) {
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
function buildStates(typePropName, currentType, statePropName, stateOptions, node) {
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
function normalizeFrame(typeFrame) {
  typeFrame.fills = [];
  typeFrame.clipsContent = false;
}
function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
function createNormalizedFrame(name, direction, paddingHorizontal, paddingVertical, spacing) {
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
var init_buildBasicGrid = __esm({
  "src/buildBasicGrid.ts"() {
    "use strict";
    init_utilityFunctions();
  }
});

// src/getOneElementVariants.ts
async function getOneElementVariants(node) {
  await loadFonts();
  const mainComponent = await getMainComponent(node);
  if (!mainComponent) {
    figma.notify("MAIN COMPONENT IS NOT FOUND", { error: true });
    return null;
  }
  const componentProps = getComponentProps(mainComponent);
  const { stateProps, typeProps, sizeProps, binaryProps, otherProps } = getProps(componentProps);
  console.log("stateProps", stateProps);
  console.log("typeProps", typeProps);
  console.log("sizeProps", sizeProps);
  console.log("binaryProps", binaryProps);
  console.log("otherProps", otherProps);
  let defaultVariant = null;
  if (mainComponent.type === "COMPONENT") {
    defaultVariant = mainComponent;
  } else {
    defaultVariant = mainComponent.defaultVariant;
  }
  const basicGrid = buildBasicGrid(defaultVariant, stateProps, typeProps);
}
var loadFonts;
var init_getOneElementVariants = __esm({
  "src/getOneElementVariants.ts"() {
    "use strict";
    init_utilityFunctions();
    init_getBaseProps();
    init_getComponentProps();
    init_getMainComponent();
    init_buildBasicGrid();
    loadFonts = async (font) => {
      await figma.loadFontAsync(
        font ? font : { family: "Inter", style: "Regular" }
      );
      await figma.loadFontAsync({ family: "Inter", style: "Regular" });
      await figma.loadFontAsync({ family: "Inter", style: "Bold" });
      await figma.loadFontAsync({ family: "Inter", style: "Semi Bold" });
      await figma.loadFontAsync({ family: "Inter", style: "Medium" });
    };
  }
});

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => main_default
});
function main_default() {
  on("CLOSE", function() {
    const selection = figma.currentPage.selection;
    if (!selection.length)
      return;
    for (const node of selection) {
      if (node.type === "COMPONENT" || node.type === "COMPONENT_SET" || node.type === "INSTANCE") {
        getOneElementVariants(node);
      } else {
        figma.notify("Please select an instance, component, or component set", {
          error: true
        });
      }
    }
  });
  showUI({
    height: 72,
    width: 240
  });
}
var init_main = __esm({
  "src/main.ts"() {
    "use strict";
    init_lib();
    init_getOneElementVariants();
  }
});

// <stdin>
var modules = { "src/main.ts--default": (init_main(), __toCommonJS(main_exports))["default"] };
var commandId = true ? "src/main.ts--default" : figma.command;
modules[commandId]();
