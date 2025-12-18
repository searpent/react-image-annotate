const MAX_GROUP_LENGTH = 20;

function regionsGroups(regions) {
  if (!regions) {
    return []
  }
  const groups = regions.filter(region => region.cls !== 'metadata').reduce((acc, curr) => {
    const { groupId } = curr;
    if (acc.some(e => e.id === groupId)) {
      return acc
    }
    acc.push({ id: groupId, label: curr?.text?.substring(0, MAX_GROUP_LENGTH) || groupId })
    return acc;
  }, [])

  return groups;
}

export default regionsGroups;