/**
 * TableOfContents - Represents a Table of Contents in a Word document
 *
 * A TOC is a special field that automatically generates a list of headings
 * based on heading styles (Heading1, Heading2, etc.) in the document.
 */

import { XMLElement } from '../xml/XMLBuilder';

/**
 * TOC properties
 */
export interface TOCProperties {
  /** Title for the TOC (default: "Table of Contents") */
  title?: string;
  /** Heading levels to include (1-9, default: 1-3) */
  levels?: number;
  /** Specific styles to include (overrides levels if provided) */
  includeStyles?: string[];
  /** Whether to show page numbers (default: true) */
  showPageNumbers?: boolean;
  /** Whether to right-align page numbers (default: true) */
  rightAlignPageNumbers?: boolean;
  /** Whether to use hyperlinks instead of page numbers (default: false) */
  useHyperlinks?: boolean;
  /** Custom TOC style (default: built-in TOC style) */
  style?: string;
  /** Tab leader character (default: dot) */
  tabLeader?: 'dot' | 'hyphen' | 'underscore' | 'none';
  /** Custom field switches */
  fieldSwitches?: string;
  /** Whether TOC entries should be numbered (default: false) */
  numbered?: boolean;
  /** Numbering format for TOC entries */
  numberingFormat?: 'decimal' | 'roman' | 'alpha';
  /** Remove all indentation from TOC entries (default: false) */
  noIndent?: boolean;
  /** Custom indents for each TOC level in twips */
  customIndents?: number[];
  /** Space between TOC entries in twips (default: 0) */
  spaceBetweenEntries?: number;
  /** Hyperlink color in hex format without # (default: 0000FF) */
  hyperlinkColor?: string;
}

/**
 * Represents a Table of Contents
 */
export class TableOfContents {
  private title: string;
  private levels: number;
  private includeStyles?: string[];
  private showPageNumbers: boolean;
  private useHyperlinks: boolean;
  private tabLeader: 'dot' | 'hyphen' | 'underscore' | 'none';
  private fieldSwitches?: string;
  private numbered: boolean;
  private numberingFormat: 'decimal' | 'roman' | 'alpha';
  private noIndent: boolean;
  private customIndents?: number[];
  private spaceBetweenEntries: number;
  private hyperlinkColor: string;

  /**
   * Creates a new Table of Contents
   * @param properties TOC properties
   */
  constructor(properties: TOCProperties = {}) {
    this.title = properties.title || 'Table of Contents';
    this.levels = properties.levels || 3;
    this.includeStyles = properties.includeStyles;
    this.showPageNumbers = properties.showPageNumbers !== false;
    this.useHyperlinks = properties.useHyperlinks || false;
    this.tabLeader = properties.tabLeader || 'dot';
    this.fieldSwitches = properties.fieldSwitches;
    this.numbered = properties.numbered || false;
    this.numberingFormat = properties.numberingFormat || 'decimal';
    this.noIndent = properties.noIndent || false;
    this.customIndents = properties.customIndents;
    this.spaceBetweenEntries = properties.spaceBetweenEntries || 0;
    this.hyperlinkColor = properties.hyperlinkColor || '0000FF';
  }

  /**
   * Gets the TOC title
   */
  getTitle(): string {
    return this.title;
  }

  /**
   * Sets the TOC title
   */
  setTitle(title: string): this {
    this.title = title;
    return this;
  }

  /**
   * Gets the number of heading levels to include
   */
  getLevels(): number {
    return this.levels;
  }

  /**
   * Sets the number of heading levels to include (1-9)
   */
  setLevels(levels: number): this {
    if (levels < 1 || levels > 9) {
      throw new Error('TOC levels must be between 1 and 9');
    }
    this.levels = levels;
    return this;
  }

  /**
   * Gets whether page numbers are shown
   */
  getShowPageNumbers(): boolean {
    return this.showPageNumbers;
  }

  /**
   * Sets whether to show page numbers
   */
  setShowPageNumbers(show: boolean): this {
    this.showPageNumbers = show;
    return this;
  }

