import React, { useState } from 'react';
import { createReactEditorJS } from 'react-editor-js'
import blocksToArticle from '../utils/blocks-to-article';
import { EDITOR_JS_TOOLS } from './tools'
import ReadOnly from './readOnly';
import { isSpellcheckEnabled, setSpellcheckEnabled } from '../utils/spellcheck-nspell'
import './editor.css';

const ReactEditorJS = createReactEditorJS()

function Editor({ blocks = [], onChange, imageIndex, selectedFrame, selectedGroupId = null, originalSelectedGroupId = null }) {
  const [editMode, setEditMode] = useState(false);
  const [autoSpellcheck, setAutoSpellcheck] = useState(isSpellcheckEnabled());
  const handleChange = async instance => {
    const data = await instance.saver.save();
    onChange({ imageIndex, data })
  };
  const toggleEditMode = () => {
    setEditMode(prev => !prev)
  }

  const toggleAutoSpellcheck = () => {
    setAutoSpellcheck(prev => {
      const next = !prev
      setSpellcheckEnabled(next)
      return next
    })
  }

  // BUG SIMULATION: Only activate with ?bug=true parameter (not just localhost)
  // This allows Storybook to test both the fix and the bug simulation
  const isBugMode = typeof window !== 'undefined' && window.location.search.includes('bug=true');
  
  // In bug mode: selectedGroupId is null (simulating the bug), but originalSelectedGroupId has the actual selection
  // Use originalSelectedGroupId for filtering in read-only mode to show correct article
  // Use selectedGroupId (null) for edit mode to reproduce the bug
  const groupIdForReadOnly = isBugMode && originalSelectedGroupId != null 
    ? originalSelectedGroupId  // Use original selection for read-only filtering
    : selectedGroupId;          // Otherwise use selectedGroupId
  
  const groupIdForEdit = selectedGroupId; // Always use selectedGroupId for edit mode (null in bug mode = bug)
  
  // Filter blocks for read-only mode
  const blocksForReadOnly = groupIdForReadOnly === null
    ? (isBugMode ? blocks : []) // In bug mode show all blocks, otherwise show empty
    : blocks.filter(i => i?.data?.groupId === groupIdForReadOnly); // Filter by selected article
  
  // Filter blocks for edit mode - this is where the bug manifests
  const blocksForEdit = groupIdForEdit === null
    ? blocks.filter(i => i?.data?.groupId === groupIdForEdit) // BUG: Filter to empty array when selectedGroupId is null
    : blocks.filter(i => i?.data?.groupId === groupIdForEdit); // Normal: filter by selected article

  return (
    <div>
      <div className="show-metadata-wrapper editor-toggle-wrapper">
        <div>
          <label className="switch mr-2 editor-switch">
            <input
              id="automatic-spellcheck"
              type="checkbox"
              checked={autoSpellcheck}
              onChange={toggleAutoSpellcheck}
            />
            <span className="slider round"></span>
          </label>
          <label className="mr-4">Spellcheck</label>
        </div>
        <div>
          <label className="switch mr-2 editor-switch">
            <input id="show-metadata" type="checkbox" checked={editMode} onChange={toggleEditMode} />
            <span className="slider round"></span>
          </label>
          <label>Edit mode</label>
        </div>
      </div>

      {blocksForReadOnly.length < 1 ? (
        <div className='instructions'><h1>Click article to display text.</h1></div>
      ) : (
        !editMode ?
          (<ReadOnly article={blocksToArticle(blocksForReadOnly)} />) :
          (<ReactEditorJS defaultValue={{
            blocks: blocksForEdit
          }}
            tools={EDITOR_JS_TOOLS}
            onChange={handleChange}
            onInitialize={() => {}}
            enableReInitialize
            key={selectedFrame}
          />)
      )}
    </div>

  );
}

export default Editor;
