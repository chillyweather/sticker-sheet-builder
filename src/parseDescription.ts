interface ComponentDescription {
  misprint: string;
  tags: string[];
}

export function parseComponentDescription(
  description: string
): ComponentDescription {
  if (description.length === 0) {
    console.log("It's so empty here...");
    return {
      misprint: "",
      tags: [],
    };
  }

  const arr = description.split("\n\n\n").filter((e) => e !== "");
  const result: ComponentDescription = {
    misprint: "",
    tags: [],
  };

  const misprintString =
    arr.find((string) => string.toLowerCase().startsWith("misprint")) ?? "";
  const tags = arr.find((string) => string.startsWith("#"))?.split("\n") ?? [];

  result.misprint = misprintString;
  result.tags = tags;

  console.log("🔵", arr);
  console.log("🟠", result.misprint);
  console.log("🟢", tags);
  console.log("🟥⬜️🟥⬜️🟥", result);

  return result;
}
