import { useSettings } from "../SettingsProvider"

function defaultClsColor(cls) {
  switch (cls) {
    case 'subtitle':
      return "#e11438"
    case 'text':
      return "#14deef"
    case 'author':
      return "#f8d51e"
    case 'appendix':
      return "#bfede2"
    case 'photo_author':
      return "#9a17bb"
    case 'photo_caption':
      return "#ff84f6"
    case 'advertisement':
      return "#ffb201"
    case 'other_graphics':
      return "#ff5400"
    case 'unknown':
      return "#bfede2"
    case 'about_author':
      return "#9a17bb"
    case 'image':
      return "#14deef"
    case 'interview':
      return "#23b20f"
    case 'table':
      return "#02b4ba"
    default:
      return "#02b4ba"
  }
}

function defaultGroupColor(groupId) {
  switch (groupId) {
    case "0":
      return "#FDDFDF"
    case "1":
      return "#FCF7DE"
    case "2":
      return "#DEFDE0"
    case "3":
      return "#DEF3FD"
    case "4":
      return "#F0DEFD"
    default:
      return "#F0DEFD"
  }
}

const useColors = () => {
  const { clsColors, groupColors } = useSettings()

  const clsColor = (cls) => {
    if (clsColors[cls]) { return clsColors[cls] }
    return defaultClsColor(cls)
  }

  const groupColor = (groupId) => {
    if (groupColors[groupId]) { return groupColors[groupId] }
    return defaultGroupColor(groupId)
  }

  return {
    clsColor,
    groupColor
  }
}

export default useColors;