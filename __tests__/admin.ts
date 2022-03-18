import {btAdmin} from '../src/index';

jest.setTimeout(30000);

describe('blocktank admin api', () => {
  beforeAll(async () => {});

  it('auth and check orders', async () => {
    const sessionKey = process.env.SESSION_KEY || '';

    expect(sessionKey).toBeTruthy();

    btAdmin.setNetwork('testnet');
    btAdmin.setSessionKey(sessionKey);

    const orders = await btAdmin.getOrders();

    expect(orders.length).toBeGreaterThan(0);

    // const creditRes = await btAdmin.manualCredit({order_id: '62320b7c011c4515686df145', tx_id: '4be138bca1f7206c44424f400e6148edb6ff2b23f8783a6ba516f91b3309e771'});
    // console.log(creditRes);

    const refundRes = await btAdmin.refund({order_id: '62320b7c011c4515686df145', refund_tx: '4be138bca1f7206c44424f400e6148edb6ff2b23f8783a6ba516f91b3309e771'});
    expect(refundRes.success).toBe(true);
  });
});
