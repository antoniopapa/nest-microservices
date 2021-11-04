import { Injectable } from '@nestjs/common';
import axios, { Method } from 'axios';

@Injectable()
export class UserService {
  baseURL = process.env.USERS_MS + '/api';

  async request(method: Method, url: string, data = {}, cookie = ''): Promise<any> {
    let headers = {};

    if (cookie != '') {
      headers = {
        'Cookie': `jwt=${cookie}`,
      };
    }

    try {
      const response = await axios.request({
        method,
        url,
        baseURL: this.baseURL,
        headers,
        data,
      });

      return response.data;
    } catch (e) {
      console.log(e);
      return e.response.data;
    }
  }

  async post(url: string, data: any, cookie = '') {
    return this.request('post', url, data, cookie);
  }

  async put(url: string, data: any, cookie = '') {
    return this.request('put', url, data, cookie);
  }

  async get(url: string, cookie = '') {
    return this.request('GET', url, {}, cookie);
  }
}
