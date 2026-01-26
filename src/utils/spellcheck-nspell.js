/**
 * Multi-language spellcheck system with priority-based language detection
 *
 * Language Detection Priority:
 * 1. Explicit spellcheck language setting (setSpellcheckLanguage())
 * 2. Text content analysis (character frequency)
 * 3. Browser language preferences
 * 4. Default fallback (en-US)
 *
 * Usage:
 * - setSpellcheckEnabled(true)    // Enable spellchecking (disabled by default for performance)
 * - setSpellcheckLanguage('cs-CZ') // Set explicit language
 * - setSpellcheckLanguage(null)    // Clear setting (use auto-detection)
 * - highlightMisspellingsInHtml(html, 'auto') // Auto-detect with priority
 *
 * Configuration:
 * - Set REACT_APP_SPELLCHECK_ENABLED=true in .env file to enable spellchecking (default: disabled)
 * - Or call setSpellcheckEnabled(true) programmatically at app startup to enable
 */

// Simple nspell loader usable in the browser. It lazy-loads the aff/dic
// and exposes a singleton spell instance plus a helper to check words.

// Cache for different language spellcheckers
const spellInstances = new Map()
const loadPromises = new Map()

export async function getSpell(lang = 'en-US') {
  // Check if dictionary is available
  if (!AVAILABLE_DICTIONARIES[lang]) {
    console.warn(`Dictionary not available for language: ${lang}`)
    return null // Return null instead of throwing
  }

  if (spellInstances.has(lang)) return spellInstances.get(lang)
  if (loadPromises.has(lang)) {
    const result = await loadPromises.get(lang)
    return result // May be null if loading failed
  }

  const promise = (async () => {
    try {
      const { default: nspell } = await import('nspell')
      // Use the mapped dictionary name
      const dictName = AVAILABLE_DICTIONARIES[lang]
      const affUrl = `/dicts/${dictName}.aff`
      const dicUrl = `/dicts/${dictName}.dic`

      console.log('Loading dictionary files:', affUrl, dicUrl)

      const [affRes, dicRes] = await Promise.all([
        fetch(affUrl, { mode: 'cors' }),
        fetch(dicUrl, { mode: 'cors' })
      ])

      console.log('Fetch responses:', affRes.status, dicRes.status)

      if (!affRes.ok || !dicRes.ok) {
        const errorMsg = `Failed to load dictionary files: ${affUrl} (${affRes.status}), ${dicUrl} (${dicRes.status})`
        console.error(`[Spellcheck Error] ${errorMsg}`)
        console.error(`[Spellcheck Error] Make sure dictionary files are served from /dicts/ path`)
        console.error(`[Spellcheck Error] Check that public/dicts/ files are copied during build`)
        return null // Return null instead of throwing
      }
      // Load as raw bytes to support legacy encodings declared by SET in .aff
      const [affBuf, dicBuf] = await Promise.all([affRes.arrayBuffer(), dicRes.arrayBuffer()])

      // Decode .aff as UTF-8 first to read SET <encoding>
      const utf8Decoder = new TextDecoder('utf-8')
      let affUtf8 = utf8Decoder.decode(affBuf)
      let enc = 'utf-8'
      const setMatch = /\n\s*SET\s+([^\r\n]+)/i.exec("\n" + affUtf8)
      if (setMatch) {
        const raw = setMatch[1].trim()
        // Map common Hunspell enc names to TextDecoder labels
        const map = {
          'UTF-8': 'utf-8', 'UTF8': 'utf-8',
          'ISO8859-1': 'iso-8859-1', 'ISO-8859-1': 'iso-8859-1',
          'ISO8859-2': 'iso-8859-2', 'ISO-8859-2': 'iso-8859-2',
          'ISO8859-5': 'iso-8859-5', 'ISO-8859-5': 'iso-8859-5',
          'KOI8-R': 'koi8-r', 'KOI8-U': 'koi8-u',
          'WINDOWS-1250': 'windows-1250', 'CP1250': 'windows-1250',
          'WINDOWS-1251': 'windows-1251', 'CP1251': 'windows-1251',
          'WINDOWS-1252': 'windows-1252', 'CP1252': 'windows-1252',
          'MICROSOFT-CP1251': 'windows-1251', 'microsoft-cp1251': 'windows-1251'
        }
        const mapped = map[raw.toUpperCase()] || raw
        try {
          // Probe if browser supports it
          new TextDecoder(mapped)
          enc = mapped
        } catch (_) {
          console.warn(`Unsupported dictionary encoding '${raw}' resolved to '${mapped}'. Falling back to UTF-8.`)
        }
      }

      const decoder = new TextDecoder(enc)
      const aff = enc === 'utf-8' ? affUtf8 : decoder.decode(affBuf)
      const dic = decoder.decode(dicBuf)

      const spellInstance = nspell(aff, dic)
      spellInstances.set(lang, spellInstance)
      console.log(`Dictionary loaded successfully for ${lang}`)
      return spellInstance
    } catch (error) {
      console.error(`[Spellcheck Error] Failed to load dictionary for ${lang}:`, error)
      return null // Return null instead of throwing
    }
  })()

  loadPromises.set(lang, promise)
  return promise
}

