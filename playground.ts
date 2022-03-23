import {
  camelcasify as camelcase,
  OptionsType as CamelcaseOptionsType,
  InputDataType as CamelcaseInputDataType,
} from './parsers/camelcasify/camelcasify.parser';
import {
  pick as pickParser,
  OptionsType as PickOptionsType,
  InputDataType as PickInputDataType,
} from './parsers/pick/pick.parser';
import {
  toCssCustomProperties as toCssCustomPropertiesParser,
  OptionsType as ToCssOptionsType,
  InputDataType as ToCssInputDataType,
} from './parsers/to-css-custom-properties/to-css-custom-properties.parser';
import { Token } from './types';
import { pipe } from './libs/pipe';
import { match, select, when } from 'ts-pattern';

const tokens: Array<Token> = [
  {
    id: '5c819ba1-d0bc-43d8-91f6-952998eb345b',
    createdAt: '2021-07-23T09:26:45.160Z',
    updatedAt: '2021-07-23T09:26:45.160Z',
    name: 'Colors/Accent',
    value: {
      a: 1,
      b: 254,
      g: 124,
      r: 87,
    },
    meta: {
      source: 'localStyles',
    },
    type: 'color',
    originId: '12:150',
    sourceId: '6232b157-22db-4ef1-9437-f7f8066849e1',
    repositoryId: '927e26f6-da29-40d6-b9de-530bdcddf1ed',
  },
  {
    id: 'bb7b5be0-b79f-4b7c-9b0e-a8a2d264970a',
    createdAt: '2021-07-23T09:26:45.164Z',
    updatedAt: '2021-07-23T09:26:45.164Z',
    name: 'Colors/Black',
    value: {
      a: 1,
      b: 43,
      g: 33,
      r: 30,
    },
    meta: {
      source: 'localStyles',
    },
    type: 'color',
    originId: '12:151',
    sourceId: '6232b157-22db-4ef1-9437-f7f8066849e1',
    repositoryId: '927e26f6-da29-40d6-b9de-530bdcddf1ed',
  },
  {
    id: 'f9ac3798-01e8-4a4e-8331-e877cbc0fdd1',
    createdAt: '2021-04-02T09:55:29.276Z',
    updatedAt: '2021-07-28T16:09:12.986Z',
    name: 'acme-logo',
    value: {
      url: 'https://s3-us-west-2.amazonaws.com/figma-alpha-api/img/13d6/2eb6/a2626d914998754ac0b704e2cdb7a813',
      format: 'png',
    },
    meta: {
      file: 'Specify - Seeds',
      page: 'Seeds',
      frame: 'acme-logo',
      format: 'png',
      dimension: 1,
      parentFrame: 'Bitmap · Frame Example',
    },
    type: 'bitmap',
    originId: '12:14-png-1',
    sourceId: 'ded1694b-249a-42e8-add9-35df05d36f80',
    repositoryId: '927e26f6-da29-40d6-b9de-530bdcddf1ed',
  },
  {
    id: '466e4b10-44de-4065-b4f7-25446b024f8c',
    createdAt: '2021-04-12T11:39:15.699Z',
    updatedAt: '2021-04-12T11:39:15.699Z',
    name: 'Body',
    value: {
      font: {
        id: 'e69237ab-05db-4380-81e5-70db7f5448f1',
        createdAt: '2021-04-02T08:01:57.087Z',
        updatedAt: '2021-06-28T14:00:49.527Z',
        name: 'Inter-Medium',
        value: {
          format: 'ttf',
          isItalic: false,
          provider: 'Google Fonts',
          fontFamily: 'Inter',
          fontWeight: 500,
          fontFileMissing: false,
          fontPostScriptName: 'Inter-Medium',
          url: 'https://ddp-assets-prod.s3.eu-west-1.amazonaws.com/927e26f6-da29-40d6-b9de-530bdcddf1ed/font/Inter-Medium/Inter-Medium.ttf?AWSAccessKeyId=ASIAYLKZPEWOA5AIAGXG&Expires=1637085259&Signature=FKdkizmRoUonqUersrJ%2BXU2Akcg%3D&x-amz-security-token=IQoJb3JpZ2luX2VjENb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCWV1LXdlc3QtMSJHMEUCIGFX94Yth2vFvW3PSBoO6RNmv%2BCE5R%2BITpRJWGIheNpvAiEA1nLfIHU7jW%2FKNq3MToab%2FdlO1ar3hn87w9UwdIoGAdsq7gMIj%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARACGgw1NzQxMDI2NDQxMjQiDG5SAHpNXoTtQDh78SrCA8n%2FGwEyOei4m4fHRBmILFSJBKvCfd6tInbiksDJwArZGvc94tubYbYDscaQLm8HF2Z2vOnSQG3sXvqsLAYVq9yuWCZXq6NB5hw%2FkCCxkTSF6zolHD1ZledxUICqQZhqj0NB8565%2BEjIGpH5Qyn75CELA%2FhhHwiKUj%2B5dF3rm6rBNxrEh08auTpy4LLvGnydFsYUAGkWiioqtnKCIMgqz7j1hsJdFMd7RlsQEszj%2BdxeWWBCcXuO5a5Jzs4%2BZNB3w1R2XMSxzwkllTRkNbwrpjjd%2F9GTDWvhZyn7pQbR9N7oDAoX95dI74OLqFQaQaAzl%2FVzV7Tmg6HAqo1P2QePJrrTGnWFpvpM4bveWIWDhsAOg8QpSDndthYC7jOL3YFRLfS%2BcuK6iAsqJiMdmze6Mt07kXOKm7iPmPZpw5zo13Jdmv9H4G7sFmRF9wlVIP3uqVS%2B0qHuxwWHBBwyXr0k41ACV%2BOButgDUGW%2F77DhAh2I6jXB5zqIbrs4bPFj3%2FNlAYtO1bmih%2F20ZeVua5nvi5W%2BRkG8z26IUPaoyi8wOMAK30lwLUPPujVtHSBrIJ2UbO3g%2BWKn2e2ks5fQ5qw799GCSzDR6M6MBjqlASuAUq%2FpTEQNndarf%2FM66QWUpKxis1YJeae3fWkjtzYLvUMUD0O5bwz6JEjoJJu8G5wQrQpErDAv%2FzRQRgHa%2F9%2FImM0kVJK%2FUsko7bVJvY2eTp%2FC0Q5qrSJhz3OP7CP6oIyzyvE1AUsYfMMdUK859g42qtJK0QouFOX2XqHGWO99xS%2BjZS5qIPwjqah2wmhwWAxd5Bbg%2BKKLFWoVlw3zw0zxsJAi0w%3D%3D',
        },
        meta: {
          source: 'frames',
          sourceFile: 'https://www.figma.com/file/9KvLO7F8VPrJ7GxGBWwCr9',
          originFrameName: 'Text Style · Frame Example',
        },
        type: 'font',
        originId: 'Inter-Medium',
        sourceId: '2ec31677-436c-4ebe-9740-96acd5193b06',
        repositoryId: '927e26f6-da29-40d6-b9de-530bdcddf1ed',
      },
      color: {
        value: {
          a: 1,
          b: 43,
          g: 33,
          r: 30,
        },
      },
      fontSize: {
        value: {
          unit: 'px',
          measure: 14,
        },
      },
      textAlign: {
        vertical: 'top',
        horizontal: 'left',
      },
      lineHeight: {
        value: {
          unit: 'px',
          measure: 20,
        },
      },
      letterSpacing: {
        value: {
          unit: 'px',
          measure: 10,
        },
      },
    },
    meta: {
      source: 'frames',
      sourceFile: 'https://www.figma.com/file/9KvLO7F8VPrJ7GxGBWwCr9',
      originFrameName: 'Text Style · Frame Example',
    },
    type: 'textStyle',
    originId: '12:64',
    sourceId: '2ec31677-436c-4ebe-9740-96acd5193b06',
    repositoryId: '927e26f6-da29-40d6-b9de-530bdcddf1ed',
  },
];

const camelcasify =
  (options?: CamelcaseOptionsType) =>
  <T extends CamelcaseInputDataType>(data: T) =>
    camelcase(data ?? tokens, options);

const pick =
  (options: PickOptionsType<any>) =>
  <T extends PickInputDataType>(data: T) =>
    pickParser(data, options);

const toCssCustomProperties =
  (options?: ToCssOptionsType) =>
  <T extends ToCssInputDataType>(data: T) =>
    toCssCustomPropertiesParser(data, options);

// const functionIfy =
//   <Opt, I, R>(handler: (data: I, options?: Opt) => R) =>
//   (options?: Opt) =>
//   (data: I) =>
//     handler(data, options);
//
// const camelcasify = functionIfy<CamelcaseOptionsType, Array<Token>, ReturnType<typeof camelcase>>(
//   camelcase,
// );

// const pickify = functionIfy<PickOptionsType<any>, Array<Token>, ReturnType<typeof pick>>(pick);

(async () => {
  const result = pipe(
    camelcasify({ keys: ['name'] }),
    pick({ keys: ['name', 'type', 'value'] }),
    toCssCustomProperties(),
  );
  console.log('>>>>>>>>>>>', result);
})();

// TODO: Allow async parser
// TODO: Improve typing