  /**
   * Gets whether to use hyperlinks
   */
  getUseHyperlinks(): boolean {
    return this.useHyperlinks;
  }

  /**
   * Sets whether to use hyperlinks instead of page numbers
   */
  setUseHyperlinks(use: boolean): this {
    this.useHyperlinks = use;
    return this;
  }

  /**
   * Gets whether TOC entries are numbered
   */
  getNumbered(): boolean {
    return this.numbered;
  }

  /**
   * Gets the numbering format
   */
  getNumberingFormat(): 'decimal' | 'roman' | 'alpha' {
    return this.numberingFormat;
  }

  /**
   * Gets whether indentation is removed
   */
  getNoIndent(): boolean {
    return this.noIndent;
  }

  /**
   * Gets custom indents
   */
  getCustomIndents(): number[] | undefined {
    return this.customIndents;
  }

  /**
   * Gets spacing between entries
   */
  getSpaceBetweenEntries(): number {
    return this.spaceBetweenEntries;
  }

  /**
   * Gets hyperlink color
   */
  getHyperlinkColor(): string {
    return this.hyperlinkColor;
  }

  /**
   * Gets specific included styles
   */
  getIncludeStyles(): string[] | undefined {
    return this.includeStyles;
  }

  /**
   * Builds the TOC field instruction string
   */
  private buildFieldInstruction(): string {
    let instruction = 'TOC';

    // Add specific styles switch OR heading levels switch
    if (this.includeStyles && this.includeStyles.length > 0) {
      // Use \t switch to specify exact styles
      const stylesString = this.includeStyles.map(s => `"${s}",1`).join(' ');
      instruction += ` \\t ${stylesString}`;
    } else {
      // Use \o switch for heading levels
      instruction += ` \\o "1-${this.levels}"`;
    }

    // Add hyperlinks switch if enabled
    if (this.useHyperlinks) {
      instruction += ' \\h';
    }

    // Add page number switches
    if (!this.showPageNumbers) {
      instruction += ' \\n';
    }

    // Add tab leader switch
    if (this.tabLeader !== 'dot') {
      const leaderMap = {
        hyphen: 'h',
        underscore: 'u',
        none: 'n',
      };
      instruction += ` \\p "${leaderMap[this.tabLeader as keyof typeof leaderMap]}"`;
    }

    // Add custom field switches
    if (this.fieldSwitches) {
      instruction += ` ${this.fieldSwitches}`;
    }

    // Add MERGEFORMAT to preserve formatting
    instruction += ' \\* MERGEFORMAT';

    return instruction;
  }

