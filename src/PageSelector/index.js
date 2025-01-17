import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from "classnames"
import './page-selector.css';
import Locker from '../Locker';
import Errorer from '../Errorer';

function PageThumbnail({ src, isActive, onClick, metadata, showMetadata, imageIndex, imageId, onMetadataChange, metadataConfigs = [], isLocked, error, onRecalcClick, isRecalcReady = false }) {
  const handleChange = e => {
    e.preventDefault()
    const { name, value } = e.target
    onMetadataChange({
      name,
      value,
      imageIndex
    })
  }

  const handleRecalcClick = e => {
    e.stopPropagation();
    onRecalcClick({ imageId })
  }

  const pageNumber = metadata?.find?.(md => md.key === 'pageNumber')?.value

  return (
    <div
      role="button"
      tabIndex={0}
      className={classnames('ps-page-thumbnail', {
        'ps-page-thumbnail-is-active': isActive,
      })}
      onClick={onClick}
    >
      {
        isLocked && (
          <Locker />
        )
      }
      {
        error && (
          <Errorer errorMessage={error.message} />
        )
      }
      <div className="ps-page-thumbnail-image-wrapper">
        {
          isRecalcReady && (
            <div className="ps-page-thumbnail-recalc-wrapper">
              <button className="recalc-button" onClick={handleRecalcClick}>Extract</button>
            </div>
          )
        }
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
        {
          metadata.map(({ key, value }) => (<>
            <label for={key}>{key}</label>
            <input type="text" value={value} name={key} onChange={handleChange} onClick={e => e.stopPropagation()} id={key} list={`${key}-list`} />
            <datalist id={`${key}-list`}>
              {
                metadataConfigs.find(mcf => mcf.key === key)?.options.map(opt => <option key={opt} value={opt}></option>)
              }
            </datalist>
          </>))
        }
      </div>
    </div >
  );
}

function isLocked(page) {
  const { lockedUntil } = page;

  // needs to be defined and greater than current time
  if (Date.parse(lockedUntil)?.valueOf() > new Date().valueOf()) {
    return true
  }

  return false;
}

function PageSelector({ pages, onPageClick, onMetadataChange, metadataConfigs, onRecalcClick }) {
  const [showMetadata, setShowMetadata] = useState(false);

  return (
    <div className={classnames('page-selector', {
      'page-selector--opened': showMetadata,
    })}>
      <div className="top-buttons">
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
            isLocked={isLocked(page)}
            error={page.syncError}
            src={page.src}
            isActive={page.isActive}
            onClick={() => onPageClick(idx)}
            metadata={page.metadata}
            showMetadata={showMetadata}
            imageIndex={idx}
            imageId={page.id}
            onMetadataChange={onMetadataChange}
            metadataConfigs={metadataConfigs}
            onRecalcClick={onRecalcClick}
            isRecalcReady={page.isRecalcReady}
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
  recalcActive: PropTypes.bool,
  saveActive: PropTypes.bool,
  pageNumber: PropTypes.string,
  onMetadataChange: PropTypes.func.isRequired,
  metadataConfigs: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    level: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.string).isRequired,
  }))
};

PageSelector.defaultProps = {
  onPageClick: () => { },
  recalcActive: false,
  saveActive: false,
  pageNumber: undefined
};

export default PageSelector;