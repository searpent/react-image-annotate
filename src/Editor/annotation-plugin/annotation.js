/**
 * Build styles
 */
import './annotation.css';

export function whitespaceCharactersToHTML(str = '') {
  return str
    // new line whitespace
    .replaceAll(/[ ]\n[ ]/gm, '&nbsp;<br>&nbsp;') // space both sides adds &nbsp;
    .replaceAll(/\n[ ]/gm, '<br>&nbsp;') // space right side adds &nbsp;
    .replaceAll(/[ ]\n/gm, '&nbsp;<br>') // space left side adds &nbsp;
    .replaceAll(/\n/gm, '<br>') // no spaces
    // tab whitespace
    .replaceAll(/\t/gm, '&nbsp;&nbsp;&nbsp;&nbsp;') // no spaces
}

function HTMLToWhitespaceCharacters(str = '') {
  return str
    .replaceAll(/((&nbsp;|\s){4})/gm, '\t')
    .replaceAll('&nbsp;', ' ')
    .replaceAll('<br>', '\n') // new line whitespace
}


// Possible classes
// ================

class Annotation {
  /**
   * Render plugin`s main Element and fill it with saved data
   *
   * @param {{data: HeaderData, config: HeaderConfig, api: object}}
   *   data — previously saved data
   *   config - user config for Tool
   *   api - Editor.js API
   *   readOnly - read only mode flag
   */
  constructor({ data, config, api, readOnly }) {
    this.api = api;
    this.readOnly = readOnly;

    /**
     * Styles
     *
     * @type {object}
     */
    this._CSS = {
      block: this.api.styles.block,
      settingsButton: this.api.styles.settingsButton,
      settingsButtonActive: this.api.styles.settingsButtonActive,
      wrapper: 'ce-header',
      backgroundColor: (data?.highlighted && data?.clsColor) ? data.clsColor : undefined,
    };

    /**
     * Tool's settings passed from Editor
     *
     * @type {HeaderConfig}
     * @private
     */
    this._settings = config;

    /**
     * Block's data
     *
     * @type {HeaderData}
     * @private
     */
    this._data = this.normalizeData(data);

    /**
     * List of settings buttons
     *
     * @type {HTMLElement[]}
     */
    this.settingsButtons = [];

    /**
     * Main Block wrapper
     *
     * @type {HTMLElement}
     * @private
     */
    this._element = this.getTag();
  }

  /**
   * Normalize input data
   *
   * @param {HeaderData} data - saved data to process
   *
   * @returns {HeaderData}
   * @private
   */
  normalizeData(data) {
    const newData = {};

    if (typeof data !== 'object') {
      data = {};
    }

    newData.text = whitespaceCharactersToHTML(data.text)
    newData.labelName = data.labelName || this.defaultLabel.labelName;

    return newData;
  }

  /**
   * Return Tool's view
   *
   * @returns {HTMLHeadingElement}
   * @public
   */
  render() {
    return this._element;
  }

  /**
   * Create Block's settings block
   *
   * @returns {HTMLElement}
   */
  renderSettings() {
    const holder = document.createElement('DIV');

    // do not add settings button, when only one label is configured
    if (this.labels.length <= 1) {
      return holder;
    }

    /** Add type selectors */
    this.labels.forEach(label => {
      const selectTypeButton = document.createElement('DIV');

      selectTypeButton.classList.add(this._CSS.settingsButton);

      /**
       * Highlight current label button
       */
      if (this.currentLabel.labelName === label.labelName) {
        selectTypeButton.classList.add(this._CSS.settingsButtonActive);
      }

      /**
       * Add SVG icon
       */
      selectTypeButton.innerHTML = `${label.labelName}`;

      /**
       * Save label to its button
       */
      selectTypeButton.dataset.labelName = label.labelName;

      /**
       * Set up click handler
       */
      selectTypeButton.addEventListener('click', () => {
        this.setLabelName(label.labelName);
      });

      /**
       * Append settings button to holder
       */
      holder.appendChild(selectTypeButton);

      /**
       * Save settings buttons
       */
      this.settingsButtons.push(selectTypeButton);
    });

    return holder;
  }

  /**
   * Callback for Block's settings buttons
   *
   * @param {labelName} labelName - labelName to set
   */
  setLabelName(labelName) {
    this.data = {
      labelName,
      text: this.data.text
    };

    /**
     * Highlight button by selected labelName
     */
    this.settingsButtons.forEach(button => {
      button.classList.toggle(
        this._CSS.settingsButtonActive,
        button.dataset.labelName === labelName
      );
    });
  }

  /**
   * Method that specified how to merge two Text blocks.
   * Called by Editor.js by backspace at the beginning of the Block
   *
   * @param {HeaderData} data - saved data to merger with current block
   * @public
   */
  merge(data) {
    const newData = {
      text: this.data.text + data.text,
      labelName: this.data.labelName
    };

    this.data = newData;
  }

