import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from "classnames"
import './page-selector.css';

function PageThumbnail({ src, isActive, onClick, pageNumber, metadata, showMetadata }) {
  return (
    <div
      role="button"
      tabIndex={0}
      className={classnames('ps-page-thumbnail', {
        'ps-page-thumbnail-is-active': isActive
      })}
      onClick={onClick}
    >
      <div className="ps-page-thumbnail-image-wrapper">
        <img src={src} alt="" className="ps-page-thumbnail-image" />
        <div className="page-number-wrapper">
          {
            (pageNumber !== undefined && !showMetadata) && (
              <span className="page-number">{pageNumber}</span>
            )
          }
        </div>
      </div>
      <div className="ps-page-thumbnail-metadata-wrapper">
        <label htmlFor>Page</label>
        <input type="text" value="2" />
        <label htmlFor>Topic</label>
        <input type="text" value="012345678901234567890123456789" />
        <label htmlFor>Mutation</label>
        <input type="text" value="2" />
        <label htmlFor>Page</label>
        <input type="text" value="2" />
        <label htmlFor>Topic</label>
        <input type="text" value="012345678901234567890123456789" />
        <label htmlFor>Mutation</label>
        <input type="text" value="2" />
      </div>
    </div >
  );
}

function PageSelector({ pages, onPageClick, onRecalc, onSave, recalcActive, saveActive, onMetadataChange }) {
  const [showMetadata, setShowMetadata] = useState(false);

  return (
    <div className={classnames('page-selector', {
      'page-selector--opened': showMetadata,
    })}>
      <div className="top-buttons">
        <button onClick={onRecalc} disabled={!recalcActive} className="info">Recalc</button>
        <button onClick={onSave} disabled={!saveActive} className="success">Save</button>
        <div className="show-metadata-wrapper">
          <label className="switch mr-2">
            <input id="show-metadata" type="checkbox" value={showMetadata} onChange={() => setShowMetadata(prev => !prev)} />
            <span className="slider round"></span>
          </label>
          <label>Metadata</label>
        </div>
      </div>
      <div className="pages">
        {pages.map((page, idx) => (
          <PageThumbnail
            key={`${page.id}`}
            src={page.src}
            isActive={page.isActive}
            onClick={() => onPageClick(idx)}
            metadata={page.metadata}
            showMetadata={showMetadata}
          />
        ))
        }
      </div >
    </div >
  );
}

PageSelector.propTypes = {
  pages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      src: PropTypes.string.isRequired,
      isActive: PropTypes.bool.isRequired,
      pageNumber: PropTypes.string
    })
  ).isRequired,
  onPageClick: PropTypes.func,
  onRecalc: PropTypes.func,
  onSave: PropTypes.func,
  recalcActive: PropTypes.bool,
  saveActive: PropTypes.bool,
  pageNumber: PropTypes.string
};

PageSelector.defaultProps = {
  onPageClick: () => { },
  onRecalc: () => { },
  onSave: () => { },
  recalcActive: false,
  saveActive: false,
  pageNumber: undefined
};

export default PageSelector;