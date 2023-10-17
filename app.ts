import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

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

  // const instance = new VodiyLoader();
  // //
  // await instance.fillUpQuestions();
  // //
  // const [questions, themes, tickets] = await Promise.all([
  //   instance.getQuestions(),
  //   instance.getThemes(),
  //   instance.getTickets(),
  // ]);
  //
  // Storage.saveJSONToStorage('questions.json', questions);
  // Storage.saveJSONToStorage('themes.json', themes);
  // Storage.saveJSONToStorage('tickets.json', tickets);

  // console.log(new URLProcessor('https://vodiy.ua').toAbsolute('/media'));

  // Cloudinary.v2.uploader.upload('');

  console.log('start');

  // await Storage.uploadMedia('https://vodiy.ua/media/questions/1219_6.jpg');

  console.log('done');
};

main();
