import seeds from '../../tests/seeds';
import toDsp, { OptionsType } from './to-dsp.parser';
import { Token } from '../../types';
import { DspParserSettings } from './dsp.type';
import libs, { LibsType } from '../global-libs';

const entitiesAvailable = [
  'bitmap',
  'border',
  'color',
  'depth',
  'duration',
  'gradient',
  'measurement',
  'opacity',
  'shadow',
  'vector',
];
const entitiesLength = seeds().tokens.filter(({ type }) => entitiesAvailable.includes(type)).length;

describe('To DSP', () => {
  it('should take settings and be able to return the correct value', async () => {
    const settings: DspParserSettings = {
      name: 'My DSP',
      buildStatusLabel: 'test',
      packageVersion: '0.0.1',
      snippetTriggerPrefix: 'ex-',
    };

    const tokenSeeds = seeds().tokens;
    const result = await toDsp(tokenSeeds, { settings } as OptionsType, libs as LibsType);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(
      tokenSeeds.filter(({ type }) => type === 'vector' || type === 'bitmap').length + 5,
    );
    expect(result.some(entity => entity.name === 'dsp.json')).toBe(true);
    expect(result.some(entity => entity.name === 'data/tokens.json')).toBe(true);
    expect(result.some(entity => entity.name === 'data/components.json')).toBe(true);
    expect(result.some(entity => entity.name === 'data/fonts.json')).toBe(true);
    expect(result.some(entity => entity.name === 'data/docs.json')).toBe(true);

    const tokens = result.find(entity => entity.name === 'data/tokens.json');
    const tokensEntities = JSON.parse(tokens?.value.content!).entities;

    expect(Array.isArray(tokensEntities)).toBe(true);
    expect(tokensEntities.length).toBe(entitiesLength);

    const components = result.find(entity => entity.name === 'data/components.json');
    const componentsEntities = JSON.parse(components?.value.content!).entities;

    expect(Array.isArray(componentsEntities)).toBe(true);
    expect(componentsEntities.length).toBe(0);

    const dsp = result.find(entity => entity.name === 'dsp.json');
    const dspContent = JSON.parse(dsp?.value.content!);

    expect(dspContent.settings.name).toEqual(settings.name);
    expect(dspContent.settings.build_status_label).toEqual(settings.buildStatusLabel);
    expect(dspContent.settings.package_version).toEqual(settings.packageVersion);
    expect(dspContent.settings.snippet_trigger_prefix).toEqual(settings.snippetTriggerPrefix);

    expect(
      dspContent.import.some((imported: { src: string }) => imported.src === 'data/tokens.json'),
    ).toBe(true);
    expect(
      dspContent.import.some(
        (imported: { src: string }) => imported.src === 'data/components.json',
      ),
    ).toBe(true);
    expect(
      dspContent.import.some((imported: { src: string }) => imported.src === 'data/fonts.json'),
    ).toBe(true);
    expect(
      dspContent.import.some((imported: { src: string }) => imported.src === 'data/docs.json'),
    ).toBe(true);
  });

  it('should send all when no tokens', async () => {
    const settings: DspParserSettings = {
      name: 'My DSP',
      buildStatusLabel: 'test',
      packageVersion: '0.0.1',
      snippetTriggerPrefix: 'ex-',
    };

    const result = await toDsp([] as Array<Token>, { settings } as OptionsType, libs as LibsType);
    expect(result.length).toBe(5);

    expect(result.some(entity => entity.name === 'dsp.json')).toBe(true);
    expect(result.some(entity => entity.name === 'data/tokens.json')).toBe(true);
    expect(result.some(entity => entity.name === 'data/components.json')).toBe(true);
    expect(result.some(entity => entity.name === 'data/fonts.json')).toBe(true);
    expect(result.some(entity => entity.name === 'data/docs.json')).toBe(true);

    const tokens = result.find(entity => entity.name === 'data/tokens.json');
    const tokensEntities = JSON.parse(tokens?.value.content!).entities;

    expect(Array.isArray(tokensEntities)).toBe(true);
    expect(tokensEntities.length).toBe(0);

    const components = result.find(entity => entity.name === 'data/components.json');
    const componentsEntities = JSON.parse(components?.value.content!).entities;

    expect(Array.isArray(componentsEntities)).toBe(true);
    expect(componentsEntities.length).toBe(0);
  });

  it('should work with no settings', async () => {
    const result = await toDsp([] as Array<Token>, {} as OptionsType, libs as LibsType);
    expect(result.length).toBe(5);

    expect(result.some(entity => entity.name === 'dsp.json')).toBe(true);
    expect(result.some(entity => entity.name === 'data/tokens.json')).toBe(true);
    expect(result.some(entity => entity.name === 'data/components.json')).toBe(true);
    expect(result.some(entity => entity.name === 'data/fonts.json')).toBe(true);
    expect(result.some(entity => entity.name === 'data/docs.json')).toBe(true);

    const dsp = result.find(entity => entity.name === 'dsp.json');
    const dspContent = JSON.parse(dsp?.value.content!);

    expect(dspContent.settings.name).toEqual('Generated by Specify');
  });

  it('should work with undefined settings', async () => {
    const result = await toDsp([] as Array<Token>, undefined as OptionsType, libs as LibsType);
    expect(result.length).toBe(5);

    expect(result.some(entity => entity.name === 'dsp.json')).toBe(true);
    expect(result.some(entity => entity.name === 'data/tokens.json')).toBe(true);
    expect(result.some(entity => entity.name === 'data/components.json')).toBe(true);
    expect(result.some(entity => entity.name === 'data/fonts.json')).toBe(true);
    expect(result.some(entity => entity.name === 'data/docs.json')).toBe(true);

    const dsp = result.find(entity => entity.name === 'dsp.json');
    const dspContent = JSON.parse(dsp?.value.content!);

    expect(dspContent.settings.name).toEqual('Generated by Specify');
  });

  it('should work with missing name settings', async () => {
    const settings: DspParserSettings = {
      buildStatusLabel: 'test',
      packageVersion: '0.0.1',
      snippetTriggerPrefix: 'ex-',
    };

    const tokenSeeds = seeds().tokens as Array<Token>;
    const result = await toDsp(tokenSeeds, { settings } as OptionsType, libs as LibsType);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(
      tokenSeeds.filter(({ type }) => type === 'vector' || type === 'bitmap').length + 5,
    );
    expect(result.some(entity => entity.name === 'dsp.json')).toBe(true);
    expect(result.some(entity => entity.name === 'data/tokens.json')).toBe(true);
    expect(result.some(entity => entity.name === 'data/components.json')).toBe(true);
    expect(result.some(entity => entity.name === 'data/fonts.json')).toBe(true);
    expect(result.some(entity => entity.name === 'data/docs.json')).toBe(true);

    const tokens = result.find(entity => entity.name === 'data/tokens.json');
    const tokensEntities = JSON.parse(tokens?.value.content!).entities;

    expect(Array.isArray(tokensEntities)).toBe(true);
    expect(tokensEntities.length).toBe(entitiesLength);

    const components = result.find(entity => entity.name === 'data/components.json');
    const componentsEntities = JSON.parse(components?.value.content!).entities;

    expect(Array.isArray(componentsEntities)).toBe(true);
    expect(componentsEntities.length).toBe(0);

    const dsp = result.find(entity => entity.name === 'dsp.json');
    const dspContent = JSON.parse(dsp?.value.content!);

    expect(dspContent.settings.name).toEqual('Generated by Specify');
    expect(dspContent.settings.build_status_label).toEqual(settings.buildStatusLabel);
    expect(dspContent.settings.package_version).toEqual(settings.packageVersion);
    expect(dspContent.settings.snippet_trigger_prefix).toEqual(settings.snippetTriggerPrefix);
  });

  it('should work with missing buildStatusLabel setting', async () => {
    const settings: DspParserSettings = {
      name: 'My DSP',
      packageVersion: '0.0.1',
      snippetTriggerPrefix: 'ex-',
    };

    const tokenSeeds = seeds().tokens as Array<Token>;
    const result = await toDsp(tokenSeeds, { settings } as OptionsType, libs as LibsType);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(
      tokenSeeds.filter(({ type }) => type === 'vector' || type === 'bitmap').length + 5,
    );
    expect(result.some(entity => entity.name === 'dsp.json')).toBe(true);
    expect(result.some(entity => entity.name === 'data/tokens.json')).toBe(true);
    expect(result.some(entity => entity.name === 'data/components.json')).toBe(true);
    expect(result.some(entity => entity.name === 'data/fonts.json')).toBe(true);
    expect(result.some(entity => entity.name === 'data/docs.json')).toBe(true);

    const tokens = result.find(entity => entity.name === 'data/tokens.json');
    const tokensEntities = JSON.parse(tokens?.value.content!).entities;

    expect(Array.isArray(tokensEntities)).toBe(true);
    expect(tokensEntities.length).toBe(entitiesLength);

    const components = result.find(entity => entity.name === 'data/components.json');
    const componentsEntities = JSON.parse(components?.value.content!).entities;

    expect(Array.isArray(componentsEntities)).toBe(true);
    expect(componentsEntities.length).toBe(0);

    const dsp = result.find(entity => entity.name === 'dsp.json');
    const dspContent = JSON.parse(dsp?.value.content!);

    expect(dspContent.settings.name).toEqual(settings.name);
    expect(dspContent.settings.build_status_label).toEqual('released');
    expect(dspContent.settings.package_version).toEqual(settings.packageVersion);
    expect(dspContent.settings.snippet_trigger_prefix).toEqual(settings.snippetTriggerPrefix);
  });

  it('should work with missing packageVersion setting', async () => {
    const settings: DspParserSettings = {
      name: 'My DSP',
      buildStatusLabel: 'test',
      snippetTriggerPrefix: 'ex-',
    };

    const tokenSeeds = seeds().tokens as Array<Token>;
    const result = await toDsp(tokenSeeds, { settings } as OptionsType, libs as LibsType);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(
      tokenSeeds.filter(({ type }) => type === 'vector' || type === 'bitmap').length + 5,
    );
    expect(result.some(entity => entity.name === 'dsp.json')).toBe(true);
    expect(result.some(entity => entity.name === 'data/tokens.json')).toBe(true);
    expect(result.some(entity => entity.name === 'data/components.json')).toBe(true);
    expect(result.some(entity => entity.name === 'data/fonts.json')).toBe(true);
    expect(result.some(entity => entity.name === 'data/docs.json')).toBe(true);

    const tokens = result.find(entity => entity.name === 'data/tokens.json');
    const tokensEntities = JSON.parse(tokens?.value.content!).entities;

    expect(Array.isArray(tokensEntities)).toBe(true);
    expect(tokensEntities.length).toBe(entitiesLength);

    const components = result.find(entity => entity.name === 'data/components.json');
    const componentsEntities = JSON.parse(components?.value.content!).entities;

    expect(Array.isArray(componentsEntities)).toBe(true);
    expect(componentsEntities.length).toBe(0);

    const dsp = result.find(entity => entity.name === 'dsp.json');
    const dspContent = JSON.parse(dsp?.value.content!);

    expect(dspContent.settings.name).toEqual(settings.name);
    expect(dspContent.settings.build_status_label).toEqual(settings.buildStatusLabel);
    expect(dspContent.settings.package_version).toEqual('1.0.0');
    expect(dspContent.settings.snippet_trigger_prefix).toEqual(settings.snippetTriggerPrefix);
  });

  it('should work with missing snipperTriggerPrefix setting', async () => {
    const settings: DspParserSettings = {
      name: 'My DSP',
      buildStatusLabel: 'test',
      packageVersion: '0.0.1',
    };

    const tokenSeeds = seeds().tokens as Array<Token>;
    const result = await toDsp(tokenSeeds, { settings } as OptionsType, libs as LibsType);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(
      tokenSeeds.filter(({ type }) => type === 'vector' || type === 'bitmap').length + 5,
    );
    expect(result.some(entity => entity.name === 'dsp.json')).toBe(true);
    expect(result.some(entity => entity.name === 'data/tokens.json')).toBe(true);
    expect(result.some(entity => entity.name === 'data/components.json')).toBe(true);
    expect(result.some(entity => entity.name === 'data/fonts.json')).toBe(true);
    expect(result.some(entity => entity.name === 'data/docs.json')).toBe(true);

    const tokens = result.find(entity => entity.name === 'data/tokens.json');
    const tokensEntities = JSON.parse(tokens?.value.content!).entities;

    expect(Array.isArray(tokensEntities)).toBe(true);
    expect(tokensEntities.length).toBe(entitiesLength);

    const components = result.find(entity => entity.name === 'data/components.json');
    const componentsEntities = JSON.parse(components?.value.content!).entities;

    expect(Array.isArray(componentsEntities)).toBe(true);
    expect(componentsEntities.length).toBe(0);

    const dsp = result.find(entity => entity.name === 'dsp.json');
    const dspContent = JSON.parse(dsp?.value.content!);

    expect(dspContent.settings.name).toEqual(settings.name);
    expect(dspContent.settings.build_status_label).toEqual(settings.buildStatusLabel);
    expect(dspContent.settings.package_version).toEqual(settings.packageVersion);
    expect(dspContent.settings.snippet_trigger_prefix).toEqual('sp-');
  });

  it('should not create assets if asked so', async () => {
    const settings: DspParserSettings = {
      name: 'My DSP',
      buildStatusLabel: 'test',
      packageVersion: '0.0.1',
      snippetTriggerPrefix: 'ex-',
    };

    const result = await toDsp(
      seeds().tokens as Array<Token>,
      { settings, createAssets: false } as OptionsType,
      libs as LibsType,
    );
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(5);
    expect(result.some(entity => entity.name === 'dsp.json')).toBe(true);
    expect(result.some(entity => entity.name === 'data/tokens.json')).toBe(true);
    expect(result.some(entity => entity.name === 'data/components.json')).toBe(true);
    expect(result.some(entity => entity.name === 'data/fonts.json')).toBe(true);
    expect(result.some(entity => entity.name === 'data/docs.json')).toBe(true);

    const tokens = result.find(entity => entity.name === 'data/tokens.json');
    const tokensEntities = JSON.parse(tokens?.value.content!).entities;

    expect(Array.isArray(tokensEntities)).toBe(true);
    expect(tokensEntities.length).toBe(entitiesLength);

    const components = result.find(entity => entity.name === 'data/components.json');
    const componentsEntities = JSON.parse(components?.value.content!).entities;

    expect(Array.isArray(componentsEntities)).toBe(true);
    expect(componentsEntities.length).toBe(0);

    const dsp = result.find(entity => entity.name === 'dsp.json');
    const dspContent = JSON.parse(dsp?.value.content!);

    expect(dspContent.settings.name).toEqual(settings.name);
    expect(dspContent.settings.build_status_label).toEqual(settings.buildStatusLabel);
    expect(dspContent.settings.package_version).toEqual(settings.packageVersion);
    expect(dspContent.settings.snippet_trigger_prefix).toEqual(settings.snippetTriggerPrefix);
  });

  it('should create assets with true value', async () => {
    const settings: DspParserSettings = {
      name: 'My DSP',
      buildStatusLabel: 'test',
      packageVersion: '0.0.1',
      snippetTriggerPrefix: 'ex-',
    };

    const tokenSeeds = seeds().tokens as Array<Token>;
    const result = await toDsp(
      tokenSeeds,
      { settings, createAssets: true } as OptionsType,
      libs as LibsType,
    );
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(
      tokenSeeds.filter(({ type }) => type === 'vector' || type === 'bitmap').length + 5,
    );
    expect(result.some(entity => entity.name === 'dsp.json')).toBe(true);
    expect(result.some(entity => entity.name === 'data/tokens.json')).toBe(true);
    expect(result.some(entity => entity.name === 'data/components.json')).toBe(true);
    expect(result.some(entity => entity.name === 'data/fonts.json')).toBe(true);
    expect(result.some(entity => entity.name === 'data/docs.json')).toBe(true);

    const tokens = result.find(entity => entity.name === 'data/tokens.json');
    const tokensEntities = JSON.parse(tokens?.value.content!).entities;

    expect(Array.isArray(tokensEntities)).toBe(true);
    expect(tokensEntities.length).toBe(entitiesLength);

    const components = result.find(entity => entity.name === 'data/components.json');
    const componentsEntities = JSON.parse(components?.value.content!).entities;

    expect(Array.isArray(componentsEntities)).toBe(true);
    expect(componentsEntities.length).toBe(0);

    const dsp = result.find(entity => entity.name === 'dsp.json');
    const dspContent = JSON.parse(dsp?.value.content!);

    expect(dspContent.settings.name).toEqual(settings.name);
    expect(dspContent.settings.build_status_label).toEqual(settings.buildStatusLabel);
    expect(dspContent.settings.package_version).toEqual(settings.packageVersion);
    expect(dspContent.settings.snippet_trigger_prefix).toEqual(settings.snippetTriggerPrefix);
  });
});
