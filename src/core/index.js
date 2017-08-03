import helmet from 'helmet';
import bodyParser from 'body-parser';
import compression from 'compression';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import session from 'express-session';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import morgan from 'morgan';
import config from './../config';

export default (app) => {

  app.use(bodyParser.json({ limit: '5mb' }));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(fileUpload());
  app.use(cookieParser());
  app.use(methodOverride());
  app.use(compression());
  app.use(helmet());
  app.use(cors({ origin: true, credentials: true }));

  if ("twitter" in config.oAuth && config.oAuth.twitter.enabled)
    app.use(session({ secret: config.secret, resave: false, saveUninitialized: false }));

  app.use(passport.initialize());
  app.use(passport.session());

  // Liverload
  if (config.mode === 'development' && config.livereload.enabled)
    app.use(require('connect-livereload')({ src: `http://${config.livereload.ip}:${config.livereload.port}/livereload.js` }));

  // Morgan
  if (config.log)
    app.use(morgan('dev'));

  // Mongo
  require('../lib/mongoose');

  // Redis
  require('../lib/redis');

  // Socket.io
  require('../lib/socket.io');

  // Services
  require('../auth/services');

  // You can add more require's here! 
};
