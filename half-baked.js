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
  const entity = STORAGE.ACCESS_PATH && ramda.last(STORAGE.ACCESS_PATH) || 'id';

  const finish = x => x[NOT_FOUND] ? res.sendStatus(404) : res.json(x);

  ramda.pipe(readFileOr(`{}`), ramda.map(ramda.pipe(JSON.parse, selectBySelectorOr({
    [NOT_FOUND]: true
  }, entity, req.params[entity]))), fluture.fork(next)(finish))(STORAGE.BRAIN);
};

const defaultData = () => JSON.stringify({
  data: [],
  meta: {
    generatedBy: 'half-baked'
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
    BRAIN: 'half-bakedata.json',
    BACKUP: 'half-bakedata.json.bak',
    LIMIT: '50mb',
    TYPE: APPLICATION_JSON
  },
  autoListen: true,
  onLoad: false,
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
    ramda.pipe(oldThoughts, ramda.chain(newThoughts), fluture.fork(console.warn)(x => x))(config.STORAGE.BRAIN);
  };
}

const j2 = x => JSON.stringify(x, null, 2);
/* istanbul ignore next */


const announceBackupWithConfig = ramda.curry(function _announceBackupWithConfig(server, x) {
  server.close(() => {
    process.exit(0);
  });
  setTimeout(() => process.exit(2), 5e3);
});
/* istanbul ignore next */

const errorOnExit = e => {
  console.log('ERROR?', e);
  process.exit(1);
};
const addModifiedBy = x => ramda.pipe(JSON.parse, ramda.assocPath(['meta', 'modified'], new Date().toString()), j2)(x);
/* istanbul ignore next */

function onUnloadWithConfig(server, config) {
  return () => {
    const oldThoughts = T__default.readFile(config.STORAGE.BRAIN);
    const newThoughts = T__default.writeFile(config.STORAGE.BACKUP, ramda.__, 'utf8');
    ramda.pipe(oldThoughts, ramda.map(addModifiedBy), ramda.chain(newThoughts), fluture.fork(errorOnExit)(announceBackupWithConfig(server)))('utf8');
  };
}

const j0 = x => JSON.stringify(x, null, 2);

const updateFile = ramda.curry(function _updateFile(filepath, update) {
  return ramda.pipe(T.readFile(ramda.__, 'utf8'), ramda.map(ramda.pipe(JSON.parse, update, j0)), fluture.chain(T.writeFile(filepath, ramda.__, 'utf8')))(filepath);
});

const relativePath = x => path.resolve(process.cwd(), x); // head requests must return 204


const corsHead204 = (req, res) => {
  res.sendStatus(204);
};

function configureHalfBaked(rawConfig = DEFAULT_CONFIG) {
  return new fluture.Future(function configuredServer(bad, good) {
    const CONFIG = ramda.pipe(ramda.mergeDeepRight(DEFAULT_CONFIG), Object.freeze)(rawConfig);
    const {
      STORAGE,
      CORS,
      onGetRoot,
      onPostRoot,
      onGetId,
      onPostId,
      onCancel,
      logging,
      autoListen,
      onLoad
    } = CONFIG;
    const {
      BRAIN: _BRAIN,
      BACKUP: _BACKUP,
      LIMIT: limit,
      TYPE: type
    } = STORAGE;
    const app = express();
    app.locals.title = "Half-Baked";

    if (logging) {
      app.use(pinoHttp({
        logger: pino({
          name: 'half-baked'
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
    const LOCALIZED_CONFIG = Object.freeze(ramda.mergeDeepRight(CONFIG, {
      STORAGE: ramda.mergeDeepRight(STORAGE, LOCALIZED_STORAGE),
      updateBrain: updateFile(LOCALIZED_STORAGE.BRAIN)
    }));
    const defaultOnLoad = onLoadWithConfig(LOCALIZED_CONFIG);
    const load = ramda.is(Function, onLoad) ? ramda.pipe(defaultOnLoad, onLoad) : defaultOnLoad;
    const state = {
      load
    };

    if (autoListen) {
      const server = app.listen(CONFIG.PORT, load);
      state.server = server;
      state.onUnload = onUnloadWithConfig(state.server, LOCALIZED_CONFIG);
      process.on('exit', state.onUnload);
      process.on('SIGTERM', state.onUnload);
      process.on('SIGINT', state.onUnload);
    }

    app.head('/', corsHead204);
    app.get('/', onGetRoot(LOCALIZED_CONFIG));
    app.post('/', onPostRoot(LOCALIZED_CONFIG));
    app.head('/:id', corsHead204);
    app.get('/:id', onGetId(LOCALIZED_CONFIG));
    app.post('/:id', onPostId(LOCALIZED_CONFIG));
    good({
      app,
      state,
      config: CONFIG,
      localized: LOCALIZED_CONFIG,
      updateFile,
      updateRoot: updateFile(LOCALIZED_CONFIG.STORAGE.BRAIN)
    });
    return onCancel(LOCALIZED_CONFIG);
  });
}

module.exports = configureHalfBaked;
