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
      .map((v: TemplateSpans) => (v && v[1] ? v[1] : null));
  }

  private flattenVariablesFromParseTree(acc: TemplateSpans, variable: TemplateSpans[0]) {
    if (variable[0] === 'name' || variable[0] === '&') {
      // Evaluation of a variable. Simply add the variable to be evaluated
      acc.push(variable);
    } else if (variable[0] === '#' || variable[0] === '^') {
      // Condition in the template. Add the variable to check + check if there is any nested conditions
      acc.push(variable);
      const childs = (variable[4] as TemplateSpans).reduce<TemplateSpans>((acc, variable) => {
        return this.flattenVariablesFromParseTree(acc, variable);
      }, acc)[0];
      if (childs) acc.push(childs);
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