// Available dictionaries mapping
const AVAILABLE_DICTIONARIES = {
  'en-US': 'en_US',
  'en': 'en_US',
  'cs-CZ': 'cs_CZ',
  'cs': 'cs_CZ',
  'sk-SK': 'sk_SK',
  'sk': 'sk_SK',
  'pt-BR': 'pt_BR',
  'pt_BR': 'pt_BR',
  'pt': 'pt_BR',
  'mk-MK': 'mk_MK',
  'mk': 'mk_MK'
}

// Spellcheck language setting (can be set by user)
let spellcheckLanguageSetting = null

// Spellcheck enabled/disabled flag
// Defaults to false (disabled) for performance. Enable via REACT_APP_SPELLCHECK_ENABLED=true or setSpellcheckEnabled()
let spellcheckEnabled = (() => {
  try {
    // Check for environment variable (works in Create React App, Storybook, etc.)
    if (typeof process !== 'undefined' && process.env && process.env.REACT_APP_SPELLCHECK_ENABLED !== undefined) {
      const envValue = process.env.REACT_APP_SPELLCHECK_ENABLED
      console.log('[Spellcheck] REACT_APP_SPELLCHECK_ENABLED from env:', envValue)
      const enabledFromEnv = envValue === 'true' || envValue === '1'
      console.log('[Spellcheck] Initial spellcheckEnabled from env:', enabledFromEnv)
      return enabledFromEnv
    }
  } catch (e) {
    // Ignore errors accessing process.env
    console.warn('[Spellcheck] Failed to read REACT_APP_SPELLCHECK_ENABLED from process.env:', e)
  }
  console.log('[Spellcheck] REACT_APP_SPELLCHECK_ENABLED not set, defaulting spellcheckEnabled=false')
  return false // Default to disabled for performance
})()

// Function to enable/disable spellchecking
// Call this from your application to control spellchecking at runtime
export function setSpellcheckEnabled(enabled) {
  spellcheckEnabled = Boolean(enabled)
  console.log(`Spellcheck ${spellcheckEnabled ? 'enabled' : 'disabled'}`)
}

// Function to check if spellchecking is enabled
export function isSpellcheckEnabled() {
  return spellcheckEnabled
}

// Function to set spellcheck language preference
export function setSpellcheckLanguage(lang) {
  if (lang && AVAILABLE_DICTIONARIES[lang]) {
    spellcheckLanguageSetting = lang
    console.log(`Spellcheck language set to: ${lang}`)
  } else if (lang === null) {
    spellcheckLanguageSetting = null
    console.log('Spellcheck language setting cleared')
  } else {
    console.warn(`Invalid spellcheck language: ${lang}. Available: ${Object.keys(AVAILABLE_DICTIONARIES).join(', ')}`)
  }
}

// Function to get current spellcheck language setting
export function getSpellcheckLanguage() {
  return spellcheckLanguageSetting
}

