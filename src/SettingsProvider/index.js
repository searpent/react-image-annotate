// @flow

import React, { createContext, useContext, useState } from "react"

const defaultSettings = {
  showCrosshairs: false,
  showHighlightBox: true,
  wasdMode: true,
}

const DEFAULT_GROUP_COLORS = [
  "#3853F1",
  "#F6E54C",
  "#39D33C",
  "#CF24CF",
  "#22E3ED",
  "#EF3029",
]

export const SettingsContext = createContext(defaultSettings)

const pullSettingsFromLocalStorage = () => {
  if (!window || !window.localStorage) return {}
  let settings = {}
  for (let i = 0; i < window.localStorage.length; i++) {
    const key = window.localStorage.key(i)
    if (key.startsWith("settings_")) {
      try {
        settings[key.replace("settings_", "")] = JSON.parse(
          window.localStorage.getItem(key)
        )
      } catch (e) { }
    }
  }
  return settings
}

export const useSettings = () => useContext(SettingsContext)

export const SettingsProvider = ({ children, clsColors, groupColors = DEFAULT_GROUP_COLORS }) => {
  const [state, changeState] = useState({
    ...() => pullSettingsFromLocalStorage(),
    clsColors,
    groupColors,
  })
  const changeSetting = (setting: string, value: any) => {
    changeState({ ...state, [setting]: value })
    window.localStorage.setItem(`settings_${setting}`, JSON.stringify(value))
  }
  return (
    <SettingsContext.Provider value={{ ...state, changeSetting }}>
      {children}
    </SettingsContext.Provider>
  )
}

export default SettingsProvider
