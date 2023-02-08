import blocksToArticle from "./blocks-to-article";

const blocks = [{
  id: "a1",
  type: "annotation",
  data: {
    groupColor: "",
    groupId: "0",
    labelName: "text",
    text: "First part of text."
  }
}, {
  id: "a2",
  type: "annotation",
  data: {
    groupColor: "",
    groupId: "0",
    labelName: "interview",
    text: "First part of interview."
  }
}, {
  id: "a3",
  type: "annotation",
  data: {
    groupColor: "",
    groupId: "0",
    labelName: "title",
    text: "Tohle je jeden kus title."
  }
}, {
  id: "a4",
  type: "annotation",
  data: {
    groupColor: "",
    groupId: "0",
    labelName: "text",
    text: "Second part of text. Hippo-"
  }
}, {
  id: "a5",
  type: "annotation",
  data: {
    groupColor: "",
    groupId: "0",
    labelName: "text",
    text: "potamus is a big animal."
  }
}]

test('blocksToArticle', () => {
  const article = blocksToArticle(blocks);
  expect(article).toEqual({
    title: "Tohle je jeden kus title.",
    text: "First part of text. First part of interview. Second part of text. Hippopotamus is a big animal."
  });
});

