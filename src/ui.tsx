import {
  Button,
  Container,
  render,
  VerticalSpace,
} from "@create-figma-plugin/ui";
import { emit, on } from "@create-figma-plugin/utilities";
import { h } from "preact";
import { useCallback, useEffect, useState } from "preact/hooks";
import { Spinner } from "./spinner";

function Plugin() {
  const [stickersheetExists, setStickersheetExists] = useState(false);
  const [isBuilding, setIsBuilding] = useState(false);
  const [isValidSelection, setIsValidSelection] = useState(false);
  // const [nowBuilding, setNowBuilding] = useState("...");
  const hanleBuildOneClick = useCallback(function () {
    setIsBuilding(true);
    emit("BUILD_ONE");
  }, []);
  const hanleBuildAllClick = useCallback(function () {
    console.log("isBuilding");
    setIsBuilding(true);
    emit("BUILD_ALL");
  }, []);

  const handleParseDescription = useCallback(function () {
    emit("PARSE_DESCRIPTION");
  }, []);

  on("STICKERSHEET_EXISTS", () => {
    setStickersheetExists(true);
  });

  on("NO_STICKERSHEET", () => {
    setStickersheetExists(false);
  });

  on("BUILT", () => setIsBuilding(false));

  on("VALID_SELECTION", () => {
    setIsValidSelection(true);
  });

  on("INVALID_SELECTION", () => {
    setIsValidSelection(false);
  });

  return (
    <Container space="medium">
      <VerticalSpace space="large" />
      {isBuilding ? (
        <div>
          <Spinner />
          {/* <div>{nowBuilding}</div> */}
        </div>
      ) : (
        <div>
          <Button
            fullWidth
            onClick={hanleBuildOneClick}
            secondary
            style={{ backgroundColor: "#5ffe84", border: "none" }}
            disabled={!isValidSelection}
          >
            Build one sticker
          </Button>
          <VerticalSpace space="small" />
          <Button
            fullWidth
            onClick={hanleBuildAllClick}
            style={{ backgroundColor: "#6edcfd", border: "none" }}
            secondary
          >
            {stickersheetExists
              ? "↻ Rebuild Stickersheet"
              : "Build Stickersheet"}
          </Button>
          <VerticalSpace space="small" />
          <Button
            fullWidth
            onClick={handleParseDescription}
            style={{ backgroundColor: "coral", border: "none" }}
            secondary
          >
            Parse description
          </Button>
        </div>
      )}
      <VerticalSpace space="small" />
    </Container>
  );
}

export default render(Plugin);
