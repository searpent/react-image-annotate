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
        article.unknown, article.table, article.section
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
    </div>
  )
}

export default ReadOnly;