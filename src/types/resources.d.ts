interface ITheme {
  title: string;
  id: string;
  questions: string[];
}

interface IAnswer {
  id: string;
  text: string;
  isRight: boolean;
}

interface IQuestion {
  source: string;
  title: string;
  media: string;
  answers: IAnswer[];
  description: string[];
  id: string;
}

interface ITicket {
  title: string;
  ticketNumber: string;
  id: string;
  questions: string[];
}

interface ITooltips {
  [key: string]: string;
}
