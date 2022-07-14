# Blocktank Client library

### Description
Client side wrapper library for interacting with the Blocktank LSP server. For REST API docs see [synonym.readme.io](https://synonym.readme.io/)

[Blocktank](https://blocktank.synonym.to/) is an LSP that allows businesses, apps, or online platforms to integrate, automate, and monetize services from your Lightning node. This includes channel configuration, channel purchases, channel info and more.

For widget and complete code samples see [blocktank-ui](https://github.com/synonymdev/blocktank-ui)

### Rest API docs
https://synonym.readme.io/

## Getting started

```bash
yarn add @synonymdev/blocktank-client
#or
npm i -S @synonymdev/blocktank-client
````

## Usage
```javascript
import bt from '@synonymdev/blocktank-client';
```

```javascript
// Choose network
bt.setNetwork('mainnet'); // Options are 'mainnet' and 'regtest'

// Get all node info and available services
const info = await bt.getInfo();

const service = info.services[0];

// 1. Place order
const buyRes = await bt.buyChannel({
    product_id: service.product_id,
    channel_expiry: 4,
    remote_balance: 0,
    local_balance: 20000,
});

// 2. Make payment using one of below methods
const {btc_address, ln_invoice} = buyRes;

// 3. Get order details for current state
const order = await bt.getOrder(buy.order_id);

// 4. Make an onchain transaction using the below min fee with RBF disabled to instantly be able to claim your channel
const {zero_conf_satvbyte, zero_conf_satvbyte_expiry} = order;

// Once order state === 100 a channel can be claimed
const {state, stateMessage} = order;

// For all order states see: https://github.com/synonymdev/blocktank-client/blob/f8a20c35a4953435cecf8f718ee555e311e1db9b/src/services/client.ts#L15

// 5. Claim lnurl-channel
const {lnurl_string} = order;

// Or claim manually with an additional method
try {
  await bt.finalizeChannel({
    order_id: order._id,
    node_uri: '0296b2db342fcf87ea94d981757fdf4d3e545bd5cef4919f58b5d38dfdd73bf5c9@34.79.58.84:9735',
    private: true // For mobile nodes that won't be routing transactions
  });
} catch (e) {
  console.error(e);
}

```


## Development


### `yarn build`

Builds library ready for production use.

### `yarn test`

Integration tests.

### `yarn format`

Code formatting.

### `yarn lint`

Code linting.

### `yarn prepublish`

Prepares code for publishing bu building and bumping package version.
