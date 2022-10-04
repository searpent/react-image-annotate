function regionsGroups(regions) {
  if (!regions) {
    return []
  }
  const groups = regions.reduce((prev, curr) => {
    const { groupId } = curr;
    if (prev.includes(groupId)) {
      return prev
    }
    prev.push(groupId)
    return prev;
  }, [])

  return groups;
}

export default regionsGroups;