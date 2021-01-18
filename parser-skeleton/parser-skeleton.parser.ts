import { LibsType } from '../parsers/global-libs';

// You can remove these if you want to avoid redundancy. It is written here so that it's easier for you to create your first parser
type PleaseChangeThisType = Array<Record<string, any>>;
type PleaseChangeThisTypeToo = Array<Record<string, any>>;
type PleaseChangeThisOutputType = Array<Record<string, any>>;

// These informations are mandatory so that our parsers engine can chain them and check for errors
// InputDataType, OutputDataType and OptionsType are mandatory and cannot be renamed.
export type InputDataType = PleaseChangeThisType;
export type OutputDataType = PleaseChangeThisOutputType;
export type OptionsType = undefined | PleaseChangeThisTypeToo;

/**
 * Your custom description of your parser
 * @param input {PleaseChangeThisType} Input = Output of previous parser. Parsers are chained.
 * @param options {PleaseChangeThisTypeToo} The options your parser can have.
 * @param libs {LibsType} All the libs defined in global libs. See https://specifyapp.com/developers//configuration#heading-parsers.
 */
export default async function (
  input: InputDataType,
  options: OptionsType = [],
  libs: LibsType,
): Promise<OutputDataType> {
  try {
    // Here code your parser
    const pleaseChangeYourReturn: PleaseChangeThisType = [];
    return pleaseChangeYourReturn;
  } catch (err) {
    throw err;
  }
}
