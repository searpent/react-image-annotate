import React, { useState } from 'react';
import { createReactEditorJS } from 'react-editor-js'
import blocksToArticle from '../utils/blocks-to-article';
import { EDITOR_JS_TOOLS } from './tools'
import ReadOnly from './readOnly';
import { isSpellcheckEnabled, setSpellcheckEnabled } from '../utils/spellcheck-nspell'
import '../PageSelector/page-selector.css';
import './editor.css';

const ReactEditorJS = createReactEditorJS()

function Editor({ blocks = [], onChange, imageIndex, selectedFrame }) {
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

  if (blocks.length < 1) {
    return <div className='instructions'><h1>Click article to display text.</h1></div>
  }

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
            <input
              id="show-metadata"
              type="checkbox"
              checked={editMode}
              onChange={toggleEditMode}
            />
            <span className="slider round"></span>
          </label>
          <label>Edit mode</label>
        </div>
      </div>

      {
        !editMode ?
          (<ReadOnly article={blocksToArticle(blocks)} />) :
          (<ReactEditorJS defaultValue={{
            blocks
          }}
            tools={EDITOR_JS_TOOLS}
            onChange={handleChange}
            onInitialize={() => {}}
            enableReInitialize
            key={selectedFrame}
          />)
      }
    </div>

  );
}

export default Editor;
