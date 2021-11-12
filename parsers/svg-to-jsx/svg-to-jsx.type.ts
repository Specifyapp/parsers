import { PartialRecord } from '../../types';

export type xml2jsElementType = {
  '#name': string; //tagName
  _?: object; //text
  $$?: Array<PartialRecord<keyof SVGElementTagNameMap,object>>; //children
  $?: object; //attributes
}