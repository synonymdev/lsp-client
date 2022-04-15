# Blocktank Client library

### Description
Client side library for interacting with the Blocktank LSP server

## Getting started

```bash
yarn add @synonymdev/blocktank-client
#or
npm i -s @synonymdev/blocktank-client
````

## Usage
```javascript
import bt from '@synonymdev/blocktank-client';
```

```javascript
//Get all node info and available services
const info = await bt.getInfo();

const service = info.services[0];

//Place order
const buy = await bt.buyChannel({
    product_id: service.product_id,
    channel_expiry: 4,
    remote_balance: 0,
    local_balance: 20000,
});

//Then pay for the order onchain using buy.btc_address or
//via lightning with buy.ln_invoice (BOLT 11 encoded payment request), or buy.lnurl_channel (LNURL address)

//Check order status and details
const order = await bt.getOrder(buy.order_id);
```

For more details, see the [Blocktank API docs](https://synonym.readme.io/reference/nodeinfo).
