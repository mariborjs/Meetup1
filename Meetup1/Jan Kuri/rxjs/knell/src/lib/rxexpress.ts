import * as express from 'express';
import { Observable } from 'rxjs/Observable';

export function RxExpress(): any {
  const expressApp: express.Application = express();
  const app: any = {};

  app.listen = (function() {
    const server = Observable.create(observer => {
      const args = arguments;
      args[args.length++] = () => observer.next();
      expressApp.listen.apply(expressApp, args);
    });

    return server;
  });

  Object.keys(expressApp).forEach(method => {
    app[method] = (function() {
      const args = arguments;
      const observable = Observable.create(observer => {
        args[args.length++] = (req: express.Request, res: express.Response, next: express.NextFunction) => {
          observer.next({ req: res, res: res, next: next });
        };

        expressApp[method].apply(expressApp, args);
      });

      return observable;
    });
  });

  return app;
}
