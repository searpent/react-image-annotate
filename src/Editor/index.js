import React from 'react';
import { createReactEditorJS } from 'react-editor-js'
import { EDITOR_JS_TOOLS } from './tools'

const ReactEditorJS = createReactEditorJS()

function Editor({ blocks, onChange, imageIndex }) {
  const handleChange = async instance => {
    const data = await instance.saver.save();
    onChange({ imageIndex, data })
  };

  return (
    <ReactEditorJS defaultValue={{
      blocks
    }}
      tools={EDITOR_JS_TOOLS}
      onChange={handleChange}
      enableReInitialize
    />
  );
}

export default Editor;