// Get browser language preferences for spellcheck
function getBrowserSpellcheckLanguage() {
  if (typeof navigator === 'undefined') return 'en-US'

  // Get browser language preferences
  const languages = navigator.languages || [navigator.language || navigator.userLanguage || 'en-US']

  // Find first available language
  for (const lang of languages) {
    const normalized = lang.toLowerCase()

    // Direct match
    if (AVAILABLE_DICTIONARIES[lang]) return lang

    // Match by prefix (e.g., 'en-US' matches 'en')
    const prefix = normalized.split('-')[0]
    if (AVAILABLE_DICTIONARIES[prefix]) return prefix

    // Match by full language code
    if (AVAILABLE_DICTIONARIES[normalized]) return normalized
  }

  return 'en-US' // fallback
}

// Enhanced language detection with priority: spellcheck setting → text analysis → browser settings
function detectLanguage(text, browserLang = null, spellcheckLang = null) {
  // console.log(`Language detection inputs - browserLang: ${browserLang}, spellcheckLang: ${spellcheckLang}, text length: ${text ? text.length : 0}`)

  // Priority 1: Use explicit spellcheck language setting if available
  if (spellcheckLang && AVAILABLE_DICTIONARIES[spellcheckLang]) {
    console.log(`Using explicit spellcheck language: ${spellcheckLang}`)
    return spellcheckLang
  }

  // Priority 2: Detect from text content if available
  if (text) {
    // Check for Czech-specific characters first (highest priority for distinctive characters)
    const czechChars = text.match(/[áčďéěíňóřšťúůýžÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]/g) || []
    const czechScore = czechChars.length

    // Check for Slovak-specific characters
    const slovakChars = text.match(/[áäčďéíĺľňóôŕšťúýžÁÄČĎÉÍĹĽŇÓÔŔŠŤÚÝŽ]/g) || []
    const slovakScore = slovakChars.length

    // Check for Portuguese-specific characters (including Brazilian Portuguese)
    const portugueseChars = text.match(/[áàâãäéêëíîïóôõöúûüçÁÀÂÃÄÉÊËÍÎÏÓÔÕÖÚÛÜÇ]/g) || []
    const portugueseScore = portugueseChars.length

    // Check for Macedonian-specific Cyrillic characters
    // Macedonian uses letters like ѓ (U+0453), ќ (U+045C), ѕ (U+0455), џ (U+045F), ј (U+0458)
    // and their uppercase counterparts Ѓ (U+0403), Ќ (U+040C), Ѕ (U+0405), Џ (U+040F), Ј (U+0408)
    // We also include the broader Cyrillic range to capture words.
    const macedonianChars = text.match(/[ЃЌЅЏЈѓќѕџјА-Яа-яЀ-Џѐ-џ]/g) || []
    const macedonianScore = macedonianChars.length

    // console.log(`Language detection scores - Czech: ${czechScore}, Slovak: ${slovakScore}, Portuguese: ${portugueseScore}`)

    // Find the language with the highest score
    const languageScores = [
      { lang: 'cs-CZ', score: czechScore, name: 'Czech' },
      { lang: 'sk-SK', score: slovakScore, name: 'Slovak' },
      { lang: 'pt-BR', score: portugueseScore, name: 'Portuguese' },
      { lang: 'mk-MK', score: macedonianScore, name: 'Macedonian' }
    ]

    // Filter out languages with no score and check if dictionary is available
    const validLanguages = languageScores.filter(lang =>
      lang.score > 0 && AVAILABLE_DICTIONARIES[lang.lang]
    )

    if (validLanguages.length > 0) {
      // Sort by score (highest first) and return the top language
      const bestMatch = validLanguages.sort((a, b) => b.score - a.score)[0]
      // console.log(`Detected language from text: ${bestMatch.lang} (${bestMatch.name} diacritics: ${bestMatch.score})`)
      return bestMatch.lang
    }

    // If we have text but no distinctive diacritics, it's likely English
    if (text.trim().length > 0) {
      // console.log(`Detected language from text: en-US (no distinctive diacritics found)`)
      return 'en-US'
    }
  }

  // Priority 3: Fall back to browser language if available
  if (browserLang && AVAILABLE_DICTIONARIES[browserLang]) {
    console.log(`Using browser language: ${browserLang}`)
    return browserLang
  }

  // Final fallback
  console.log('Using default language: en-US')
  return 'en-US'
}

