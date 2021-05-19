import * as os from 'os';
import toScssMap, { TYPES_USING_FUNCTION, TYPES_USING_MIXIN } from './to-scss-map.parser';
import libs from '../global-libs';
import seeds from '../../tests/seeds';
import { Token } from '../../types';
import { render } from '../../tests/helper/runScss';
import { ToScssMapTokenType } from './to-scss-map.type';
import colorHandler from './tokens/color';

jest.setTimeout(3 * 60 * 1000);

describe('to-scss-map', () => {
  describe('Generate tokens', () => {
    it('Expect result to be a valid downloadable file', async done => {
      const result = await toScssMap(
        seeds().tokens.filter(({ type }) => type === 'color') as Array<Token>,
        { splitBy: '/', formatConfig: { singleQuote: true } },
        libs,
      );

      expect(Array.isArray(result)).toEqual(true);
      result.forEach(file => expect(typeof file.value.content).toEqual('string'));
      done();
    });

    it('Expect result to be a valid downloadable file when there is no options', async done => {
      const result = await toScssMap(seeds().tokens as Array<Token>, undefined, libs);

      expect(Array.isArray(result)).toEqual(true);
      result.forEach(file => expect(typeof file.value.content).toEqual('string'));
      done();
    });

    it('should throw unexpected error from the parser', async done => {
      try {
        jest.spyOn(colorHandler, 'run').mockImplementationOnce(() => {
          throw new Error('Unexpected error');
        });
        await toScssMap(seeds().tokens as Array<Token>, {}, libs);
        fail();
      } catch (err) {
        expect(err.message).toMatch('Unexpected error');
      }
      done();
    });

    it('should not have function with the omit option', async done => {
      const result = await toScssMap(
        seeds().tokens.filter(({ type }) => type === 'color') as Array<Token>,
        { splitBy: '/', omitFunctionAndMixin: true },
        libs,
      );

      expect(Array.isArray(result)).toEqual(true);
      result.forEach(file => {
        expect(typeof file.value.content).toEqual('string');
        expect(file.value.content!.includes('get-token-for-color')).toBeFalsy();
      });
      done();
    });

    it('should not have mixin with the omit option', async done => {
      const result = await toScssMap(
        seeds().tokens.filter(({ type }) => type === 'textStyle') as Array<Token>,
        { splitBy: '/', omitFunctionAndMixin: true },
        libs,
      );

      expect(Array.isArray(result)).toEqual(true);
      result.forEach(file => {
        expect(typeof file.value.content).toEqual('string');
        expect(file.value.content!.includes('mixin-for-text-style')).toBeFalsy();
      });
      done();
    });
  });

  describe('SCSS functions', () => {
    it('should be able to get values from the scss function', async done => {
      const testFunctionMapping: Record<string, string> = {
        depth: '.test { z-index: get-depth(middle); }',
        duration: '.test { transition-duration: get-duration(short); }',
        measurement: '.test { width: get-measurement(baseSpace05); }',
        border: '.test { border: get-border(borderDashed); }',
        color: '.test { color: get-color(colors, white); }',
        shadow: '.test { box-shadow: get-shadow(elevation3); }',
        gradient: '.test { background-image: get-gradient(gradients, colored); }',
        opacity: '.test { opacity: get-opacity(subtle); }',
      };

      const expectedMapping: Record<string, string> = {
        depth: '.test { z-index: 50; }',
        duration: '.test { transition-duration: 100ms; }',
        measurement: '.test { width: 32px; }',
        border: '.test { border: 1px dashed #1e212b; }',
        color: '.test { color: white; }',
        shadow:
          '.test { box-shadow: 0px 1.85185px 3.14815px rgba(0, 0, 0, 0.02), 0px 8.14815px 6.51852px rgba(0, 0, 0, 0.03), 0px 20px 13px rgba(0, 0, 0, 0.04), 0px 38.51852px 25.48148px rgba(0, 0, 0, 0.04), 0px 64.81481px 46.85185px rgba(0, 0, 0, 0.05), 0px 100px 80px 1px rgba(0, 0, 0, 0.07); }',
        gradient: '.test { background-image: linear-gradient(90deg, #f5483f 0%, #ff8e05 100%); }',
        opacity: '.test { opacity: 0.5; }',
      };

      const ScssMapsResponse = await toScssMap(
        seeds().tokens.filter(token =>
          TYPES_USING_FUNCTION.includes(token.type as ToScssMapTokenType),
        ) as Array<Token>,
        { splitBy: '/', formatConfig: { singleQuote: true } },
        libs,
      );

      await Promise.all(
        ScssMapsResponse.map(async fileGenerated => {
          const type = /get-(.*)\(/.exec(fileGenerated.value.content!)![1];
          const functionExecution = testFunctionMapping[type] ?? '';
          const data = `${fileGenerated.value.content}${os.EOL}${functionExecution}`;

          const content = await render({ data });
          if (expectedMapping[type]) {
            expect(content.css.toString().includes(expectedMapping[type])).toBeTruthy();
          }
        }),
      );

      done();
    });

    it('should be able to get the properties from the scss mixin', async done => {
      const testFunctionMapping: Record<string, string> = {
        'text-style': '.test { @include text-style(title); }',
      };

      const expectedMapping: Record<string, string> = {
        'text-style':
          '.test { font-family: "Inter-SemiBold"; font-size: 32px; font-weight: 600; line-height: 40px; }',
      };

      const ScssMapsResponse = await toScssMap(
        seeds().tokens.filter(token =>
          TYPES_USING_MIXIN.includes(token.type as ToScssMapTokenType),
        ) as Array<Token>,
        { splitBy: '/', formatConfig: { singleQuote: true } },
        libs,
      );

      await Promise.all(
        ScssMapsResponse.map(async fileGenerated => {
          const type = /mixin (.*)\(/.exec(fileGenerated.value.content!)![1];
          const functionExecution = testFunctionMapping[type] ?? '';
          const data = `${fileGenerated.value.content}${os.EOL}${functionExecution}`;
          const content = await render({ data });

          if (expectedMapping[type]) {
            expect(content.css.toString().includes(expectedMapping[type])).toBeTruthy();
          }
        }),
      );

      done();
    });

    it('should throw error from the scss function if missing parameter', async done => {
      const testFunctionMapping: Record<string, string> = {
        depth: '.test { z-index: get-depth(); }',
        duration: '.test { transition-duration: get-duration(); }',
        measurement: '.test { width: get-measurement(); }',
        border: '.test { border: get-border(); }',
        color: '.test { color: get-color(colors); }',
        shadow: '.test { box-shadow: get-shadow(); }',
        gradient: '.test { background-image: get-gradient(gradients); }',
        opacity: '.test { opacity: get-opacity(); }',
      };

      const expectedError: Record<string, string> = {
        depth: 'Non usable value. Got `(background: 1, middle: 50, foreground: 100)`',
        duration: 'Non usable value. Got `(veryLong: 3s, short: 100ms, base: 300ms, long: 700ms)',
        measurement:
          'Non usable value. Got `(baseSpace01: 4px, baseSpace02: 8px, baseSpace03: 12px, baseSpace04: 16px, baseSpace05: 32px, baseSpace06: 48px, baseSpace07: 64px, baseSpace08: 80px, baseSpace09: 96px, baseSpace10: 112px)`',
        border:
          'Non usable value. Got `(borderAccent: 2px solid #6650ef, borderAccentWithOpacity: 2px solid rgba(102, 80, 239, 0.5), borderAccentWithoutRadii: 2px solid rgba(102, 80, 239, 0.5), borderDashed: 1px dashed #1e212b)`',
        color:
          'Non usable value. Got `(colors: (accent: #577cfe, black: #1e212b, green: #58cd52, grey: #ccd5e1, orange: #ff8e05, red: #f5483f, white: white))`',
        shadow:
          'Non usable value. Got `(elevation1: 0px 4px 8px rgba(0, 0, 0, 0.1), elevation2: 0px 4px 28px rgba(0, 0, 0, 0.1), 0px 4px 4px rgba(0, 0, 0, 0.1), elevation3: 0px 1.85185px 3.14815px rgba(0, 0, 0, 0.02), 0px 8.14815px 6.51852px rgba(0, 0, 0, 0.03), 0px 20px 13px rgba(0, 0, 0, 0.04), 0px 38.51852px 25.48148px rgba(0, 0, 0, 0.04), 0px 64.81481px 46.85185px rgba(0, 0, 0, 0.05), 0px 100px 80px 1px rgba(0, 0, 0, 0.07))`',
        gradient:
          'Non usable value. Got `(gradients: (colored: linear-gradient(90deg, #f5483f 0%, #ff8e05 100%), dark: linear-gradient(90deg, #1e212b 0%, #ccd5e1 100%), neutral: linear-gradient(90deg, #ccd5e1 0%, white 100%), safari: linear-gradient(90deg, #ff8e05 0%, white 100%)))`',
        opacity: 'Non usable value. Got `(transparent: 0.1, subtle: 0.5, visible: 0.95)`',
      };

      const ScssMapsResponse = await toScssMap(
        seeds().tokens.filter(token =>
          TYPES_USING_FUNCTION.includes(token.type as ToScssMapTokenType),
        ) as Array<Token>,
        { splitBy: '/', formatConfig: { singleQuote: true } },
        libs,
      );

      await Promise.all(
        ScssMapsResponse.map(async fileGenerated => {
          const type = /get-(.*)\(/.exec(fileGenerated.value.content!)![1];
          const functionExecution = testFunctionMapping[type] ?? '';
          const data = `${fileGenerated.value.content}${os.EOL}${functionExecution}`;

          try {
            await render({ data });
          } catch (error) {
            expect(error.message.includes(expectedError[type])).toBeTruthy();
          }
        }),
      );

      done();
    });

    it('should throw error from the scss mixin if missing parameters', async done => {
      const testFunctionMapping: Record<string, string> = {
        'text-style': '.test { @include text-style(); }',
      };

      const expectedError: Record<string, string> = {
        'text-style':
          '(font-family: "Inter-Medium", font-size: 14px, font-weight: 500, letter-spacing: 10px, line-height: 20px) isn\'t a valid CSS value',
      };

      const scssMapsResponse = await toScssMap(
        seeds().tokens.filter(token =>
          TYPES_USING_MIXIN.includes(token.type as ToScssMapTokenType),
        ) as Array<Token>,
        { splitBy: '/', formatConfig: { singleQuote: true } },
        libs,
      );

      await Promise.all(
        scssMapsResponse.map(async fileGenerated => {
          const type = /mixin (.*)\(/.exec(fileGenerated.value.content!)![1];
          const functionExecution = testFunctionMapping[type] ?? '';
          const data = `${fileGenerated.value.content}${os.EOL}${functionExecution}`;

          try {
            await render({ data });
          } catch (error) {
            expect(error.message.includes(expectedError[type])).toBeTruthy();
          }
        }),
      );

      done();
    });

    it('should throw error from the scss mixin if too much params', async done => {
      const testFunctionMapping: Record<string, string> = {
        'text-style': '.test { @include text-style(body, font-family); }',
      };

      const expectedError: Record<string, string> = {
        'text-style':
          'Non usable value. Got `(body: (font-family: "Inter-Medium", font-size: 14px, font-weight: 500, letter-spacing: 10px, line-height: 20px), bodyWithOpacity: (font-family: "Inter-Medium", font-size: 14px, font-weight: 500, letter-spacing: 10px, line-height: 20px), code: (font-family: "FiraCode-Medium", font-size: 13px, font-weight: 500, line-height: 20px), list: (font-family: "Roboto-Regular", font-size: 14px, font-weight: 400, line-height: 20px), title: (font-family: "Inter-SemiBold", font-size: 32px, font-weight: 600, line-height: 40px))',
      };

      const scssMapsResponse = await toScssMap(
        seeds().tokens.filter(token =>
          TYPES_USING_MIXIN.includes(token.type as ToScssMapTokenType),
        ) as Array<Token>,
        { splitBy: '/', formatConfig: { singleQuote: true } },
        libs,
      );

      await Promise.all(
        scssMapsResponse.map(async fileGenerated => {
          const type = /mixin (.*)\(/.exec(fileGenerated.value.content!)![1];
          const functionExecution = testFunctionMapping[type] ?? '';
          const data = `${fileGenerated.value.content}${os.EOL}${functionExecution}`;

          try {
            await render({ data });
          } catch (error) {
            expect(error.message.includes(expectedError[type])).toBeTruthy();
          }
        }),
      );

      done();
    });

    it('should be able to get values from the scss function following the configuration', async done => {
      const testFunction = '.test { width: get-my-measurements(baseSpace05); }';

      const expectedName = '_measurement-custom.scss';
      const expected = '.test { width: 32px; }';

      const ScssMapsResponse = await toScssMap(
        seeds().tokens.filter(token =>
          ['measurement'].includes(token.type as ToScssMapTokenType),
        ) as Array<Token>,
        {
          splitBy: '/',
          formatConfig: { singleQuote: true },
          variableName: {
            measurement: '$my-{{type}}s',
          },
          fileName: {
            measurement: '_{{type}}-custom',
          },
        },
        libs,
      );

      await Promise.all(
        ScssMapsResponse.map(async fileGenerated => {
          const data = `${fileGenerated.value.content}${os.EOL}${testFunction}`;
          const content = await render({ data });
          expect(content.css.toString().includes(expected)).toBeTruthy();
          expect(fileGenerated.name).toEqual(expectedName);
        }),
      );

      done();
    });

    it('should be able to get the properties from the scss mixin following the configuration', async done => {
      const testFunctionMapping: Record<string, string> = {
        typography: '.test { @include typography(title); }',
      };

      const expectedMapping: Record<string, string> = {
        typography:
          '.test { font-family: "Inter-SemiBold"; font-size: 32px; font-weight: 600; line-height: 40px; }',
      };

      const expectedFileName: Record<string, string> = {
        typography: '_typography.scss',
      };

      const ScssMapsResponse = await toScssMap(
        seeds().tokens.filter(token =>
          TYPES_USING_MIXIN.includes(token.type as ToScssMapTokenType),
        ) as Array<Token>,
        {
          splitBy: '/',
          formatConfig: {
            singleQuote: true,
          },
          variableName: {
            textStyle: '$typography',
          },
          fileName: {
            textStyle: '_typography',
          },
        },
        libs,
      );

      await Promise.all(
        ScssMapsResponse.map(async fileGenerated => {
          const type = /mixin (.*)\(/.exec(fileGenerated.value.content!)![1];
          const functionExecution = testFunctionMapping[type] ?? '';
          const data = `${fileGenerated.value.content}${os.EOL}${functionExecution}`;
          const content = await render({ data });

          expect(fileGenerated.name).toEqual(expectedFileName[type]);

          if (expectedMapping[type]) {
            expect(content.css.toString().includes(expectedMapping[type])).toBeTruthy();
          }
        }),
      );

      done();
    });

    it('should be able to get values from the scss function with variable name not starting by $', async done => {
      const testFunction = '.test { width: get-my-measurements(baseSpace05); }';

      const expectedName = '_measurement-custom.scss';
      const expected = '.test { width: 32px; }';

      const ScssMapsResponse = await toScssMap(
        seeds().tokens.filter(token => token.type === 'measurement') as Array<Token>,
        {
          splitBy: '/',
          formatConfig: { singleQuote: true },
          variableName: {
            measurement: 'my-{{type}}s',
          },
          fileName: {
            measurement: '_{{type}}-custom',
          },
        },
        libs,
      );

      await Promise.all(
        ScssMapsResponse.map(async fileGenerated => {
          const data = `${fileGenerated.value.content}${os.EOL}${testFunction}`;
          const content = await render({ data });
          expect(content.css.toString().includes(expected)).toBeTruthy();
          expect(fileGenerated.name).toEqual(expectedName);
        }),
      );

      done();
    });

    it('should be able to get values with variable and file as a string', async done => {
      const testFunction = '.test { width: get-my-measurements(baseSpace05); }';

      const expectedName = '_measurement-custom.scss';
      const expected = '.test { width: 32px; }';

      const ScssMapsResponse = await toScssMap(
        seeds().tokens.filter(token => token.type === 'measurement') as Array<Token>,
        {
          splitBy: '/',
          formatConfig: { singleQuote: true },
          variableName: 'my-{{type}}s',
          fileName: '_{{type}}-custom',
        },
        libs,
      );

      await Promise.all(
        ScssMapsResponse.map(async fileGenerated => {
          const data = `${fileGenerated.value.content}${os.EOL}${testFunction}`;
          const content = await render({ data });
          expect(content.css.toString().includes(expected)).toBeTruthy();
          expect(fileGenerated.name).toEqual(expectedName);
        }),
      );

      done();
    });

    it('should be able to get values from the scss function with function named', async done => {
      const testFunctionMapping: Record<string, string> = {
        measurement: '.test { width: my-measurements(baseSpace05); }',
        color: '.test { color: color(colors, white); }',
      };

      const expectedMapping: Record<string, string> = {
        measurement: '.test { width: 32px; }',
        color: '.test { color: white; }',
      };

      const ScssMapsResponse = await toScssMap(
        seeds().tokens.filter(token =>
          ['measurement', 'color'].includes(token.type as ToScssMapTokenType),
        ) as Array<Token>,
        {
          splitBy: '/',
          formatConfig: { singleQuote: true },
          functionName: {
            color: 'color',
            measurement: 'my-{{type}}s',
          },
        },
        libs,
      );

      await Promise.all(
        ScssMapsResponse.map(async fileGenerated => {
          const type = /function (.*)\(/.exec(fileGenerated.value.content!)![1];

          const functionExecution = testFunctionMapping[type] ?? '';
          const data = `${fileGenerated.value.content}${os.EOL}${functionExecution}`;

          const content = await render({ data });
          if (expectedMapping[type]) {
            expect(content.css.toString().includes(expectedMapping[type])).toBeTruthy();
          }
        }),
      );

      done();
    });

    it('should be able to get the properties from the scss mixin with mixin named', async done => {
      const testFunctionMapping: Record<string, string> = {
        typography: '.test { @include typography(title); }',
      };

      const expectedMapping: Record<string, string> = {
        typography:
          '.test { font-family: "Inter-SemiBold"; font-size: 32px; font-weight: 600; line-height: 40px; }',
      };

      const ScssMapsResponse = await toScssMap(
        seeds().tokens.filter(token =>
          TYPES_USING_MIXIN.includes(token.type as ToScssMapTokenType),
        ) as Array<Token>,
        { splitBy: '/', formatConfig: { singleQuote: true }, mixinName: 'typography' },
        libs,
      );

      await Promise.all(
        ScssMapsResponse.map(async fileGenerated => {
          const type = /mixin (.*)\(/.exec(fileGenerated.value.content!)![1];
          const functionExecution = testFunctionMapping[type] ?? '';
          const data = `${fileGenerated.value.content}${os.EOL}${functionExecution}`;
          const content = await render({ data });

          if (expectedMapping[type]) {
            expect(content.css.toString().includes(expectedMapping[type])).toBeTruthy();
          }
        }),
      );

      done();
    });
  });
});
