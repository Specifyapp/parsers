import _ from 'lodash';
import Mustache from 'mustache';
import { MustacheWriter, TemplateSpans } from '../types/libs/mustache';

export default class Template {
  keys: Array<string> = [];
  pattern: string;
  mustache: MustacheWriter = new Mustache.Writer();
  constructor(pattern: string) {
    this.mustache.escapedValue = (token, context) => {
      return context.lookup(token[1]);
    };
    this.pattern = pattern;
    this.keys = this.mustache
      .parse(pattern)
      .reduce(
        (acc: TemplateSpans, variable: TemplateSpans[0]) =>
          this.flattenVariablesFromParseTree(acc, variable),
        [],
      )
      .map((v: TemplateSpans) => v[1]);
  }

  private flattenVariablesFromParseTree(acc: TemplateSpans, variable: TemplateSpans[0]) {
    if (variable[0] === 'name' || variable[0] === '&') {
      acc = [...acc, variable];
    } else if (variable[0] === '#') {
      acc = [
        ...acc,
        (variable[4] as TemplateSpans).reduce(this.flattenVariablesFromParseTree, [])[0],
      ] as TemplateSpans;
    }
    return acc;
  }

  render(item: any) {
    const views = this.keys.reduce<Record<string, () => string>>((acc, key) => {
      _.set(acc, key, _.get(item, key, _.get(item, `value[${key}]`, '')));
      return acc;
    }, {});
    return this.mustache.render(this.pattern, views);
  }
}
