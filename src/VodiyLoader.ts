import { IPageLoader } from './types/page-loader';
import axios from 'axios';
import { JSDOM } from 'jsdom';
import { v4 } from 'uuid';
import FormData from 'form-data';
import HTMLNodes from './HTMLNodes';
import URLProcessor from './URLProcessor';
import Time from './Time';
import Storage from './Storage';
import VodiyImages from './VodiyImages';

const chalk = {
  yellow: console.log,
  green: console.log,
  blue: console.log,
  white: console.log,
  grey: console.log,
};

class VodiyLoader implements IPageLoader {
  static domainURL = 'https://vodiy.ua';
  static baseURL = 'https://vodiy.ua/pdr/test/?complect=6&theme=1';

  private urlProcessor = new URLProcessor(VodiyLoader.domainURL);
  private themes: { [id: string]: ITheme } = {};
  private questions: { [id: string]: IQuestion } = {};
  private tickets: { [id: string]: ITicket } = {};
  private tooltips: ITooltips = {};

  private getThemesUrl = async (_pageData = null): Promise<IVodiyThemeUrl[]> => {
    const pageData =
      _pageData ||
      (await (async () => {
        const { data } = await axios.get(VodiyLoader.baseURL);

        return data;
      })());
    const jsdomInstance = new JSDOM(pageData);

    return [].slice
      .call(jsdomInstance.window.document.querySelectorAll('.inner_keep_block .inner_keep_block_0001 li a'))
      .map((node) => ({
        url: this.urlProcessor.toAbsolute(node.href),
        title: HTMLNodes.processInnerText(node.innerHTML),
      }))
      .filter(
        ({ url }) =>
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

  private processDescription = (description: string): string[] => {
    const inst = new JSDOM(description);
    const content = inst.window.document.body.innerHTML;
    const titles = content.match(/(\<a.+?<\/a>)/g).map((entry) => {
      const div = inst.window.document.createElement('div');
      div.innerHTML = entry;
      const link = div.querySelector('a');
      const titleValue = link.getAttribute('title') || link.getAttribute('oldtitle');

      return [titleValue, HTMLNodes.processInnerText(link.innerHTML), entry];
    });

    const replacedTooltips = titles.reduce((acc, node) => {
      const [title, content, entry] = node;

      return acc.replace(entry, `__TOOLTIP__${title}__${content}__TOOLTIP__`);
    }, content);

    const replacedMedia = replacedTooltips.replace(/(src=")(.+?)(")/g, '$1https://vodiy.ua$2$3');

    return replacedMedia.split('__TOOLTIP__');
  };

  private processSingleQuestion = async (listNode: HTMLElement): Promise<IQuestion & { ticketId: string }> => {
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

    // @ts-ignore
    const ticketId = listNode.querySelector('input[name="ticket_number"]').value;

    let description = [];

    try {
      description = this.processDescription(listNode.querySelector('.reply_ticket p').innerHTML);
    } catch (e) {
      console.error('No description in question "' + questionContent + '"');
    }

    return {
      ticketId,
      id: v4(),
      title,
      source,
      media: media ? this.urlProcessor.toAbsolute(media) : '',
      description,
      answers,
    };
  };

  handleSinglePage = async (jsdomInstance: JSDOM, themeId: string): Promise<this> => {
    for (const questionNode of [].slice.call(jsdomInstance.window.document.querySelectorAll('.ticketpage_ul > li'))) {
      const { ticketId, ...question } = await this.processSingleQuestion(questionNode);

      this.themes[themeId].questions.push(question.id);
      this.questions[question.id] = question;

      if (!this.tickets[ticketId]) {
        this.tickets[ticketId] = {
          id: v4(),
          ticketNumber: ticketId,
          title: `Білет №${ticketId}`,
          questions: [],
        };
      }

      this.tickets[ticketId].questions.push(question.id);
    }

    return this;
  };

  handleSingleTheme = async (jsdomInstance: JSDOM, themeTitle: string, themeUrl: string): Promise<this> => {
    const themeId = v4();

    this.themes[themeId] = {
      id: themeId,
      title: themeTitle,
      questions: [],
    };

    chalk.yellow(`Start page ${themeUrl}`);

    await this.handleSinglePage(jsdomInstance, themeId);

    chalk.yellow(`Finish page ${themeUrl}`);

    const questionsAmount = parseInt(
      HTMLNodes.processInnerText(jsdomInstance.window.document.querySelector('.questions_left').innerHTML)
    );
    const pagesAmount = Math.ceil(questionsAmount / 20);

    if (pagesAmount === 1) {
      return this;
    }

    const themeUrls = Array(pagesAmount - 1)
      .fill(null)
      .map((_, idx) => {
        const urlInstance = new jsdomInstance.window.URL(themeUrl);
        urlInstance.searchParams.set('part', `${idx + 2}`);

        return urlInstance.href;
      });

    for (const themeUrlItem of themeUrls) {
      chalk.yellow(`Start page ${themeUrlItem}`);
      const { data } = await axios.get(themeUrlItem);
      const themeJsdom = new JSDOM(data);

      await this.handleSinglePage(themeJsdom, themeId);
      chalk.yellow(`Finish page ${themeUrlItem}`);
    }

    return this;
  };

  fillUpQuestions = async (): Promise<this> => {
    const _urls = await this.getThemesUrl();

    const urls = [..._urls];

    for (const urlData of urls) {
      chalk.green(`Start theme ${urlData.title}`);

      const { data } = await axios.get(urlData.url);
      const jsdomInstance = new JSDOM(data);

      await this.handleSingleTheme(jsdomInstance, urlData.title, urlData.url);

      chalk.green(`Finish theme ${urlData.title}`);

      await Time.sleep_ms(200);
    }

    return this;
  };

  processTooltips = async (): Promise<this> => {
    chalk.blue(`Start tooltips`);
    Object.values(this.questions).forEach((question) => {
      const tooltips = question.description.filter((item) => item.match(/^\w/i));

      tooltips.forEach((tooltip) => {
        this.tooltips[tooltip] = '';
      });
    });

    for (const tooltip of Object.keys(this.tooltips)) {
      const [type] = tooltip.split('__');

      const fd = new FormData();
      fd.append('type', type);

      const { data } = await axios.post(`https://vodiy.ua/load_tooltip/`, fd);

      this.tooltips[tooltip] = data.response;
      await Time.sleep_ms(200);
    }

    chalk.blue(`Finish tooltips`);

    return this;
  };

  processQuestionImages = async (questions = this.questions): Promise<{ [key: string]: string }> => {
    chalk.white(`Start question images`);
    const imageKeys = Object.values(questions).reduce((acc, question) => {
      const missingImages = VodiyImages.extractImages(question);

      return {
        ...acc,
        ...missingImages.reduce((imagesAcc, image) => ({ ...imagesAcc, [image]: '' }), {}),
      };
    }, {});

    for (const imageKey of Object.keys(imageKeys)) {
      if (!imageKey) {
        continue;
      }

      await Storage.uploadMedia(imageKey);
    }

    Object.keys(questions).forEach((key) => {
      questions[key] = VodiyImages.replaceQuestionImage(questions[key]);
    });

    chalk.white(`Finish question images`);

    return imageKeys;
  };

  processTooltipImages = async (
    loadedImages: { [key: string]: string },
    tooltips: ITooltips = this.tooltips
  ): Promise<this> => {
    chalk.grey(`Start tooltip images`);
    const imageKeys = Object.keys(tooltips).reduce((acc, tooltipKey) => {
      const tooltipValue = tooltips[tooltipKey];

      const { tooltip, imageUrls } = VodiyImages.replaceTooltipImages(tooltipValue);

      tooltips[tooltipKey] = tooltip;

      return {
        ...acc,
        ...imageUrls.reduce(
          (imagesAcc, image) => (loadedImages.hasOwnProperty(image) ? imagesAcc : { ...imagesAcc, [image]: '' }),
          {}
        ),
      };
    }, {});

    const imagesAmount = Object.keys(imageKeys).length;
    let idx = 1;

    for (const imageKey of Object.keys(imageKeys)) {
      if (!imageKey) {
        continue;
      }

      console.log(`Start tooltip image ${imageKey} (${idx}/${imagesAmount})`);
      await Storage.uploadMedia(imageKey);
      console.log(`Finish tooltip image ${imageKey} (${idx}/${imagesAmount})`);
      idx += 1;
    }

    chalk.grey(`Finish tooltip images`);

    return this;
  };

  getQuestions = async (): Promise<IQuestion[]> => {
    return Object.values(this.questions);
  };

  getThemes = async (): Promise<ITheme[]> => {
    return Object.values(this.themes);
  };

  getTickets = async (): Promise<ITicket[]> => {
    return Object.values(this.tickets);
  };

  getTooltips = async (): Promise<ITooltips> => {
    return this.tooltips;
  };
}

export default VodiyLoader;
