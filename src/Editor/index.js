import React from 'react';

function index({ regions, selectedGroupId }) {
  return (
    <div style={{ backgroundColor: 'red' }}>
      There will be the editor
      {JSON.stringify(regions)}
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      {JSON.stringify(selectedGroupId)}
    </div>
  );
}

export default index;