  /**
   * Generates XML for the TOC field
   *
   * A TOC in Word is represented as:
   * 1. A paragraph with the title (styled as TOC Heading)
   * 2. A complex field (fldChar) with the TOC instruction (begin → separate → end)
   * 3. Placeholder entries (updated by Word when opening)
   *
   * Per ECMA-376 Part 1 §17.16.5: All complex fields MUST have
   * begin → instrText → separate → content → end structure.
   * Missing any of these causes Word to reject the document as corrupted.
   *
   * @throws Error if field structure cannot be generated completely
   */
  toXML(): XMLElement[] {
    const elements: XMLElement[] = [];

    // 1. Title paragraph
    if (this.title) {
      elements.push({
        name: 'w:p',
        children: [
          {
            name: 'w:pPr',
            children: [
              {
                name: 'w:pStyle',
                attributes: { 'w:val': 'TOCHeading' },
                selfClosing: true,
              },
            ],
          },
          {
            name: 'w:r',
            children: [
              {
                name: 'w:t',
                children: [this.title],
              },
            ],
          },
        ],
      });
    }

    // 2. TOC field paragraph - CRITICAL: Must have complete begin → separate → end structure
    const tocParagraph: XMLElement = {
      name: 'w:p',
      children: [],
    };

    // FIELD BEGIN (required)
    tocParagraph.children!.push({
      name: 'w:r',
      children: [
        {
          name: 'w:fldChar',
          attributes: { 'w:fldCharType': 'begin' },
          selfClosing: true,
        },
      ],
    });

    // FIELD INSTRUCTION (required)
    tocParagraph.children!.push({
      name: 'w:r',
      children: [
        {
          name: 'w:instrText',
          attributes: { 'xml:space': 'preserve' },
          children: [this.buildFieldInstruction()],
        },
      ],
    });

    // FIELD SEPARATE (required - marks boundary between instruction and result)
    tocParagraph.children!.push({
      name: 'w:r',
      children: [
        {
          name: 'w:fldChar',
          attributes: { 'w:fldCharType': 'separate' },
          selfClosing: true,
        },
      ],
    });

    // FIELD CONTENT (placeholder - Word updates on open)
    tocParagraph.children!.push({
      name: 'w:r',
      children: [
        {
          name: 'w:rPr',
          children: [
            {
              name: 'w:noProof',
              selfClosing: true,
            },
          ],
        },
        {
          name: 'w:t',
          children: ['Right-click to update field.'],
        },
      ],
    });

    // FIELD END (CRITICAL - REQUIRED by ECMA-376 §17.16.5)
    // Missing this causes Word to treat document as corrupted
    tocParagraph.children!.push({
      name: 'w:r',
      children: [
        {
          name: 'w:fldChar',
          attributes: { 'w:fldCharType': 'end' },
          selfClosing: true,
        },
      ],
    });

    // Validate complete structure before returning
    if (tocParagraph.children!.length !== 5) {
      throw new Error(
        `CRITICAL: TOC field structure incomplete. Expected 5 elements ` +
        `(begin, instruction, separate, content, end), got ${tocParagraph.children!.length}. ` +
        `This would create an invalid OpenXML document per ECMA-376 §17.16.5.`
      );
    }

    elements.push(tocParagraph);

    return elements;
  }

  /**
   * Creates a standard TOC with 3 levels
   */
  static createStandard(title?: string): TableOfContents {
    return new TableOfContents({
      title: title || 'Table of Contents',
      levels: 3,
      showPageNumbers: true,
      rightAlignPageNumbers: true,
    });
  }

  /**
   * Creates a simple TOC with 2 levels
   */
  static createSimple(title?: string): TableOfContents {
    return new TableOfContents({
      title: title || 'Contents',
      levels: 2,
      showPageNumbers: true,
      rightAlignPageNumbers: true,
    });
  }

  /**
   * Creates a detailed TOC with 4 levels
   */
  static createDetailed(title?: string): TableOfContents {
    return new TableOfContents({
      title: title || 'Table of Contents',
      levels: 4,
      showPageNumbers: true,
      rightAlignPageNumbers: true,
    });
  }

  /**
   * Creates a hyperlinked TOC (for web documents)
   */
  static createHyperlinked(title?: string): TableOfContents {
    return new TableOfContents({
      title: title || 'Contents',
      levels: 3,
      showPageNumbers: false,
      useHyperlinks: true,
    });
  }

  /**
   * Creates a TOC with custom properties
   */
  static create(properties?: TOCProperties): TableOfContents {
    return new TableOfContents(properties);
  }

  /**
   * Sets specific styles to include in TOC (overrides levels)
   * @param styles - Array of style names (e.g., ['Heading1', 'Heading3'])
   * @returns This TOC for chaining
   */
  setIncludeStyles(styles: string[]): this {
    this.includeStyles = styles;
    return this;
  }

  /**
   * Sets whether TOC entries should be numbered
   * @param numbered - Whether to number entries
   * @param format - Numbering format (decimal, roman, alpha)
   * @returns This TOC for chaining
   */
  setNumbered(numbered: boolean, format: 'decimal' | 'roman' | 'alpha' = 'decimal'): this {
    this.numbered = numbered;
    this.numberingFormat = format;
    return this;
  }

  /**
   * Sets whether to remove indentation from TOC entries
   * @param noIndent - Whether to remove indentation
   * @returns This TOC for chaining
   */
  setNoIndent(noIndent: boolean): this {
    this.noIndent = noIndent;
    return this;
  }

