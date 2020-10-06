export interface DspEntity {
  class: 'token' | 'collection' | 'doc' | 'component';
  type: 'color' | 'size' | 'custom' | 'alias' | 'font' | 'page';
  id: string;
  name: string;
  value: string;
  tags: Array<string>;
  related_entity_ids?: Array<string>;
  snippets?: {
    trigger: string;
    languages: {
      html: string;
    };
  };
}

export interface DspImport {
  src: string;
}

export interface DspParserSettings {
  name?: string;
  buildStatusLabel?: string;
  packageVersion?: string;
  snippetTriggerPrefix?: string;
}

export interface DspSettings {
  name: string;
  build_status_label: string;
  package_version: string;
  snippet_trigger_prefix: string;
}

export interface DspJson {
  dsp_spec_version: string;
  last_updated_by: string;
  last_updated: string;
  import?: Array<DspImport>;
  settings?: Partial<DspSettings>;
}

export interface ImportsJson {
  dsp_spec_version: string;
  last_updated_by: string;
  last_updated: string;
  entities: Array<DspEntity>;
}