  /**
   * Validate Text block data:
   * - check for emptiness
   *
   * @param {HeaderData} blockData — data received after saving
   * @returns {boolean} false if saved data is not correct, otherwise true
   * @public
   */
  validate(blockData) {
    return blockData.text.trim() !== '';
  }

  /**
   * Extract Tool's data from the view
   *
   * @param {HTMLHeadingElement} toolsContent - Text tools rendered view
   * @returns {HeaderData} - saved data
   * @public
   */
  save(toolsContent) {
    return {
      text: HTMLToWhitespaceCharacters(toolsContent.innerHTML),
      labelName: this.currentLabel.labelName
    };
  }

  /**
   * Allow Header to be converted to/from other blocks
   */
  static get conversionConfig() {
    return {
      export: 'text', // use 'text' property for other blocks
      import: 'text' // fill 'text' property from other block's export string
    };
  }

  /**
   * Sanitizer Rules
   */
  static get sanitize() {
    return {
      labelName: false,
      text: {}
    };
  }

  /**
   * Returns true to notify core that read-only is supported
   *
   * @returns {boolean}
   */
  static get isReadOnlySupported() {
    return true;
  }

  /**
   * Get current Tools`s data
   *
   * @returns {HeaderData} Current data
   * @private
   */
  get data() {
    this._data.text = this._element.innerHTML;
    this._data.labelName = this.currentLabel.labelName;

    return this._data;
  }

  /**
   * Store data in plugin:
   * - at the this._data property
   * - at the HTML
   *
   * @param {HeaderData} data — data to set
   * @private
   */
  set data(data) {
    this._data = this.normalizeData(data);

    /**
     * If labelName is set and block in DOM
     * then replace it to a new block
     */
    if (data.labelName !== undefined && this._element.parentNode) {
      /**
       * Create a new tag
       *
       * @type {HTMLHeadingElement}
       */
      const newHeader = this.getTag();

      /**
       * Save Block's content
       */
      newHeader.innerHTML = this._element.innerHTML;

      /**
       * Replace blocks
       */
      this._element.parentNode.replaceChild(newHeader, this._element);

      /**
       * Save new block to private variable
       *
       * @type {HTMLHeadingElement}
       * @private
       */
      this._element = newHeader;
    }

    /**
     * If data.text was passed then update block's content
     */
    if (data.text !== undefined) {
      this._element.innerHTML = this._data.text || '';
    }
  }

  /**
   * Get tag for target label
   * By default returns second-labelled header
   *
   * @returns {HTMLElement}
   */
  getTag() {
    /**
     * Create element for current Block's label
     */
    const tag = document.createElement(this.currentLabel.tag);
    if (this._CSS.backgroundColor) {
      tag.style.backgroundColor = this._CSS.backgroundColor
    }

    /**
     * Add text to block
     */
    tag.innerHTML = this._data.text || '';

    /**
     * Add styles class
     */
    tag.classList.add(this._CSS.wrapper);

    /**
     * Make tag editable
     */
    tag.contentEditable = this.readOnly ? 'false' : 'true';

    /**
     * Add Placeholder
     */
    tag.dataset.placeholder = this.api.i18n.t(this._settings.placeholder || '');

    /**
     * Add spellcheck
     */
    tag.spellcheck = 'true'

    return tag;
  }

  /**
   * Get current label
   *
   * @returns {label}
   */
  get currentLabel() {
    let label = this.labels.find(
      labelItem => labelItem.labelName === this._data.labelName
    );

    if (!label) {
      label = this.defaultLabel;
    }

    return label;
  }

  /**
   * Return default label
   *
   * @returns {label}
   */
  get defaultLabel() {
    /**
     * User can specify own default label value
     */
    if (this._settings.defaultLabel) {
      const userSpecified = this.labels.find(labelItem => {
        return labelItem.labelName === this._settings.defaultLabel;
      });

      if (userSpecified) {
        return userSpecified;
      }
      console.warn(
        "(ง'̀-'́)ง Annotation Tool: the default label specified was not found in available labels"
      );
    }

    /**
     * With no additional options, there will be H2 by default
     *
     * @type {label}
     */
    return this.labels[1];
  }

  /**
   * @typedef {object} label
   * @property {labelName} labelName - label labelName
   * @property {string} tag - tag corresponds with label labelName
   * @property {string} svg - icon
   */

