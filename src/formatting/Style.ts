/**
 * Style - Represents a style definition in a Word document
 * Supports paragraph, character, table, and numbering styles
 */

import { XMLBuilder, XMLElement } from '../xml/XMLBuilder';
import { ParagraphFormatting } from '../elements/Paragraph';
import { RunFormatting } from '../elements/Run';

/**
 * Style type
 */
export type StyleType = 'paragraph' | 'character' | 'table' | 'numbering';

/**
 * Table alignment
 */
export type TableAlignment = 'left' | 'center' | 'right';

/**
 * Border properties
 */
export interface BorderProperties {
  /** Border style */
  style?: 'none' | 'single' | 'double' | 'dashed' | 'dotted' | 'thick';
  /** Border size in eighths of a point */
  size?: number;
  /** Border spacing/padding in points */
  space?: number;
  /** Border color (hex without #) */
  color?: string;
}

/**
 * Table borders (6 possible borders)
 */
export interface TableBorders {
  top?: BorderProperties;
  bottom?: BorderProperties;
  left?: BorderProperties;
  right?: BorderProperties;
  /** Inside horizontal borders */
  insideH?: BorderProperties;
  /** Inside vertical borders */
  insideV?: BorderProperties;
}

/**
 * Cell borders (8 possible borders, includes diagonals)
 */
export interface CellBorders extends TableBorders {
  /** Top-left to bottom-right diagonal */
  tl2br?: BorderProperties;
  /** Top-right to bottom-left diagonal */
  tr2bl?: BorderProperties;
}

/**
 * Shading properties
 */
export interface ShadingProperties {
  /** Background fill color (hex without #) */
  fill?: string;
  /** Foreground color for patterns (hex without #) */
  color?: string;
  /** Shading pattern */
  val?: 'clear' | 'solid' | 'pct5' | 'pct10' | 'pct20' | 'pct25'
       | 'pct30' | 'pct40' | 'pct50' | 'pct60' | 'pct70' | 'pct75'
       | 'pct80' | 'pct90' | 'diagStripe' | 'horzStripe' | 'vertStripe'
       | 'reverseDiagStripe' | 'horzCross' | 'diagCross';
}

/**
 * Cell margins
 */
export interface CellMargins {
  /** Top margin in twips */
  top?: number;
  /** Bottom margin in twips */
  bottom?: number;
  /** Left margin in twips */
  left?: number;
  /** Right margin in twips */
  right?: number;
}

/**
 * Table-level formatting properties (tblPr)
 */
export interface TableStyleFormatting {
  /** Table indentation from left margin in twips */
  indent?: number;
  /** Default cell spacing in twips */
  cellSpacing?: number;
  /** Table borders */
  borders?: TableBorders;
  /** Default cell margins */
  cellMargins?: CellMargins;
  /** Table background shading */
  shading?: ShadingProperties;
  /** Table alignment */
  alignment?: TableAlignment;
}

/**
 * Table cell formatting properties (tcPr)
 */
export interface TableCellStyleFormatting {
  /** Cell borders (8 possible borders) */
  borders?: CellBorders;
  /** Cell background shading */
  shading?: ShadingProperties;
  /** Cell-specific margins */
  margins?: CellMargins;
  /** Vertical alignment in cell */
  verticalAlignment?: 'top' | 'center' | 'bottom';
}

/**
 * Table row formatting properties (trPr)
 */
export interface TableRowStyleFormatting {
  /** Prevent row from splitting across pages */
  cantSplit?: boolean;
  /** Mark row as header row */
  isHeader?: boolean;
  /** Row height in twips */
  height?: number;
  /** Row height rule */
  heightRule?: 'auto' | 'exact' | 'atLeast';
}

/**
 * Conditional formatting type for table regions
 */
export type ConditionalFormattingType =
  | 'wholeTable'   // Entire table
  | 'firstRow'     // First row
  | 'lastRow'      // Last row
  | 'firstCol'     // First column
  | 'lastCol'      // Last column
  | 'band1Vert'    // Odd column banding
  | 'band2Vert'    // Even column banding
  | 'band1Horz'    // Odd row banding
  | 'band2Horz'    // Even row banding
  | 'nwCell'       // Northwest (top-left) corner cell
  | 'neCell'       // Northeast (top-right) corner cell
  | 'swCell'       // Southwest (bottom-left) corner cell
  | 'seCell';      // Southeast (bottom-right) corner cell

/**
 * Conditional table formatting for a specific region
 */
export interface ConditionalTableFormatting {
  /** Region type */
  type: ConditionalFormattingType;
  /** Paragraph formatting for this region */
  paragraphFormatting?: ParagraphFormatting;
  /** Run formatting for this region */
  runFormatting?: RunFormatting;
  /** Table formatting for this region */
  tableFormatting?: TableStyleFormatting;
  /** Cell formatting for this region */
  cellFormatting?: TableCellStyleFormatting;
  /** Row formatting for this region */
  rowFormatting?: TableRowStyleFormatting;
}

/**
 * Table style properties (Phase 5.1)
 */
export interface TableStyleProperties {
  /** Table-level formatting */
  table?: TableStyleFormatting;
  /** Default cell formatting */
  cell?: TableCellStyleFormatting;
  /** Default row formatting */
  row?: TableRowStyleFormatting;
  /** Rows per band for row banding (default 1) */
  rowBandSize?: number;
  /** Columns per band for column banding (default 1) */
  colBandSize?: number;
  /** Conditional formatting for specific table regions */
  conditionalFormatting?: ConditionalTableFormatting[];
}

/**
 * Style properties
 */
