import seeds from '../../tests/seeds';
import prefixBy from './prefix-by.parser';
import { Token } from '../../types';
import libs from '../global-libs';

describe('prefix-by', () => {
  it('Execute parser', async () => {
    const prefix = 'ds-';
    const result = await prefixBy(
      seeds().tokens,
      { key: 'name', prefix, applyOn: ['color'] },
      libs,
    );
    if (result instanceof Error) return fail(result);
    expect(
      result.every(token =>
        token.type === 'color' ? token.name.startsWith(prefix) : !token.name.startsWith(prefix),
      ),
    ).toEqual(true);
    return;
  });
  it('Execute parser with minimum option', async () => {
    const result = await prefixBy(
      seeds().tokens.filter(({ type }) => type === 'color') as Array<Token>,
      { prefix: 'ds-' },
      libs,
    );
    if (result instanceof Error) return fail(result);
    expect(result.every(color => color.name?.startsWith('ds-'))).toEqual(true);
    return;
  });
  it('Execute with template', async () => {
    const result = await prefixBy(
      seeds().tokens.filter(({ type }) => type === 'bitmap') as Array<Token>,
      { prefix: '{{#dimension}}@{{dimension}}x.{{/dimension}}{{^dimension}}@1x.{{/dimension}}' },
      libs,
    );
    if (result instanceof Error) return fail(result);
    expect(
      result.every(
        bitmap =>
          bitmap.name?.startsWith(bitmap.name) ||
          bitmap.name?.startsWith('@1x.') ||
          bitmap.name?.startsWith('@2x.') ||
          bitmap.name?.startsWith('@3x.'),
      ),
    ).toEqual(true);
    return;
  });
  it('Execute parser on string as InputDataType', async () => {
    const result = await prefixBy(
      ':root {}',
      { prefix: '/* Comment \n on several lines */' },
      libs,
    );
    expect(result).toEqual('/* Comment \n on several lines */\n\n:root {}');
    return;
  });
});
