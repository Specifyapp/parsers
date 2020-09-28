import Token, { TokenInterface } from './Token';

export interface FontValue {
  fontFamily: string;
  url: string;
  fontPostScriptName: string;
  fontWeight: string;
}

export class FontToken extends Token implements TokenInterface {
  type: string;
  value: FontValue;

  constructor(element: Partial<FontToken>) {
    super(element);
    this.type = 'font';
    this.value = element.value!;
  }
}
