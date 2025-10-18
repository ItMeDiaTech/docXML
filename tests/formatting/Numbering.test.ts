/**
 * Tests for Numbering components (NumberingLevel, AbstractNumbering, NumberingInstance)
 */

import { NumberingLevel, NumberFormat } from '../../src/formatting/NumberingLevel';
import { AbstractNumbering } from '../../src/formatting/AbstractNumbering';
import { NumberingInstance } from '../../src/formatting/NumberingInstance';
import { NumberingManager } from '../../src/formatting/NumberingManager';
import { XMLElement } from '../../src/xml/XMLBuilder';

/**
 * Helper to filter and safely access XMLElement children
 */
function filterXMLElements(children?: (XMLElement | string)[]): XMLElement[] {
  return (children || []).filter((c): c is XMLElement => typeof c !== 'string');
}

describe('NumberingLevel', () => {
  describe('Basic functionality', () => {
    it('should create a numbering level with required properties', () => {
      const level = new NumberingLevel({
        level: 0,
        format: 'decimal',
        text: '%1.',
      });

      const props = level.getProperties();
      expect(props.level).toBe(0);
      expect(props.format).toBe('decimal');
      expect(props.text).toBe('%1.');
    });

    it('should use default values for optional properties', () => {
      const level = new NumberingLevel({
        level: 0,
        format: 'bullet',
        text: '•',
      });

      const props = level.getProperties();
      expect(props.alignment).toBe('left');
      expect(props.start).toBe(1);
      expect(props.leftIndent).toBe(720); // 720 * (0 + 1)
      expect(props.hangingIndent).toBe(360);
      expect(props.font).toBe('Symbol'); // For bullet format
      expect(props.fontSize).toBe(22);
      expect(props.isLegalNumberingStyle).toBe(false);
      expect(props.suffix).toBe('tab');
    });

    it('should calculate default indentation based on level', () => {
      const level = new NumberingLevel({
        level: 2,
        format: 'decimal',
        text: '%3.',
      });

      const props = level.getProperties();
      expect(props.leftIndent).toBe(2160); // 720 * (2 + 1)
    });

    it('should use custom properties when provided', () => {
      const level = new NumberingLevel({
        level: 1,
        format: 'upperRoman',
        text: '%2)',
        alignment: 'right',
        start: 5,
        leftIndent: 1440,
        hangingIndent: 720,
        font: 'Times New Roman',
        fontSize: 24,
        isLegalNumberingStyle: true,
        suffix: 'space',
      });

      const props = level.getProperties();
      expect(props.alignment).toBe('right');
      expect(props.start).toBe(5);
      expect(props.leftIndent).toBe(1440);
      expect(props.hangingIndent).toBe(720);
      expect(props.font).toBe('Times New Roman');
      expect(props.fontSize).toBe(24);
      expect(props.isLegalNumberingStyle).toBe(true);
      expect(props.suffix).toBe('space');
    });
  });

  describe('Validation', () => {
    it('should throw error for invalid level', () => {
      expect(() => new NumberingLevel({
        level: -1,
        format: 'decimal',
        text: '%1.',
      })).toThrow('Level must be between 0 and 8');

      expect(() => new NumberingLevel({
        level: 9,
        format: 'decimal',
        text: '%1.',
      })).toThrow('Level must be between 0 and 8');
    });

    it('should throw error for negative indentation', () => {
      expect(() => new NumberingLevel({
        level: 0,
        format: 'decimal',
        text: '%1.',
        leftIndent: -100,
      })).toThrow('Left indent must be non-negative');

      expect(() => new NumberingLevel({
        level: 0,
        format: 'decimal',
        text: '%1.',
        hangingIndent: -100,
      })).toThrow('Hanging indent must be non-negative');
    });

    it('should throw error for negative start value', () => {
      expect(() => new NumberingLevel({
        level: 0,
        format: 'decimal',
        text: '%1.',
        start: -1,
      })).toThrow('Start value must be non-negative');
    });
  });

  describe('Setters', () => {
    it('should set left indent', () => {
      const level = new NumberingLevel({
        level: 0,
        format: 'decimal',
        text: '%1.',
      });

      level.setLeftIndent(1080);
      expect(level.getProperties().leftIndent).toBe(1080);
    });

    it('should set hanging indent', () => {
      const level = new NumberingLevel({
        level: 0,
        format: 'decimal',
        text: '%1.',
      });

      level.setHangingIndent(540);
      expect(level.getProperties().hangingIndent).toBe(540);
    });

    it('should set font', () => {
      const level = new NumberingLevel({
        level: 0,
        format: 'bullet',
        text: '•',
      });

      level.setFont('Wingdings');
      expect(level.getProperties().font).toBe('Wingdings');
    });

    it('should set alignment', () => {
      const level = new NumberingLevel({
        level: 0,
        format: 'decimal',
        text: '%1.',
      });

      level.setAlignment('center');
      expect(level.getProperties().alignment).toBe('center');
    });

    it('should throw error for negative indents in setters', () => {
      const level = new NumberingLevel({
        level: 0,
        format: 'decimal',
        text: '%1.',
      });

      expect(() => level.setLeftIndent(-100)).toThrow('Left indent must be non-negative');
      expect(() => level.setHangingIndent(-100)).toThrow('Hanging indent must be non-negative');
    });
  });

  describe('Method chaining', () => {
    it('should support method chaining', () => {
      const level = new NumberingLevel({
        level: 0,
        format: 'decimal',
        text: '%1.',
      });

      const result = level
        .setLeftIndent(1440)
        .setHangingIndent(720)
        .setFont('Arial')
        .setAlignment('right');

      expect(result).toBe(level);
      const props = level.getProperties();
      expect(props.leftIndent).toBe(1440);
      expect(props.hangingIndent).toBe(720);
      expect(props.font).toBe('Arial');
      expect(props.alignment).toBe('right');
    });
  });

  describe('XML generation', () => {
    it('should generate basic level XML', () => {
      const level = new NumberingLevel({
        level: 0,
        format: 'decimal',
        text: '%1.',
      });

      const xml = level.toXML();
      expect(xml.name).toBe('w:lvl');
      expect(xml.attributes?.['w:ilvl']).toBe('0');

      // Check for required elements
      const xmlElements = filterXMLElements(xml.children);
      const start = xmlElements.find(c => c.name === 'w:start');
      expect(start?.attributes?.['w:val']).toBe('1');

      const numFmt = xmlElements.find(c => c.name === 'w:numFmt');
      expect(numFmt?.attributes?.['w:val']).toBe('decimal');

      const lvlText = xmlElements.find(c => c.name === 'w:lvlText');
      expect(lvlText?.attributes?.['w:val']).toBe('%1.');

      const lvlJc = xmlElements.find(c => c.name === 'w:lvlJc');
      expect(lvlJc?.attributes?.['w:val']).toBe('left');
    });

    it('should generate XML with paragraph properties', () => {
      const level = new NumberingLevel({
        level: 1,
        format: 'decimal',
        text: '%2.',
        leftIndent: 1440,
        hangingIndent: 720,
      });

      const xml = level.toXML();
      const pPr = filterXMLElements(xml.children).find(c => c.name === 'w:pPr');
      expect(pPr).toBeDefined();

      const ind = filterXMLElements(pPr?.children).find(c => c.name === 'w:ind');
      expect(ind?.attributes?.['w:left']).toBe('1440');
      expect(ind?.attributes?.['w:hanging']).toBe('720');
    });

    it('should generate XML with run properties', () => {
      const level = new NumberingLevel({
        level: 0,
        format: 'bullet',
        text: '•',
        font: 'Symbol',
        fontSize: 24,
      });

      const xml = level.toXML();
      const rPr = filterXMLElements(xml.children).find(c => c.name === 'w:rPr');
      expect(rPr).toBeDefined();

      const rFonts = filterXMLElements(rPr?.children).find(c => c.name === 'w:rFonts');
      expect(rFonts?.attributes?.['w:ascii']).toBe('Symbol');
      expect(rFonts?.attributes?.['w:hAnsi']).toBe('Symbol');

      const sz = filterXMLElements(rPr?.children).find(c => c.name === 'w:sz');
      expect(sz?.attributes?.['w:val']).toBe('24');
    });

    it('should generate XML with suffix', () => {
      const level = new NumberingLevel({
        level: 0,
        format: 'decimal',
        text: '%1.',
        suffix: 'space',
      });

      const xml = level.toXML();
      const suff = filterXMLElements(xml.children).find(c => c.name === 'w:suff');
      expect(suff?.attributes?.['w:val']).toBe('space');
    });

    it('should generate XML with legal numbering style', () => {
      const level = new NumberingLevel({
        level: 0,
        format: 'decimal',
        text: '%1.',
        isLegalNumberingStyle: true,
      });

      const xml = level.toXML();
      const isLgl = filterXMLElements(xml.children).find(c => c.name === 'w:isLgl');
      expect(isLgl).toBeDefined();
    });
  });

  describe('Static factory methods', () => {
    it('should create bullet level', () => {
      const level = NumberingLevel.createBulletLevel(0, '◦');
      const props = level.getProperties();
      expect(props.format).toBe('bullet');
      expect(props.text).toBe('◦');
      expect(props.font).toBe('Symbol');
    });

    it('should use default bullet', () => {
      const level = NumberingLevel.createBulletLevel(1);
      expect(level.getProperties().text).toBe('•');
    });

    it('should create decimal level', () => {
      const level = NumberingLevel.createDecimalLevel(0);
      const props = level.getProperties();
      expect(props.format).toBe('decimal');
      expect(props.text).toBe('%1.');
    });

    it('should create decimal level with custom template', () => {
      const level = NumberingLevel.createDecimalLevel(1, '(%2)');
      expect(level.getProperties().text).toBe('(%2)');
    });

    it('should create lower roman level', () => {
      const level = NumberingLevel.createLowerRomanLevel(0);
      const props = level.getProperties();
      expect(props.format).toBe('lowerRoman');
      expect(props.text).toBe('%1.');
    });

    it('should create upper roman level', () => {
      const level = NumberingLevel.createUpperRomanLevel(0);
      const props = level.getProperties();
      expect(props.format).toBe('upperRoman');
      expect(props.text).toBe('%1.');
    });

    it('should create lower letter level', () => {
      const level = NumberingLevel.createLowerLetterLevel(0);
      const props = level.getProperties();
      expect(props.format).toBe('lowerLetter');
      expect(props.text).toBe('%1.');
    });

    it('should create upper letter level', () => {
      const level = NumberingLevel.createUpperLetterLevel(0);
      const props = level.getProperties();
      expect(props.format).toBe('upperLetter');
      expect(props.text).toBe('%1.');
    });

    it('should create level with custom properties', () => {
      const level = NumberingLevel.create({
        level: 2,
        format: 'decimal',
        text: '%3:',
        alignment: 'center',
      });

      const props = level.getProperties();
      expect(props.level).toBe(2);
      expect(props.format).toBe('decimal');
      expect(props.text).toBe('%3:');
      expect(props.alignment).toBe('center');
    });
  });

  describe('All number formats', () => {
    it('should support all number formats', () => {
      const formats: NumberFormat[] = [
        'bullet', 'decimal', 'lowerRoman', 'upperRoman',
        'lowerLetter', 'upperLetter', 'ordinal', 'cardinalText',
        'ordinalText', 'hex', 'chicago', 'decimal zero'
      ];

      formats.forEach(format => {
        expect(() => new NumberingLevel({
          level: 0,
          format,
          text: format === 'bullet' ? '•' : '%1.',
        })).not.toThrow();
      });
    });
  });
});