  /**
   * Available header labels
   *
   * @returns {label[]}
   */
  get labels() {
    const availableLabels = [
      {
        labelName: 'title',
        tag: 'h1',
        name: 'title',
        backgroundColor: '#ffcccc'
      },
      { labelName: 'subtitle', tag: 'h2', name: 'subtitle', backgroundColor: '#ffccff' },
      { labelName: 'text', tag: 'p', name: 'text', backgroundColor: '#14deef' },
      { labelName: 'author', tag: 'i', name: 'author', backgroundColor: '#00bb00' },
      { labelName: 'appendix', tag: 'p', name: 'appendix', backgroundColor: '#dcfcec' },
      { labelName: 'photo_author', tag: 'p', name: 'photo_author', backgroundColor: '#bb0000' },
      { labelName: 'photo_caption', tag: 'p', name: 'photo_caption', backgroundColor: '#ccffff' },
      { labelName: 'advertisement', tag: 'p', name: 'advertisement', backgroundColor: '#ffeccc' },
      { labelName: 'other_graphics', tag: 'p', name: 'other_graphics', backgroundColor: '#ff5400' },
      { labelName: 'unknown', tag: 's', name: 'unknown', backgroundColor: '#cccccc' },
      { labelName: 'about_author', tag: 'p', name: 'about_author', backgroundColor: '#ecffec' },
      { labelName: 'image', tag: 'p', name: 'image', backgroundColor: '#ffffcc' },
      { labelName: 'interview', tag: 'p', name: 'interview', backgroundColor: '#23b20f' },
      { labelName: 'table', tag: 'p', name: 'table', backgroundColor: '#0000bb' },
      { labelName: 'section', tag: 'p', name: 'section', backgroundColor: '#ffcccc' },
      { labelName: 'continuation_ref', backgroundColor: '#FF33CC', name: 'continuation_ref', tag: 'p' },
      { labelName: 'cover_clip', backgroundColor: '#669966', name: 'cover_clip', tag: 'p' },
      { labelName: 'page_id', backgroundColor: '#4433AA', name: 'page_id', tag: 'p' },
      { labelName: 'continuation_mark', backgroundColor: '#660066', name: 'continuation_mark', tag: 'p' },
      { labelName: 'follow_up_mark', backgroundColor: '#873e23', name: 'follow_up_mark', tag: 'p' },
      { labelName: 'article_termination_mark', backgroundColor: '#873e23', name: 'article_termination_mark', tag: 'p' },
      { labelName: 'page_splitting_stripe', backgroundColor: '#873e23', name: 'page_splitting_stripe', tag: 'p' },
      { labelName: 'column_id_stripe', backgroundColor: '#873e23', name: 'column_id_stripe', tag: 'p' },
      { labelName: 'prev_page_reference', backgroundColor: '#f3a864', name: 'prev_page_reference', tag: 'p' },
      { labelName: 'section_subcategory', backgroundColor: '#442c55', name: 'section_subcategory', tag: 'p' },
    ];

    return this._settings.labels
      ? availableLabels.filter(l => this._settings.labels.includes(l.labelName))
      : availableLabels;
  }

  /**
   * Handle H1-H6 tags on paste to substitute it with header Tool
   *
   * @param {PasteEvent} event - event with pasted content
   */
  onPaste(event) {
    const content = event.detail.data;

    /**
     * Define default label value
     *
     * @type {labelName}
     */
    let { labelName } = this.defaultLabel;

    switch (content.tagName) {
      case 'H1':
        labelName = 1;
        break;
      case 'H2':
        labelName = 2;
        break;
      case 'H3':
        labelName = 3;
        break;
      case 'H4':
        labelName = 4;
        break;
      case 'H5':
        labelName = 5;
        break;
      case 'H6':
        labelName = 6;
        break;
    }

    // if (this._settings.labels) {
    //   // Fallback to nearest label when specified not available
    //   label = this._settings.labels.reduce((prevLabel, currLabel) => {
    //     return Math.abs(currLabel - label) < Math.abs(prevLabel - label)
    //       ? currLabel
    //       : prevLabel;
    //   });
    // }

    this.data = {
      labelName,
      text: content.innerHTML
    };
  }

  /**
   * Used by Editor.js paste handling API.
   * Provides configuration to handle H1-H6 tags.
   *
   * @returns {{handler: (function(HTMLElement): {text: string}), tags: string[]}}
   */
  static get pasteConfig() {
    return {
      tags: ['H1', 'H2', 'H3', 'H4', 'H5', 'H6']
    };
  }

  /**
   * Get Tool toolbox settings
   * icon - Tool icon's SVG
   * title - title to show in toolbox
   *
   * @returns {{icon: string, title: string}}
   */
  static get toolbox() {
    return {
      icon:
        '<svg width="17" height="15" viewBox="0 0 336 276" xmlns="http://www.w3.org/2000/svg"><path d="M291 150V79c0-19-15-34-34-34H79c-19 0-34 15-34 34v42l67-44 81 72 56-29 42 30zm0 52l-43-30-56 30-81-67-66 39v23c0 19 15 34 34 34h178c17 0 31-13 34-29zM79 0h178c44 0 79 35 79 79v118c0 44-35 79-79 79H79c-44 0-79-35-79-79V79C0 35 35 0 79 0z"/></svg>',
      title: 'Annotation'
    };
  }
}

export default Annotation;