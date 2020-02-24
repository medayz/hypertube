const torrentStream = require('torrent-stream');
const FFmpeg = require('fluent-ffmpeg');
const CronJob = require('cron').CronJob;
const EventEmitter = require('events');

class MovieStream {
  constructor(options = {}, cronCallback = () => {}) {
    this._verbose = options.verbose || false;
    this._clientSupportedFormat = options.clientSupportedFormat;
    this._convert = options.convert || false;
    this._events = new EventEmitter();
    /*
    'imdbid-quality': {
      magnet: string,
      engine: torrentStreamEngine
    }
    */
    this.data = {};

    if (typeof cronCallback != 'function') return;

    const job = new CronJob(
      '0 * * * *',
      () => {
        cronCallback(this);
      },
      null,
      true,
      'Africa/Casablanca'
    );
    job.start();
  }

  on(event, callback) {
    this._events.on(event, callback);
    return this;
  }

  destroyEngines(pattern) {
    for (const key in this.data) {
      if (pattern.test(key)) {
        const result = this.data[key];
        result.engine.destroy(() => {
          delete this.data[key];
        });
      }
    }
    return false;
  }

  get(imdbid, quality) {
    const key = `${imdbid}-${quality}`;

    return this.data[key];
  }

  fromMagnet(options) {
    const { imdbid, magnet, quality } = options;
    let isNewEngine = false;

    const key = `${imdbid}-${quality}`;

    if (!this.data[key]) {
      if (this._verbose) {
        console.info('[INFO] engine creating...');
      }

      const engine = torrentStream(magnet, {
        path: `${process.env.MOVIES_PATH}/${imdbid}/${quality}`,
        trackers: [
          'udp://open.demonii.com:1337/announce',
          'udp://tracker.openbittorrent.com:80',
          'udp://tracker.coppersurfer.tk:6969',
          'udp://glotorrents.pw:6969/announce',
          'udp://tracker.opentrackr.org:1337/announce',
          'udp://torrent.gresille.org:80/announce',
          'udp://p4p.arenabg.com:1337',
          'udp://tracker.leechers-paradise.org:6969'
        ]
      });

      this.data[key] = {
        magnet: magnet,
        engine: engine
      };
      isNewEngine = true;
    }
    this._events.emit('access', { imdbid });

    const { engine } = this.data[key];

    return new Promise((resolve, reject) => {
      if (isNewEngine) {
        return engine.on('ready', () => {
          resolve(this._start(engine, options));
        });
      }

      resolve(this._start(engine, options));
    });
  }

  fromTorrent() {
    throw { message: 'Not implemented yet' };
  }

  _transcode(stream, threads = 4) {
    const converted = new FFmpeg(stream)
      .videoCodec('libvpx')
      .audioCodec('libvorbis')
      .format('webm')
      .audioBitrate(128)
      .videoBitrate(8000)
      .outputOptions([
        `-threads ${threads}`,
        '-deadline realtime',
        '-error-resilient 1'
      ])
      .on('error', err => {
        console.log(err);
        converted && converted.destroy();
      })
      .stream();

    return converted;
  }

  _getFile(files, supportedFormat = ['mp4', 'mkv', 'ogg', 'webm', 'avi']) {
    const file = files.find(file =>
      supportedFormat.includes(file.name.split('.').pop())
    );

    return file;
  }

  _getStartEnd(range, fileSize) {
    if (!range) return { start: 0, end: fileSize - 1 };

    const parts = range.replace(/bytes=/, '').split('-');
    const partialstart = parts[0];
    const partialend = parts[1];
    const start = parseInt(partialstart, 10);
    const end = partialend ? parseInt(partialend, 10) : fileSize - 1;

    return { start, end };
  }

  _getHead(range, fileSize, ext) {
    if (!range) {
      return {
        'Content-Type': `video/${ext}`
      };
    }

    const { start, end } = this._getStartEnd(range, fileSize);

    if (!fileSize) {
      return {
        'Content-Range': `bytes ${start}-${end}/*`,
        'Content-Type': `video/${ext}`
      };
    }

    return {
      'Content-Range': 'bytes ' + start + '-' + end + '/' + fileSize,
      'Accept-Ranges': 'bytes',
      'Content-Length': end - start + 1,
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Content-Type': `video/${ext}`
    };
  }

  _start(engine, options) {
    const { range } = options;
    const file = this._getFile(engine.files);

    if (!file) throw new Error('Cannot find a supported format');

    if (this._verbose) {
      console.log('[INFO]', file.name);
    }

    const ext = file.name.split('.').pop();
    const convert = !this._clientSupportedFormat.includes(ext);
    const total = file.length;
    const { start, end } = this._getStartEnd(range, total);

    if (this._verbose) {
      console.log('[INFO] sending...');
    }

    if (convert && this._convert) {
      const stream = file.createReadStream({ start, end });

      return {
        head: this._getHead(range, total, ext),
        stream: this._transcode(stream)
      };
    } else if (!convert) {
      const stream = file.createReadStream({ start, end });

      return {
        head: this._getHead(range, total, ext),
        stream
      };
    } else {
      const stream = file.createReadStream();

      return {
        head: this._getHead(range, total, ext),
        stream
      };
    }
  }
}

module.exports = MovieStream;
