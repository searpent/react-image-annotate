import React from 'react';
import { createReactEditorJS } from 'react-editor-js'
import { EDITOR_JS_TOOLS } from './tools'

const ReactEditorJS = createReactEditorJS()

const blocks = {
  "time": 1656421988504,
  "blocks": [
    {
      "id": "BNm1xCwz-P",
      "type": "annotation",
      "data": {
        "text": "Editor.js",
        "labelName": "title"
      }
    },
  ],
  "version": "2.24.3"
};

function Editor(props) {
  const handleChange = async instance => {
    const data = await instance.saver.save();
    console.log(data)
  };

  return (
    <ReactEditorJS defaultValue={blocks} tools={EDITOR_JS_TOOLS} onChange={handleChange}
      onCompareBlocks={(newData, oldData) => newData === oldData} />
  );
}

export default Editor;
