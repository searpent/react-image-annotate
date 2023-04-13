function regionsToBlocks(regions, clsColor) {
  return regions.map(r => ({
    id: r.id,
    type: "annotation",
    data: {
      text: r.text || '',
      labelName: r.cls,
      groupColor: r.groupColor,
      groupId: r.groupId,
      clsColor: clsColor(r.cls),
      highlighted: r.highlighted,
    }
  }))
}

export default regionsToBlocks;