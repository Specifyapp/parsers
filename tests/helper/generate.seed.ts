import got from 'got';

import * as dotenv from 'dotenv';
import fs from 'fs';
import crypto from 'crypto';
import path from 'path';
import { IToken, VectorValue } from '../../types';
dotenv.config();

(async () => {
  try {
    const response = await got.post<Array<IToken>>(
      'https://beta.api.specifyapp.com/repository/@specifyapp/Seeds/design-tokens',
      {
        headers: {
          Authorization: process.env.SPECIFY_ACCESS_TOKEN,
          'Content-Type': 'application/json',
        },
        json: {},
        responseType: 'json',
      },
    );

    fs.writeFileSync(
      path.join(__dirname, '../fixtures/seeds.json'),
      JSON.stringify(response.body, null, 2),
    );

    response.body
      .filter(({ type }) => type === 'vector')
      .map(async vector => {
        const url = (vector.value as VectorValue).url!;
        const data = await got(url, {
          responseType: 'text',
        });
        return fs.promises.writeFile(
          path.join(
            __dirname,
            `../fixtures/assets/${crypto.createHash('md5').update(url).digest('hex')}`,
          ),
          data.body,
        );
      });
  } catch (err) {
    console.error(err);
  }
})();
