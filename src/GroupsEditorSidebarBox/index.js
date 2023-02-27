// @flow

import React, { memo, useState } from "react"
import SidebarBoxContainer from "../SidebarBoxContainer"
import FilterNoneIcon from '@mui/icons-material/FilterNone';
import { styled } from "@mui/material/styles"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import { grey } from "@mui/material/colors"
import uuidToHash from "../utils/uuid-to-hash";

const theme = createTheme()

const GroupItemDiv = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  marginBottom: "1rem",
  "& > label": {
    fontSize: "1rem",
    marginBottom: ".5rem",
    textTransform: "capitalize"
  }
}))

const GroupItem = ({ group }) => {
  return (
    <GroupItemDiv>
      {uuidToHash(group.id)}
    </GroupItemDiv>
  )
}

const GroupList = ({ groups }) => (
  <div>
    <h2>Groups</h2>
    {
      groups.map((g, idx) => <GroupItem key={`${g}-${idx}`} group={g} />)
    }
  </div>
)

const AddGroupFormDiv = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
}))

const AddGroupFrom = ({ onAddGroup }) => {
  const [value, setValue] = useState("");

  const handleChange = (e) => {
    setValue(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddGroup(value);
    setValue('')
  }

  return (
    <AddGroupFormDiv>
      <form onSubmit={handleSubmit} style={{
        display: "flex",
        paddingRight: "6px",
      }}>
        <input type="text" value={value} name="new-group" placeholder="New group name" onChange={handleChange} style={{
          marginRight: "1rem",
        }} />
        <input type="submit" value="Create group" />
      </form >
    </AddGroupFormDiv>
  )
}


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

export const GroupsEditorSidebarBox = ({ groups, onAddGroup }) => {
  return (
    <ThemeProvider theme={theme}>
      <SidebarBoxContainer
        title="Groups"
        icon={<FilterNoneIcon style={{ color: grey[700] }} />}
        expandedByDefault={true}
      >
        <DivContainer>
          <h2>Add new group</h2>
          <AddGroupFrom onAddGroup={onAddGroup} />
          <GroupList groups={groups} />
        </DivContainer>
      </SidebarBoxContainer>
    </ThemeProvider>
  )
}

export default memo(GroupsEditorSidebarBox)
