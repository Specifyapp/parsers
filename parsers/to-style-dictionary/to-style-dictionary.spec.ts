import toStyleDictionary from './to-style-dictionary.parser';
import seeds from '../../tests/seeds';
import libs from '../global-libs';
import { AllowedFormat, FontFormatList, Token } from '../../types';
import * as TokensClass from './tokens';
import {
  BaseStyleDictionaryTokensFormat,
  StyleDictionaryTokenClass,
} from './to-style-dictionary.type';

describe('To Style Dictionary', () => {
  it('Should be able to extract tokens in multiple files', async () => {
    const result = await toStyleDictionary(
      seeds().tokens.filter(({ type }) =>
        ['color', 'textStyle', 'shadow', 'border'].includes(type),
      ) as Array<Token>,
      { splitBy: '/' },
      libs,
    );

    const expectedNames = [
      'color/base.json',
      'color/font.json',
      'color/shadow.json',
      'color/border.json',
    ];

    expect(Array.isArray(result)).toEqual(true);

    // Only test on extracted colors
    const resultWithOnlyColors = result.filter(file => file.name.includes('color/'));
    expect(resultWithOnlyColors.length).toEqual(4); // Should have all the files
    const actualNames = resultWithOnlyColors.map(file => file.name);
    expect(actualNames).toEqual(expect.arrayContaining(expectedNames));
  });

  it('Should be able to extract Color token type', async () => {
    const result = await toStyleDictionary(
      seeds().tokens.filter(({ type }) => type === 'color') as Array<Token>,
      { splitBy: '/' },
      libs,
    );

    expect(Array.isArray(result)).toEqual(true);
    expect(result.length).toEqual(1); // Color token only creates base
    const file = result[0];
    expect(typeof file.name).toEqual('string');
    expect(file.name).toEqual('color/base.json');
    expect(typeof file.value.content).toEqual('string');
    const content = JSON.parse(file.value.content!) as Record<string, any>;
    expect(Object.keys(content)[0]).toEqual('color');
    expect(Object.keys(content.color)[0]).toEqual('base');
    expect(Object.keys(content.color.base)[0]).toEqual('colors');
    expect(content.color.base.colors.accent).toEqual({ value: expect.any(String) });
    expect(content.color.base.colors.black).toEqual({ value: expect.any(String) });
    expect(content.color.base.colors.green).toEqual({ value: expect.any(String) });
    expect(content.color.base.colors.grey).toEqual({ value: expect.any(String) });
    expect(content.color.base.colors.orange).toEqual({ value: expect.any(String) });
  });

  it('Should be able to extract Border token type', async () => {
    const result = await toStyleDictionary(
      seeds().tokens.filter(({ type }) => type === 'border') as Array<Token>,
      { splitBy: '/' },
      libs,
    );

    const expectedNames = ['color/border.json', 'size/border.json', 'size/radius.json'];
    const expectedTypes = ['color', 'size', 'size'];

    expect(Array.isArray(result)).toEqual(true);
    expect(result.length).toEqual(expectedNames.length); // Border token creates a size and a color

    result.forEach(file => {
      const index = expectedNames.findIndex(name => name === file.name);

      expect(typeof file.name).toEqual('string');
      expect(index).toBeGreaterThan(-1);
      expect(typeof file.value.content).toEqual('string');
      const type = expectedTypes[index];
      const content = JSON.parse(file.value.content!) as Record<string, any>;
      expect(typeof content[type]).toEqual('object');
      Object.values(content).forEach(property => {
        expect(Object.values(property).length).toBeGreaterThan(0);
      });
    });
  });

  it('Should be able to extract Depth token type', async () => {
    const result = await toStyleDictionary(
      seeds().tokens.filter(({ type }) => type === 'depth') as Array<Token>,
      { splitBy: '/' },
      libs,
    );
    expect(Array.isArray(result)).toEqual(true);
    expect(result.length).toEqual(1); // Depth token only creates base
    const file = result[0];
    expect(typeof file.name).toEqual('string');
    expect(file.name).toEqual('depth/base.json');
    expect(typeof file.value.content).toEqual('string');
    const content = JSON.parse(file.value.content!) as Record<string, any>;
    expect(Object.keys(content)[0]).toEqual('depth');
    expect(Object.keys(content.depth)[0]).toEqual('base');
    expect(content.depth.base.background).toEqual({ value: expect.any(String) });
    expect(content.depth.base.middle).toEqual({ value: expect.any(String) });
    expect(content.depth.base.foreground).toEqual({ value: expect.any(String) });
  });

  it('Should be able to extract Duration token type', async () => {
    const result = await toStyleDictionary(
      seeds().tokens.filter(({ type }) => type === 'duration') as Array<Token>,
      { splitBy: '/' },
      libs,
    );
    expect(Array.isArray(result)).toEqual(true);
    expect(result.length).toEqual(1); // Time token only creates base
    const file = result[0];
    expect(typeof file.name).toEqual('string');
    expect(file.name).toEqual('time/base.json');
    expect(typeof file.value.content).toEqual('string');
    const content = JSON.parse(file.value.content!) as Record<string, any>;
    expect(Object.keys(content)[0]).toEqual('time');
    expect(Object.keys(content.time)[0]).toEqual('base');
    expect(content.time.base.base).toEqual({ value: expect.any(String) });
    expect(content.time.base.long).toEqual({ value: expect.any(String) });
    expect(content.time.base.short).toEqual({ value: expect.any(String) });
    expect(content.time.base.veryLong).toEqual({ value: expect.any(String) });
  });

  it('Should be able to extract Measurement token type', async () => {
    const result = await toStyleDictionary(
      seeds().tokens.filter(({ type }) => type === 'measurement') as Array<Token>,
      { splitBy: '/' },
      libs,
    );
    expect(Array.isArray(result)).toEqual(true);
    expect(result.length).toEqual(1); // Measurement token only creates base
    const file = result[0];
    expect(typeof file.name).toEqual('string');
    expect(file.name).toEqual('size/base.json');
    expect(typeof file.value.content).toEqual('string');
    const content = JSON.parse(file.value.content!) as Record<string, any>;
    expect(Object.keys(content)[0]).toEqual('size');
    expect(Object.keys(content.size)[0]).toEqual('base');
    Object.values(content.size).forEach(property => {
      Object.values(property as Record<string, { value: string }>).forEach(value => {
        expect(value.value).toEqual(expect.any(String));
      });
    });
  });

  it('Should be able to extract Opacity token type', async () => {
    const result = await toStyleDictionary(
      seeds().tokens.filter(({ type }) => type === 'opacity') as Array<Token>,
      { splitBy: '/' },
      libs,
    );
    expect(Array.isArray(result)).toEqual(true);
    expect(result.length).toEqual(1); // Opacity token only creates base
    const file = result[0];
    expect(typeof file.name).toEqual('string');
    expect(file.name).toEqual('opacity/base.json');
    expect(typeof file.value.content).toEqual('string');
    const content = JSON.parse(file.value.content!) as Record<string, any>;
    expect(Object.keys(content)[0]).toEqual('opacity');
    expect(Object.keys(content.opacity)[0]).toEqual('base');
    expect(content.opacity.base.transparent).toEqual({ value: expect.any(String) });
    expect(content.opacity.base.subtle).toEqual({ value: expect.any(String) });
    expect(content.opacity.base.visible).toEqual({ value: expect.any(String) });
  });

  it('Should be able to extract Shadow token type', async () => {
    const result = await toStyleDictionary(
      seeds().tokens.filter(({ type }) => type === 'shadow') as Array<Token>,
      { splitBy: '/' },
      libs,
    );

    const expectedNames = ['color/shadow.json', 'size/shadow.json'];

    expect(Array.isArray(result)).toEqual(true);
    expect(result.length).toEqual(expectedNames.length); // Shadow token creates a size and a color

    result.forEach(file => {
      const index = expectedNames.findIndex(name => name === file.name);

      expect(typeof file.name).toEqual('string');
      expect(index).toBeGreaterThan(-1);
      expect(typeof file.value.content).toEqual('string');
      const content = JSON.parse(file.value.content!) as Record<string, any>;

      // get in color or size
      Object.values(content).forEach(value => {
        expect(typeof value).toEqual('object');
        // get in shadow
        Object.values(
          value as NonNullable<BaseStyleDictionaryTokensFormat['size' | 'color']>,
        ).forEach(nestedValue => {
          expect(typeof nestedValue).toEqual('object');
          expect(Object.keys(nestedValue).length).toBeGreaterThan(0);
        });
      });
    });
  });

  it('Should be able to extract TextStyle token type', async () => {
    const result = await toStyleDictionary(
      seeds().tokens.filter(({ type }) => type === 'textStyle') as Array<Token>,
      { splitBy: '/' },
      libs,
    );

    const expectedNames = [
      'color/font.json',
      'size/font.json',
      'size/lineHeight.json',
      'size/letterSpacing.json',
      'size/textIndent.json',
    ];

    expect(Array.isArray(result)).toEqual(true);
    expect(result.length).toEqual(expectedNames.length); // Shadow token creates 4 size and a color
    result.forEach(file => {
      const index = expectedNames.findIndex(name => name === file.name);

      expect(typeof file.name).toEqual('string');
      expect(index).toBeGreaterThan(-1);
      expect(typeof file.value.content).toEqual('string');
      const content = JSON.parse(file.value.content!) as Record<string, any>;
      Object.values(content).forEach(property => {
        Object.values(property).forEach(nestedProperty => {
          Object.values(nestedProperty as Record<string, { value: string }>).forEach(value => {
            expect(value.value).toEqual(expect.any(String));
          });
        });
      });
    });
  });

  it('Should be able to extract Font token type', async () => {
    const result = await toStyleDictionary(
      seeds().tokens.filter(({ type }) => type === 'font') as Array<Token>,
      { splitBy: '/' },
      libs,
    );

    expect(Array.isArray(result)).toEqual(true);
    expect(result.length).toEqual(1); // Time token only creates base
    const file = result[0];
    expect(typeof file.name).toEqual('string');
    expect(file.name).toEqual('asset/font.json');
    expect(typeof file.value.content).toEqual('string');
    const content = JSON.parse(file.value.content!) as Record<string, any>;
    expect(Object.keys(content)[0]).toEqual('asset');
    expect(Object.keys(content.asset)[0]).toEqual('font');
    Object.values(content).forEach(property => {
      Object.values(property).forEach(nestedProperty => {
        Object.values(nestedProperty as Record<string, Record<string, { value: string }>>).forEach(
          format => {
            Object.values(format).forEach(value => {
              expect(value.value).toEqual(expect.any(String));
            });
          },
        );
      });
    });
  });

  it('Should be able to extract Font token type with assetsBaseDirectory', async () => {
    const result = await toStyleDictionary(
      seeds().tokens.filter(({ type }) => type === 'font') as Array<Token>,
      { splitBy: '/', assetsBaseDirectory: { fonts: 'fonts/' } },
      libs,
    );

    expect(Array.isArray(result)).toEqual(true);
    expect(result.length).toEqual(1); // Time token only creates base
    const file = result[0];
    expect(typeof file.name).toEqual('string');
    expect(file.name).toEqual('asset/font.json');
    expect(typeof file.value.content).toEqual('string');
    const content = JSON.parse(file.value.content!) as Record<string, any>;
    expect(Object.keys(content)[0]).toEqual('asset');
    expect(Object.keys(content.asset)[0]).toEqual('font');
    Object.values(content).forEach(property => {
      Object.values(property).forEach(nestedProperty => {
        Object.values(nestedProperty as Record<string, Record<string, { value: string }>>).forEach(
          format => {
            Object.entries(format).forEach(([format, value]) => {
              if (format === 'name') {
                expect(value.value).toEqual(expect.any(String));
              } else {
                expect(value.value).toContain('fonts/');
              }
            });
          },
        );
      });
    });
  });

  it('Should be able to extract Font token type with assetsBaseDirectory without trailing slash', async () => {
    const result = await toStyleDictionary(
      seeds().tokens.filter(({ type }) => type === 'font') as Array<Token>,
      { splitBy: '/', assetsBaseDirectory: { fonts: 'fonts' } },
      libs,
    );

    expect(Array.isArray(result)).toEqual(true);
    expect(result.length).toEqual(1); // Time token only creates base
    const file = result[0];
    expect(typeof file.name).toEqual('string');
    expect(file.name).toEqual('asset/font.json');
    expect(typeof file.value.content).toEqual('string');
    const content = JSON.parse(file.value.content!) as Record<string, any>;
    expect(Object.keys(content)[0]).toEqual('asset');
    expect(Object.keys(content.asset)[0]).toEqual('font');
    Object.values(content).forEach(property => {
      Object.values(property).forEach(nestedProperty => {
        Object.values(nestedProperty as Record<string, Record<string, { value: string }>>).forEach(
          format => {
            Object.entries(format).forEach(([format, value]) => {
              if (format === 'name') {
                expect(value.value).toEqual(expect.any(String));
              } else {
                expect(value.value).toContain('fonts/');
              }
            });
          },
        );
      });
    });
  });

  it('Should be able to extract Bitmap token type', async () => {
    const result = await toStyleDictionary(
      seeds().tokens.filter(({ type }) => type === 'bitmap') as Array<Token>,
      { splitBy: '/' },
      libs,
    );
    expect(Array.isArray(result)).toEqual(true);
    expect(result.length).toEqual(1); // Time token only creates base
    const file = result[0];
    expect(typeof file.name).toEqual('string');
    expect(file.name).toEqual('asset/image.json');
    expect(typeof file.value.content).toEqual('string');
    const content = JSON.parse(file.value.content!) as Record<string, any>;
    expect(Object.keys(content)[0]).toEqual('asset');
    expect(Object.keys(content.asset)[0]).toEqual('image');
    Object.values(content.asset).forEach(property => {
      Object.values(property as Record<string, { value: string }>).forEach(nestedProperty => {
        expect(nestedProperty.value).toEqual(expect.any(String));
      });
    });
  });

  it('Should be able to extract Bitmap token type with assetsBaseDirectory', async () => {
    const result = await toStyleDictionary(
      seeds().tokens.filter(({ type }) => type === 'bitmap') as Array<Token>,
      { splitBy: '/', assetsBaseDirectory: { images: 'images/' } },
      libs,
    );
    expect(Array.isArray(result)).toEqual(true);
    expect(result.length).toEqual(1); // Time token only creates base
    const file = result[0];
    expect(typeof file.name).toEqual('string');
    expect(file.name).toEqual('asset/image.json');
    expect(typeof file.value.content).toEqual('string');
    const content = JSON.parse(file.value.content!) as Record<string, any>;
    expect(Object.keys(content)[0]).toEqual('asset');
    expect(Object.keys(content.asset)[0]).toEqual('image');
    Object.values(content.asset).forEach(property => {
      Object.values(property as Record<string, { value: string }>).forEach(nestedProperty => {
        expect(nestedProperty.value.includes('images/')).toBeTruthy();
        expect(nestedProperty.value).toEqual(expect.any(String));
      });
    });
  });

  it('Should be able to extract Bitmap token type with assetsBaseDirectory without trailing slash', async () => {
    const result = await toStyleDictionary(
      seeds().tokens.filter(({ type }) => type === 'bitmap') as Array<Token>,
      { splitBy: '/', assetsBaseDirectory: { images: 'images' } },
      libs,
    );
    expect(Array.isArray(result)).toEqual(true);
    expect(result.length).toEqual(1); // Time token only creates base
    const file = result[0];
    expect(typeof file.name).toEqual('string');
    expect(file.name).toEqual('asset/image.json');
    expect(typeof file.value.content).toEqual('string');
    const content = JSON.parse(file.value.content!) as Record<string, any>;
    expect(Object.keys(content)[0]).toEqual('asset');
    expect(Object.keys(content.asset)[0]).toEqual('image');
    Object.values(content.asset).forEach(property => {
      Object.values(property as Record<string, { value: string }>).forEach(nestedProperty => {
        expect(nestedProperty.value.includes('images/')).toBeTruthy();
        expect(nestedProperty.value).toEqual(expect.any(String));
      });
    });
  });

  it('Should be able to extract Vector token type', async () => {
    const result = await toStyleDictionary(
      seeds().tokens.filter(({ type }) => type === 'vector') as Array<Token>,
      { splitBy: '/' },
      libs,
    );
    expect(Array.isArray(result)).toEqual(true);
    expect(result.length).toEqual(1); // Time token only creates base
    const file = result[0];
    expect(typeof file.name).toEqual('string');
    expect(file.name).toEqual('asset/icon.json');
    expect(typeof file.value.content).toEqual('string');
    const content = JSON.parse(file.value.content!) as Record<string, any>;
    expect(Object.keys(content)[0]).toEqual('asset');
    expect(Object.keys(content.asset)[0]).toEqual('icon');
    Object.values(content.asset).forEach(property => {
      Object.values(property as Record<string, { value: string }>).forEach(nestedProperty => {
        expect(nestedProperty.value).toEqual(expect.any(String));
      });
    });
  });

  it('Should be able to extract Vector token type with assetsBaseDirectory', async () => {
    const result = await toStyleDictionary(
      seeds().tokens.filter(({ type }) => type === 'vector') as Array<Token>,
      { splitBy: '/', assetsBaseDirectory: { icons: 'icons/' } },
      libs,
    );
    expect(Array.isArray(result)).toEqual(true);
    expect(result.length).toEqual(1); // Time token only creates base
    const file = result[0];
    expect(typeof file.name).toEqual('string');
    expect(file.name).toEqual('asset/icon.json');
    expect(typeof file.value.content).toEqual('string');
    const content = JSON.parse(file.value.content!) as Record<string, any>;
    expect(Object.keys(content)[0]).toEqual('asset');
    expect(Object.keys(content.asset)[0]).toEqual('icon');
    Object.values(content.asset).forEach(property => {
      Object.values(property as Record<string, { value: string }>).forEach(nestedProperty => {
        expect(nestedProperty.value.includes('icons/')).toBeTruthy();
        expect(nestedProperty.value).toEqual(expect.any(String));
      });
    });
  });

  it('Should be able to extract Vector token type with assetsBaseDirectory without trailing slash', async () => {
    const result = await toStyleDictionary(
      seeds().tokens.filter(({ type }) => type === 'vector') as Array<Token>,
      { splitBy: '/', assetsBaseDirectory: { icons: 'icons' } },
      libs,
    );
    expect(Array.isArray(result)).toEqual(true);
    expect(result.length).toEqual(1); // Time token only creates base
    const file = result[0];
    expect(typeof file.name).toEqual('string');
    expect(file.name).toEqual('asset/icon.json');
    expect(typeof file.value.content).toEqual('string');
    const content = JSON.parse(file.value.content!) as Record<string, any>;
    expect(Object.keys(content)[0]).toEqual('asset');
    expect(Object.keys(content.asset)[0]).toEqual('icon');
    Object.values(content.asset).forEach(property => {
      Object.values(property as Record<string, { value: string }>).forEach(nestedProperty => {
        expect(nestedProperty.value.includes('icons/')).toBeTruthy();
        expect(nestedProperty.value).toEqual(expect.any(String));
      });
    });
  });

  it('Should be able to extract without splitBy', async () => {
    const result = await toStyleDictionary(
      seeds().tokens.filter(({ type }) => type === 'color') as Array<Token>,
      {},
      libs,
    );

    expect(Array.isArray(result)).toEqual(true);
    expect(result.length).toEqual(1); // Color token only creates base
    const file = result[0];
    expect(typeof file.name).toEqual('string');
    expect(file.name).toEqual('color/base.json');
    expect(typeof file.value.content).toEqual('string');
    const content = JSON.parse(file.value.content!) as Record<string, any>;
    expect(Object.keys(content)[0]).toEqual('color');
    expect(Object.keys(content.color)[0]).toEqual('base');
    expect(content.color.base['colorsAccent']).toEqual({ value: expect.any(String) });
    expect(content.color.base['colorsBlack']).toEqual({ value: expect.any(String) });
    expect(content.color.base['colorsGreen']).toEqual({ value: expect.any(String) });
    expect(content.color.base['colorsGrey']).toEqual({ value: expect.any(String) });
    expect(content.color.base['colorsOrange']).toEqual({ value: expect.any(String) });
  });

  describe('Should generate simple token per type', () => {
    it('Color', () => {
      seeds()
        .tokens.filter(({ type }) => type === 'color')
        .map(color => {
          const tokenClass: StyleDictionaryTokenClass = (<any>TokensClass)['Color'];
          const instance = new tokenClass(color, color.name.split('/'));
          const result = instance.generate({ formatTokens: { colorFormat: { format: 'rgb' } } });
          expect(result).toEqual({
            color: {
              base: {
                Colors: {
                  [color.name.split('/').pop() as string]: {
                    value: expect.any(String),
                  },
                },
              },
            },
          });
        });
    });
    it('Border', () => {
      seeds()
        .tokens.filter(({ type }) => type === 'border')
        .map(border => {
          const tokenClass: StyleDictionaryTokenClass = (<any>TokensClass)['Border'];
          const instance = new tokenClass(border, border.name.split('-'));
          const result = instance.generate({ formatTokens: { colorFormat: { format: 'rgb' } } });
          const expectation: Record<string, any> = {
            size: {
              border: { border: expect.any(Object) },
            },
            color: {
              border: { border: expect.any(Object) },
            },
          };
          if ('radii' in border.value) {
            expectation.size.radius = { border: expect.any(Object) };
          }
          expect(result).toEqual(expectation);
        });
    });
    it('Depth', () => {
      seeds()
        .tokens.filter(({ type }) => type === 'depth')
        .map(depth => {
          const tokenClass: StyleDictionaryTokenClass = (<any>TokensClass)['Depth'];
          const instance = new tokenClass(depth, depth.name.split('-'));
          const result = instance.generate({});
          expect(result).toEqual({
            depth: { base: { [depth.name]: { value: expect.any(String) } } },
          });
        });
    });
    it('Duration', () => {
      seeds()
        .tokens.filter(({ type }) => type === 'duration')
        .map(duration => {
          const tokenClass: StyleDictionaryTokenClass = (<any>TokensClass)['Duration'];
          const instance = new tokenClass(duration, duration.name.split('-'));
          const result = instance.generate({});
          expect(result).toEqual({
            time: { base: { [duration.name]: { value: expect.any(String) } } },
          });
        });
    });
    it('Measurement', () => {
      seeds()
        .tokens.filter(({ type }) => type === 'measurement')
        .map(measurement => {
          const tokenClass: StyleDictionaryTokenClass = (<any>TokensClass)['Measurement'];
          const instance = new tokenClass(measurement, measurement.name.split('-'));
          const result = instance.generate({});
          expect(result).toEqual({
            size: {
              base: {
                base: {
                  space: {
                    [measurement.name.split('-').pop() as string]: {
                      value: expect.any(String),
                    },
                  },
                },
              },
            },
          });
        });
    });
    it('Opacity', () => {
      seeds()
        .tokens.filter(({ type }) => type === 'opacity')
        .map(opacity => {
          const tokenClass: StyleDictionaryTokenClass = (<any>TokensClass)['Opacity'];
          const instance = new tokenClass(opacity, opacity.name.split('-'));
          const result = instance.generate({});
          expect(result).toEqual({
            opacity: {
              base: {
                [opacity.name.split('-').pop() as string]: {
                  value: expect.any(String),
                },
              },
            },
          });
        });
    });
    it('Shadow', () => {
      seeds()
        .tokens.filter(({ type }) => type === 'shadow')
        .map(shadow => {
          const tokenClass: StyleDictionaryTokenClass = (<any>TokensClass)['Shadow'];
          const instance = new tokenClass(shadow, shadow.name.split('-'));
          const result = instance.generate({});
          expect(result).toEqual({
            color: {
              shadow: {
                Elevation: expect.any(Object),
              },
            },
            size: {
              shadow: {
                Elevation: expect.any(Object),
              },
            },
          });
        });
    });
    it('TextStyle', () => {
      seeds()
        .tokens.filter(({ type }) => type === 'textStyle')
        .map(textStyle => {
          const tokenClass: StyleDictionaryTokenClass = (<any>TokensClass)['TextStyle'];
          const instance = new tokenClass(textStyle, textStyle.name.split('-'));
          const result = instance.generate({});
          const firstLevelSplitedTokenName = textStyle.name.split('-').shift() as string;
          const expectation: Record<any, any> = {
            size: {
              font: { [firstLevelSplitedTokenName]: expect.any(Object) },
              lineHeight: { [firstLevelSplitedTokenName]: expect.any(Object) },
            },
          };
          if ('color' in textStyle.value) {
            expectation.color = { font: { [firstLevelSplitedTokenName]: expect.any(Object) } };
          }
          if ('letterSpacing' in textStyle.value) {
            expectation.size.letterSpacing = { [firstLevelSplitedTokenName]: expect.any(Object) };
          }
          if ('textIndent' in textStyle.value) {
            expectation.size.textIndent = { [firstLevelSplitedTokenName]: expect.any(Object) };
          }
          expect(result).toEqual(expectation);
        });
    });
    it('Font', () => {
      seeds()
        .tokens.filter(({ type }) => type === 'font')
        .map(font => {
          const tokenClass: StyleDictionaryTokenClass = (<any>TokensClass)['Font'];
          const [familyName, subFamilyName] = font.name.split('-');
          const instance = new tokenClass(font, [familyName, subFamilyName]);
          const expectedFormats: Array<AllowedFormat> = ['woff', 'woff2'];
          const result = instance.generate({
            formatTokens: {
              fontFormat: expectedFormats,
            },
          });

          expect(result).toEqual({
            asset: {
              font: {
                [familyName]: {
                  [subFamilyName]: expectedFormats.reduce<Record<string, object>>(
                    (acc, format) => {
                      acc[format] = {
                        value: `${font.name}.${format}`,
                      };
                      return acc;
                    },
                    {
                      name: {
                        value: font.name,
                      },
                    },
                  ),
                },
              },
            },
          });
        });
    });
  });
});
