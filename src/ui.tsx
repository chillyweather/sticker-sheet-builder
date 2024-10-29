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
  const handleCloseButtonClick = useCallback(function () {
    emit("GET");
  }, []);
  return (
    <Container space="medium">
      <VerticalSpace space="large" />
      <Button fullWidth onClick={handleCloseButtonClick} secondary>
        Get
      </Button>
      <VerticalSpace space="small" />
    </Container>
  );
}

export default render(Plugin);
