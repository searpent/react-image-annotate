import React from 'react';
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

function PagesSelector({ pages, onPageClick, onRecalc, onSave, recalcActive, saveActive }) {
  return (
    <div className="page-selector">
      <div className="bottom-buttons">
        <button onClick={onRecalc} disabled={!recalcActive} className="info">Recalc</button>
        <button onClick={onSave} disabled={!saveActive} className="success">Save</button>
      </div>
      <div className="pages">
        {pages.map((page, idx) => (
          <PageThumbnail
            key={page.id}
            src={page.src}
            isActive={page.isActive}
            onClick={() => onPageClick(idx)}
          />
        ))}
      </div>
    </div>
  );
}

PagesSelector.propTypes = {
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

PagesSelector.defaultProps = {
  onPageClick: () => { },
  onRecalc: () => { },
  onSave: () => { },
  recalcActive: false,
  saveActive: false,
  pageNumber: undefined
};

export default PagesSelector;