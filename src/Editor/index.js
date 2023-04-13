import React, { useState } from 'react';
import { createReactEditorJS } from 'react-editor-js'
import blocksToArticle from '../utils/blocks-to-article';
import { EDITOR_JS_TOOLS } from './tools'
import ReadOnly from './readOnly';

const ReactEditorJS = createReactEditorJS()

function Editor({ blocks = [], onChange, imageIndex, selectedFrame }) {
  const [editMode, setEditMode] = useState(false);
  const handleChange = async instance => {
    const data = await instance.saver.save();
    onChange({ imageIndex, data })
  };
  const toggleEditMode = () => {
    setEditMode(prev => !prev)
  }

  if (blocks.length < 1) {
    return <div className='instructions'><h1>Click article to display text.</h1></div>
  }

  return (
    <div>
      <div className="show-metadata-wrapper">
        <label className="switch mr-2">
          <input id="show-metadata" type="checkbox" value={editMode} onChange={toggleEditMode} />
          <span className="slider round"></span>
        </label>
        <label>Edit mode</label>
      </div>

      {
        !editMode ?
          (<ReadOnly article={blocksToArticle(blocks)} />) :
          (<ReactEditorJS defaultValue={{
            blocks
          }}
            tools={EDITOR_JS_TOOLS}
            onChange={handleChange}
            enableReInitialize
            key={selectedFrame}
          />)
      }
    </div>

  );
}

export default Editor;
