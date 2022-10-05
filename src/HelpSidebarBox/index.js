// @flow

import React, { memo } from "react"
import SidebarBoxContainer from "../SidebarBoxContainer"
import HelpIcon from '@mui/icons-material/Help';
import { styled } from "@mui/material/styles"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import { grey } from "@mui/material/colors"
import Markdown from "react-markdown"

const theme = createTheme()
const MarkdownContainer = styled("div")(({ theme }) => ({
  paddingLeft: 16,
  paddingRight: 16,
  fontSize: 12,
  "& h1": { fontSize: 18 },
  "& h2": { fontSize: 14 },
  "& h3": { fontSize: 12 },
  "& h4": { fontSize: 12 },
  "& h5": { fontSize: 12 },
  "& h6": { fontSize: 12 },
  "& p": { fontSize: 12 },
  "& a": {},
  "& img": { width: "100%" },
}))

export const HelpSidebarBox = ({ help }) => {
  return (
    <ThemeProvider theme={theme}>
      <SidebarBoxContainer
        title="Help"
        icon={<HelpIcon style={{ color: grey[700] }} />}
        expandedByDefault={help && help !== "" ? false : true}
      >
        <MarkdownContainer>
          <Markdown source={help} />
        </MarkdownContainer>
      </SidebarBoxContainer>
    </ThemeProvider>
  )
}

export default memo(HelpSidebarBox)