describe('AbstractNumbering', () => {
  describe('Basic functionality', () => {
    it('should create abstract numbering with ID', () => {
      const abstractNum = new AbstractNumbering(1);
      expect(abstractNum.getId()).toBe(1);
    });

    it('should add single level', () => {
      const abstractNum = new AbstractNumbering(1);
      const level = new NumberingLevel({
        level: 0,
        format: 'decimal',
        text: '%1.',
      });

      abstractNum.addLevel(level);
      expect(abstractNum.getLevel(0)).toBe(level);
    });

    it('should add multiple levels', () => {
      const abstractNum = new AbstractNumbering(1);
      const levels = [
        NumberingLevel.createDecimalLevel(0),
        NumberingLevel.createLowerLetterLevel(1),
        NumberingLevel.createLowerRomanLevel(2),
      ];

      abstractNum.addLevels(levels);
      expect(abstractNum.getLevel(0)?.getFormat()).toBe('decimal');
      expect(abstractNum.getLevel(1)?.getFormat()).toBe('lowerLetter');
      expect(abstractNum.getLevel(2)?.getFormat()).toBe('lowerRoman');
    });

    it('should get all levels', () => {
      const abstractNum = new AbstractNumbering(1);
      abstractNum.addLevels([
        NumberingLevel.createDecimalLevel(0),
        NumberingLevel.createDecimalLevel(1),
      ]);

      const levels = abstractNum.getLevels();
      expect(levels).toHaveLength(2);
    });

    it('should return undefined for invalid level index', () => {
      const abstractNum = new AbstractNumbering(1);
      abstractNum.addLevel(NumberingLevel.createDecimalLevel(0));

      expect(abstractNum.getLevel(1)).toBeUndefined();
      expect(abstractNum.getLevel(-1)).toBeUndefined();
    });
  });

  describe('Multi-level list ID', () => {
    it('should set and get multi-level list ID', () => {
      const abstractNum = new AbstractNumbering(1);
      abstractNum.setMultiLevelType('multilevel');

      expect(abstractNum.getMultiLevelType()).toBe('multilevel');
    });
  });

  describe('XML generation', () => {
    it('should generate abstract numbering XML', () => {
      const abstractNum = new AbstractNumbering(5);
      abstractNum.addLevels([
        NumberingLevel.createDecimalLevel(0),
        NumberingLevel.createLowerLetterLevel(1),
      ]);

      const xml = abstractNum.toXML();
      expect(xml.name).toBe('w:abstractNum');
      expect(xml.attributes?.['w:abstractNumId']).toBe('5');

      // Check for levels
      const levels = filterXMLElements(xml.children).filter(c => c.name === 'w:lvl');
      expect(levels).toHaveLength(2);
    });

    it('should include multi-level type in XML', () => {
      const abstractNum = new AbstractNumbering(1);
      abstractNum.setMultiLevelType('hybridMultilevel');

      const xml = abstractNum.toXML();
      const multiLevelType = filterXMLElements(xml.children).find(c => c.name === 'w:multiLevelType');
      expect(multiLevelType?.attributes?.['w:val']).toBe('hybridMultilevel');
    });
  });

  describe('Static factory methods', () => {
    it('should create bullet list', () => {
      const abstractNum = AbstractNumbering.createBulletList(1);
      expect(abstractNum.getId()).toBe(1);

      // Should have 9 levels, all bullets
      const levels = abstractNum.getLevels();
      expect(levels).toHaveLength(9);
      levels.forEach(level => {
        expect(level.getFormat()).toBe('bullet');
      });
    });

    it('should create numbered list', () => {
      const abstractNum = AbstractNumbering.createNumberedList(2);
      expect(abstractNum.getId()).toBe(2);

      const levels = abstractNum.getLevels();
      expect(levels).toHaveLength(9);

      // Check the pattern: decimal, lower letter, lower roman, repeating
      expect(levels[0]!.getFormat()).toBe('decimal');
      expect(levels[1]!.getFormat()).toBe('lowerLetter');
      expect(levels[2]!.getFormat()).toBe('lowerRoman');
      expect(levels[3]!.getFormat()).toBe('decimal');
    });

    it('should create outline list', () => {
      const abstractNum = AbstractNumbering.createOutlineList(3);
      expect(abstractNum.getId()).toBe(3);

      const levels = abstractNum.getLevels();
      expect(levels).toHaveLength(9);

      // Check the outline pattern
      expect(levels[0]!.getFormat()).toBe('upperRoman');
      expect(levels[1]!.getFormat()).toBe('upperLetter');
      expect(levels[2]!.getFormat()).toBe('decimal');
    });
  });
});