export interface StyleProperties {
  /** Unique style identifier */
  styleId: string;
  /** Display name */
  name: string;
  /** Style type */
  type: StyleType;
  /** Parent style ID for inheritance */
  basedOn?: string;
  /** Next style ID (auto-next paragraph style) */
  next?: string;
  /** Whether this is a default style */
  isDefault?: boolean;
  /** Whether this is a custom style */
  customStyle?: boolean;
  /** Paragraph formatting (for paragraph and table styles) */
  paragraphFormatting?: ParagraphFormatting;
  /** Run formatting (for character and paragraph styles) */
  runFormatting?: RunFormatting;
  /** Table style properties (for table styles only - Phase 5.1) */
  tableStyle?: TableStyleProperties;

  // Style Gallery Metadata (Phase 5.3)
  /** Quick style - show in style gallery */
  qFormat?: boolean;
  /** UI priority - sort order in style picker (0-99, lower = higher priority) */
  uiPriority?: number;
  /** Semi-hidden - hide from gallery unless in use */
  semiHidden?: boolean;
  /** Unhide when used - auto-show when applied */
  unhideWhenUsed?: boolean;
  /** Locked - prevent modification */
  locked?: boolean;
  /** Personal - user-specific style */
  personal?: boolean;
  /** Link - linked character/paragraph style ID */
  link?: string;
  /** Auto-redefine - update style from manual formatting */
  autoRedefine?: boolean;
  /** Aliases - alternative names (comma-separated) */
  aliases?: string;
}

/**
 * Represents a style definition
 */
export class Style {
  private properties: StyleProperties;

  /**
   * Creates a new Style
   * @param properties - Style properties
   */
  constructor(properties: StyleProperties) {
    this.properties = { ...properties };
  }

  /**
   * Gets the style ID
   * @returns Style ID
   */
  getStyleId(): string {
    return this.properties.styleId;
  }

  /**
   * Gets the style name
   * @returns Style name
   */
  getName(): string {
    return this.properties.name;
  }

  /**
   * Gets the style type
   * @returns Style type
   */
  getType(): StyleType {
    return this.properties.type;
  }

  /**
   * Gets all style properties
   * @returns Style properties
   */
  getProperties(): StyleProperties {
    return { ...this.properties };
  }

  /**
   * Sets the base style
   * @param styleId - Parent style ID
   * @returns This style for chaining
   */
  setBasedOn(styleId: string): this {
    this.properties.basedOn = styleId;
    return this;
  }

  /**
   * Sets the next style
   * @param styleId - Next style ID
   * @returns This style for chaining
   */
  setNext(styleId: string): this {
    this.properties.next = styleId;
    return this;
  }

  /**
   * Sets paragraph formatting
   * @param formatting - Paragraph formatting options
   * @returns This style for chaining
   */
  setParagraphFormatting(formatting: ParagraphFormatting): this {
    this.properties.paragraphFormatting = { ...formatting };
    return this;
  }

  /**
   * Sets run formatting
   * @param formatting - Run formatting options
   * @returns This style for chaining
   */
  setRunFormatting(formatting: RunFormatting): this {
    this.properties.runFormatting = { ...formatting };
    return this;
  }

  /**
   * Sets whether this is a quick style (appears in style gallery)
   * @param enabled - True to show in quick style gallery
   * @returns This style for chaining
   */
  setQFormat(enabled: boolean): this {
    this.properties.qFormat = enabled;
    return this;
  }

  /**
   * Sets the UI priority (sort order in style picker)
   * @param priority - Priority value (0-99, lower = higher priority)
   * @returns This style for chaining
   */
  setUiPriority(priority: number): this {
    if (priority < 0 || priority > 99) {
      throw new Error('UI priority must be between 0 and 99');
    }
    this.properties.uiPriority = priority;
    return this;
  }

  /**
   * Sets whether this style is semi-hidden (hidden from recommended list)
   * @param hidden - True to hide from recommended list
   * @returns This style for chaining
   */
  setSemiHidden(hidden: boolean): this {
    this.properties.semiHidden = hidden;
    return this;
  }

  /**
   * Sets whether to unhide this style when first used
   * @param enabled - True to auto-show when applied
   * @returns This style for chaining
   */
  setUnhideWhenUsed(enabled: boolean): this {
    this.properties.unhideWhenUsed = enabled;
    return this;
  }

  /**
   * Sets whether this style is locked (prevents modification)
   * @param locked - True to lock the style
   * @returns This style for chaining
   */
  setLocked(locked: boolean): this {
    this.properties.locked = locked;
    return this;
  }

  /**
   * Sets whether this is a personal style (user-specific)
   * @param personal - True to mark as personal
   * @returns This style for chaining
   */
  setPersonal(personal: boolean): this {
    this.properties.personal = personal;
    return this;
  }

  /**
   * Sets the linked style ID (for character/paragraph style linking)
   * @param styleId - ID of the linked style
   * @returns This style for chaining
   */
  setLink(styleId: string): this {
    this.properties.link = styleId;
    return this;
  }

  /**
   * Sets whether to auto-redefine this style from manual formatting
   * @param enabled - True to enable auto-redefine
   * @returns This style for chaining
   */
  setAutoRedefine(enabled: boolean): this {
    this.properties.autoRedefine = enabled;
    return this;
  }

  /**
   * Sets alternative names for this style (comma-separated)
   * @param aliases - Comma-separated list of alternative names
   * @returns This style for chaining
   */
  setAliases(aliases: string): this {
    this.properties.aliases = aliases;
    return this;
  }

