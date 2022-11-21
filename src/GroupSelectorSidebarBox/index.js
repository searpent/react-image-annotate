// @flow

import React, { memo } from "react"
import { makeStyles } from "@mui/styles"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import SidebarBoxContainer from "../SidebarBoxContainer"
import CollectionsIcon from "@mui/icons-material/Collections"
import { grey } from "@mui/material/colors"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import uuidToHash from '../utils/uuid-to-hash';

const theme = createTheme()
const useStyles = makeStyles((theme) => ({
  img: { width: 40, height: 40, borderRadius: 8 },
}))

export const GroupSelectorSidebarBox = ({ title, subtitle, groups, onSelect, selectedGroupId }) => {
  const classes = useStyles()
  return (
    <ThemeProvider theme={theme}>
      <SidebarBoxContainer
        title={title || ''}
        subTitle={subtitle || ''}
        icon={<CollectionsIcon style={{ color: grey[700] }} />}
      >
        <List>
          {groups.map(({ id, title: groupTitle, subtitle: groupSubtitle, color }, i) => (
            <ListItem button onClick={() => onSelect(id)} dense key={id} style={{
              backgroundColor: id === selectedGroupId ? '#bbdefb' : null
            }}>
              <ListItemText
                primary={<strong style={{
                  color
                }}>{uuidToHash(groupTitle)}</strong>}
                secondary={groupSubtitle}
              />
            </ListItem>
          ))}
        </List>

      </SidebarBoxContainer>
    </ThemeProvider>
  )
}

export default GroupSelectorSidebarBox
