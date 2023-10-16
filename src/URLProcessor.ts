import { JSDOM } from 'jsdom';

class URLProcessor {
  private baseURL: string;
  jsdomInstance = new JSDOM('');

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  toAbsolute = (url: string): string => {
    try {
      const urlInstance = new this.jsdomInstance.window.URL(url);
      const localUrlInstance = new this.jsdomInstance.window.URL(this.baseURL);
      localUrlInstance.pathname = urlInstance.pathname;

      return localUrlInstance.href;
    } catch (e) {
      const urlInstance = new this.jsdomInstance.window.URL(this.baseURL);
      const [pathname, search] = url.split('?');
      urlInstance.pathname = pathname;
      urlInstance.search = search || '';

      return urlInstance.href;
    }
  };
}

export default URLProcessor;
