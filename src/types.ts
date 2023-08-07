export enum EOrderState {
  created = 'created',
  expired = 'expired',
  open = 'open',
  closed = 'closed',
}
export enum EChannelState {
  opening = 'opening',
  open = 'open',
  closed = 'closed',
}
export enum EPaymentState {
  created = 'created',
  partiallyPaid = 'partiallyPaid',
  paid = 'paid',
  refunded = 'refunded',
  refundAvailable = 'refundAvailable',
}
export enum EBolt11InvoiceState {
  pending = 'pending',
  holding = 'holding',
  paid = 'paid',
  canceled = 'canceled',
}

export interface IGetInfoResponse {
  version: number;
  nodes: ILspNode[];
  options: IInfoResOptions;
}

interface IInfoResOptions {
  minChannelSizeSat: number;
  maxChannelSizeSat: number;
  minExpiryWeeks: number;
  maxExpiryWeeks: number;
  minPaymentConfirmations: number;
  minPaymentConfirmationsClientBalance: number;
  max0ConfClientBalanceSat: number;
  maxClientBalanceLspBalanceRatio: number;
}

export interface ICreateOrderRequest {
  /**
   * Number of satoshi that the LSP will provide on their channel side initially.
   */
  lspBalanceSat: number;
  /**
   * Number of weeks the channel will be leased for before the LSP may close the channel.
   */
  channelExpiryWeeks: number;
  /**
   * Initial number of satoshi the client wants to provide on their channel side. The client pays this balance
   * to the LSP. The LSP will push the balance to the LSP on channel creation. Defaults to 0.
   */
  clientBalanceSat: number;
  /**
   * Node id the client wants to receive the channel from. The id must come from the node list provided by `getInfo`.
   * If not provided, a random node will be chosen.
   */
  lspNodeId?: string;
  /**
   * Coupon code to get discounts. Also used for affiliates.
   */
  couponCode?: string;
}

export interface IOrder {
  id: string;
  state: EOrderState;
  feeSat: number;
  lspBalanceSat: number;
  clientBalanceSat: number;
  zeroConf: boolean;
  channelExpiryWeeks: number;
  channelExpiresAt: string;
  orderExpiresAt: string;
  channel?: IChannel;
  lspNode: ILspNode;
  payment: IPayment;
  couponCode: string;
  discountPercent: number;
  updatedAt: string;
  createdAt: string;
}

interface ILspNode {
  alias: string;
  pubkey: string;
  connectionStrings: string[];
}

interface IPayment {
  state: EPaymentState;
  paidSat: number;
  bolt11Invoice: IBolt11Invoice;
  onchain: IOnchain;
}

interface IBolt11Invoice {
  request: string;
  state: EBolt11InvoiceState;
  expiresAt: string;
  updatedAt: string;
}

interface IOnchain {
  address: string;
  confirmedSat: number;
  transactions: ITransaction[];
}

export interface IOpenChannelRequest {
  orderId: string;
  connectionStringOrPubkey: string;
  announceChannel: boolean;
}

export interface IChannel {
  state: EChannelState;
  lspNodePubkey: string;
  clientNodePubkey: string;
  announceChannel: boolean;
  fundingTx: {
    id: string;
    vout: number;
  };
  shortChannelId: string;
}

export interface IOpenChannelResponse {
  id: string;
  state: EOrderState;
  feeSat: number;
  lspBalanceSat: number;
  clientBalanceSat: number;
  zeroConf: boolean;
  channelExpiryWeeks: number;
  channelExpiresAt: string;
  orderExpiresAt: string;
  channel: IChannel;
  lspNode: ILspNode;
  payment: IPayment;
  couponCode: string;
  discountPercent: number;
  updatedAt: string;
  createdAt: string;
}

export interface ITransaction {
  amountSat: number;
  txId: string;
  vout: number;
  blockHeight: number;
  blockConfirmationCount: number;
  feeRateSatPerVbyte: number;
  confirmed: boolean;
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

export type TNetwork = 'mainnet' | 'regtest';

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
