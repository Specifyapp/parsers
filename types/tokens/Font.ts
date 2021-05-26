import Token, { TokenInterface } from './Token';
import { TokensType } from './index';

export const FontFormatList = ['woff2', 'woff', 'otf', 'ttf', 'eot'] as const;
export type AllowedFormat = typeof FontFormatList[number];

export interface FontValue {
  fontFamily: string;
  fontPostScriptName: string;
  fontWeight: number;
  fontFileMissing?: boolean;
  isItalic?: boolean;
  provider?: 'Custom font' | 'Google Fonts';
  url?: string;
}

export class FontToken extends Token implements TokenInterface {
  type: TokensType = 'font';
  value: FontValue;

  constructor(element: Partial<FontToken>) {
    super(element);
    this.value = element.value!;
  }
}
