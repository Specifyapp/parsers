import camelcasify, {
  InputDataType as CamelcaseInputDataType,
} from './parsers/camelcasify/camelcasify.parser';
import pick, { InputDataType as PickInputDataType } from './parsers/pick/pick.parser';
import toCssCustomProperties, {
  InputDataType as ToCssInputDataType,
} from './parsers/to-css-custom-properties/to-css-custom-properties.parser';
import { Result } from '@swan-io/boxed';
import { IToken, Token } from './types';
const tokens = [
  {
    id: '5c819ba1-d0bc-43d8-91f6-952998eb345b',
    createdAt: '2021-07-23T09:26:45.160Z',
    updatedAt: '2021-07-23T09:26:45.160Z',
    name: 'Colors/Accent',
    value: {
      a: 1,
      b: 254,
      g: 124,
      r: 87,
    },
    meta: {
      source: 'localStyles',
    },
    type: 'color',
    originId: '12:150',
    sourceId: '6232b157-22db-4ef1-9437-f7f8066849e1',
    repositoryId: '927e26f6-da29-40d6-b9de-530bdcddf1ed',
  },
  {
    id: 'bb7b5be0-b79f-4b7c-9b0e-a8a2d264970a',
    createdAt: '2021-07-23T09:26:45.164Z',
    updatedAt: '2021-07-23T09:26:45.164Z',
    name: 'Colors/Black',
    value: {
      a: 1,
      b: 43,
      g: 33,
      r: 30,
    },
    meta: {
      source: 'localStyles',
    },
    type: 'color',
    originId: '12:151',
    sourceId: '6232b157-22db-4ef1-9437-f7f8066849e1',
    repositoryId: '927e26f6-da29-40d6-b9de-530bdcddf1ed',
  },
] as Array<IToken>;

(async () => {
  // const camelcaseResult = await Result.fromPromise<typeof tokens>(
  //   ,
  // );

  (await Result.fromPromise(camelcasify(tokens, { keys: ['name'] }))).match({
    Ok: async value => {
      // keys value come from the config of the user. So the output type of the parser can't be relevant
      (await Result.fromPromise(pick(value, { keys: ['name', 'type', 'value'] }))).match({
        Ok: async value => {
          (await Result.fromPromise(toCssCustomProperties(value))).match({
            Ok: value => {
              console.log(value);
            },
            Error: error => error,
          });
        },
        Error: error => error,
      });
    },
    Error: error => error,
  });
  // const camelcase = await pick<typeof camelcase['result']>(camelcase.result, { keys: ['name'] });
  // const t = await pipe(
  //   tokens,
  //   a => T.of(camelcasify<typeof a>(a, { keys: ['name'] })),
  //   b => T.of(pick<typeof b['result']>(b.c, { keys: ['name', 'value', 'type'] })),
  //   // toCssCustomProperties(),
  // );
  // console.log('>>>>>>>>>>>', t);
})();
