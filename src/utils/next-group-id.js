function nextGroupId(groupIds) {
  let numberIds = [...groupIds.filter(i => !isNaN(i)).map(i => parseInt(i))].sort()
  return (numberIds[numberIds.length - 1] + 1).toString()
}

export default nextGroupId;