import { whitespaceCharactersToHTML } from '../Editor/annotation-plugin/annotation';

function sanitizedText(text) {
  const escapedWhitespaces = whitespaceCharactersToHTML(text);

  // remove whitespaces
  const trimmed = escapedWhitespaces.trim();

  // replace dashes at the end of sentence
  const noTrailingDash = trimmed.replace(/-$/, "")

  return noTrailingDash;
}

function getConnectingSymbol(labelName) {
  switch (labelName) {
    case 'text':
      return "";
    case 'appendix':
      return "<br><br>"
    default:
      return "<br>"
  }
}

function blocksToArticle(blocks) {
  const renamedBlocks = blocks.map(b => {
    const newBlock = {
      ...b, data: {
        ...b.data,
        labelName: b.data.labelName === 'interview' ? 'text' : b.data.labelName
      }
    }
    return newBlock
  })

  const article = renamedBlocks.reduce((acc, curr) => {
    const { labelName, text } = curr?.data;
    if (acc[labelName] === undefined) {
      acc[labelName] = ""
    }

    let connectingSymbol = getConnectingSymbol(labelName);

    // if last symbol is dot, next sentence should start with space
    if (acc[labelName].charAt(acc[labelName].length - 1) === "." && connectingSymbol === "") {
      connectingSymbol = " "
    }

    acc[labelName] = acc[labelName] + connectingSymbol + sanitizedText(text);

    return acc;
  }, {
    title: "",
    text: ""
  })

  return article;
}

export default blocksToArticle;