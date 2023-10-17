import { JSDOM } from 'jsdom';

class VodiyImages {
  static extractImages(question: IQuestion) {
    const descriptionImages =
      question.description
        .join('')
        .match(/(")(https:\/\/vodiy\.ua\/media.+?)(")/gi)
        ?.map((entry) => entry.replace(/"/g, '')) || [];

    return [...descriptionImages, question.media];
  }

  static replaceImageUrl(url: string): string {
    if (!url) {
      return '';
    }

    const { CURRENT_YEAR } = process.env;
    const jsdomInstance = new JSDOM('');
    const urlInstance = new jsdomInstance.window.URL(url);
    const [, media, ...rest] = urlInstance.pathname.split('/');

    return [process.env.MEDIA_PATH, media, CURRENT_YEAR, ...rest].join('/');
  }

  static replaceQuestionImage(question: IQuestion) {
    const questionClone = {
      ...question,
    };

    questionClone.media = questionClone.media ? VodiyImages.replaceImageUrl(questionClone.media) : '';
    questionClone.description = questionClone.description.map((entry) => {
      const imageUrls = entry.match(/(")(https:\/\/vodiy\.ua\/media.+?)(")/gi)?.map((entry) => entry.replace(/"/g, ''));

      if (!imageUrls) {
        return entry;
      }

      imageUrls.forEach((url) => {
        entry = entry.replace(url, VodiyImages.replaceImageUrl(url));
      });

      return entry;
    });

    return questionClone;
  }
}

export default VodiyImages;
