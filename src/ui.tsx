import {
  Button,
  Container,
  render,
  VerticalSpace,
} from "@create-figma-plugin/ui";
import { emit, on } from "@create-figma-plugin/utilities";
import { h } from "preact";
import { useCallback, useState } from "preact/hooks";

function Plugin() {
  const [stickersheetExists, setStickersheetExists] = useState(false);
  const hanleBuildOneClick = useCallback(function () {
    emit("BUILD_ONE");
  }, []);
  const hanleBuildAllClick = useCallback(function () {
    emit("BUILD_ALL");
  }, []);

  on("STICKERSHEET_EXISTS", () => {
    setStickersheetExists(true);
  });

  on("NO_STICKERSHEET", () => {
    setStickersheetExists(false);
  });

  return (
    <Container space="medium">
      <VerticalSpace space="large" />
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
        {stickersheetExists ? "↻ Rebuild Stickersheet" : "Build Stickersheet"}
      </Button>
      <VerticalSpace space="small" />
    </Container>
  );
}

export default render(Plugin);
