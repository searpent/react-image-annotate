import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from "classnames"
require('./page-selector.css').toString();

function PageThumbnail({ src, isActive, onClick, pageNumber }) {
  return (
    <div
      role="button"
      tabIndex={0}
      className={classnames('page-thumbnail', {
        'page-thumbnail-is-active': isActive
      })}
      onClick={onClick}
    >
      <img src={src} alt="" />
      {
        (pageNumber !== undefined) && (
          <div className="page-number-wrapper">
            <span className="page-number">{pageNumber}</span>
          </div>
        )
      }
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
      </div>
      <div className="pages">
        {pages.map((page, idx) => (
          <div className="page-thumbnail__wrapper">
            <PageThumbnail
              key={page.id}
              src={page.src}
              isActive={page.isActive}
              onClick={() => onPageClick(idx)}
            />
            {
              showMetadata && (
                <div className="page-thumbnail__metadata">
                  <h5>Metadata</h5>
                  {
                    page?.metadata?.map(({ key, value }) => (
                      <>
                        <label htmlFor={key}>{key}</label>
                        <input id={key} type="text" value={value} onChange={(e) => onMetadataChange({ name: key, value: e.target.value, imageIndex: idx })} />
                      </>
                    ))
                  }
                </div>
              )
            }
          </div>
        ))}
      </div>
      <div className="bottom-buttons">
        <div className="show-metadata-wrapper">
          <label className="switch mr-2">
            <input id="show-metadata" type="checkbox" value={showMetadata} onChange={() => setShowMetadata(prev => !prev)} />
            <span className="slider round"></span>
          </label>
          <label>Metadata</label>
        </div>
      </div>
    </div>
  );
}

PageSelector.propTypes = {
  pages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      src: PropTypes.string.isRequired,
      isActive: PropTypes.string.isRequired,
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