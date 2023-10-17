// import { JSDOM } from 'jsdom';
// import HTMLNodes from './src/HTMLNodes';
// import VodiyLoader from './src/VodiyLoader';
// import Storage from './src/Storage';
//
// const main = async () => {
//   const instance = new VodiyLoader();
//   //
//   await instance.fillUpQuestions();
//   //
//   const [questions, themes, tickets] = await Promise.all([
//     instance.getQuestions(),
//     instance.getThemes(),
//     instance.getTickets(),
//   ]);
//
//   Storage.saveJSONToStorage('questions.json', questions);
//   Storage.saveJSONToStorage('themes.json', themes);
//   Storage.saveJSONToStorage('tickets.json', tickets);
//
//   // console.log(new URLProcessor('https://vodiy.ua').toAbsolute('/media'));
//
//   // Cloudinary.v2.uploader.upload('');
// };
//
// main();