  /**
   * Sets custom indents for each TOC level
   * @param indents - Array of indent values in twips
   * @returns This TOC for chaining
   */
  setCustomIndents(indents: number[]): this {
    this.customIndents = indents;
    return this;
  }

  /**
   * Sets spacing between TOC entries
   * @param spacing - Spacing in twips
   * @returns This TOC for chaining
   */
  setSpaceBetweenEntries(spacing: number): this {
    this.spaceBetweenEntries = spacing;
    return this;
  }

  /**
   * Sets hyperlink color for TOC entries
   * @param color - Hex color without # (e.g., '0000FF' for blue)
   * @returns This TOC for chaining
   */
  setHyperlinkColor(color: string): this {
    this.hyperlinkColor = color;
    return this;
  }

  /**
   * Configures multiple properties at once
   * @param options - Partial TOC properties to apply
   * @returns This TOC for chaining
   */
  configure(options: Partial<TOCProperties>): this {
    if (options.title !== undefined) this.title = options.title;
    if (options.levels !== undefined) this.levels = options.levels;
    if (options.includeStyles !== undefined) this.includeStyles = options.includeStyles;
    if (options.showPageNumbers !== undefined) this.showPageNumbers = options.showPageNumbers;
    if (options.useHyperlinks !== undefined) this.useHyperlinks = options.useHyperlinks;
    if (options.tabLeader !== undefined) this.tabLeader = options.tabLeader;
    if (options.fieldSwitches !== undefined) this.fieldSwitches = options.fieldSwitches;
    if (options.numbered !== undefined) this.numbered = options.numbered;
    if (options.numberingFormat !== undefined) this.numberingFormat = options.numberingFormat;
    if (options.noIndent !== undefined) this.noIndent = options.noIndent;
    if (options.customIndents !== undefined) this.customIndents = options.customIndents;
    if (options.spaceBetweenEntries !== undefined) this.spaceBetweenEntries = options.spaceBetweenEntries;
    if (options.hyperlinkColor !== undefined) this.hyperlinkColor = options.hyperlinkColor;
    return this;
  }

  /**
   * Creates a TOC with specific styles
   * @param styles - Array of style names to include
   * @param options - Additional TOC options
   * @returns New TableOfContents instance
   */
  static createWithStyles(styles: string[], options?: Partial<TOCProperties>): TableOfContents {
    return new TableOfContents({
      ...options,
      includeStyles: styles,
    });
  }

  /**
   * Creates a flat (no indent) TOC
   * @param title - Optional TOC title
   * @param styles - Optional specific styles (default: all heading levels)
   * @returns New TableOfContents instance
   */
  static createFlat(title?: string, styles?: string[]): TableOfContents {
    return new TableOfContents({
      title: title || 'Contents',
      includeStyles: styles,
      noIndent: true,
      spaceBetweenEntries: 100, // Small spacing for flat TOC
    });
  }

  /**
   * Creates a numbered TOC
   * @param title - Optional TOC title
   * @param format - Numbering format (decimal, roman, alpha)
   * @returns New TableOfContents instance
   */
  static createNumbered(title?: string, format: 'decimal' | 'roman' | 'alpha' = 'decimal'): TableOfContents {
    return new TableOfContents({
      title: title || 'Table of Contents',
      numbered: true,
      numberingFormat: format,
    });
  }

  /**
   * Creates a TOC with custom spacing
   * @param spaceBetweenEntries - Spacing in twips
   * @param options - Additional TOC options
   * @returns New TableOfContents instance
   */
  static createWithSpacing(spaceBetweenEntries: number, options?: Partial<TOCProperties>): TableOfContents {
    return new TableOfContents({
      ...options,
      spaceBetweenEntries,
    });
  }

  /**
   * Creates a TOC with custom hyperlink color
   * @param color - Hex color without # (e.g., '0000FF' for blue)
   * @param options - Additional TOC options
   * @returns New TableOfContents instance
   */
  static createWithHyperlinkColor(color: string, options?: Partial<TOCProperties>): TableOfContents {
    return new TableOfContents({
      ...options,
      hyperlinkColor: color,
    });
  }
}
