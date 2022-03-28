import { seeds } from '../../tests/seeds';
import { toReactNative } from './to-react-native.parser';

describe('To React Native', () => {
  it('Should generate the theme object', async () => {
    const tokens = seeds();
    const result = await toReactNative(tokens, undefined);
    expect(result).toMatchSnapshot();
  });
  it('Should use assetsFolderPath', async () => {
    const tokens = seeds();
    const result = await toReactNative(tokens, { assetsFolderPath: 'path' });
    expect(result).toMatchSnapshot();
  });
  it('Should support different duration types', async () => {
    const result = await toReactNative(
      [
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
      ],
      { assetsFolderPath: 'path' },
    );
    expect(result).toMatchSnapshot();
  });
});
