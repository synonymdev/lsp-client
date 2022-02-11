import {btAdmin} from '../src/index';
global.fetch = require('node-fetch');

describe('blocktank admin api', () => {
  beforeAll(async () => {});

  it('auth and check orders', async () => {
    const info = await btAdmin.getInfo();

    expect(info.capacity.remote_balance).not.toBeNaN();

    const service = info.services[0];
  });
});
