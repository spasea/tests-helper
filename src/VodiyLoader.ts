import { IPageLoader } from './types/page-loader';
import axios from 'axios';
import { JSDOM } from 'jsdom';
import { v4 } from 'uuid';
import HTMLNodes from './HTMLNodes';
import URLProcessor from './URLProcessor';

class VodiyLoader implements IPageLoader {
  static domainURL = 'https://vodiy.ua';
  static baseURL = 'https://vodiy.ua/pdr/test/?complect=6&theme=1';

  private urlProcessor = new URLProcessor(VodiyLoader.domainURL);

  private getThemesUrl = async (): Promise<string[]> => {
    const { data } = await axios.get(VodiyLoader.baseURL);
    const jsdomInstance = new JSDOM(data);

    return [].slice
      .call(jsdomInstance.window.document.querySelectorAll('.inner_keep_block .inner_keep_block_0001 li a'))
      .map((node) => this.urlProcessor.toAbsolute(node.href))
      .filter(
        (url) =>
          ![
            'theme=125',
            'theme=126',
            'theme=127',
            'theme=128',
            'theme=129',
            'theme=130',
            'theme=131',
            'theme=132',
            'theme=133',
            'theme=134',
            'theme=135',
            'theme=136',
            'theme=141',
            'theme=142',
            'theme=143',
            'theme=144',
          ].find((excludedItem) => url.includes(excludedItem))
      );
  };

  private processSingleQuestion = async (listNode: HTMLElement): Promise<IQuestion> => {
    const title = HTMLNodes.processInnerText(listNode.querySelector('p').innerHTML);
    const source = HTMLNodes.processInnerText(listNode.querySelector('.title_ticket').innerHTML);

    const questionContent = listNode.querySelector('.select_ticket');
    // @ts-ignore
    const media = questionContent.querySelector('.ticket_left img')?.src || '';

    const answers: IAnswer[] = [].slice
      .call(questionContent.querySelectorAll('.ticket_right label'))
      .map((question) => ({
        text: HTMLNodes.processInnerText(question.querySelector('.span_text').innerHTML),
        isRight: question.querySelector('input').getAttribute('rel') === 'rt1',
        id: v4(),
      }));

    let description = [];

    try {
      description = listNode
        .querySelector('.reply_ticket p')
        .innerHTML.replace(
          /(\<a {0,}href=")(.+?)(" {0,}title=")(.+?)(".+?\>?)(.+?)(<\/a>)/g,
          '__TOOLTIP__$4__$6__TOOLTIP__'
        )
        .split('__TOOLTIP__');
    } catch (e) {
      console.error('No description in question "' + questionContent + '"');
    }

    return {
      id: v4(),
      title,
      source,
      media: media ? this.urlProcessor.toAbsolute(media) : '',
      description,
      answers,
    };
  };

  getQuestions = async (): Promise<IQuestion[]> => {
    const urls = await this.getThemesUrl();

    const { data } = await axios.get(urls[0]);
    const jsdomInstance = new JSDOM(data);

    const ticket = await this.processSingleQuestion(jsdomInstance.window.document.querySelector('.ticketpage_ul > li'));

    console.log(ticket);

    return Promise.resolve([]);
  };

  getThemes = async (): Promise<ITheme[]> => {
    return Promise.resolve([]);
  };

  getTickets = async (): Promise<ITicket[]> => {
    return Promise.resolve([]);
  };

  getTooltips = async (): Promise<ITooltips> => {
    return Promise.resolve(undefined);
  };
}

export default VodiyLoader;
