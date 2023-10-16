import { JSDOM } from 'jsdom';

interface IPageLoader {
  getThemes(): Promise<ITheme[]>;
  getQuestions(): Promise<IQuestion[]>;
  getTickets(): Promise<ITicket[]>;
  getTooltips(): Promise<ITooltips>;
}
