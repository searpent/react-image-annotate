// @flow

import React, { memo } from "react"
import SidebarBoxContainer from "../SidebarBoxContainer"
import DescriptionIcon from "@mui/icons-material/Description"
import { styled } from "@mui/material/styles"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import { grey } from "@mui/material/colors"

type MetadataItemProps = {
  name: string,
  value: string,
  imageIndex: number,
  onChange: ({ name: string, value: String, imageIndex: number }) => void
}

const MetadataItemDiv = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  marginBottom: "1rem",
  "& > label": {
    fontSize: "1rem",
    marginBottom: ".5rem",
    textTransform: "capitalize"
  }
}))

const MetadataItem = ({ name, value, imageIndex, onChange }: MetadataItemProps) => {
  const handleChange = e => {
    e.preventDefault()
    const { name, value } = e.target
    onChange({
      name,
      value,
      imageIndex
    })
  }

  return (
    <MetadataItemDiv>
      <label for={name}>{name}</label>
      <input type="text" value={value} name={name} onChange={handleChange} />
    </MetadataItemDiv>
  )
}

const MetadataList = ({ title, metadata, imageIndex, onMetadataChange }) => (
  <div>
    <h2>{title}</h2>
    {
      metadata.map(({ key, value }) => (
        <MetadataItem name={key} value={value} imageIndex={imageIndex} onChange={onMetadataChange} />
      ))
    }
  </div>
)

const theme = createTheme()
const DivContainer = styled("div")(({ theme }) => ({
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

export const MetadataEditorSidebarBox = ({ state, onMetadataChange }) => {


  return (
    <ThemeProvider theme={theme}>
      <SidebarBoxContainer
        title="Metadata"
        icon={<DescriptionIcon style={{ color: grey[700] }} />}
        expandedByDefault={true}
      >
        <DivContainer>
          <MetadataList title="Global" metadata={state.metadata} onMetadataChange={onMetadataChange} />
          {
            state?.images[state.selectedImage]?.metadata && (
              <MetadataList title="Local" metadata={state.images[state.selectedImage].metadata} imageIndex={state.selectedImage} onMetadataChange={onMetadataChange} />
            )
          }

        </DivContainer>
      </SidebarBoxContainer>
    </ThemeProvider>
  )
}

export default memo(MetadataEditorSidebarBox)
