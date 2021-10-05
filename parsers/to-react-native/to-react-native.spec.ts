import libs from '../global-libs';
import seeds from '../../tests/seeds';
import toReactNative, { InputDataType } from './to-react-native.parser';

describe('To React Native', () => {
  it('Should generate the theme object', async () => {
    const tokens = seeds().tokens;
    const result = await toReactNative(tokens, undefined, libs);
    expect(result).toMatchSnapshot();
  });
  it('Should use assetsFolderPath', async () => {
    const tokens = seeds().tokens;
    const result = await toReactNative(tokens, { assetsFolderPath: 'path' }, libs);
    expect(result).toMatchSnapshot();
  });
  it('Should support different duration types', async () => {
    const tokens: InputDataType = [
      {
        id: '1',
        name: '2 hours',
        value: { unit: 'h', duration: 2 },
        type: 'duration',
      },
      {
        id: '2',
        name: '2 minutes',
        value: { unit: 'm', duration: 2 },
        type: 'duration',
      },
      {
        id: '3',
        name: '2 seconds',
        value: { unit: 's', duration: 2 },
        type: 'duration',
      },
      {
        id: '4',
        name: '2 milliseconds',
        value: { unit: 'ms', duration: 2 },
        type: 'duration',
      },
      {
        id: '5',
        name: '2 nanoseconds',
        value: { unit: 'ns', duration: 2 },
        type: 'duration',
      },
    ];
    const result = await toReactNative(tokens, { assetsFolderPath: 'path' }, libs);
    expect(result).toMatchSnapshot();
  });
});
