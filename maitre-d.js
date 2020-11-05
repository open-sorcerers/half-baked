'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var path = _interopDefault(require('path'));
var express = _interopDefault(require('express'));
var bodyParser = _interopDefault(require('body-parser'));
var cors = _interopDefault(require('cors'));
var pino = _interopDefault(require('pino'));
var pinoHttp = _interopDefault(require('pino-http'));
var ramda = require('ramda');
var fluture = require('fluture');
var T = require('torpor');
var T__default = _interopDefault(T);

const APPLICATION_JSON = 'application/json';

const onCancel = CONFIG => () => {};

const readFileOr = ramda.curry(function _readFileOr(otherwise, pathToFile) {
  const forceFileExistence = raw => {
    if (raw === '') {
      return ramda.pipe(T.writeFile(ramda.__, otherwise, 'utf8'), ramda.map(() => otherwise))(pathToFile);
    }

    return fluture.resolve(raw);
  };

  return ramda.pipe(T.readFile(ramda.__, {
    encoding: 'utf8',
    flag: 'a+'
  }), fluture.chain(forceFileExistence))(pathToFile);
});

const notEmpty = x => Object.values(x).filter(z => z).length > 0;

const selectBySelectorOr = ramda.curry(function select(or, selector, id, futureData) {
  return ramda.pipe(ramda.map(ramda.find(({
    [selector]: given
  }) => id === given)), z => notEmpty(z) ? z : or)(futureData);
});

const onGetId = ({
  STORAGE,
  CONSTANTS
}) => (req, res, next) => {
  const {
    NO_MATCH: NOT_FOUND
  } = CONSTANTS;
  const entity = ramda.last(STORAGE.ACCESS_PATH);

  const finish = x => x[NOT_FOUND] ? res.sendStatus(404) : res.json(x);

  ramda.pipe(readFileOr({}), ramda.map(JSON.parse), ramda.map(selectBySelectorOr({
    [NOT_FOUND]: true
  }, entity, req.params[entity])), fluture.fork(next)(finish))(STORAGE.BRAIN);
};

const defaultData = () => JSON.stringify({
  data: [],
  meta: {
    generatedBy: 'maitre-d'
  }
}, null, 2);

const onGetRoot = CONFIG => {
  const forceReadFile = readFileOr(defaultData());
  return function defaultJSONResponse(req, res, next) {
    const {
      STORAGE
    } = CONFIG;

    const finish = x => res.json(x);

    ramda.pipe(forceReadFile, ramda.map(JSON.parse), fluture.fork(next)(finish))(STORAGE.BRAIN);
  };
};

const onPostId = config => (req, res, next) => {
  res.send(200);
};

const onPostRoot = config => (req, res, next) => {
  const finish = () => res.json({
    saved: true
  });

  ramda.pipe(x => JSON.stringify(x), T.writeFile(config.STORAGE.BRAIN, ramda.__, 'utf8'), fluture.fork(next)(finish))(req.body);
};

const freeze = Object.freeze;
const deepFreeze = ramda.pipe(ramda.map(freeze), freeze);
const DEFAULT_CONFIG = deepFreeze({
  CONSTANTS: {
    NO_MATCH: 'no-matching-entity-found'
  },
  CORS: {
    origin: true,
    credentials: true
  },
  PORT: 1234,
  STORAGE: {
    ACCESS_PATH: ['data', 'id'],
    BRAIN: 'maitre-data.json',
    BACKUP: 'maitre-data.json.bak',
    LIMIT: '50mb',
    TYPE: APPLICATION_JSON
  },
  onCancel,
  onGetId,
  onGetRoot,
  onPostId,
  onPostRoot
});

function onLoadWithConfig(config) {
  const backup = config.STORAGE.BACKUP;
  return () => {
    const oldThoughts = readFileOr(defaultData());
    const newThoughts = T.writeFile(backup, ramda.__, 'utf8');
    ramda.pipe(oldThoughts, ramda.chain(newThoughts), fluture.fork(console.warn)(console.log))(config.STORAGE.BRAIN);
  };
}

const announceBackupWithConfig = ramda.curry(function _announceBackupWithConfig(server, x) {
  // kill connection
  server.close(() => {
    process.exit(0);
  }); // force kill connection

  setTimeout(() => process.exit(2), 5e3);
});

const errorOnExit = e => {
  process.exit(1);
};

function onUnloadWithConfig(server, config) {
  return () => {
    const oldThoughts = T__default.readFile(config.STORAGE.BRAIN);
    const newThoughts = T__default.writeFile(config.STORAGE.BACKUP, ramda.__, 'utf8');
    ramda.pipe(oldThoughts, ramda.map(ramda.pipe(JSON.parse, ramda.assocPath(['meta', 'modified'], new Date().toString()), x => JSON.stringify(x, null, 2))), ramda.chain(newThoughts), fluture.fork(errorOnExit)(announceBackupWithConfig(server)))('utf8');
  };
}

const relativePath = x => path.resolve(__dirname, x); // head requests must return 204


const corsHead204 = (req, res) => {
  res.sendStatus(204);
};

function configureMaitreD(rawConfig = DEFAULT_CONFIG) {
  return new fluture.Future(function configuredServer(bad, good) {
    const CONFIG = ramda.pipe(ramda.merge(DEFAULT_CONFIG), Object.freeze)(rawConfig);
    const {
      STORAGE,
      CORS,
      onGetRoot,
      onPostRoot,
      onGetId,
      onPostId,
      onCancel,
      logging
    } = CONFIG;
    const {
      BRAIN: _BRAIN,
      BACKUP: _BACKUP,
      LIMIT: limit,
      TYPE: type
    } = STORAGE;
    const app = express();
    app.locals.title = "Maître d'Serveur";

    if (logging) {
      app.use(pinoHttp({
        logger: pino({
          name: 'maitre-d'
        })
      }));
    } // cors


    app.use(cors(CORS)); // json

    if (type === APPLICATION_JSON) {
      app.use(bodyParser.json({
        limit,
        type
      }));
    }

    const LOCALIZED_STORAGE = ramda.map(relativePath, {
      BRAIN: _BRAIN,
      BACKUP: _BACKUP
    });
    const LOCALIZED_CONFIG = Object.freeze(ramda.merge(CONFIG, {
      STORAGE: ramda.merge(STORAGE, LOCALIZED_STORAGE)
    }));
    const onLoad = onLoadWithConfig(LOCALIZED_CONFIG);
    const server = app.listen(CONFIG.PORT, onLoad);
    const onUnload = onUnloadWithConfig(server, LOCALIZED_CONFIG);
    process.on('SIGTERM', onUnload);
    process.on('SIGINT', onUnload);
    app.head('/', corsHead204);
    app.get('/', onGetRoot(LOCALIZED_CONFIG));
    app.post('/', onPostRoot(LOCALIZED_CONFIG));
    app.head('/:id', corsHead204);
    app.get('/:id', onGetId(LOCALIZED_CONFIG));
    app.post('/:id', onPostId(LOCALIZED_CONFIG));
    good(app);
    return onCancel(LOCALIZED_CONFIG);
  });
}

module.exports = configureMaitreD;