describe('NumberingInstance', () => {
  describe('Basic functionality', () => {
    it('should create numbering instance', () => {
      const instance = new NumberingInstance(1, 100);
      expect(instance.getId()).toBe(1);
      expect(instance.getAbstractNumId()).toBe(100);
    });

    it('should set level overrides', () => {
      const instance = new NumberingInstance(1, 100);
      instance.setLevelOverride(0, 5);

      const overrides = instance.getLevelOverrides();
      expect(overrides.get(0)).toBe(5);
    });

    it('should support multiple level overrides', () => {
      const instance = new NumberingInstance(1, 100);
      instance.setLevelOverride(0, 10);
      instance.setLevelOverride(1, 20);
      instance.setLevelOverride(2, 30);

      const overrides = instance.getLevelOverrides();
      expect(overrides.size).toBe(3);
      expect(overrides.get(0)).toBe(10);
      expect(overrides.get(1)).toBe(20);
      expect(overrides.get(2)).toBe(30);
    });
  });

  describe('XML generation', () => {
    it('should generate basic numbering instance XML', () => {
      const instance = new NumberingInstance(5, 200);
      const xml = instance.toXML();

      expect(xml.name).toBe('w:num');
      expect(xml.attributes?.['w:numId']).toBe('5');

      const abstractNumId = filterXMLElements(xml.children).find(c => c.name === 'w:abstractNumId');
      expect(abstractNumId?.attributes?.['w:val']).toBe('200');
    });

    it('should generate XML with level overrides', () => {
      const instance = new NumberingInstance(1, 100);
      instance.setLevelOverride(0, 5);
      instance.setLevelOverride(2, 10);

      const xml = instance.toXML();

      const lvlOverrides = filterXMLElements(xml.children).filter(c => c.name === 'w:lvlOverride');
      expect(lvlOverrides).toHaveLength(2);

      const level0Override = lvlOverrides.find(o => o.attributes?.['w:ilvl'] === '0');
      const startOverride0 = filterXMLElements(level0Override?.children).find(c => c.name === 'w:startOverride');
      expect(startOverride0?.attributes?.['w:val']).toBe('5');

      const level2Override = lvlOverrides.find(o => o.attributes?.['w:ilvl'] === '2');
      const startOverride2 = filterXMLElements(level2Override?.children).find(c => c.name === 'w:startOverride');
      expect(startOverride2?.attributes?.['w:val']).toBe('10');
    });
  });

  describe('Static factory method', () => {
    it('should create instance with static method', () => {
      const instance = NumberingInstance.create(10, 500);
      expect(instance).toBeInstanceOf(NumberingInstance);
      expect(instance.getId()).toBe(10);
      expect(instance.getAbstractNumId()).toBe(500);
    });
  });
});

