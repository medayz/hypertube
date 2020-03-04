const getSubtitles = require('yifysubtitles');
const fs = require('fs');

exports.get = async imdbid => {
  try {
    fs.mkdirSync(`${process.env.MOVIES_PATH}/${imdbid}`, {
      recursive: true
    });

    let subtitles = await getSubtitles(imdbid, {
      path: `${process.env.MOVIES_PATH}/${imdbid}`,
      langs: ['ar', 'fr', 'en', 'es']
    });

    subtitles = subtitles.map(item => ({
      lang: item.lang,
      langShort: item.langShort,
      fileName: item.fileName
    }));

    return subtitles;
  } catch (err) {
    return [];
  }
};