export async function findMisspellings(text, lang = 'auto') {
  // Early return if spellchecking is disabled
  if (!spellcheckEnabled) {
    return []
  }

  try {
    // Get browser language preferences
    const browserLang = getBrowserSpellcheckLanguage()

    // Get spellcheck language setting
    const spellcheckLang = getSpellcheckLanguage()

    // Auto-detect language if not specified
    const detectedLang = lang === 'auto' ? detectLanguage(text, browserLang, spellcheckLang) : lang

    // Check if dictionary is available
    if (!AVAILABLE_DICTIONARIES[detectedLang]) {
      console.warn(`Dictionary not available for ${detectedLang}, skipping spellcheck`)
      return []
    }

    const spell = await getSpell(detectedLang)

    // If dictionary failed to load, return empty array (no misspellings found)
    if (!spell) {
      console.warn(`[Spellcheck] Dictionary not available for ${detectedLang}, skipping spellcheck`)
      return []
    }

    // Unicode-aware word extraction across scripts (Latin, Cyrillic, etc.)
    // Matches sequences of letters, allowing internal apostrophes/dashes.
    const wordRegex = /\p{L}[\p{L}'’\-]*/gu
    const words = text.match(wordRegex) || []
    const miss = new Set()

    for (const w of words) {
      const word = w.replace(/^'+|'+$/g, '')
      if (!word) continue
      if (!spell.correct(word)) miss.add(word)
    }

    return Array.from(miss)
  } catch (error) {
    console.error(`[Spellcheck Error] Spellcheck failed for language ${lang}:`, error)
    console.error(`[Spellcheck Error] Stack:`, error.stack)
    return [] // Return empty array instead of throwing
  }
}

export async function highlightMisspellingsInHtml(html, lang = 'auto') {
  if (!html) return html

  // Early return if spellchecking is disabled
  if (!spellcheckEnabled) {
    return html
  }

  try {
    // Decode HTML entities for spellchecking, but preserve original HTML
    const textForSpellcheck = html
      .replace(/<[^>]+>/g, ' ') // strip tags
      .replace(/&nbsp;/g, ' ') // convert non-breaking spaces to regular spaces
      .replace(/&[a-zA-Z0-9#]+;/g, ' ') // remove other HTML entities
      .replace(/\s+/g, ' ') // normalize whitespace
      .trim()

    const browserLang = getBrowserSpellcheckLanguage()
    const spellcheckLang = getSpellcheckLanguage()
    const detectedLang = lang === 'auto' ? detectLanguage(textForSpellcheck, browserLang, spellcheckLang) : lang

    // Check if dictionary is available
    if (!AVAILABLE_DICTIONARIES[detectedLang]) {
      console.warn(`Dictionary not available for ${detectedLang}, skipping spellcheck`)
      return html // Return original HTML without spellcheck
    }

    const miss = await findMisspellings(textForSpellcheck, detectedLang)
    if (miss.length === 0) return html

    // Replace whole-word occurrences with span wrapper. Do not touch inside tags or HTML entities
    // We split on tags and HTML entities, only operate on text segments.
    const segments = html.split(/(<[^>]+>|&[a-zA-Z0-9#]+;)/g)
    const wrapped = segments.map(seg => {
      if (/^<[^>]+>$/.test(seg) || /^&[a-zA-Z0-9#]+;$/.test(seg)) {
        return seg // tag or HTML entity segment - leave unchanged
      }
      let out = seg
      for (const m of miss) {
        // Use Unicode-aware boundaries: ensure preceding/following chars are not letters
        const re = new RegExp(`(?<!\\p{L})${escapeRegExp(m)}(?!\\p{L})`, 'gu')
        out = out.replace(re, `<span class="spell-error">$&</span>`)
      }
      return out
    })
    return wrapped.join('')
  } catch (error) {
    console.warn('Spellcheck failed, returning original HTML:', error)
    return html // Return original HTML without any modifications
  }
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
