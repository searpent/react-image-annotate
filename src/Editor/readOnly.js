import React from 'react';

function ReadOnly({ article }) {
  return (<div>
    <h1 className='ro-title' dangerouslySetInnerHTML={{ __html: article.title }} />
    <h2 className='ro-subtitle' dangerouslySetInnerHTML={{ __html: article.subtitle }} />
    <p className='ro-text' dangerouslySetInnerHTML={{ __html: article.text }}></p>
    <p className='ro-author' dangerouslySetInnerHTML={{ __html: article.author }}></p>
    <p className='ro-about-author' dangerouslySetInnerHTML={{ __html: article.about_author }}></p>
    <p className='ro-appendix' dangerouslySetInnerHTML={{ __html: article.appendix }}></p>
    <p className='ro-photo-author' dangerouslySetInnerHTML={{ __html: article.photo_author }}></p>
    <p className='ro-photo-caption' dangerouslySetInnerHTML={{ __html: article.photo_caption }}></p>
    <p className='ro-advertisment' dangerouslySetInnerHTML={{ __html: article.advertisement }}></p>
    <p className='ro-other-graphics' dangerouslySetInnerHTML={{ __html: article.other_graphics }}></p>
    <p className='ro-unknown' dangerouslySetInnerHTML={{ __html: article.unknown }}></p>
    <p className='ro-table' dangerouslySetInnerHTML={{ __html: article.table }}></p>
    <p className='ro-section' dangerouslySetInnerHTML={{ __html: article.section }}></p>
    <p className='ro-continuation_ref' dangerouslySetInnerHTML={{ __html: article.continuation_ref }}></p>
    <p className='ro-cover_clip' dangerouslySetInnerHTML={{ __html: article.cover_clip }}></p>
    <p className='ro-page_id' dangerouslySetInnerHTML={{ __html: article.page_id }}></p>
    <p className='ro-continuation_mark' dangerouslySetInnerHTML={{ __html: article.continuation_mark }}></p>
    <p className='ro-follow_up_mark' dangerouslySetInnerHTML={{ __html: article.follow_up_mark }}></p>
    <p className='ro-article_termination_mark' dangerouslySetInnerHTML={{ __html: article.article_termination_mark }}></p>
    <p className='ro-page_splitting_stripe' dangerouslySetInnerHTML={{ __html: article.page_splitting_stripe }}></p>
    <p className='ro-column_id_stripe' dangerouslySetInnerHTML={{ __html: article.column_id_stripe }}></p>
    <p className='ro-prev_page_reference' dangerouslySetInnerHTML={{ __html: article.prev_page_reference }}></p>
    <p className='ro-section_subcategory' dangerouslySetInnerHTML={{ __html: article.section_subcategory }}></p>
  </div>)
}

export default ReadOnly;