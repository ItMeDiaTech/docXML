/**
 * TableCell - Represents a cell in a table
 */

import { Paragraph, TextDirection } from './Paragraph';
import { XMLBuilder, XMLElement } from '../xml/XMLBuilder';

/**
 * Cell border style
 */
export type BorderStyle = 'none' | 'single' | 'double' | 'dashed' | 'dotted' | 'thick';

/**
 * Cell border definition
 */
export interface CellBorder {
  style?: BorderStyle;
  size?: number; // Size in eighths of a point
  color?: string; // Hex color without #
}

/**
 * Cell borders
 */
export interface CellBorders {
  top?: CellBorder;
  bottom?: CellBorder;
  left?: CellBorder;
  right?: CellBorder;
}

/**
 * Cell shading/background
 */
export interface CellShading {
  fill?: string; // Background color in hex
  color?: string; // Foreground/pattern color in hex
}

/**
 * Vertical alignment in cell
 */
export type CellVerticalAlignment = 'top' | 'center' | 'bottom';

/**
 * Cell margins (spacing inside cell borders)
 * Per ECMA-376 Part 1 §17.4.43
 */
export interface CellMargins {
  top?: number; // Margin in twips
  bottom?: number; // Margin in twips
  left?: number; // Margin in twips
  right?: number; // Margin in twips
}

/**
 * Cell width type
 * Per ECMA-376 Part 1 §17.18.87
 */
export type CellWidthType = 'auto' | 'dxa' | 'pct';

/**
 * Vertical merge type for cells
 * Per ECMA-376 Part 1 §17.4.85
 */
export type VerticalMerge = 'restart' | 'continue';

/**
 * Cell formatting options
 */
export interface CellFormatting {
  width?: number; // Width in twips
  widthType?: CellWidthType; // Width type (auto, dxa, pct)
  borders?: CellBorders;
  shading?: CellShading;
  verticalAlignment?: CellVerticalAlignment;
  columnSpan?: number; // Number of columns to span (gridSpan)
  rowSpan?: number; // Number of rows to span (gridSpan)
  margins?: CellMargins; // Cell margins (spacing inside borders)
  textDirection?: TextDirection; // Text flow direction
  fitText?: boolean; // Fit text to cell width
  noWrap?: boolean; // Prevent text wrapping
  hideMark?: boolean; // Hide end-of-cell mark
  cnfStyle?: string; // Conditional formatting style (14-char binary string)
  vMerge?: VerticalMerge; // Vertical cell merge
}

/**
 * Represents a table cell
 */
export class TableCell {
  private paragraphs: Paragraph[] = [];
  private formatting: CellFormatting;

  /**
   * Creates a new TableCell
   * @param formatting - Cell formatting options
   */
  constructor(formatting: CellFormatting = {}) {
    this.formatting = formatting;
  }

  /**
   * Adds a paragraph to the cell
   * @param paragraph - Paragraph to add
   * @returns This cell for chaining
   */
  addParagraph(paragraph: Paragraph): this {
    this.paragraphs.push(paragraph);
    return this;
  }

  /**
   * Creates and adds a new paragraph with text
   * @param text - Text content
   * @returns The created paragraph
   */
  createParagraph(text?: string): Paragraph {
    const para = new Paragraph();
    if (text) {
      para.addText(text);
    }
    this.paragraphs.push(para);
    return para;
  }

  /**
   * Gets all paragraphs in the cell
   * @returns Array of paragraphs
   */
  getParagraphs(): Paragraph[] {
    return [...this.paragraphs];
  }

  /**
   * Gets the text content of all paragraphs
   * @returns Combined text
   */
  getText(): string {
    return this.paragraphs.map(p => p.getText()).join('\n');
  }

  /**
   * Sets cell width
   * @param twips - Width in twips
   * @returns This cell for chaining
   */
  setWidth(twips: number): this {
    this.formatting.width = twips;
    return this;
  }

  /**
   * Sets cell borders
   * @param borders - Border definitions
   * @returns This cell for chaining
   */
  setBorders(borders: CellBorders): this {
    this.formatting.borders = borders;
    return this;
  }

  /**
   * Sets cell shading/background
   * @param shading - Shading definition
   * @returns This cell for chaining
   */
  setShading(shading: CellShading): this {
    this.formatting.shading = shading;
    return this;
  }

  /**
   * Sets vertical alignment
   * @param alignment - Vertical alignment
   * @returns This cell for chaining
   */
  setVerticalAlignment(alignment: CellVerticalAlignment): this {
    this.formatting.verticalAlignment = alignment;
    return this;
  }

  /**
   * Sets column span (merge cells horizontally)
   * @param span - Number of columns to span
   * @returns This cell for chaining
   */
  setColumnSpan(span: number): this {
    this.formatting.columnSpan = span;
    return this;
  }

