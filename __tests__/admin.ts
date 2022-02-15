import {btAdmin} from '../src/index';
global.fetch = require('node-fetch');

describe('blocktank admin api', () => {
  beforeAll(async () => {});

  it('auth and check orders', async () => {
    const username = process.env.ADMIN_USERNAME;
    const password = process.env.ADMIN_PASSWORD;
    const token = process.env.ADMIN_TOKEN;

    expect(username).toBeDefined();
    expect(password).toBeDefined();
    expect(token).toBeDefined();

    btAdmin.setNetwork('mainnet');

    await btAdmin.login({
      username,
      password,
      token
    })

    const orders = await btAdmin.getOrders();

    expect(orders).not.toBeNaN();

    console.log(orders);
  });
});