  /**
   * Sets table-level formatting properties (Phase 5.1)
   * @param formatting - Table formatting options
   * @returns This style for chaining
   */
  setTableFormatting(formatting: TableStyleFormatting): this {
    if (!this.properties.tableStyle) {
      this.properties.tableStyle = {};
    }
    this.properties.tableStyle.table = { ...formatting };
    return this;
  }

  /**
   * Sets table cell formatting properties (Phase 5.1)
   * @param formatting - Cell formatting options
   * @returns This style for chaining
   */
  setTableCellFormatting(formatting: TableCellStyleFormatting): this {
    if (!this.properties.tableStyle) {
      this.properties.tableStyle = {};
    }
    this.properties.tableStyle.cell = { ...formatting };
    return this;
  }

  /**
   * Sets table row formatting properties (Phase 5.1)
   * @param formatting - Row formatting options
   * @returns This style for chaining
   */
  setTableRowFormatting(formatting: TableRowStyleFormatting): this {
    if (!this.properties.tableStyle) {
      this.properties.tableStyle = {};
    }
    this.properties.tableStyle.row = { ...formatting };
    return this;
  }

  /**
   * Sets row band size for row banding (Phase 5.1)
   * @param size - Number of rows per band (default 1)
   * @returns This style for chaining
   */
  setRowBandSize(size: number): this {
    if (!this.properties.tableStyle) {
      this.properties.tableStyle = {};
    }
    if (size < 0) {
      throw new Error('Row band size must be non-negative');
    }
    this.properties.tableStyle.rowBandSize = size;
    return this;
  }

  /**
   * Sets column band size for column banding (Phase 5.1)
   * @param size - Number of columns per band (default 1)
   * @returns This style for chaining
   */
  setColBandSize(size: number): this {
    if (!this.properties.tableStyle) {
      this.properties.tableStyle = {};
    }
    if (size < 0) {
      throw new Error('Column band size must be non-negative');
    }
    this.properties.tableStyle.colBandSize = size;
    return this;
  }

  /**
   * Adds conditional formatting for a specific table region (Phase 5.1)
   * @param conditional - Conditional formatting definition
   * @returns This style for chaining
   */
  addConditionalFormatting(conditional: ConditionalTableFormatting): this {
    if (!this.properties.tableStyle) {
      this.properties.tableStyle = {};
    }
    if (!this.properties.tableStyle.conditionalFormatting) {
      this.properties.tableStyle.conditionalFormatting = [];
    }
    this.properties.tableStyle.conditionalFormatting.push({ ...conditional });
    return this;
  }

