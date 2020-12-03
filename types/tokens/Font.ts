import Token, { TokenInterface } from './Token';

export const FontFormatList = ['woff2', 'woff', 'otf', 'ttf', 'eot'] as const;
export type AllowedFormat = typeof FontFormatList[number];

export interface FontValue {
  fontFamily: string;
  url?: string;
  fontPostScriptName: string;
  fontWeight: string | number;
  fontFileMissing: boolean;
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
