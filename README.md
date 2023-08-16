<p align="center">
  <a href="https://github.com/synonymdev/bitkit" title="Blocktank Client Library">
    <img alt="bitkit" src="./blocktank_brand_mark.png" width="150"></img>
  </a>
</p>

<h3 align="center">Blocktank Client Libary</h3>


## Description
Client side wrapper library for interacting with the Blocktank LSP server. For REST API docs see [synonym.readme.io](https://synonym.readme.io/)

[Blocktank](https://blocktank.synonym.to/) is an LSP that allows businesses, apps, or online platforms to integrate, automate, and monetize services from your Lightning node. This includes channel configuration, channel purchases, channel info and more.

For widget and complete code samples see [blocktank-ui](https://github.com/synonymdev/blocktank-ui)

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

// Get all node info
const info = await bt.getInfo();

// 1. Create channel order
const buyRes = await bt.createOrder({
    lspBalanceSat: 100000,
    channelExpiryWeeks: 6,
    clientBalanceSat: 0
});

// 2. Make payment using one of the provided methods
const {onchain, bolt11Invoice} = buyRes.payment;

// 3. Get status and details for the current channel order
const order = await bt.getOrder(buyRes.id);
const {state, payment} = order;

// 4. Open channel once order.payment.state === 'paid'
await bt.openChannel({
    connectionStringOrPubkey: '0296b2db342fcf87ea94d981757fdf4d3e545bd5cef4919f58b5d38dfdd73bf5c9@34.79.58.84:9735',
    announceChannel: false // For mobile nodes that won't be routing transactions
});
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