  /**
   * Validates that this style definition is valid
   *
   * Checks:
   * - Required fields (styleId, name, type)
   * - Valid type value
   * - No circular references (basedOn != styleId)
   * - Valid formatting values
   *
   * @returns True if the style is valid, false otherwise
   */
  isValid(): boolean {
    try {
      // Required fields
      if (!this.properties.styleId || !this.properties.name || !this.properties.type) {
        return false;
      }

      // Valid type
      const validTypes: StyleType[] = ['paragraph', 'character', 'table', 'numbering'];
      if (!validTypes.includes(this.properties.type)) {
        return false;
      }

      // No circular reference
      if (this.properties.basedOn === this.properties.styleId) {
        return false;
      }

      // Check paragraph formatting if present
      if (this.properties.paragraphFormatting) {
        const pf = this.properties.paragraphFormatting;

        // Check alignment
        if (pf.alignment) {
          const validAlignments = ['left', 'center', 'right', 'justify', 'both', 'distribute'];
          if (!validAlignments.includes(pf.alignment)) {
            return false;
          }
        }

        // Check spacing values
        if (pf.spacing) {
          const spacing = pf.spacing;
          if (spacing.before !== undefined && spacing.before < 0) return false;
          if (spacing.after !== undefined && spacing.after < 0) return false;
          if (spacing.line !== undefined && spacing.line < 0) return false;
          if (spacing.lineRule && !['auto', 'exact', 'atLeast'].includes(spacing.lineRule)) {
            return false;
          }
        }

        // Check indentation values
        if (pf.indentation) {
          const ind = pf.indentation;
          // Indentation values can be negative for hanging indent
          if (ind.left !== undefined && ind.left < -100000) return false;
          if (ind.right !== undefined && ind.right < -100000) return false;
        }
      }

      // Check run formatting if present
      if (this.properties.runFormatting) {
        const rf = this.properties.runFormatting;

        // Check font size
        if (rf.size !== undefined && (rf.size <= 0 || rf.size > 1638)) {
          return false; // Max font size in Word is 1638
        }

        // Check color format (should be 6 hex characters)
        if (rf.color && !/^[0-9A-Fa-f]{6}$/.test(rf.color)) {
          return false;
        }

        // Check highlight color
        if (rf.highlight) {
          const validHighlights = [
            'black', 'blue', 'cyan', 'darkBlue', 'darkCyan', 'darkGray',
            'darkGreen', 'darkMagenta', 'darkRed', 'darkYellow', 'green',
            'lightGray', 'magenta', 'none', 'red', 'white', 'yellow'
          ];
          if (!validHighlights.includes(rf.highlight)) {
            return false;
          }
        }
      }

      // Check metadata properties (Phase 5.3)
      if (this.properties.uiPriority !== undefined) {
        if (this.properties.uiPriority < 0 || this.properties.uiPriority > 99) {
          return false;
        }
      }

      // Check linked style doesn't reference self
      if (this.properties.link === this.properties.styleId) {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }

  /**
   * Converts the style to WordprocessingML XML element
   * @returns XMLElement representing the style
   */
  toXML(): XMLElement {
    const styleAttrs: Record<string, string> = {
      'w:type': this.properties.type,
      'w:styleId': this.properties.styleId,
    };

    if (this.properties.isDefault) {
      styleAttrs['w:default'] = '1';
    }

    if (this.properties.customStyle) {
      styleAttrs['w:customStyle'] = '1';
    }

    const styleChildren: XMLElement[] = [];

    // Add style name
    styleChildren.push(XMLBuilder.wSelf('name', { 'w:val': this.properties.name }));

    // Add basedOn
    if (this.properties.basedOn) {
      styleChildren.push(XMLBuilder.wSelf('basedOn', { 'w:val': this.properties.basedOn }));
    }

    // Add next
    if (this.properties.next) {
      styleChildren.push(XMLBuilder.wSelf('next', { 'w:val': this.properties.next }));
    }

    // Add link (linked character/paragraph style)
    if (this.properties.link) {
      styleChildren.push(XMLBuilder.wSelf('link', { 'w:val': this.properties.link }));
    }

    // Add autoRedefine
    if (this.properties.autoRedefine) {
      styleChildren.push(XMLBuilder.wSelf('autoRedefine'));
    }

    // Add metadata properties (Phase 5.3)
    // qFormat - Quick style gallery appearance
    if (this.properties.qFormat !== undefined) {
      if (this.properties.qFormat) {
        styleChildren.push(XMLBuilder.wSelf('qFormat'));
      }
    } else if (!this.properties.customStyle) {
      // Default: built-in styles have qFormat
      styleChildren.push(XMLBuilder.wSelf('qFormat'));
    }

    // semiHidden - Hide from recommended list
    if (this.properties.semiHidden) {
      styleChildren.push(XMLBuilder.wSelf('semiHidden'));
    }

    // unhideWhenUsed - Auto-show when applied
    if (this.properties.unhideWhenUsed) {
      styleChildren.push(XMLBuilder.wSelf('unhideWhenUsed'));
    }

    // uiPriority - Sort order in style picker
    if (this.properties.uiPriority !== undefined) {
      styleChildren.push(XMLBuilder.wSelf('uiPriority', { 'w:val': String(this.properties.uiPriority) }));
    }

    // locked - Prevent modification
    if (this.properties.locked) {
      styleChildren.push(XMLBuilder.wSelf('locked'));
    }

    // personal - User-specific style
    if (this.properties.personal) {
      styleChildren.push(XMLBuilder.wSelf('personal'));
    }

    // aliases - Alternative names
    if (this.properties.aliases) {
      styleChildren.push(XMLBuilder.wSelf('aliases', { 'w:val': this.properties.aliases }));
    }

    // Add paragraph properties
    if (this.properties.paragraphFormatting) {
      const pPr = this.generateParagraphProperties(this.properties.paragraphFormatting);
      if (pPr.children && pPr.children.length > 0) {
        styleChildren.push(pPr);
      }
    }

    // Add run properties
    if (this.properties.runFormatting) {
      const rPr = this.generateRunProperties(this.properties.runFormatting);
      if (rPr.children && rPr.children.length > 0) {
        styleChildren.push(rPr);
      }
    }

    // Add table style properties (Phase 5.1)
    if (this.properties.tableStyle) {
      // Add tblPr (table properties)
      if (this.properties.tableStyle.table) {
        const tblPr = this.generateTableProperties(this.properties.tableStyle.table, this.properties.tableStyle);
        if (tblPr.children && tblPr.children.length > 0) {
          styleChildren.push(tblPr);
        }
      }

      // Add tcPr (table cell properties)
      if (this.properties.tableStyle.cell) {
        const tcPr = this.generateTableCellProperties(this.properties.tableStyle.cell);
        if (tcPr.children && tcPr.children.length > 0) {
          styleChildren.push(tcPr);
        }
      }

      // Add trPr (table row properties)
      if (this.properties.tableStyle.row) {
        const trPr = this.generateTableRowProperties(this.properties.tableStyle.row);
        if (trPr.children && trPr.children.length > 0) {
          styleChildren.push(trPr);
        }
      }

      // Add conditional formatting (tblStylePr)
      if (this.properties.tableStyle.conditionalFormatting) {
        for (const conditional of this.properties.tableStyle.conditionalFormatting) {
          const tblStylePr = this.generateConditionalFormatting(conditional);
          if (tblStylePr.children && tblStylePr.children.length > 0) {
            styleChildren.push(tblStylePr);
          }
        }
      }
    }

    return XMLBuilder.w('style', styleAttrs, styleChildren);
  }

  /**
   * Generates paragraph properties XML
   */
  private generateParagraphProperties(formatting: ParagraphFormatting): XMLElement {
    const pPrChildren: XMLElement[] = [];

    // Add alignment
    if (formatting.alignment) {
      // Map 'justify' to 'both' per ECMA-376 (Word uses 'both' for justified text)
      const alignmentValue = formatting.alignment === 'justify' ? 'both' : formatting.alignment;
      pPrChildren.push(XMLBuilder.wSelf('jc', { 'w:val': alignmentValue }));
    }

    // Add indentation
    if (formatting.indentation) {
      const ind = formatting.indentation;
      const attributes: Record<string, number> = {};
      if (ind.left !== undefined) attributes['w:left'] = ind.left;
      if (ind.right !== undefined) attributes['w:right'] = ind.right;
      if (ind.firstLine !== undefined) attributes['w:firstLine'] = ind.firstLine;
      if (ind.hanging !== undefined) attributes['w:hanging'] = ind.hanging;
      if (Object.keys(attributes).length > 0) {
        pPrChildren.push(XMLBuilder.wSelf('ind', attributes));
      }
    }

    // Add spacing
    if (formatting.spacing) {
      const spc = formatting.spacing;
      const attributes: Record<string, number | string> = {};
      if (spc.before !== undefined) attributes['w:before'] = spc.before;
      if (spc.after !== undefined) attributes['w:after'] = spc.after;
      if (spc.line !== undefined) attributes['w:line'] = spc.line;
      if (spc.lineRule) attributes['w:lineRule'] = spc.lineRule;
      if (Object.keys(attributes).length > 0) {
        pPrChildren.push(XMLBuilder.wSelf('spacing', attributes));
      }
    }

    // Add other properties
    if (formatting.keepNext) {
      pPrChildren.push(XMLBuilder.wSelf('keepNext'));
    }
    if (formatting.keepLines) {
      pPrChildren.push(XMLBuilder.wSelf('keepLines'));
    }
    if (formatting.pageBreakBefore) {
      pPrChildren.push(XMLBuilder.wSelf('pageBreakBefore'));
    }

    return XMLBuilder.w('pPr', undefined, pPrChildren);
  }

  /**
   * Generates run properties XML
   */
  private generateRunProperties(formatting: RunFormatting): XMLElement {
    const rPrChildren: XMLElement[] = [];

    // Add formatting elements
    if (formatting.bold) {
      rPrChildren.push(XMLBuilder.wSelf('b'));
    }
    if (formatting.italic) {
      rPrChildren.push(XMLBuilder.wSelf('i'));
    }
    if (formatting.underline) {
      const underlineValue = typeof formatting.underline === 'string'
        ? formatting.underline
        : 'single';
      rPrChildren.push(XMLBuilder.wSelf('u', { 'w:val': underlineValue }));
    }
    if (formatting.strike) {
      rPrChildren.push(XMLBuilder.wSelf('strike'));
    }
    if (formatting.dstrike) {
      rPrChildren.push(XMLBuilder.wSelf('dstrike'));
    }
    if (formatting.subscript) {
      rPrChildren.push(XMLBuilder.wSelf('vertAlign', { 'w:val': 'subscript' }));
    }
    if (formatting.superscript) {
      rPrChildren.push(XMLBuilder.wSelf('vertAlign', { 'w:val': 'superscript' }));
    }
    if (formatting.font) {
      rPrChildren.push(XMLBuilder.wSelf('rFonts', {
        'w:ascii': formatting.font,
        'w:hAnsi': formatting.font,
        'w:cs': formatting.font,
      }));
    }
    if (formatting.size !== undefined) {
      // Word uses half-points (size * 2)
      const halfPoints = formatting.size * 2;
      rPrChildren.push(XMLBuilder.wSelf('sz', { 'w:val': halfPoints }));
      rPrChildren.push(XMLBuilder.wSelf('szCs', { 'w:val': halfPoints }));
    }
    if (formatting.color) {
      rPrChildren.push(XMLBuilder.wSelf('color', { 'w:val': formatting.color }));
    }
    if (formatting.highlight) {
      rPrChildren.push(XMLBuilder.wSelf('highlight', { 'w:val': formatting.highlight }));
    }
    if (formatting.smallCaps) {
      rPrChildren.push(XMLBuilder.wSelf('smallCaps'));
    }
    if (formatting.allCaps) {
      rPrChildren.push(XMLBuilder.wSelf('caps'));
    }

    return XMLBuilder.w('rPr', undefined, rPrChildren);
  }

  /**
   * Generates table properties XML (tblPr) - Phase 5.1
   */
  private generateTableProperties(formatting: TableStyleFormatting, tableStyle: TableStyleProperties): XMLElement {
    const tblPrChildren: XMLElement[] = [];

    // Table width (defaulting to auto if not specified)
    tblPrChildren.push(
      XMLBuilder.wSelf('tblW', { 'w:w': '0', 'w:type': 'auto' })
    );

    // Table indentation
    if (formatting.indent !== undefined) {
      tblPrChildren.push(XMLBuilder.wSelf('tblInd', { 'w:w': formatting.indent, 'w:type': 'dxa' }));
    }

    // Table alignment
    if (formatting.alignment) {
      tblPrChildren.push(XMLBuilder.wSelf('jc', { 'w:val': formatting.alignment }));
    }

    // Cell spacing
    if (formatting.cellSpacing !== undefined) {
      tblPrChildren.push(
        XMLBuilder.wSelf('tblCellSpacing', { 'w:w': formatting.cellSpacing, 'w:type': 'dxa' })
      );
    }

    // Table borders
    if (formatting.borders) {
      const borderElements = this.generateBorderElements(formatting.borders, false);
      if (borderElements.length > 0) {
        tblPrChildren.push(XMLBuilder.w('tblBorders', undefined, borderElements));
      }
    }

    // Table shading
    if (formatting.shading) {
      tblPrChildren.push(this.generateShadingElement(formatting.shading));
    }

    // Cell margins
    if (formatting.cellMargins) {
      const marginElements: XMLElement[] = [];
      if (formatting.cellMargins.top !== undefined) {
        marginElements.push(XMLBuilder.wSelf('top', { 'w:w': formatting.cellMargins.top, 'w:type': 'dxa' }));
      }
      if (formatting.cellMargins.left !== undefined) {
        marginElements.push(XMLBuilder.wSelf('left', { 'w:w': formatting.cellMargins.left, 'w:type': 'dxa' }));
      }
      if (formatting.cellMargins.bottom !== undefined) {
        marginElements.push(XMLBuilder.wSelf('bottom', { 'w:w': formatting.cellMargins.bottom, 'w:type': 'dxa' }));
      }
      if (formatting.cellMargins.right !== undefined) {
        marginElements.push(XMLBuilder.wSelf('right', { 'w:w': formatting.cellMargins.right, 'w:type': 'dxa' }));
      }
      if (marginElements.length > 0) {
        tblPrChildren.push(XMLBuilder.w('tblCellMar', undefined, marginElements));
      }
    }

    // Row band size
    if (tableStyle.rowBandSize !== undefined) {
      tblPrChildren.push(XMLBuilder.wSelf('tblStyleRowBandSize', { 'w:val': tableStyle.rowBandSize }));
    }

    // Column band size
    if (tableStyle.colBandSize !== undefined) {
      tblPrChildren.push(XMLBuilder.wSelf('tblStyleColBandSize', { 'w:val': tableStyle.colBandSize }));
    }

    return XMLBuilder.w('tblPr', undefined, tblPrChildren);
  }

  /**
   * Generates table cell properties XML (tcPr) - Phase 5.1
   */
  private generateTableCellProperties(formatting: TableCellStyleFormatting): XMLElement {
    const tcPrChildren: XMLElement[] = [];

    // Cell borders
    if (formatting.borders) {
      const borderElements = this.generateBorderElements(formatting.borders, true);
      if (borderElements.length > 0) {
        tcPrChildren.push(XMLBuilder.w('tcBorders', undefined, borderElements));
      }
    }

    // Cell shading
    if (formatting.shading) {
      tcPrChildren.push(this.generateShadingElement(formatting.shading));
    }

    // Cell margins
    if (formatting.margins) {
      const marginElements: XMLElement[] = [];
      if (formatting.margins.top !== undefined) {
        marginElements.push(XMLBuilder.wSelf('top', { 'w:w': formatting.margins.top, 'w:type': 'dxa' }));
      }
      if (formatting.margins.left !== undefined) {
        marginElements.push(XMLBuilder.wSelf('left', { 'w:w': formatting.margins.left, 'w:type': 'dxa' }));
      }
      if (formatting.margins.bottom !== undefined) {
        marginElements.push(XMLBuilder.wSelf('bottom', { 'w:w': formatting.margins.bottom, 'w:type': 'dxa' }));
      }
      if (formatting.margins.right !== undefined) {
        marginElements.push(XMLBuilder.wSelf('right', { 'w:w': formatting.margins.right, 'w:type': 'dxa' }));
      }
      if (marginElements.length > 0) {
        tcPrChildren.push(XMLBuilder.w('tcMar', undefined, marginElements));
      }
    }

    // Vertical alignment
    if (formatting.verticalAlignment) {
      tcPrChildren.push(XMLBuilder.wSelf('vAlign', { 'w:val': formatting.verticalAlignment }));
    }

    return XMLBuilder.w('tcPr', undefined, tcPrChildren);
  }

  /**
   * Generates table row properties XML (trPr) - Phase 5.1
   */
  private generateTableRowProperties(formatting: TableRowStyleFormatting): XMLElement {
    const trPrChildren: XMLElement[] = [];

    // Row height
    if (formatting.height !== undefined) {
      const heightRule = formatting.heightRule || 'auto';
      trPrChildren.push(
        XMLBuilder.wSelf('trHeight', { 'w:val': formatting.height, 'w:hRule': heightRule })
      );
    }

    // Can't split row across pages
    if (formatting.cantSplit) {
      trPrChildren.push(XMLBuilder.wSelf('cantSplit'));
    }

    // Header row
    if (formatting.isHeader) {
      trPrChildren.push(XMLBuilder.wSelf('tblHeader'));
    }

    return XMLBuilder.w('trPr', undefined, trPrChildren);
  }

  /**
   * Generates conditional formatting XML (tblStylePr) - Phase 5.1
   */
  private generateConditionalFormatting(conditional: ConditionalTableFormatting): XMLElement {
    const tblStylePrChildren: XMLElement[] = [];

    // Add paragraph properties if specified
    if (conditional.paragraphFormatting) {
      const pPr = this.generateParagraphProperties(conditional.paragraphFormatting);
      if (pPr.children && pPr.children.length > 0) {
        tblStylePrChildren.push(pPr);
      }
    }

    // Add run properties if specified
    if (conditional.runFormatting) {
      const rPr = this.generateRunProperties(conditional.runFormatting);
      if (rPr.children && rPr.children.length > 0) {
        tblStylePrChildren.push(rPr);
      }
    }

    // Add table properties if specified
    if (conditional.tableFormatting) {
      const tblPr = this.generateTableProperties(conditional.tableFormatting, {});
      if (tblPr.children && tblPr.children.length > 0) {
        tblStylePrChildren.push(tblPr);
      }
    }

    // Add cell properties if specified
    if (conditional.cellFormatting) {
      const tcPr = this.generateTableCellProperties(conditional.cellFormatting);
      if (tcPr.children && tcPr.children.length > 0) {
        tblStylePrChildren.push(tcPr);
      }
    }

    // Add row properties if specified
    if (conditional.rowFormatting) {
      const trPr = this.generateTableRowProperties(conditional.rowFormatting);
      if (trPr.children && trPr.children.length > 0) {
        tblStylePrChildren.push(trPr);
      }
    }

    return XMLBuilder.w('tblStylePr', { 'w:type': conditional.type }, tblStylePrChildren);
  }

  /**
   * Generates border elements for tables or cells - Phase 5.1
   * @param borders - Border properties
   * @param includeDiagonals - Whether to include diagonal borders (for cells)
   */
  private generateBorderElements(borders: TableBorders | CellBorders, includeDiagonals: boolean): XMLElement[] {
    const borderElements: XMLElement[] = [];

    const borderProps = ['top', 'bottom', 'left', 'right', 'insideH', 'insideV'] as const;
    for (const prop of borderProps) {
      const border = borders[prop];
      if (border) {
        const attrs: Record<string, string | number> = {};
        if (border.style) attrs['w:val'] = border.style;
        if (border.size !== undefined) attrs['w:sz'] = border.size;
        if (border.space !== undefined) attrs['w:space'] = border.space;
        if (border.color) attrs['w:color'] = border.color;

        if (Object.keys(attrs).length > 0) {
          borderElements.push(XMLBuilder.wSelf(prop, attrs));
        }
      }
    }

    // Add diagonal borders for cells
    if (includeDiagonals) {
      const cellBorders = borders as CellBorders;
      if (cellBorders.tl2br) {
        const attrs: Record<string, string | number> = {};
        if (cellBorders.tl2br.style) attrs['w:val'] = cellBorders.tl2br.style;
        if (cellBorders.tl2br.size !== undefined) attrs['w:sz'] = cellBorders.tl2br.size;
        if (cellBorders.tl2br.space !== undefined) attrs['w:space'] = cellBorders.tl2br.space;
        if (cellBorders.tl2br.color) attrs['w:color'] = cellBorders.tl2br.color;

        if (Object.keys(attrs).length > 0) {
          borderElements.push(XMLBuilder.wSelf('tl2br', attrs));
        }
      }
      if (cellBorders.tr2bl) {
        const attrs: Record<string, string | number> = {};
        if (cellBorders.tr2bl.style) attrs['w:val'] = cellBorders.tr2bl.style;
        if (cellBorders.tr2bl.size !== undefined) attrs['w:sz'] = cellBorders.tr2bl.size;
        if (cellBorders.tr2bl.space !== undefined) attrs['w:space'] = cellBorders.tr2bl.space;
        if (cellBorders.tr2bl.color) attrs['w:color'] = cellBorders.tr2bl.color;

        if (Object.keys(attrs).length > 0) {
          borderElements.push(XMLBuilder.wSelf('tr2bl', attrs));
        }
      }
    }

    return borderElements;
  }

  /**
   * Generates shading element - Phase 5.1
   */
  private generateShadingElement(shading: ShadingProperties): XMLElement {
    const attrs: Record<string, string> = {};
    if (shading.val) attrs['w:val'] = shading.val;
    if (shading.color) attrs['w:color'] = shading.color;
    if (shading.fill) attrs['w:fill'] = shading.fill;

    return XMLBuilder.wSelf('shd', attrs);
  }

  /**
   * Creates a new Style
   * @param properties - Style properties
   * @returns New Style instance
   */
  static create(properties: StyleProperties): Style {
    return new Style(properties);
  }

  /**
   * Creates the Normal style (default paragraph style)
   * @returns Normal style
   */
  static createNormalStyle(): Style {
    return new Style({
      styleId: 'Normal',
      name: 'Normal',
      type: 'paragraph',
      isDefault: true,
      next: 'Normal',
      paragraphFormatting: {
        spacing: {
          after: 200,
          line: 276,
          lineRule: 'auto',
        },
      },
      runFormatting: {
        font: 'Calibri',
        size: 11,
      },
    });
  }

  /**
   * Creates a Heading style
   * @param level - Heading level (1-9)
   * @returns Heading style
   */
  static createHeadingStyle(level: number): Style {
    if (level < 1 || level > 9) {
      throw new Error('Heading level must be between 1 and 9');
    }

    const sizes = [16, 13, 12, 11, 11, 11, 11, 11, 11]; // Font sizes for Heading1-9
    const bold = level <= 4; // Headings 1-4 are bold

    return new Style({
      styleId: `Heading${level}`,
      name: `Heading ${level}`,
      type: 'paragraph',
      basedOn: 'Normal',
      next: 'Normal',
      paragraphFormatting: {
        spacing: {
          before: level === 1 ? 240 : 120,
          after: 120,
        },
        keepNext: true,
        keepLines: true,
      },
      runFormatting: {
        font: 'Calibri Light',
        size: sizes[level - 1],
        bold: bold,
        color: level === 1 ? '2E74B5' : '1F4D78',
      },
    });
  }

  /**
   * Creates the Title style
   * @returns Title style
   */
  static createTitleStyle(): Style {
    return new Style({
      styleId: 'Title',
      name: 'Title',
      type: 'paragraph',
      basedOn: 'Normal',
      next: 'Normal',
      paragraphFormatting: {
        spacing: {
          after: 120,
        },
      },
      runFormatting: {
        font: 'Calibri Light',
        size: 28,
        color: '2E74B5',
      },
    });
  }

  /**
   * Creates the Subtitle style
   * @returns Subtitle style
   */
  static createSubtitleStyle(): Style {
    return new Style({
      styleId: 'Subtitle',
      name: 'Subtitle',
      type: 'paragraph',
      basedOn: 'Normal',
      next: 'Normal',
      paragraphFormatting: {
        spacing: {
          after: 120,
        },
      },
      runFormatting: {
        font: 'Calibri Light',
        size: 14,
        color: '595959',
        italic: true,
      },
    });
  }

  /**
   * Creates a List Paragraph style (for lists)
   * @returns List Paragraph style
   */
  static createListParagraphStyle(): Style {
    return new Style({
      styleId: 'ListParagraph',
      name: 'List Paragraph',
      type: 'paragraph',
      basedOn: 'Normal',
      next: 'ListParagraph',
      paragraphFormatting: {
        indentation: {
          left: 720, // 0.5 inch
        },
      },
    });
  }

  /**
   * Creates a TOC Heading style (for table of contents titles)
   * @returns TOC Heading style
   */
  static createTOCHeadingStyle(): Style {
    return new Style({
      styleId: 'TOCHeading',
      name: 'TOC Heading',
      type: 'paragraph',
      basedOn: 'Heading1',
      next: 'Normal',
      runFormatting: {
        bold: true,
        font: 'Calibri',
        size: 14,
        color: '000000', // Black (different from Heading1's blue)
      },
      paragraphFormatting: {
        spacing: {
          before: 480, // Larger spacing before TOC
          after: 240,
        },
      },
    });
  }

  /**
   * Creates a Table Normal style (Phase 5.1)
   * @returns Table Normal style
   */
  static createTableNormalStyle(): Style {
    return new Style({
      styleId: 'TableNormal',
      name: 'Table Normal',
      type: 'table',
      basedOn: 'Normal',
      tableStyle: {
        table: {
          cellMargins: {
            top: 0,
            left: 108,  // ~0.075 inch
            bottom: 0,
            right: 108,
          },
        },
        rowBandSize: 1,
        colBandSize: 1,
      },
    });
  }

  /**
   * Creates a Table Grid style with borders (Phase 5.1)
   * @returns Table Grid style
   */
  static createTableGridStyle(): Style {
    return new Style({
      styleId: 'TableGrid',
      name: 'Table Grid',
      type: 'table',
      basedOn: 'TableNormal',
      tableStyle: {
        table: {
          borders: {
            top: { style: 'single', size: 4, color: '000000' },
            bottom: { style: 'single', size: 4, color: '000000' },
            left: { style: 'single', size: 4, color: '000000' },
            right: { style: 'single', size: 4, color: '000000' },
            insideH: { style: 'single', size: 4, color: '000000' },
            insideV: { style: 'single', size: 4, color: '000000' },
          },
          cellMargins: {
            top: 0,
            left: 108,
            bottom: 0,
            right: 108,
          },
        },
        rowBandSize: 1,
        colBandSize: 1,
      },
    });
  }

  /**
   * Creates a deep clone of this style
   * @returns New Style instance with copied properties
   * @example
   * ```typescript
   * const original = Style.createHeadingStyle(1);
   * const copy = original.clone();
   * copy.setRunFormatting({ color: 'FF0000' });  // Doesn't affect original
   * ```
   */
  clone(): Style {
    // Deep copy all properties
    const clonedProps: StyleProperties = JSON.parse(JSON.stringify(this.properties));
    return new Style(clonedProps);
  }

  /**
   * Merges properties from another style into this one
   * @param otherStyle - Style to merge from
   * @returns This style for chaining
   * @example
   * ```typescript
   * const base = Style.createNormalStyle();
   * const override = Style.create({
   *   styleId: 'Override',
   *   name: 'Override',
   *   type: 'paragraph',
   *   runFormatting: { bold: true, color: 'FF0000' }
   * });
   * base.mergeWith(override);  // base now has bold red text
   * ```
   */
  mergeWith(otherStyle: Style): this {
    const otherProps = otherStyle.getProperties();

    // Merge paragraph formatting
    if (otherProps.paragraphFormatting) {
      if (!this.properties.paragraphFormatting) {
        this.properties.paragraphFormatting = {};
      }

      // Merge top-level paragraph properties
      if (otherProps.paragraphFormatting.alignment) {
        this.properties.paragraphFormatting.alignment = otherProps.paragraphFormatting.alignment;
      }
      if (otherProps.paragraphFormatting.keepNext !== undefined) {
        this.properties.paragraphFormatting.keepNext = otherProps.paragraphFormatting.keepNext;
      }
      if (otherProps.paragraphFormatting.keepLines !== undefined) {
        this.properties.paragraphFormatting.keepLines = otherProps.paragraphFormatting.keepLines;
      }
      if (otherProps.paragraphFormatting.pageBreakBefore !== undefined) {
        this.properties.paragraphFormatting.pageBreakBefore = otherProps.paragraphFormatting.pageBreakBefore;
      }

      // Merge indentation
      if (otherProps.paragraphFormatting.indentation) {
        if (!this.properties.paragraphFormatting.indentation) {
          this.properties.paragraphFormatting.indentation = {};
        }
        Object.assign(this.properties.paragraphFormatting.indentation, otherProps.paragraphFormatting.indentation);
      }

      // Merge spacing
      if (otherProps.paragraphFormatting.spacing) {
        if (!this.properties.paragraphFormatting.spacing) {
          this.properties.paragraphFormatting.spacing = {};
        }
        Object.assign(this.properties.paragraphFormatting.spacing, otherProps.paragraphFormatting.spacing);
      }
    }

    // Merge run formatting
    if (otherProps.runFormatting) {
      if (!this.properties.runFormatting) {
        this.properties.runFormatting = {};
      }
      Object.assign(this.properties.runFormatting, otherProps.runFormatting);
    }

    // Merge other properties (but don't override styleId)
    if (otherProps.name) this.properties.name = otherProps.name;
    if (otherProps.basedOn) this.properties.basedOn = otherProps.basedOn;
    if (otherProps.next) this.properties.next = otherProps.next;

    return this;
  }
}
