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
  metadataId?: string,
  onChange: ({ name: string, value: String, imageIndex: number }) => void
}

const MetadataItemDiv = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  marginBottom: ".5em",
  "& > label": {
    fontSize: "1rem",
    marginBottom: ".5em",
    textTransform: "capitalize",
    wordWrap: "break-word",
  },
  label: {
    width: "50%",
  },
  select: {
    width: "100%",
  },
}))

const MetadataItem = ({ name, value, metadataId, imageIndex, groupId, onChange, metadataConfig = {} }: MetadataItemProps) => {
  const handleChange = e => {
    e.preventDefault()
    const { name, value } = e.target
    onChange({
      name,
      value,
      imageIndex,
      groupId,
      metadataId
    })
  }

  return (
    <MetadataItemDiv>
      <label for={name}>{name}</label>
      <div style={{
        width: "50%",
      }}>
        {
          metadataConfig?.selectable !== true && (
            <>
              <input type="text" value={value} name={name} onChange={handleChange} id={name} list={`${name}-list`} style={{ width: "100%" }} />
              <datalist id={`${name}-list`}>
                {
                  metadataConfig?.options?.map(opt => {
                    if (opt.value && opt.label) {
                      return <option key={opt.value} value={opt.value}>{opt.label}</option>
                    }
                    return <option key={opt} value={opt}></option>
                  })
                }
              </datalist>
            </>
          )
        }
        {
          metadataConfig?.selectable === true && (
            <select name={name} id={name} onChange={handleChange} style={{ width: '100%' }}>
              {
                metadataConfig?.options?.map(opt => {
                  if (opt.value && opt.label) {
                    return <option key={opt.value} value={opt.value} selected={opt.value === value}>{opt.label}</option>
                  }
                  return <option key={opt} value={opt}></option>
                })
              }
            </select>
          )
        }

      </div>
    </MetadataItemDiv>
  )
}

const MetadataList = ({ title, metadata, imageIndex, onMetadataChange, metadataConfigs = [], groupId }) => (
  <div>
    <h2>{title}</h2>
    {
      metadata && metadata.map(({ key, value, metadataId }) => (
        <MetadataItem name={key} value={value} imageIndex={imageIndex} metadataId={metadataId} groupId={groupId} onChange={onMetadataChange} metadataConfig={metadataConfigs.find(i => i.key === key)} />
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
  const metadataConfigs = state.metadataConfigs || [];
  const selectedPhotoMetadata = state?.images[state.selectedImage]?.metadata;
  let selectedGroupId = state?.images[state.selectedImage]?.regions?.find(r => r.highlighted === true)?.groupId;
  let articleMetadata = []; // example: [{key: "previousArticleId", value "123-123-123-123-123"}]

  if (selectedGroupId !== undefined) {
    const articleMetadataRegion = state?.images[state.selectedImage].regions.find(r => r.cls === 'metadata' && `${r.groupId}` === selectedGroupId)
    if (articleMetadataRegion) {
      const metadata = JSON.parse(articleMetadataRegion.text)
      articleMetadata = metadata
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <SidebarBoxContainer
        title="Metadata"
        icon={<DescriptionIcon style={{ color: grey[700] }} />}
        expandedByDefault={true}
      >
        <DivContainer style={{
          height: "600px",
        }}>
          {
            articleMetadata.length > 0 && (
              <MetadataList title="Article" metadata={articleMetadata} imageIndex={state.selectedImage} groupId={selectedGroupId} onMetadataChange={onMetadataChange} metadataConfigs={metadataConfigs.filter(mfc => mfc.level === 'photo_metadata-engine')} />
            )
          }
          {
            selectedPhotoMetadata && (
              <MetadataList title="Page" metadata={selectedPhotoMetadata} imageIndex={state.selectedImage} onMetadataChange={onMetadataChange} metadataConfigs={metadataConfigs.filter(mfc => mfc.level === 'photo')} />
            )
          }
          <MetadataList title="Issue" metadata={state.albumMetadata} onMetadataChange={onMetadataChange} id="metadata-album" metadataConfigs={metadataConfigs.filter(mfc => mfc.level === 'album')} />
        </DivContainer>
      </SidebarBoxContainer>
    </ThemeProvider>
  )
}

export default memo(MetadataEditorSidebarBox)
