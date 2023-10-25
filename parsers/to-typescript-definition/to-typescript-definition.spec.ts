import seeds from '../../tests/seeds';
import toTypescriptDefinition, { InputDataType } from './to-typescript-definition.parser';
import libs from '../global-libs';

const tokens = seeds().tokens;

describe('Tokens to Typescript types definitions', () => {
  it('Should generate all the types with default formatting', async () => {
    const result = await toTypescriptDefinition(tokens as InputDataType, {}, libs);

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
      libs,
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
      libs,
    );

    expect(result.includes("export type another = 'colors_accent'")).toBeTruthy();
    expect(result.includes("export type name = 'subtle'")).toBeTruthy();
    expect(result.includes("export type why = 'elevation_1'")).toBeTruthy();
    expect(result.includes("export type not = 'base_space_01'")).toBeTruthy();

    expect(result).toMatchSnapshot();
  });

  it('Should generate all the types with name in pascalCase', async () => {
    const result = await toTypescriptDefinition(
      tokens as InputDataType,
      {
        formatName: 'pascalCase',
      },
      libs,
    );

    expect(result).toMatchSnapshot();
  });
});
