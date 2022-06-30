function regionsToBlocks(regions) {
  return regions.map(r => ({
    id: r.id,
    type: "annotation",
    data: {
      text: r.text || '',
      labelName: r.cls,
      groupColor: r.groupColor,
      groupId: r.groupId
    }
  }))
}

export default regionsToBlocks;