import { isClient, makeRefreshToken } from './auth';

export class FetchWrapper {
  #baseUrl: string = '';
  #headers: { [key: string]: string } = {};
  #refreshToken: string = '';

  constructor(baseUrl?: string, headers?: { [key: string]: string }) {
    if (baseUrl) {
      this.#baseUrl = baseUrl;
    }
    this.#headers = headers || {};
  }

  async refreshToken(refreshToken: string) {
    this.#refreshToken = refreshToken;
  }

  // async #send<T>(
  //   path: string,
  //   method: string,
  //   data: null | { [key: string]: unknown },
  //   options: { headers?: { [key: string]: string } } = {}
  // ): Promise<Response & { data?: T }> {
  //   const requestInit: RequestInit = {
  //     method,
  //     headers: {
  //       'Content-Type': 'application/json',
  //       ...this.#headers,
  //       ...options.headers
  //     }
  //   };

  //   if (data) {
  //     requestInit.body = JSON.stringify(data);
  //   }

  //   const response: Response & { data?: T } = await fetch(`${this.#baseUrl}${path}`, requestInit);

  //   if (response.status === 401 && this.#refreshToken && isClient()) {
  //     const newToken = await makeRefreshToken(this.#refreshToken);

  //     if (newToken) {
  //       await fetch('/api/cookie?key=token', {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json'
  //         },
  //         body: JSON.stringify({
  //           value: newToken.accessToken,
  //           maxAge: 60 * 15
  //         })
  //       });
  //       this.#headers.Authorization = `Bearer ${newToken.accessToken}`;
  //       return this.#send<T>(path, method, data, options);
  //     }

  //     if (window.location.href !== '/auth/log-out') {
  //       window.location.href = '/auth/log-out';
  //     }
  //   }

  //   response.data = await response.json();

  //   console.log(response);

  //   return response;
  // }
  async #send<T>(
    path: string,
    method: string,
    data: null | { [key: string]: unknown },
    options: { headers?: { [key: string]: string } } = {}
  ): Promise<Response & { data?: T }> {
    const requestInit: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...this.#headers,
        ...options.headers
      }
    };

    if (data) {
      requestInit.body = JSON.stringify(data);
    }

    let response: Response & { data?: T };

    try {
      response = (await fetch(`${this.#baseUrl}${path}`, requestInit)) as Response & { data?: T };
    } catch (error) {
      console.error('API server is unavailable:', error);

      const fallbackResponse = new Response(
        JSON.stringify({
          message: 'API server is unavailable'
        }),
        {
          status: 503,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      ) as Response & { data?: T };

      fallbackResponse.data = undefined;

      return fallbackResponse;
    }

    if (response.status === 401 && this.#refreshToken && isClient()) {
      const newToken = await makeRefreshToken(this.#refreshToken);

      if (newToken) {
        await fetch('/api/cookie?key=token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            value: newToken.accessToken,
            maxAge: 60 * 15
          })
        });

        this.#headers.Authorization = `Bearer ${newToken.accessToken}`;

        return this.#send<T>(path, method, data, options);
      }

      if (window.location.pathname !== '/auth/log-out') {
        window.location.href = '/auth/log-out';
      }
    }

    try {
      response.data = await response.json();
    } catch {
      response.data = undefined;
    }

    return response;
  }

  async upload<T>(
    path: string,
    formData: FormData,
    options: { headers?: Record<string, string> } = {}
  ): Promise<Response & { data?: T }> {
    const requestInit: RequestInit = {
      method: 'POST',
      headers: {
        ...this.#headers,
        ...options.headers
      },
      body: formData
    };

    const response: Response & { data?: T } = await fetch(`${this.#baseUrl}${path}`, requestInit);

    response.data = await response.json();

    return response;
  }

  async get<T>(path: string, options = {}) {
    return this.#send<T>(path, 'GET', null, options);
  }

  async post<T>(path: string, data: null | { [key: string]: unknown } = null, options = {}) {
    return this.#send<T>(path, 'POST', data, options);
  }

  async put<T>(path: string, data: null | { [key: string]: unknown } = null, options = {}) {
    return this.#send<T>(path, 'PUT', data, options);
  }

  async patch<T>(path: string, data: null | { [key: string]: unknown } = null, options = {}) {
    return this.#send<T>(path, 'PATCH', data, options);
  }

  async delete<T>(path: string, options = {}) {
    return this.#send<T>(path, 'DELETE', null, options);
  }
}