  /**
   * Sets cell margins (spacing inside cell borders)
   * Per ECMA-376 Part 1 §17.4.43
   * @param margins - Margin definitions for each side
   * @returns This cell for chaining
   */
  setMargins(margins: CellMargins): this {
    this.formatting.margins = margins;
    return this;
  }

  /**
   * Sets all cell margins to the same value
   * @param margin - Margin in twips to apply to all sides
   * @returns This cell for chaining
   */
  setAllMargins(margin: number): this {
    this.formatting.margins = { top: margin, bottom: margin, left: margin, right: margin };
    return this;
  }

  /**
   * Sets text direction for cell content
   * Per ECMA-376 Part 1 §17.4.72
   * @param direction - Text flow direction
   *   - 'lrTb': Left-to-right, top-to-bottom (default)
   *   - 'tbRl': Top-to-bottom, right-to-left (vertical text, East Asian)
   *   - 'btLr': Bottom-to-top, left-to-right (vertical text)
   *   - 'lrTbV': Left-to-right, top-to-bottom, vertical
   *   - 'tbRlV': Top-to-bottom, right-to-left, vertical
   *   - 'tbLrV': Top-to-bottom, left-to-right, vertical
   * @returns This cell for chaining
   */
  setTextDirection(direction: TextDirection): this {
    this.formatting.textDirection = direction;
    return this;
  }

  /**
   * Sets whether to fit text to cell width
   * Per ECMA-376 Part 1 §17.4.68
   * @param fit - Whether to expand/compress text to fit cell width
   * @returns This cell for chaining
   */
  setFitText(fit: boolean = true): this {
    this.formatting.fitText = fit;
    return this;
  }

  /**
   * Sets whether to prevent text wrapping in cell
   * Per ECMA-376 Part 1 §17.4.34
   * @param noWrap - Whether to prevent wrapping (default: true)
   * @returns This cell for chaining
   */
  setNoWrap(noWrap: boolean = true): this {
    this.formatting.noWrap = noWrap;
    return this;
  }

  /**
   * Sets whether to hide the end-of-cell mark
   * Per ECMA-376 Part 1 §17.4.24
   * @param hide - Whether to ignore cell end mark in height calculations (default: true)
   * @returns This cell for chaining
   */
  setHideMark(hide: boolean = true): this {
    this.formatting.hideMark = hide;
    return this;
  }

  /**
   * Sets conditional formatting style for this cell
   * Per ECMA-376 Part 1 §17.4.7
   * @param cnfStyle - 14-character binary string representing which conditional formats to apply
   *   Each bit position controls a different conditional format (e.g., "100000000000" for first row)
   * @returns This cell for chaining
   */
  setConditionalStyle(cnfStyle: string): this {
    this.formatting.cnfStyle = cnfStyle;
    return this;
  }

  /**
   * Sets cell width with type specification
   * Per ECMA-376 Part 1 §17.4.81
   * @param width - Width value
   * @param type - Width type: 'auto' (automatic), 'dxa' (twips), or 'pct' (percentage * 50)
   * @returns This cell for chaining
   */
  setWidthType(width: number, type: CellWidthType = 'dxa'): this {
    this.formatting.width = width;
    this.formatting.widthType = type;
    return this;
  }

  /**
   * Sets vertical merge for this cell
   * Per ECMA-376 Part 1 §17.4.85
   * @param merge - Vertical merge type:
   *   - 'restart': Start a new vertically merged region (top cell)
   *   - 'continue': Continue the current vertically merged region (cells below)
   * @returns This cell for chaining
   */
  setVerticalMerge(merge: VerticalMerge): this {
    this.formatting.vMerge = merge;
    return this;
  }

  /**
   * Gets the cell formatting
   * @returns Cell formatting
   */
  getFormatting(): CellFormatting {
    return { ...this.formatting };
  }

