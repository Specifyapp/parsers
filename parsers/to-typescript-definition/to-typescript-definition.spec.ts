import seeds from '../../tests/seeds';
import { IToken } from '../../types';
import libs, { LibsType } from '../global-libs';
import toTypescriptDefinition, {
  InputDataType,
  OptionsType,
} from './to-typescript-definition.parser';

const tokens = seeds().tokens;

describe('Tokens to Typescript types definitions', () => {
  it('Should generate all the types with default formatting', async () => {
    const result = await toTypescriptDefinition(tokens as InputDataType, {}, libs as LibsType);

    expect(result).toMatchSnapshot();
  });

  it('Should generate all the types with correct type name', async () => {
    const result = await toTypescriptDefinition(
      tokens as InputDataType,
      {
        typesNamesMapping: {
          color: 'helloColor',
          vector: 'myVector',
          textStyle: 'text_style',
        },
      },
      libs as LibsType,
    );

    expect(result.includes("export type helloColor = 'colors-accent'")).toBeTruthy();
    expect(result.includes("export type myVector = 'activity'")).toBeTruthy();
    expect(result.includes("export type text_style = 'body'")).toBeTruthy();

    expect(result).toMatchSnapshot();
  });

  it('Should generate all the types with correct type name and formatting', async () => {
    const result = await toTypescriptDefinition(
      tokens as InputDataType,
      {
        formatName: 'snakeCase',
        typesNamesMapping: {
          color: 'another',
          opacity: 'name',
          shadow: 'why',
          measurement: 'not',
        },
      },
      libs as LibsType,
    );

    expect(result.includes("export type another = 'colors_accent'")).toBeTruthy();
    expect(result.includes("export type name = 'subtle'")).toBeTruthy();
    expect(result.includes("export type why = 'elevation_1'")).toBeTruthy();
    expect(result.includes("export type not = 'base_space_01'")).toBeTruthy();

    expect(result).toMatchSnapshot();
  });
});