describe('NumberingManager', () => {
  describe('Basic functionality', () => {
    it('should create numbering manager', () => {
      const manager = new NumberingManager();
      expect(manager).toBeInstanceOf(NumberingManager);
    });

    it('should add abstract numbering', () => {
      const manager = new NumberingManager();
      const abstractNum = AbstractNumbering.createBulletList(1);

      manager.addAbstractNumbering(abstractNum);
      expect(manager.getAbstractNumbering(1)).toBe(abstractNum);
    });

    it('should add numbering instance', () => {
      const manager = new NumberingManager();
      const abstractNum = AbstractNumbering.createBulletList(1);
      const instance = new NumberingInstance(10, 1);

      manager.addAbstractNumbering(abstractNum);
      manager.addNumberingInstance(instance);

      expect(manager.getNumberingInstance(10)).toBe(instance);
    });

    it('should get all abstract numberings', () => {
      const manager = new NumberingManager();
      manager.addAbstractNumbering(AbstractNumbering.createBulletList(1));
      manager.addAbstractNumbering(AbstractNumbering.createNumberedList(2));

      const abstracts = manager.getAllAbstractNumberings();
      expect(abstracts).toHaveLength(2);
    });

    it('should get all numbering instances', () => {
      const manager = new NumberingManager();
      manager.addNumberingInstance(new NumberingInstance(1, 100));
      manager.addNumberingInstance(new NumberingInstance(2, 200));

      const instances = manager.getAllNumberingInstances();
      expect(instances).toHaveLength(2);
    });
  });

  describe('Create and register methods', () => {
    it('should create and register bullet list', () => {
      const manager = new NumberingManager();
      const numId = manager.createBulletList();

      expect(numId).toBeDefined();
      const instance = manager.getNumberingInstance(numId);
      expect(instance).toBeDefined();

      const abstractId = instance?.getAbstractNumId();
      const abstractNum = abstractId ? manager.getAbstractNumbering(abstractId) : undefined;
      expect(abstractNum).toBeDefined();
    });

    it('should create and register numbered list', () => {
      const manager = new NumberingManager();
      const numId = manager.createNumberedList();

      expect(numId).toBeDefined();
      const instance = manager.getNumberingInstance(numId);
      expect(instance).toBeDefined();
    });

    it('should create and register outline list', () => {
      const manager = new NumberingManager();
      const numId = manager.createOutlineList();

      expect(numId).toBeDefined();
      const instance = manager.getNumberingInstance(numId);
      expect(instance).toBeDefined();
    });

    it('should increment IDs for multiple lists', () => {
      const manager = new NumberingManager();
      const id1 = manager.createBulletList();
      const id2 = manager.createNumberedList();
      const id3 = manager.createOutlineList();

      expect(id2).toBeGreaterThan(id1);
      expect(id3).toBeGreaterThan(id2);
    });
  });

  describe('XML generation', () => {
    it('should generate numbering XML document', () => {
      const manager = new NumberingManager();
      manager.createBulletList();
      manager.createNumberedList();

      const xml = manager.toXML();
      expect(xml.name).toBe('w:numbering');
      expect(xml.attributes?.['xmlns:w']).toBeDefined();

      // Should have abstract numberings and instances
      const abstractNums = filterXMLElements(xml.children).filter(c => c.name === 'w:abstractNum');
      expect(abstractNums.length).toBeGreaterThanOrEqual(2);

      const nums = filterXMLElements(xml.children).filter(c => c.name === 'w:num');
      expect(nums.length).toBeGreaterThanOrEqual(2);
    });

    it('should include namespaces in root element', () => {
      const manager = new NumberingManager();
      const xml = manager.toXML();

      expect(xml.attributes?.['xmlns:w']).toBe('http://schemas.openxmlformats.org/wordprocessingml/2006/main');
      expect(xml.attributes?.['xmlns:r']).toBe('http://schemas.openxmlformats.org/officeDocument/2006/relationships');
    });
  });

  describe('Static factory method', () => {
    it('should create manager with static method', () => {
      const manager = NumberingManager.create();
      expect(manager).toBeInstanceOf(NumberingManager);
    });
  });
});