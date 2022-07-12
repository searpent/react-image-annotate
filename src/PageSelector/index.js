import React from 'react';
import PropTypes from 'prop-types';
import classnames from "classnames"
require('./page-selector.css').toString();

function PageThumbnail({ src, isActive, onClick }) {
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
    </div>
  );
}

function PagesSelector({ pages, onPageClick }) {
  return (
    <div className="page-selector">
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
      isActive: PropTypes.string.isRequired
    })
  ).isRequired,
  onPageClick: PropTypes.func
};

PagesSelector.defaultProps = {
  onPageClick: () => { }
};

export default PagesSelector;