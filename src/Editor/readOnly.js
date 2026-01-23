import React, { useEffect, useRef, useState } from 'react';
import { highlightMisspellingsInHtml } from '../utils/spellcheck-nspell'

function ReadOnly({ article }) {
  const containerRef = useRef(null);

  // Warm up dictionary on component mount
  useEffect(() => {
    const run = async () => {
      const combinedHtml = [
        article.title, article.subtitle, article.text, article.author,
        article.about_author, article.appendix, article.photo_author,
        article.photo_caption, article.advertisement, article.other_graphics,
        article.unknown, article.table, article.section,
        article.continuation_ref, article.cover_clip, article.page_id,
        article.continuation_mark, article.follow_up_mark, article.article_termination_mark,
        article.page_splitting_stripe, article.column_id_stripe, article.prev_page_reference,
        article.section_subcategory
      ].filter(Boolean).join(' ')
      // warm up dictionary once with auto-detection
      await highlightMisspellingsInHtml(combinedHtml, 'auto')
    }
    run()
  }, [article])

  const [titleHTML, setTitleHTML] = useState(article.title)
  const [subtitleHTML, setSubtitleHTML] = useState(article.subtitle)
  const [textHTML, setTextHTML] = useState(article.text)
  const [authorHTML, setAuthorHTML] = useState(article.author)
  const [aboutHTML, setAboutHTML] = useState(article.about_author)
  const [appendixHTML, setAppendixHTML] = useState(article.appendix)
  const [photoAuthorHTML, setPhotoAuthorHTML] = useState(article.photo_author)
  const [photoCaptionHTML, setPhotoCaptionHTML] = useState(article.photo_caption)
  const [adHTML, setAdHTML] = useState(article.advertisement)
  const [otherGraphicsHTML, setOtherGraphicsHTML] = useState(article.other_graphics)
  const [unknownHTML, setUnknownHTML] = useState(article.unknown)
  const [tableHTML, setTableHTML] = useState(article.table)
  const [sectionHTML, setSectionHTML] = useState(article.section)
  const [continuationRefHTML, setContinuationRefHTML] = useState(article.continuation_ref)
  const [coverClipHTML, setCoverClipHTML] = useState(article.cover_clip)
  const [pageIdHTML, setPageIdHTML] = useState(article.page_id)
  const [continuationMarkHTML, setContinuationMarkHTML] = useState(article.continuation_mark)
  const [followUpMarkHTML, setFollowUpMarkHTML] = useState(article.follow_up_mark)
  const [articleTerminationMarkHTML, setArticleTerminationMarkHTML] = useState(article.article_termination_mark)
  const [pageSplittingStripeHTML, setPageSplittingStripeHTML] = useState(article.page_splitting_stripe)
  const [columnIdStripeHTML, setColumnIdStripeHTML] = useState(article.column_id_stripe)
  const [prevPageReferenceHTML, setPrevPageReferenceHTML] = useState(article.prev_page_reference)
  const [sectionSubcategoryHTML, setSectionSubcategoryHTML] = useState(article.section_subcategory)

  useEffect(() => {
    let cancelled = false
    const apply = async () => {
      try {
        const h1 = await highlightMisspellingsInHtml(article.title || '', 'auto')
        const h2 = await highlightMisspellingsInHtml(article.subtitle || '', 'auto')
        const t = await highlightMisspellingsInHtml(article.text || '', 'auto')
        const a = await highlightMisspellingsInHtml(article.author || '', 'auto')
        const ab = await highlightMisspellingsInHtml(article.about_author || '', 'auto')
        const ap = await highlightMisspellingsInHtml(article.appendix || '', 'auto')
        const pa = await highlightMisspellingsInHtml(article.photo_author || '', 'auto')
        const pc = await highlightMisspellingsInHtml(article.photo_caption || '', 'auto')
        const adv = await highlightMisspellingsInHtml(article.advertisement || '', 'auto')
        const og = await highlightMisspellingsInHtml(article.other_graphics || '', 'auto')
        const unk = await highlightMisspellingsInHtml(article.unknown || '', 'auto')
        const tbl = await highlightMisspellingsInHtml(article.table || '', 'auto')
        const sec = await highlightMisspellingsInHtml(article.section || '', 'auto')
        const contRef = await highlightMisspellingsInHtml(article.continuation_ref || '', 'auto')
        const coverClip = await highlightMisspellingsInHtml(article.cover_clip || '', 'auto')
        const pageId = await highlightMisspellingsInHtml(article.page_id || '', 'auto')
        const contMark = await highlightMisspellingsInHtml(article.continuation_mark || '', 'auto')
        const followUp = await highlightMisspellingsInHtml(article.follow_up_mark || '', 'auto')
        const articleTerm = await highlightMisspellingsInHtml(article.article_termination_mark || '', 'auto')
        const pageStripe = await highlightMisspellingsInHtml(article.page_splitting_stripe || '', 'auto')
        const columnStripe = await highlightMisspellingsInHtml(article.column_id_stripe || '', 'auto')
        const prevPageRef = await highlightMisspellingsInHtml(article.prev_page_reference || '', 'auto')
        const sectionSubcat = await highlightMisspellingsInHtml(article.section_subcategory || '', 'auto')
        if (cancelled) return
        setTitleHTML(h1)
        setSubtitleHTML(h2)
        setTextHTML(t)
        setAuthorHTML(a)
        setAboutHTML(ab)
        setAppendixHTML(ap)
        setPhotoAuthorHTML(pa)
        setPhotoCaptionHTML(pc)
        setAdHTML(adv)
        setOtherGraphicsHTML(og)
        setUnknownHTML(unk)
        setTableHTML(tbl)
        setSectionHTML(sec)
        setContinuationRefHTML(contRef)
        setCoverClipHTML(coverClip)
        setPageIdHTML(pageId)
        setContinuationMarkHTML(contMark)
        setFollowUpMarkHTML(followUp)
        setArticleTerminationMarkHTML(articleTerm)
        setPageSplittingStripeHTML(pageStripe)
        setColumnIdStripeHTML(columnStripe)
        setPrevPageReferenceHTML(prevPageRef)
        setSectionSubcategoryHTML(sectionSubcat)
      } catch (error) {
        if (!cancelled) {
          console.warn('Spellcheck error:', error)
        }
      }
    }
    apply()
    return () => { cancelled = true }
  }, [article])

  return (
    <div
      ref={containerRef}
      contentEditable={false}
      suppressContentEditableWarning={true}
      spellCheck={false}
      lang="en-US"
      style={{
        outline: 'none',
        userSelect: 'text',
        minHeight: '100px'
      }}
    >
      <style>{`.spell-error { text-decoration: wavy underline red; text-decoration-skip-ink: auto; }`}</style>
      <h1 className='ro-title' dangerouslySetInnerHTML={{ __html: titleHTML }} />
      <h2 className='ro-subtitle' dangerouslySetInnerHTML={{ __html: subtitleHTML }} />
      <p className='ro-text' dangerouslySetInnerHTML={{ __html: textHTML }}></p>
      <p className='ro-author' dangerouslySetInnerHTML={{ __html: authorHTML }}></p>
      <p className='ro-about-author' dangerouslySetInnerHTML={{ __html: aboutHTML }}></p>
      <p className='ro-appendix' dangerouslySetInnerHTML={{ __html: appendixHTML }}></p>
      <p className='ro-photo-author' dangerouslySetInnerHTML={{ __html: photoAuthorHTML }}></p>
      <p className='ro-photo-caption' dangerouslySetInnerHTML={{ __html: photoCaptionHTML }}></p>
      <p className='ro-advertisment' dangerouslySetInnerHTML={{ __html: adHTML }}></p>
      <p className='ro-other-graphics' dangerouslySetInnerHTML={{ __html: otherGraphicsHTML }}></p>
      <p className='ro-unknown' dangerouslySetInnerHTML={{ __html: unknownHTML }}></p>
      <p className='ro-table' dangerouslySetInnerHTML={{ __html: tableHTML }}></p>
      <p className='ro-section' dangerouslySetInnerHTML={{ __html: sectionHTML }}></p>
      <p className='ro-continuation_ref' dangerouslySetInnerHTML={{ __html: continuationRefHTML }}></p>
      <p className='ro-cover_clip' dangerouslySetInnerHTML={{ __html: coverClipHTML }}></p>
      <p className='ro-page_id' dangerouslySetInnerHTML={{ __html: pageIdHTML }}></p>
      <p className='ro-continuation_mark' dangerouslySetInnerHTML={{ __html: continuationMarkHTML }}></p>
      <p className='ro-follow_up_mark' dangerouslySetInnerHTML={{ __html: followUpMarkHTML }}></p>
      <p className='ro-article_termination_mark' dangerouslySetInnerHTML={{ __html: articleTerminationMarkHTML }}></p>
      <p className='ro-page_splitting_stripe' dangerouslySetInnerHTML={{ __html: pageSplittingStripeHTML }}></p>
      <p className='ro-column_id_stripe' dangerouslySetInnerHTML={{ __html: columnIdStripeHTML }}></p>
      <p className='ro-prev_page_reference' dangerouslySetInnerHTML={{ __html: prevPageReferenceHTML }}></p>
      <p className='ro-section_subcategory' dangerouslySetInnerHTML={{ __html: sectionSubcategoryHTML }}></p>
    </div>
  )
}

export default ReadOnly;
