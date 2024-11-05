import {
  Button,
  Container,
  render,
  VerticalSpace,
} from "@create-figma-plugin/ui";
import { emit } from "@create-figma-plugin/utilities";
import { h } from "preact";
import { useCallback } from "preact/hooks";

function Plugin() {
  const hanleBuildOneClick = useCallback(function () {
    emit("BUILD_ONE");
  }, []);
  const hanleBuildAllClick = useCallback(function () {
    emit("BUILD_All");
  }, []);
  return (
    <Container space="medium">
      <VerticalSpace space="large" />
      <Button
        fullWidth
        onClick={hanleBuildOneClick}
        secondary
        style={{ backgroundColor: "#5ffe84", border: "none" }}
      >
        Build one
      </Button>
      <VerticalSpace space="small" />
      <Button
        fullWidth
        onClick={hanleBuildAllClick}
        style={{ backgroundColor: "#6edcfd", border: "none" }}
        secondary
      >
        Build all
      </Button>
      <VerticalSpace space="small" />
    </Container>
  );
}

export default render(Plugin);
