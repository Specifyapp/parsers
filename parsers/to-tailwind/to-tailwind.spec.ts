import tinycolor from 'tinycolor2';
import * as _ from 'lodash';
import toTailwind from './to-tailwind.parser';
import seeds from '../../tests/seeds';
import libs from '../global-libs';
import {
  BorderToken,
  ColorToken,
  DepthToken,
  DurationToken,
  GradientToken,
  MeasurementToken,
  OpacityToken,
  ShadowToken,
  TextStyleToken,
} from '../../types';

describe('To tailwind', () => {
  it('Should generate the colors object', async done => {
    const tokens = seeds().tokens.filter(token => token.type === 'color') as Array<ColorToken>;
    const result = await toTailwind(tokens, undefined, libs);

    tokens.forEach(({ name, value }) => {
      expect(result).toEqual(expect.stringMatching(_.camelCase(name)));
      expect(result).toEqual(expect.stringMatching(tinycolor(value).toString('hex')));
    });

    done();
  });

  it('Should generate the border object', async done => {
    const tokens = seeds().tokens.filter(token => token.type === 'border') as Array<BorderToken>;
    const result = await toTailwind(tokens, undefined, libs);

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
      expect(result).toEqual(expect.stringMatching('borderRadius'));
      expect(result).toEqual(
        expect.stringMatching(
          `${_.camelCase(name)}: "${value.radii?.value.measure}${value.radii?.value.unit}"`,
        ),
      );

      if (value.color.value.a && value.color.value.a !== 1) {
        expect(result).toEqual(expect.stringMatching('borderOpacity'));
        expect(result).toEqual(
          expect.stringMatching(`${_.camelCase(name)}: "${value.color.value.a}"`),
        );
      }
    });

    done();
  });

  it('Should generate the depth object', async done => {
    const tokens = seeds().tokens.filter(token => token.type === 'depth') as Array<DepthToken>;
    const result = await toTailwind(tokens, undefined, libs);

    tokens.forEach(({ name, value }) => {
      expect(result).toEqual(expect.stringMatching(`${_.camelCase(name)}: "${value.depth}"`));
    });

    done();
  });

  it('Should generate the duration object', async done => {
    const tokens = seeds().tokens.filter(token => token.type === 'duration') as Array<
      DurationToken
    >;
    const result = await toTailwind(tokens, undefined, libs);

    tokens.forEach(({ name, value }) => {
      expect(result).toEqual(
        expect.stringMatching(`${_.camelCase(name)}: "${value.duration}${value.unit}"`),
      );
    });

    done();
  });

  it('Should generate the gradient object', async done => {
    const tokens = seeds().tokens.filter(token => token.type === 'gradient') as Array<
      GradientToken
    >;
    const result = await toTailwind(tokens, undefined, libs);

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
          `.*${_.camelCase(name)}: "${gradientValue.replace(/\(/, '\\(').replace(/\)/, '\\)')}".*`,
        ),
      );
    });

    done();
  });

  it('Should generate the measurement object', async done => {
    const tokens = seeds().tokens.filter(token => token.type === 'measurement') as Array<
      MeasurementToken
    >;
    const result = await toTailwind(tokens, undefined, libs);

    tokens.forEach(({ name, value }) => {
      expect(result).toEqual(
        expect.stringMatching(`${_.camelCase(name)}: "${value.measure}${value.unit}"`),
      );
    });

    done();
  });

  it('Should generate the opacity object', async done => {
    const tokens = seeds().tokens.filter(token => token.type === 'opacity') as Array<OpacityToken>;
    const result = await toTailwind(tokens, undefined, libs);

    tokens.forEach(({ name, value }) => {
      expect(result).toEqual(
        expect.stringMatching(`${_.camelCase(name)}: "${value.opacity / 100}"`),
      );
    });

    done();
  });

  it('Should generate the shadow object', async done => {
    const tokens = seeds().tokens.filter(token => token.type === 'shadow') as Array<ShadowToken>;
    const result = await toTailwind(tokens, undefined, libs);

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

    done();
  });

  it('Should generate the textStyle object', async done => {
    const tokens = seeds().tokens.filter(token => token.type === 'textStyle') as Array<
      TextStyleToken
    >;
    const result = await toTailwind(tokens, undefined, libs);

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
        expect.stringMatching(`${_.camelCase(name)}: ["${value.font.value.fontFamily}"]`),
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

    done();
  });

  it('Should generate with multiple types', async done => {
    const tokens = seeds().tokens.filter(token =>
      ['color', 'gradient'].includes(token.type),
    ) as Array<ColorToken | GradientToken>;
    const result = await toTailwind(tokens, undefined, libs);

    tokens.forEach(token => {
      if (token.type === 'color') {
        const color = token as ColorToken;
        expect(result).toEqual(expect.stringMatching(_.camelCase(color.name)));
        expect(result).toEqual(expect.stringMatching(tinycolor(color.value).toString('hex')));
      } else {
        const gradient = token as GradientToken;

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
    done();
  });

  it('Should generate with specific formatName', async done => {
    const tokens = seeds().tokens.filter(token => token.type === 'color') as Array<ColorToken>;
    const result = await toTailwind(tokens, { formatName: 'kebabCase' }, libs);

    tokens.forEach(({ name, value }) => {
      expect(result).toEqual(expect.stringMatching(_.kebabCase(name)));
      expect(result).toEqual(expect.stringMatching(tinycolor(value).toString('hex')));
    });

    done();
  });

  it('Should generate with specific format on colors', async done => {
    const tokens = seeds().tokens.filter(token => token.type === 'color') as Array<ColorToken>;
    const result = await toTailwind(
      tokens,
      {
        formatTokens: {
          colorFormat: {
            format: 'hsl',
          },
        },
      },
      libs,
    );

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

    done();
  });

  it('Should generate with specific format on textStyle', async done => {
    const tokens = seeds().tokens.filter(token => token.type === 'textStyle') as Array<
      TextStyleToken
    >;
    const result = await toTailwind(
      tokens,
      {
        formatTokens: {
          fontSizeFormat: {
            unit: 'rem',
          },
        },
      },
      libs,
    );

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
        expect.stringMatching(`${_.camelCase(name)}: ["${value.font.value.fontFamily}"]`),
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

    done();
  });

  it('Should generate with specific as es6 exportDefault', async done => {
    const tokens = seeds().tokens.filter(token => token.type === 'color') as Array<ColorToken>;
    const result = await toTailwind(
      tokens,
      {
        formatConfig: {
          module: 'es6',
          exportDefault: true,
        },
      },
      libs,
    );

    tokens.forEach(({ name, value }) => {
      expect(result).toEqual(expect.stringMatching(_.camelCase(name)));
      expect(result).toEqual(expect.stringMatching(tinycolor(value).toString('hex')));
    });

    expect(result).toEqual(expect.stringMatching('const theme'));
    expect(result).toEqual(expect.stringMatching('export default theme'));

    done();
  });

  it('Should generate with specific as es6 not export default', async done => {
    const tokens = seeds().tokens.filter(token => token.type === 'color') as Array<ColorToken>;
    const result = await toTailwind(
      tokens,
      {
        formatConfig: {
          module: 'es6',
          exportDefault: false,
        },
      },
      libs,
    );

    tokens.forEach(({ name, value }) => {
      expect(result).toEqual(expect.stringMatching(_.camelCase(name)));
      expect(result).toEqual(expect.stringMatching(tinycolor(value).toString('hex')));
    });

    expect(result).toEqual(expect.stringMatching('export const theme'));

    done();
  });

  it('Should generate with specific as commonjs export default', async done => {
    const tokens = seeds().tokens.filter(token => token.type === 'color') as Array<ColorToken>;
    const result = await toTailwind(
      tokens,
      {
        formatConfig: {
          module: 'commonjs',
          exportDefault: true,
        },
      },
      libs,
    );

    tokens.forEach(({ name, value }) => {
      expect(result).toEqual(expect.stringMatching(_.camelCase(name)));
      expect(result).toEqual(expect.stringMatching(tinycolor(value).toString('hex')));
    });

    expect(result).toEqual(expect.stringMatching('const theme'));
    expect(result).toEqual(expect.stringMatching('module.exports = theme'));

    done();
  });

  it('Should generate with specific as commonjs not export default', async done => {
    const tokens = seeds().tokens.filter(token => token.type === 'color') as Array<ColorToken>;
    const result = await toTailwind(
      tokens,
      {
        formatConfig: {
          module: 'commonjs',
          exportDefault: false,
        },
      },
      libs,
    );

    tokens.forEach(({ name, value }) => {
      expect(result).toEqual(expect.stringMatching(_.camelCase(name)));
      expect(result).toEqual(expect.stringMatching(tinycolor(value).toString('hex')));
    });

    expect(result).toEqual(expect.stringMatching('const theme'));
    expect(result).toEqual(expect.stringMatching('module.exports = { theme }'));

    done();
  });

  it('Should generate with specific objectName', async done => {
    const tokens = seeds().tokens.filter(token => token.type === 'color') as Array<ColorToken>;
    const result = await toTailwind(
      tokens,
      {
        formatConfig: {
          module: 'es6',
          exportDefault: true,
          objectName: 'extend',
        },
      },
      libs,
    );

    tokens.forEach(({ name, value }) => {
      expect(result).toEqual(expect.stringMatching(_.camelCase(name)));
      expect(result).toEqual(expect.stringMatching(tinycolor(value).toString('hex')));
    });

    expect(result).toEqual(expect.stringMatching('const extend'));
    expect(result).toEqual(expect.stringMatching('export default extend'));

    done();
  });
});
