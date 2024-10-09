import { EventHandler } from "@create-figma-plugin/utilities";

export interface GetHandler extends EventHandler {
  name: "CLOSE";
  handler: () => void;
}
