import { OptionsType } from '../to-style-dictionary.parser';
import Token from '../../../types/tokens/Token';

export function setDescription(spToken: Token, options: OptionsType) {
  return options?.includeDescription === true ? { description: spToken.description } : {};
}
