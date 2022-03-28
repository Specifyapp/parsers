import tinycolor from 'tinycolor2';
import * as _ from 'lodash';
import { toTailwind } from './to-tailwind.parser';
import { seeds } from '../../tests/seeds';
import {
  BorderToken,
  ColorToken,
  DepthToken,
  DurationToken,
  FontToken,
  GradientToken,
  MeasurementToken,
  OpacityToken,
  ShadowToken,
  TextStyleToken,
} from '../../types';
import { getNameFormatterFunction } from './utils/getNameFormatterFunction';
import { camelCase } from 'lodash';

describe('To tailwind', () => {
  it('Should generate the colors object', async () => {
    const tokens = seeds(['color']);
    const result = await toTailwind(tokens, undefined);

    tokens.forEach(({ name, value }) => {
      expect(result).toEqual(expect.stringMatching(_.camelCase(name)));
      expect(result).toEqual(expect.stringMatching(tinycolor(value).toString('hex')));
    });

    return;
  });

  it('Should generate the border object', async () => {
    const tokens = seeds(['border']);
    const result = await toTailwind(tokens, undefined);

    tokens.forEach(({ name, value }) => {
      expect(result).toEqual(expect.stringMatching('borderWidth'));
      expect(result).toEqual(
        expect.stringMatching(
          `${_.camelCase(name)}: "${value.width.value.measure}${value.width.value.unit}"`,
        ),
      );
      expect(result).toEqual(expect.stringMatching('borderColor'));
      expect(result).toEqual(
        expect.stringMatching(
          `${_.camelCase(name)}: "${tinycolor(value.color.value).toString('hex')}"`,
        ),
      );
      if (value.radii) {
        expect(result).toEqual(expect.stringMatching('borderRadius'));
        expect(result).toEqual(
          expect.stringMatching(
            `${_.camelCase(name)}: "${value.radii?.value.measure}${value.radii?.value.unit}"`,
          ),
        );
      }

      if (value.color.value.a && value.color.value.a !== 1) {
        expect(result).toEqual(expect.stringMatching('borderOpacity'));
        expect(result).toEqual(
          expect.stringMatching(`${_.camelCase(name)}: "${value.color.value.a}"`),
        );
      }
    });

    return;
  });

  it('Should generate the depth object', async () => {
    const tokens = seeds(['depth']);
    const result = await toTailwind(tokens, undefined);

    tokens.forEach(({ name, value }) => {
      expect(result).toEqual(expect.stringMatching(`${_.camelCase(name)}: "${value.depth}"`));
    });

    return;
  });

  it('Should generate the duration object', async () => {
    const tokens = seeds(['duration']);
    const result = await toTailwind(tokens, undefined);

    tokens.forEach(({ name, value }) => {
      expect(result).toEqual(
        expect.stringMatching(`${_.camelCase(name)}: "${value.duration}${value.unit}"`),
      );
    });

    return;
  });

  it('Should generate the gradient object', async () => {
    const tokens = seeds(['gradient']);
    const result = await toTailwind(tokens, undefined);
    tokens.forEach(({ name, value }) => {
      const gradientValue = value.gradients
        .map(gradient => {
          return `linear-gradient(${gradient.angle}, ${gradient.colors
            .map(({ color, position }) => `${tinycolor(color.value).toString('hex')} ${position}%`)
            .join(', ')})`;
        })
        .join(', ');
      expect(result).toEqual(
        expect.stringMatching(
          `${_.camelCase(name)}: "${gradientValue.replace(/\(/, '\\(').replace(/\)/, '\\)')}"`,
        ),
      );
    });

    return;
  });

  it('Should generate the measurement object', async () => {
    const tokens = seeds(['measurement']);
    const result = await toTailwind(tokens, undefined);

    tokens.forEach(({ name, value }) => {
      expect(result).toEqual(
        expect.stringMatching(`${_.camelCase(name)}: "${value.measure}${value.unit}"`),
      );
    });

    return;
  });

  it('Should generate the opacity object', async () => {
    const tokens = seeds(['opacity']);
    const result = await toTailwind(tokens, undefined);

    tokens.forEach(({ name, value }) => {
      expect(result).toEqual(
        expect.stringMatching(`${_.camelCase(name)}: "${value.opacity / 100}"`),
      );
    });

    return;
  });

  it('Should generate the shadow object', async () => {
    const tokens = seeds(['shadow']);
    const result = await toTailwind(tokens, undefined);

    tokens.forEach(({ name, value }) => {
      const shadowString = value
        .reduce<Array<string>>((acc, shadow) => {
          const { color, offsetX, offsetY, blur, isInner, spread } = shadow;
          const x = `${offsetX.value.measure}${offsetX.value.unit}`;
          const y = `${offsetY.value.measure}${offsetY.value.unit}`;
          const blurString = `${blur.value.measure}${blur.value.unit}`;
          const spreadString = spread ? ` ${spread.value.measure}${spread.value.unit}` : '';
          const innerText = isInner ? 'inset ' : '';
          const colorString = tinycolor(color.value).toString('hex');
          acc.push(`${innerText}${x} ${y} ${blurString}${spreadString} ${colorString}`);
          return acc;
        }, [])
        .join(', ');

      // Create RegExp to skip the problem of
      const regexp = new RegExp(
        `${_.camelCase(name)}:\\s*"${shadowString.replace(/\./g, '\\.')}"`,
        'gm',
      );
      expect(result).toEqual(expect.stringMatching(regexp));
    });

    return;
  });

  it('Should generate the textStyle object', async () => {
    const tokens = seeds(['textStyle']);
    const result = await toTailwind(tokens, undefined);

    tokens.forEach(({ name, value }) => {
      // Match font size
      expect(result).toEqual(expect.stringMatching('fontSize'));
      expect(result).toEqual(
        expect.stringMatching(
          `${_.camelCase(name)}: "${value.fontSize.value.measure}${value.fontSize.value.unit}"`,
        ),
      );
      // Match line height
      expect(result).toEqual(expect.stringMatching('lineHeight'));
      expect(result).toEqual(
        expect.stringMatching(
          `${_.camelCase(name)}: "${value.lineHeight.value.measure}${value.lineHeight.value.unit}"`,
        ),
      );
      // Match fontFamily
      expect(result).toEqual(expect.stringMatching('fontFamily'));
      expect(result).toEqual(
        expect.stringMatching(
          `${_.camelCase(name)}: ["${(value.font as FontToken).name.replace('-', '\\-')}"]`,
        ),
      );
      // Match textOpacity
      expect(result).toEqual(expect.stringMatching('textOpacity'));
      if (value.color?.value.a && value.color?.value.a < 1) {
        expect(result).toEqual(
          expect.stringMatching(`${_.camelCase(name)}: "${value.color?.value.a}"`),
        );
      }

      // Match textColor
      expect(result).toEqual(expect.stringMatching('textColor'));
      if (value.color?.value) {
        expect(result).toEqual(
          expect.stringMatching(
            `${_.camelCase(name)}: "${tinycolor(value.color.value).toString('hex')}"`,
          ),
        );
      }

      // Match letterSpacing
      expect(result).toEqual(expect.stringMatching('letterSpacing'));
      if (value.letterSpacing?.value) {
        expect(result).toEqual(
          expect.stringMatching(
            `${_.camelCase(name)}: "${value.letterSpacing.value.measure}${
              value.letterSpacing.value.unit
            }"`,
          ),
        );
      }
    });

    return;
  });

  it('Should generate with multiple types', async () => {
    const tokens = seeds(['color', 'gradient']);
    const result = await toTailwind(tokens, undefined);

    tokens.forEach(token => {
      if (token.type === 'color') {
        const color = token;
        expect(result).toEqual(expect.stringMatching(_.camelCase(color.name)));
        expect(result).toEqual(expect.stringMatching(tinycolor(color.value).toString('hex')));
      } else {
        const gradient = token;

        const gradientValue = gradient.value.gradients
          .map(gradient => {
            return `linear-gradient(${gradient.angle}, ${gradient.colors
              .map(
                ({ color, position }) => `${tinycolor(color.value).toString('hex')} ${position}%`,
              )
              .join(', ')})`;
          })
          .join(', ');

        expect(result).toEqual(
          expect.stringMatching(
            `.*${_.camelCase(gradient.name)}: "${gradientValue
              .replace(/\(/, '\\(')
              .replace(/\)/, '\\)')}".*`,
          ),
        );
      }
    });
    return;
  });

  it('Should generate with specific formatName', async () => {
    const tokens = seeds(['color']);
    const result = await toTailwind(tokens, { formatName: 'kebabCase' });

    tokens.forEach(({ name, value }) => {
      expect(result).toEqual(expect.stringMatching(_.kebabCase(name)));
      expect(result).toEqual(expect.stringMatching(tinycolor(value).toString('hex')));
    });

    return;
  });

  it('Should generate with specific format on colors', async () => {
    const tokens = seeds(['color']);
    const result = await toTailwind(tokens, {
      formatTokens: {
        colorFormat: {
          format: 'hsl',
        },
      },
    });

    tokens.forEach(({ name, value }) => {
      expect(result).toEqual(
        expect.stringMatching(
          `${_.camelCase(name)}: "${tinycolor(value)
            .toString('hsl')
            .replace(/\(/, '\\(')
            .replace(/\)/, '\\)')}"`,
        ),
      );
    });

    return;
  });

  it('Should generate with specific format on textStyle', async () => {
    const tokens = seeds(['textStyle']);
    const result = await toTailwind(tokens, {
      formatTokens: {
        fontSizeFormat: {
          unit: 'rem',
        },
      },
    });

    tokens.forEach(({ name, value }) => {
      // Match font size
      expect(result).toEqual(expect.stringMatching('fontSize'));
      expect(result).toEqual(
        expect.stringMatching(`${_.camelCase(name)}: "${value.fontSize.value.measure}rem"`),
      );
      // Match line height
      expect(result).toEqual(expect.stringMatching('lineHeight'));
      expect(result).toEqual(
        expect.stringMatching(
          `${_.camelCase(name)}: "${value.lineHeight.value.measure}${value.lineHeight.value.unit}"`,
        ),
      );
      // Match fontFamily
      expect(result).toEqual(expect.stringMatching('fontFamily'));
      expect(result).toEqual(
        expect.stringMatching(
          `${_.camelCase(name)}: ["${(value.font as FontToken).name.replace('-', '\\-')}"]`,
        ),
      );
      // Match textOpacity
      expect(result).toEqual(expect.stringMatching('textOpacity'));
      if (value.color?.value.a && value.color?.value.a < 1) {
        expect(result).toEqual(
          expect.stringMatching(`${_.camelCase(name)}: "${value.color?.value.a}"`),
        );
      }

      // Match textColor
      expect(result).toEqual(expect.stringMatching('textColor'));
      if (value.color?.value) {
        expect(result).toEqual(
          expect.stringMatching(
            `${_.camelCase(name)}: "${tinycolor(value.color.value).toString('hex')}"`,
          ),
        );
      }

      // Match letterSpacing
      expect(result).toEqual(expect.stringMatching('letterSpacing'));
      if (value.letterSpacing?.value) {
        expect(result).toEqual(
          expect.stringMatching(
            `${_.camelCase(name)}: "${value.letterSpacing.value.measure}${
              value.letterSpacing.value.unit
            }"`,
          ),
        );
      }
    });

    return;
  });

  it('Should generate with specific as es6 exportDefault', async () => {
    const tokens = seeds(['color']);
    const result = await toTailwind(tokens, {
      formatConfig: {
        module: 'es6',
        exportDefault: true,
      },
    });

    tokens.forEach(({ name, value }) => {
      expect(result).toEqual(expect.stringMatching(_.camelCase(name)));
      expect(result).toEqual(expect.stringMatching(tinycolor(value).toString('hex')));
    });

    expect(result).toEqual(expect.stringMatching('const theme'));
    expect(result).toEqual(expect.stringMatching('export default theme'));

    return;
  });

  it('Should generate with specific as es6 not export default', async () => {
    const tokens = seeds(['color']);
    const result = await toTailwind(tokens, {
      formatConfig: {
        module: 'es6',
        exportDefault: false,
      },
    });

    tokens.forEach(({ name, value }) => {
      expect(result).toEqual(expect.stringMatching(_.camelCase(name)));
      expect(result).toEqual(expect.stringMatching(tinycolor(value).toString('hex')));
    });

    expect(result).toEqual(expect.stringMatching('export const theme'));

    return;
  });

  it('Should generate with specific as commonjs export default', async () => {
    const tokens = seeds(['color']);
    const result = await toTailwind(tokens, {
      formatConfig: {
        module: 'commonjs',
        exportDefault: true,
      },
    });

    tokens.forEach(({ name, value }) => {
      expect(result).toEqual(expect.stringMatching(_.camelCase(name)));
      expect(result).toEqual(expect.stringMatching(tinycolor(value).toString('hex')));
    });

    expect(result).toEqual(expect.stringMatching('const theme'));
    expect(result).toEqual(expect.stringMatching('module.exports = theme'));

    return;
  });

  it('Should generate with specific as commonjs not export default', async () => {
    const tokens = seeds(['color']);
    const result = await toTailwind(tokens, {
      formatConfig: {
        module: 'commonjs',
        exportDefault: false,
      },
    });

    tokens.forEach(({ name, value }) => {
      expect(result).toEqual(expect.stringMatching(_.camelCase(name)));
      expect(result).toEqual(expect.stringMatching(tinycolor(value).toString('hex')));
    });

    expect(result).toEqual(expect.stringMatching('const theme'));
    expect(result).toEqual(expect.stringMatching('module.exports = { theme }'));

    return;
  });

  it('Should generate with specific objectName', async () => {
    const tokens = seeds(['color']);
    const result = await toTailwind(tokens, {
      formatConfig: {
        module: 'es6',
        exportDefault: true,
        objectName: 'extend',
      },
    });

    tokens.forEach(({ name, value }) => {
      expect(result).toEqual(expect.stringMatching(_.camelCase(name)));
      expect(result).toEqual(expect.stringMatching(tinycolor(value).toString('hex')));
    });

    expect(result).toEqual(expect.stringMatching('const extend'));
    expect(result).toEqual(expect.stringMatching('export default extend'));

    return;
  });

  it('Should allow renaming of `border` tokens', async () => {
    const tokens = seeds(['border']);
    const borderWidthPrefix = 'border-width-';
    const borderRadiusPrefix = 'border-radius-';
    const borderColorPrefix = 'border-color-';
    const borderOpacityPrefix = 'border-opacity-';

    const formatName = 'kebabCase';
    const result = await toTailwind(tokens, {
      renameKeys: {
        borderWidth: `${borderWidthPrefix}{{name}}`,
        borderRadius: `${borderRadiusPrefix}{{name}}`,
        borderColor: `${borderColorPrefix}{{name}}`,
        borderOpacity: `${borderOpacityPrefix}{{name}}`,
      },
      formatName,
      formatConfig: {
        module: 'es6',
        exportDefault: true,
        objectName: 'extend',
      },
    });

    tokens.forEach(({ name, value }) => {
      const transformedName = getNameFormatterFunction(formatName)(name);
      expect(result).toEqual(expect.stringContaining(`${borderWidthPrefix}${transformedName}`));
      expect(result).toEqual(expect.stringContaining(`${borderColorPrefix}${transformedName}`));

      // only for tokens with radii values
      if (value.radii) {
        expect(result).toEqual(expect.stringContaining(`${borderRadiusPrefix}${transformedName}`));
      }

      // only for border color using alpha
      if (value.color.value.a < 1) {
        expect(result).toEqual(expect.stringContaining(`${borderOpacityPrefix}${transformedName}`));
      }
    });
  });
  it('Should allow renaming of `color` tokens', async () => {
    const tokens = seeds(['color']);
    const prefix = 'color-';

    const formatName = 'kebabCase';
    const result = await toTailwind(tokens, {
      renameKeys: {
        colors: `${prefix}{{name}}`,
      },
      formatName,
      formatConfig: {
        module: 'es6',
        exportDefault: true,
        objectName: 'extend',
      },
    });

    tokens.forEach(({ name }) => {
      const transformedName = getNameFormatterFunction(formatName)(name);
      expect(result).toEqual(expect.stringContaining(`${prefix}${transformedName}`));
    });
  });
  it('Should allow renaming of `depth` tokens', async () => {
    const tokens = seeds(['depth']);
    const prefix = 'depth-';

    const formatName = 'kebabCase';
    const result = await toTailwind(tokens, {
      renameKeys: {
        zIndex: `${prefix}{{name}}`,
      },
      formatName,
      formatConfig: {
        module: 'es6',
        exportDefault: true,
        objectName: 'extend',
      },
    });

    tokens.forEach(({ name }) => {
      const transformedName = getNameFormatterFunction(formatName)(name);
      expect(result).toEqual(expect.stringContaining(`${prefix}${transformedName}`));
    });
  });
  it('Should allow renaming of `duration` tokens', async () => {
    const tokens = seeds(['duration']);
    const prefix = 'duration-';

    const formatName = 'kebabCase';
    const result = await toTailwind(tokens, {
      renameKeys: {
        transitionDuration: `${prefix}{{name}}`,
      },
      formatName,
      formatConfig: {
        module: 'es6',
        exportDefault: true,
        objectName: 'extend',
      },
    });

    tokens.forEach(({ name }) => {
      const transformedName = getNameFormatterFunction(formatName)(name);
      expect(result).toEqual(expect.stringContaining(`${prefix}${transformedName}`));
    });
  });
  it('Should allow renaming of `gradient` tokens', async () => {
    const tokens = seeds(['gradient']);
    const prefix = 'gradient-';

    const formatName = 'kebabCase';
    const result = await toTailwind(tokens, {
      renameKeys: {
        backgroundImage: `${prefix}{{name}}`,
      },
      formatName,
      formatConfig: {
        module: 'es6',
        exportDefault: true,
        objectName: 'extend',
      },
    });

    tokens.forEach(({ name }) => {
      const transformedName = getNameFormatterFunction(formatName)(name);
      expect(result).toEqual(expect.stringContaining(`${prefix}${transformedName}`));
    });
  });
  it('Should allow renaming of `measurement` tokens', async () => {
    const tokens = seeds(['measurement']);
    const prefix = 'measurement-';

    const formatName = 'kebabCase';
    const result = await toTailwind(tokens, {
      renameKeys: {
        spacing: `${prefix}{{name}}`,
      },
      formatName,
      formatConfig: {
        module: 'es6',
        exportDefault: true,
        objectName: 'extend',
      },
    });

    tokens.forEach(({ name }) => {
      const transformedName = getNameFormatterFunction(formatName)(name);
      expect(result).toEqual(expect.stringContaining(`${prefix}${transformedName}`));
    });
  });
  it('Should allow renaming of `opacity` tokens', async () => {
    const tokens = seeds(['opacity']);
    const prefix = 'opacity-';

    const formatName = 'kebabCase';
    const result = await toTailwind(tokens, {
      renameKeys: {
        opacity: `${prefix}{{name}}`,
      },
      formatName,
      formatConfig: {
        module: 'es6',
        exportDefault: true,
        objectName: 'extend',
      },
    });

    tokens.forEach(({ name }) => {
      const transformedName = getNameFormatterFunction(formatName)(name);
      expect(result).toEqual(expect.stringContaining(`${prefix}${transformedName}`));
    });
  });
  it('Should allow renaming of `shadow` tokens', async () => {
    const tokens = seeds(['shadow']);
    const prefix = 'shadow-';

    const formatName = 'kebabCase';
    const result = await toTailwind(tokens, {
      renameKeys: {
        boxShadow: `${prefix}{{name}}`,
      },
      formatName,
      formatConfig: {
        module: 'es6',
        exportDefault: true,
        objectName: 'extend',
      },
    });

    tokens.forEach(({ name }) => {
      const transformedName = getNameFormatterFunction(formatName)(name);
      expect(result).toEqual(expect.stringContaining(`${prefix}${transformedName}`));
    });
  });

  it('Should allow to format object with the splitBy options', async () => {
    const tokens = seeds([
      'border',
      'color',
      'depth',
      'duration',
      'gradient',
      'measurement',
      'opacity',
      'shadow',
      'textStyle',
    ]);
    const result = await toTailwind(tokens, {
      splitBy: '/',
    });
    tokens.forEach(token => {
      if (token.name.includes('/')) {
        expect(result).toEqual(
          expect.stringContaining(`${camelCase(token.name.split('/')[0])}: {`),
        );
        expect(result).toEqual(expect.stringContaining(`${camelCase(token.name.split('/')[1])}: `));
      } else {
        expect(result).toEqual(expect.stringContaining(camelCase(token.name)));
      }
    });
  });

  it('Should allow renaming of `textStyle` tokens', async () => {
    const tokens = seeds(['textStyle']);
    const fontSizePrefix = 'text-style-font-size-';
    const letterSpacingPrefix = 'text-style-letter-spacing-';
    const lineHeightPrefix = 'text-style-line-height-';
    const textColorPrefix = 'text-style-text-color-';
    const textOpacityPrefix = 'text-style-text-opacity-';
    const fontFamilyPrefix = 'text-style-font-family-';
    const fontWeightPrefix = 'text-style-font-weight-';

    const formatName = 'kebabCase';
    const result = await toTailwind(tokens, {
      renameKeys: {
        fontSize: `${fontSizePrefix}{{name}}`,
        letterSpacing: `${letterSpacingPrefix}{{name}}`,
        lineHeight: `${lineHeightPrefix}{{name}}`,
        textColor: `${textColorPrefix}{{name}}`,
        textOpacity: `${textOpacityPrefix}{{name}}`,
        fontFamily: `${fontFamilyPrefix}{{name}}`,
        fontWeight: `${fontWeightPrefix}{{name}}`,
      },
      formatName,
      formatConfig: {
        module: 'es6',
        exportDefault: true,
        objectName: 'extend',
      },
    });

    tokens.forEach(({ name, value }) => {
      const transformedName = getNameFormatterFunction(formatName)(name);

      expect(result).toEqual(expect.stringContaining(`${fontSizePrefix}${transformedName}`));
      expect(result).toEqual(expect.stringContaining(`${lineHeightPrefix}${transformedName}`));
      expect(result).toEqual(expect.stringContaining(`${fontFamilyPrefix}${transformedName}`));
      expect(result).toEqual(expect.stringContaining(`${fontWeightPrefix}${transformedName}`));
      if (value.letterSpacing) {
        expect(result).toEqual(expect.stringContaining(`${letterSpacingPrefix}${transformedName}`));
      }
      if (value.color) {
        expect(result).toEqual(expect.stringContaining(`${textColorPrefix}${transformedName}`));
      }
      if (value.color && value.color.value.a < 1) {
        expect(result).toEqual(expect.stringContaining(`${textOpacityPrefix}${transformedName}`));
      }
    });
  });
});
