import { useSettings } from "../SettingsProvider"

const DEFAULT_GROUP_COLOR = "#32CD32";

function defaultClsColor(cls) {
  switch (cls) {
    case 'title':
      return '#f70202'
    case 'subtitle':
      return "#ffb405"
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
    case 'section':
      return "#ffcccc"
    default:
      return "#02b4ba"
  }
}

function stringToNumber(str) {
  let sum = 0
  for (let index = 0; index < str.length; index++) {
    sum += str.charCodeAt(index)

  }
  return sum
}

const useColors = () => {
  const { clsColors, groupColors } = useSettings()

  const clsColor = (cls) => {
    if (!clsColors) { return DEFAULT_GROUP_COLOR }
    if (clsColors[cls]) { return clsColors[cls] }
    return defaultClsColor(cls)
  }

  const groupColor = (idx) => {
    if (isNaN(idx)) {
      return groupColors[stringToNumber(idx) % groupColors.length] || DEFAULT_GROUP_COLOR
    } else {
      return groupColors[idx % groupColors.length] || DEFAULT_GROUP_COLOR
    }

  }

  return {
    clsColor,
    groupColor
  }
}

export default useColors;