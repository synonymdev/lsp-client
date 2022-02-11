import { IHeaders } from '../types';
import fetch from 'cross-fetch';

/**
 * Abstract class for shared logic between public and admin api clients
 */
class Client {
  private host = '';
  private additionalHeaders: IHeaders = {};

  constructor() {
    this.setNetwork('testnet');
  }

  setNetwork(network: 'mainnet' | 'testnet' | 'regtest'): void {
    switch (network) {
      case 'mainnet': {
        this.host = 'https://blocktank.synonym.to/api/v1/';
        break;
      }
      case 'testnet': {
        this.host = 'http://35.233.47.252:443/chainreactor/v1/';
        break;
      }
      case 'regtest': {
        throw new Error('Network not yet supported');
        break;
      }
    }
  }

  setHeaders(headers: IHeaders) {
    this.additionalHeaders = headers;
  }

  async call(path: string, method: 'GET' | 'POST', request?: any): Promise<any> {
    const url = `${this.host}${path}`;

    const fetchRes = await fetch(url, {
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...this.additionalHeaders,
      },
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
