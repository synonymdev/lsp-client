import { IHeaders } from '../types';
import fetch from 'cross-fetch';

/**
 * Abstract class for shared logic between public and admin api clients
 */
class Client {
  private host = '';
  private additionalHeaders: IHeaders = {};

  constructor() {
    this.setNetwork('regtest');
  }

  static getStateMessage(code: number): string {
    switch (code) {
      case 0:
        return 'Awaiting payment';
      case 100:
        return 'Paid';
      case 150:
        return 'Payment refunded';
      case 200:
        return 'Queued for opening';
      case 300:
        return 'Channel opening';
      case 350:
        return 'Channel closing';
      case 400:
        return 'Given up';
      case 410:
        return 'Order expired';
      case 450:
        return 'Channel closed';
      case 500:
        return 'Channel open';
    }

    return `Unknown code: ${code}`;
  }

  setNetwork(network: 'mainnet' | 'testnet' | 'regtest'): void {
    switch (network) {
      case 'mainnet': {
        this.host = 'https://blocktank.synonym.to/api/';
        break;
      }
      case 'testnet': {
        throw new Error('Network not yet supported');
        break;
      }
      case 'regtest': {
        this.host = 'http://35.233.47.252:443/blocktank/';
        break;
      }
    }
  }

  setHeaders(headers: IHeaders) {
    this.additionalHeaders = { ...this.additionalHeaders, ...headers };
  }

  async call(path: string, method: 'GET' | 'POST', request?: any): Promise<any> {
    const url = `${this.host}${path}`;

    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...this.additionalHeaders,
    };

    const fetchRes = await fetch(url, {
      method,
      headers,
      body: request ? JSON.stringify(request) : undefined,
    });

    if (fetchRes.status !== 200) {
      throw new Error(`HTTP error ${fetchRes.status}`);
    }
    const body = await fetchRes.json();

    if (!body) {
      throw new Error('Unknown HTTP error');
    }

    if (body.error) {
      throw new Error(body.error);
    }

    return body;
  }
}

export default Client;
