function labelAndTextFromResultText(resultText) {
  if (!resultText) { return {} }
  const parsedResultText = JSON.parse(resultText);
  const label = parsedResultText[0].label;
  const text = parsedResultText[0].text;
  return { label, text }
}

function extractionEngineModelResultsToRegions(modelResults) {
  return modelResults.map(r => {
    const { label, text } = labelAndTextFromResultText(r.text);
    return {
      id: r.id,
      type: "box",
      visible: r.label === 'metadata' ? false : true,
      cls: label,
      highlighted: false,
      groupHighlighted: false,
      x: r.box.X1,
      y: r.box.Y1,
      w: r.box.X2 - r.box.X1,
      h: r.box.Y2 - r.box.Y1,
      groupId: r.groupId,
      text: text,
    }
  })
}

function metadataEngineModelResultsToRegions(modelResults) {
  return modelResults.map(r => {
    return {
      id: r.id,
      type: "box",
      visible: false,
      cls: "metadata",
      highlighted: false,
      groupHighlighted: false,
      x: r.box.X1,
      y: r.box.Y1,
      w: r.box.X2 - r.box.X1,
      h: r.box.Y2 - r.box.Y1,
      groupId: r.groupId,
      text: r.text,
    }
  })
}


function modelResultsToRegions(modelResults) {
  const extractionEngineRegions = extractionEngineModelResultsToRegions(modelResults.find(mr => mr.name === 'extraction-engine')?.results || [])
  const metadataEngineRegions = metadataEngineModelResultsToRegions(modelResults.find(mr => mr.name === 'metadata-engine')?.results || [])
  return [...extractionEngineRegions, ...metadataEngineRegions]
}

function photosToImages(photos) {
  return photos.map(photo => ({
    id: photo.id,
    src: photo.fullsize.key,
    thumbnail: photo.thumbnail.key,
    name: photo.fullsize.key,
    regions: modelResultsToRegions(photo.modelResults.v1),
    metadata: photo.metadata
  }))
}

export default photosToImages;