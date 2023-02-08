import React from 'react';

function ReadOnly({ article }) {
  return (<div>
    <h1>{article.title}</h1>
    <h2>{article.subtitle}</h2>
    <p>{article.text}</p>
    <p>{article.author}</p>
    <p>{article.about_author}</p>
    <div>{article.appendix}</div>
    <div>{article.photo_author}</div>
    <div>{article.photo_caption}</div>
    <div>{article.advertisement}</div>
    <div>{article.other_graphics}</div>
    <div>{article.unknown}</div>
    <div>{article.table}</div>
  </div>)
}

export default ReadOnly;