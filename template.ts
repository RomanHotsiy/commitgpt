export const defaultPromptTemplate = [
  "suggest 10 commit messages based on the following diff:",
  "{{diff}}",
  "",
  "commit messages should:",
  " - follow conventional commits",
  " - message format should be: <type>[scope]: <description>",

  "",
  "examples:",
  " - fix(authentication): add password regex pattern",
  " - feat(storage): add new test cases",
].join("\n");
