import VodiyLoader from './src/VodiyLoader';
import URLProcessor from './src/URLProcessor';

import Cloudinary from 'cloudinary';

const main = async () => {
  const instance = new VodiyLoader();

  // await instance.fillUpQuestions();

  // const data = await Promise.all([instance.getQuestions(), instance.getThemes(), instance.getTickets()]);

  // console.log(data);

  // console.log(new URLProcessor('https://vodiy.ua').toAbsolute('/media'));

  // Cloudinary.v2.uploader.upload('');
};

main();
