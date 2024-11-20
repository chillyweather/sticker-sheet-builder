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

  on("STICKERSHEET_EXISTS", () => {
    setStickersheetExists(true);
  });

  on("NO_STICKERSHEET", () => {
    setStickersheetExists(false);
  });

  on("BUILT", () => setIsBuilding(false));
  // on("NOW_BUILDING", (data) => {
  //   setIsBuilding(true);
  //   setNowBuilding(data);
  // });

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
        </div>
      )}
      <VerticalSpace space="small" />
    </Container>
  );
}

export default render(Plugin);