  /**
   * Converts the cell to WordprocessingML XML element
   * @returns XMLElement representing the cell
   */
  toXML(): XMLElement {
    const tcPrChildren: XMLElement[] = [];

    // Add cell width (tcW) per ECMA-376 Part 1 §17.4.81
    if (this.formatting.width !== undefined) {
      const widthAttrs: Record<string, string | number> = {
        'w:w': this.formatting.width,
        'w:type': this.formatting.widthType || 'dxa',
      };
      tcPrChildren.push(XMLBuilder.wSelf('tcW', widthAttrs));
    }

    // Add conditional formatting style (cnfStyle) per ECMA-376 Part 1 §17.4.7
    if (this.formatting.cnfStyle) {
      tcPrChildren.push(XMLBuilder.wSelf('cnfStyle', { 'w:val': this.formatting.cnfStyle }));
    }

    // Add cell borders
    if (this.formatting.borders) {
      const borderElements: XMLElement[] = [];
      const borders = this.formatting.borders;

      if (borders.top) {
        borderElements.push(this.createBorderElement('top', borders.top));
      }
      if (borders.bottom) {
        borderElements.push(this.createBorderElement('bottom', borders.bottom));
      }
      if (borders.left) {
        borderElements.push(this.createBorderElement('left', borders.left));
      }
      if (borders.right) {
        borderElements.push(this.createBorderElement('right', borders.right));
      }

      if (borderElements.length > 0) {
        tcPrChildren.push(XMLBuilder.w('tcBorders', undefined, borderElements));
      }
    }

    // Add shading
    if (this.formatting.shading) {
      const shadingAttrs: Record<string, string> = {
        'w:val': 'clear',
      };

      if (this.formatting.shading.fill) {
        shadingAttrs['w:fill'] = this.formatting.shading.fill;
      }
      if (this.formatting.shading.color) {
        shadingAttrs['w:color'] = this.formatting.shading.color;
      }

      tcPrChildren.push(XMLBuilder.wSelf('shd', shadingAttrs));
    }

    // Add cell margins (tcMar) per ECMA-376 Part 1 §17.4.43
    if (this.formatting.margins) {
      const margins = this.formatting.margins;
      const marginChildren: XMLElement[] = [];

      if (margins.top !== undefined) {
        marginChildren.push(XMLBuilder.wSelf('top', { 'w:w': margins.top.toString(), 'w:type': 'dxa' }));
      }
      if (margins.bottom !== undefined) {
        marginChildren.push(XMLBuilder.wSelf('bottom', { 'w:w': margins.bottom.toString(), 'w:type': 'dxa' }));
      }
      if (margins.left !== undefined) {
        marginChildren.push(XMLBuilder.wSelf('left', { 'w:w': margins.left.toString(), 'w:type': 'dxa' }));
      }
      if (margins.right !== undefined) {
        marginChildren.push(XMLBuilder.wSelf('right', { 'w:w': margins.right.toString(), 'w:type': 'dxa' }));
      }

      if (marginChildren.length > 0) {
        tcPrChildren.push(XMLBuilder.w('tcMar', undefined, marginChildren));
      }
    }

    // Add vertical alignment
    if (this.formatting.verticalAlignment) {
      tcPrChildren.push(
        XMLBuilder.wSelf('vAlign', { 'w:val': this.formatting.verticalAlignment })
      );
    }

    // Add column span (gridSpan)
    if (this.formatting.columnSpan && this.formatting.columnSpan > 1) {
      tcPrChildren.push(
        XMLBuilder.wSelf('gridSpan', { 'w:val': this.formatting.columnSpan })
      );
    }

    // Add text direction (textDirection) per ECMA-376 Part 1 §17.4.72
    if (this.formatting.textDirection) {
      tcPrChildren.push(XMLBuilder.wSelf('textDirection', { 'w:val': this.formatting.textDirection }));
    }

    // Add no wrap (noWrap) per ECMA-376 Part 1 §17.4.34
    if (this.formatting.noWrap) {
      tcPrChildren.push(XMLBuilder.wSelf('noWrap'));
    }

    // Add hide mark (hideMark) per ECMA-376 Part 1 §17.4.24
    if (this.formatting.hideMark) {
      tcPrChildren.push(XMLBuilder.wSelf('hideMark'));
    }

    // Add fit text (tcFitText) per ECMA-376 Part 1 §17.4.68
    if (this.formatting.fitText) {
      tcPrChildren.push(XMLBuilder.wSelf('tcFitText'));
    }

    // Add vertical merge (vMerge) per ECMA-376 Part 1 §17.4.85
    if (this.formatting.vMerge) {
      if (this.formatting.vMerge === 'restart') {
        tcPrChildren.push(XMLBuilder.wSelf('vMerge', { 'w:val': 'restart' }));
      } else {
        // 'continue' uses empty element (no val attribute)
        tcPrChildren.push(XMLBuilder.wSelf('vMerge'));
      }
    }

    // Build cell element
    const cellChildren: XMLElement[] = [];

    // Add cell properties if there are any
    if (tcPrChildren.length > 0) {
      cellChildren.push(XMLBuilder.w('tcPr', undefined, tcPrChildren));
    }

    // Add paragraphs (at least one required)
    if (this.paragraphs.length > 0) {
      for (const para of this.paragraphs) {
        cellChildren.push(para.toXML());
      }
    } else {
      // Empty cell needs at least one empty paragraph
      cellChildren.push(new Paragraph().toXML());
    }

    return XMLBuilder.w('tc', undefined, cellChildren);
  }

  /**
   * Creates a border element
   */
  private createBorderElement(side: string, border: CellBorder): XMLElement {
    const attrs: Record<string, string | number> = {
      'w:val': border.style || 'single',
    };

    if (border.size !== undefined) {
      attrs['w:sz'] = border.size;
    }
    if (border.color) {
      attrs['w:color'] = border.color;
    }

    return XMLBuilder.wSelf(side, attrs);
  }

  /**
   * Creates a new TableCell
   * @param formatting - Cell formatting
   * @returns New TableCell instance
   */
  static create(formatting?: CellFormatting): TableCell {
    return new TableCell(formatting);
  }
}
