function sanitizedText(text) {
  // remove whitespaces
  const trimmed = text.trim();

  // replace dashes at the end of sentence
  const noTrailingDash = trimmed.replace(/-$/, "")

  return noTrailingDash;
}

function blocksToArticle(blocks) {
  const renamedBlocks = blocks.map(b => {
    if (b.data.labelName === 'interview') {
      b.data.labelName = 'text'
    }
    return { ...b }
  })

  const article = renamedBlocks.reduce((acc, curr) => {
    const { labelName, text } = curr?.data;
    if (acc[labelName] === undefined) {
      acc[labelName] = ""
    }

    let connectingSymbol = "";

    // if last symbol is dot, next sentence should start with space
    if (acc[labelName].charAt(acc[labelName].length - 1) === ".") {
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