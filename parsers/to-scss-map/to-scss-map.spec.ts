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
    it('Expect result to be a valid downloadable file', async () => {
      const result = await toScssMap(
        seeds().tokens.filter(({ type }) => type === 'color') as Array<Token>,
        { splitBy: '/', formatConfig: { singleQuote: true } },
        libs,
      );

      expect(Array.isArray(result)).toEqual(true);
      result.forEach(file => expect(typeof file.value.content).toEqual('string'));
      return;
    });

    it('Expect result to be a valid downloadable file when there is no options', async () => {
      const result = await toScssMap(seeds().tokens as Array<Token>, undefined, libs);

      expect(Array.isArray(result)).toEqual(true);
      result.forEach(file => expect(typeof file.value.content).toEqual('string'));
      return;
    });

    it('should throw unexpected error from the parser', async () => {
      try {
        jest.spyOn(colorHandler, 'run').mockImplementationOnce(() => {
          throw new Error('Unexpected error');
        });
        await toScssMap(seeds().tokens as Array<Token>, {}, libs);
        fail();
      } catch (err) {
        expect(err.message).toMatch('Unexpected error');
      }
      return;
    });

    it('should not have function with the omit option', async () => {
      const result = await toScssMap(
        seeds().tokens.filter(({ type }) => type === 'color') as Array<Token>,
        { splitBy: '/', omitFunctionAndMixin: true },
        libs,
      );

      expect(Array.isArray(result)).toEqual(true);
      result.forEach(file => {
        expect(typeof file.value.content).toEqual('string');
        expect(file.value.content!).not.toContain('get-token-for-color');
      });
      return;
    });

    it('should not have mixin with the omit option', async () => {
      const result = await toScssMap(
        seeds().tokens.filter(({ type }) => type === 'textStyle') as Array<Token>,
        { splitBy: '/', omitFunctionAndMixin: true },
        libs,
      );

      expect(Array.isArray(result)).toEqual(true);
      result.forEach(file => {
        expect(typeof file.value.content).toEqual('string');
        expect(file.value.content!).not.toContain('mixin-for-text-style');
      });
      return;
    });
  });

  describe('SCSS functions', () => {
    it('should be able to get values from the scss function', async () => {
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
        depth: '.test{z-index:50}',
        duration: '.test{transition-duration:100ms}',
        measurement: '.test{width:32px}',
        border: '.test{border:1px dashed #1e212b}',
        color: '.test{color:#fff}',
        shadow:
          '.test{box-shadow:0px 1.8518518209px 3.1481480598px rgba(0,0,0,.02),0px 8.1481485367px 6.5185184479px rgba(0,0,0,.03),0px 20px 13px rgba(0,0,0,.04),0px 38.5185203552px 25.4814815521px rgba(0,0,0,.04),0px 64.8148117065px 46.851852417px rgba(0,0,0,.05),0px 100px 80px 1px rgba(0,0,0,.07)}',
        gradient: '.test{background-image:linear-gradient(90deg, #f5483f 0%, #ff8e05 100%)}',
        opacity: '.test{opacity:.5}',
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

          const content = await render(data);
          if (expectedMapping[type]) {
            expect(content.css.toString()).toContain(expectedMapping[type]);
          }
        }),
      );

      return;
    });

    it('should be able to get the properties from the scss mixin', async () => {
      const testFunctionMapping: Record<string, string> = {
        'text-style': '.test { @include text-style(title); }',
      };

      const expectedMapping: Record<string, string> = {
        'text-style':
          '.test{font-family:"Inter-SemiBold";font-weight:600;font-size:32px;line-height:40px;text-transform:uppercase;text-align:left;vertical-align:top;text-decoration:underline;text-indent:5px}',
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
          const content = await render(data);
          if (expectedMapping[type]) {
            expect(content.css.toString()).toContain(expectedMapping[type]);
          }
        }),
      );

      return;
    });

    it('should throw error from the scss function if missing parameter', async () => {
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
        depth: "(background: 1, middle: 50, foreground: 100) isn't a valid CSS value.",
        duration: "(veryLong: 3s, short: 100ms, base: 300ms, long: 700ms) isn't a valid CSS value.",
        measurement:
          "(baseSpace01: 4px, baseSpace02: 8px, baseSpace03: 12px, baseSpace04: 16px, baseSpace05: 32px, baseSpace06: 48px, baseSpace07: 64px, baseSpace08: 80px, baseSpace09: 96px, baseSpace10: 112px) isn't a valid CSS value.",
        border:
          "(borderAccent: 2px solid #6650ef, borderAccentWithOpacity: 2px solid rgba(102, 80, 239, 0.5), borderAccentWithoutRadii: 2px solid rgba(102, 80, 239, 0.5), borderDashed: 1px dashed #1e212b) isn't a valid CSS value.",
        color:
          "(colors: (accent: #577cfe, black: #1e212b, green: #58cd52, grey: #ccd5e1, orange: #ff8e05, red: #f5483f, white: white)) isn't a valid CSS value.",
        shadow:
          "(elevation1: ((0px 4px 8px rgba(0, 0, 0, 0.1),)), elevation2: (0px 4px 28px rgba(0, 0, 0, 0.1), 0px 4px 4px rgba(0, 0, 0, 0.1)), elevation3: (0px 1.8518518209px 3.1481480598px rgba(0, 0, 0, 0.02), 0px 8.1481485367px 6.5185184479px rgba(0, 0, 0, 0.03), 0px 20px 13px rgba(0, 0, 0, 0.04), 0px 38.5185203552px 25.4814815521px rgba(0, 0, 0, 0.04), 0px 64.8148117065px 46.851852417px rgba(0, 0, 0, 0.05), 0px 100px 80px 1px rgba(0, 0, 0, 0.07))) isn't a valid CSS value.",
        gradient:
          "(gradients: (colored: linear-gradient(90deg, #f5483f 0%, #ff8e05 100%), dark: linear-gradient(90deg, #1e212b 0%, #ccd5e1 100%), neutral: linear-gradient(90deg, #ccd5e1 0%, white 100%), safari: linear-gradient(90deg, #ff8e05 0%, white 100%))) isn't a valid CSS value.",
        opacity: "(transparent: 0.1, subtle: 0.5, visible: 0.95) isn't a valid CSS value.",
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
            await render(data);
          } catch (error) {
            expect(error.message).toContain(expectedError[type]);
            expect(error.message).toContain(`Non usable value`);
          }
        }),
      );

      return;
    });

    it('should throw error from the scss mixin if missing parameters', async () => {
      const testFunctionMapping: Record<string, string> = {
        'text-style': '.test { @include text-style(); }',
      };

      const expectedError: Record<string, string> = {
        'text-style':
          '(font-family: "Inter-Medium", font-weight: 500, font-size: 14px, letter-spacing: 10px, line-height: 20px, text-align: left, vertical-align: top) isn\'t a valid CSS value.',
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
            await render(data);
          } catch (error) {
            expect(error.message).toContain(expectedError[type]);
          }
        }),
      );

      return;
    });

    it('should throw error from the scss mixin if too much params', async () => {
      const testFunctionMapping: Record<string, string> = {
        'text-style': '.test { @include text-style(body, font-family); }',
      };

      const expectedError: Record<string, string> = {
        'text-style':
          '(body: (font-family: "Inter-Medium", font-weight: 500, font-size: 14px, letter-spacing: 10px, line-height: 20px, text-align: left, vertical-align: top), bodyWithOpacity: (font-family: "Inter-Medium", font-weight: 500, font-size: 14px, letter-spacing: 10px, line-height: 20px, text-align: left, vertical-align: top), code: (font-family: "FiraCode-Medium", font-weight: 500, font-size: 13px, line-height: 20px, text-align: left, vertical-align: top), list: (font-family: "Roboto-Regular", font-weight: 400, font-size: 14px, line-height: 20px, text-align: left, vertical-align: top), title: (font-family: "Inter-SemiBold", font-weight: 600, font-size: 32px, line-height: 40px, text-transform: uppercase, text-align: left, vertical-align: top, text-decoration: underline, text-indent: 5px)) isn\'t a valid CSS value.',
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
            await render(data);
          } catch (error) {
            expect(error.message).toContain(expectedError[type]);
            expect(error.message).toContain(`Non usable value`);
          }
        }),
      );

      return;
    });

    it('should be able to get values from the scss function following the configuration', async () => {
      const testFunction = '.test { width: get-my-measurements(baseSpace05); }';

      const expectedName = '_measurement-custom.scss';
      const expected = '.test{width:32px}';

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
          const content = await render(data);
          expect(content.css.toString()).toContain(expected);
          expect(fileGenerated.name).toEqual(expectedName);
        }),
      );

      return;
    });

    it('should be able to get the properties from the scss mixin following the configuration', async () => {
      const testFunctionMapping: Record<string, string> = {
        typography: '.test { @include typography(title); }',
      };

      const expectedMapping: Record<string, string> = {
        typography:
          '.test{font-family:"Inter-SemiBold";font-weight:600;font-size:32px;line-height:40px;text-transform:uppercase;text-align:left;vertical-align:top;text-decoration:underline;text-indent:5px}',
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
          const content = await render(data);

          expect(fileGenerated.name).toEqual(expectedFileName[type]);

          if (expectedMapping) {
            expect(content.css.toString()).toContain(expectedMapping[type]);
          }
        }),
      );

      return;
    });

    it('should be able to get values from the scss function with variable name not starting by $', async () => {
      const testFunction = '.test { width: get-my-measurements(baseSpace05); }';

      const expectedName = '_measurement-custom.scss';
      const expected = '.test{width:32px}';

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
          const content = await render(data);
          expect(content.css.toString().includes(expected));
          expect(fileGenerated.name).toEqual(expectedName);
        }),
      );

      return;
    });

    it('should be able to get values with variable and file as a string', async () => {
      const testFunction = '.test { width: get-my-measurements(baseSpace05); }';

      const expectedName = '_measurement-custom.scss';
      const expected = '.test{width:32px}';

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
          const content = await render(data);
          expect(content.css.toString().includes(expected));
          expect(fileGenerated.name).toEqual(expectedName);
        }),
      );

      return;
    });

    it('should be able to get values from the scss function with function named', async () => {
      const testFunctionMapping: Record<string, string> = {
        measurement: '.test { width: my-measurements(baseSpace05); }',
        color: '.test { color: color(colors, white); }',
      };

      const expectedMapping: Record<string, string> = {
        measurement: '.test{width:32px}',
        color: '.test{color:white}',
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

          const content = await render(data);
          if (expectedMapping[type]) {
            expect(content.css.toString().includes(expectedMapping[type]));
          }
        }),
      );

      return;
    });

    it('should be able to get the properties from the scss mixin with mixin named', async () => {
      const testFunctionMapping: Record<string, string> = {
        typography: '.test { @include typography(title); }',
      };

      const expectedMapping: Record<string, string> = {
        typography:
          '.test{font-family:"Inter-SemiBold"; font-weight:600; font-size:32px; line-height:40px; text-transform:uppercase; text-align:left; vertical-align:top; text-decoration:underline; text-indent: 5px; }',
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
          const content = await render(data);

          if (expectedMapping[type]) {
            expect(content.css.toString().includes(expectedMapping[type]));
          }
        }),
      );

      return;
    });
  });
});
