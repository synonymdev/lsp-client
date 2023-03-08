export interface IService {
  available: boolean;
  product_id: string;
  description: string;
  min_channel_size: number;
  max_channel_size: number;
  max_node_usd_capacity: number;
  min_chan_expiry: number;
  max_chan_expiry: number;
  max_chan_receiving: number;
  max_chan_receiving_usd: number;
  max_chan_spending: number;
  max_chan_spending_usd: number;
  order_states: {
    [key: string]: number;
  };
}

export interface IGetInfoResponse {
  capacity: {
    local_balance: number;
    remote_balance: number;
  };
  services: IService[];
  node_info: {
    alias: string;
    active_channels_count: number;
    uris: string[];
    public_key: string;
  };
}

export interface IBuyChannelRequest {
  product_id: string;
  remote_balance: number;
  local_balance: number;
  channel_expiry: number;
}

export interface IBuyChannelResponse {
  order_id: string;
  ln_invoice: string;
  price: number;
  total_amount: number;
  btc_address: string;
  lnurl_channel: string;
  order_expiry: number;
}

export interface IFinalizeChannelRequest {
  order_id: string;
  node_uri: string;
  private: boolean;
}

export interface IFinalizeChannelResponse {
  order_id: string;
}

interface IOnchainPayment {
  height: number;
  hash: string;
  to: string;
  amount_base: number;
  fee_base: number;
  confirmed: true;
}

export interface ILnurlDecoded {
  uri: string;
  callback: string;
  k1: string;
  tag: string;
}

interface IChannelOpenTx {
  transaction_id: string;
  transaction_vout: number;
}

interface IChannelCloseTx {
  transaction_id: string;
  ts: number;
}

interface IRemoteNode {
  err: boolean;
  port: string;
  ip: string;
  addr: string;
  public_key: string;
}

export interface IGetOrderResponse {
  _id: string;
  local_balance: number;
  remote_balance: number;
  channel_expiry: number;
  channel_open_tx?: IChannelOpenTx;
  channel_close_tx?: IChannelCloseTx;
  channel_expiry_ts: number;
  order_expiry: number;
  price: number;
  total_amount: number;
  btc_address: string;
  created_at: number;
  state: number;
  stateMessage: string; // Debug message derived from state value
  purchase_invoice: string;
  amount_received: number;
  onchain_payments: IOnchainPayment[];
  lnurl_decoded: ILnurlDecoded;
  lnurl_string: string;
  remote_node?: IRemoteNode;
  zero_conf: boolean;
  zero_conf_satvbyte?: number;
  zero_conf_satvbyte_expiry?: number;
  renewals: any[];
}

export interface IHeaders {
  [key: string]: string;
}

export type IExchangeRatesResponse = {
  [key: string]: number;
};

// Admin types
export interface IAdminLoginRequest {
  username: string;
  password: string;
  token: string;
}

export interface IAdminLoginResponse {
  key: string;
}

export interface IAdminOrderResponse extends IGetOrderResponse {
  product_id: string;
  onchain_payment_swept: boolean;
  ln_invoice: {
    created_at: string;
    description: string;
    id: string;
    mtokens: string;
    request: string;
    secret: string;
    tokens: number;
    node_pub_key: string;
  };
  product_info: {
    name: string;
    description: string;
    price_sats: number;
    product_type: string;
    product_meta: any;
    state: number;
  };
  order_result: [];
  state: number;
  zero_conf_satvbyte: number;
  zero_conf_satvbyte_expiry: number;
  amount_received: number;
  remote_node?: {
    err: boolean;
    port: string;
    ip: string;
    addr: string;
    public_key: string;
  };
  lightning_channel_id?: string;
}

export interface IAdminActionResponse {
  success: boolean;
}

export interface IAdminManualCreditRequest {
  tx_id: string;
  order_id: string;
}

export interface IAdminRefundRequest {
  order_id: string;
  refund_tx: string;
}

export interface IAdminRefundResponse {
  success: boolean;
}

export interface IAdminChannelCloseRequest {
  order_id: string;
}
