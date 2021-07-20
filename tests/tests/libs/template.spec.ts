import Template from '../../../libs/template';

describe('Libs - template', () => {
  it('Should render simple template', async () => {
    const template = new Template('{{name}}-{{type}}.{{format}}');

    const result = template.render({
      name: 'name',
      type: 'type',
      format: 'format',
    });
    expect(result).toEqual('name-type.format');
    return;
  });
  it('Should render template with condition', async () => {
    const template = new Template(
      '{{name}}-{{type}}{{#dimension}}@{{dimension}}{{/dimension}}.{{format}}',
    );

    expect(
      template.render({
        name: 'name',
        type: 'type',
        format: 'format',
      }),
    ).toEqual('name-type.format');
    expect(
      template.render({
        name: 'name',
        type: 'type',
        dimension: '4x',
        format: 'format',
      }),
    ).toEqual('name-type@4x.format');
    return;
  });
  it('Should render template with condition when keys are in value.', async () => {
    const template = new Template(
      '{{name}}-{{type}}{{#dimension}}@{{dimension}}{{/dimension}}.{{format}}',
    );
    expect(
      template.render({
        value: {
          name: 'name',
          type: 'type',
          format: 'format',
        },
      }),
    ).toEqual('name-type.format');
    expect(
      template.render({
        value: {
          name: 'name',
          type: 'type',
          dimension: '4x',
          format: 'format',
        },
      }),
    ).toEqual('name-type@4x.format');
    return;
  });
});
