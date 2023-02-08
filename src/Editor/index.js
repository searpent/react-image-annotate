import React, { useState } from 'react';
import { createReactEditorJS } from 'react-editor-js'
import blocksToArticle from '../utils/blocks-to-article';
import { EDITOR_JS_TOOLS } from './tools'
import ReadOnly from './readOnly';

const ReactEditorJS = createReactEditorJS()

function Editor({ blocks, onChange, imageIndex }) {
  const [isReadOnly, setIsReadOnly] = useState(false);
  const handleChange = async instance => {
    const data = await instance.saver.save();
    onChange({ imageIndex, data })
  };
  const toggleIsReadOnly = () => {
    setIsReadOnly(prev => !prev)
  }
  return (
    <div>
      <div className="show-metadata-wrapper">
        <label className="switch mr-2">
          <input id="show-metadata" type="checkbox" value={isReadOnly} onChange={toggleIsReadOnly} />
          <span className="slider round"></span>
        </label>
        <label>Preview</label>
      </div>
      {
        isReadOnly ?
          (<ReadOnly article={blocksToArticle(blocks)} />) :
          (<ReactEditorJS defaultValue={{
            blocks
          }}
            tools={EDITOR_JS_TOOLS}
            onChange={handleChange}
            enableReInitialize
          />)
      }
    </div>

  );
}

export default Editor;
