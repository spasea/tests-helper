import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import VodiyLoader from './src/VodiyLoader';
import Storage from './src/Storage';

dotenv.config();

const main = async () => {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    private_cdn: false,
    secure_distribution: null,
    secure: true,
  });

  console.log('start');

  const instance = new VodiyLoader();

  await instance.fillUpQuestions();
  const [, loadedImages] = await Promise.all([instance.processTooltips(), instance.processQuestionImages()]);
  await instance.processTooltipImages(loadedImages);

  const [questions, themes, tickets, tooltips] = await Promise.all([
    instance.getQuestions(),
    instance.getThemes(),
    instance.getTickets(),
    instance.getTooltips(),
  ]);

  Storage.saveJSONToStorage('questions.json', questions);
  Storage.saveJSONToStorage('themes.json', themes);
  Storage.saveJSONToStorage('tickets.json', tickets);
  Storage.saveJSONToStorage('tooltips.json', tooltips);

  console.log('done');
};

main();
