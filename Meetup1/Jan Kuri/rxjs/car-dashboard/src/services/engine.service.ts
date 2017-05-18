import { Injectable, Provider } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';

@Injectable()
export class EngineService {
  engine: Subject<boolean>;
  keyObservable: Observable<KeyboardEvent>;
  accelerate: boolean;
  timeout: any;

  constructor() {
    this.accelerate = false;
    this.engine = new Subject();
    this.keyObservable = Observable.fromEvent(document, 'keydown');

    this.keyObservable
      .map(e => e.keyCode)
      .filter(keyCode => keyCode === 38 || keyCode === 40)
      .subscribe(code => {
        this.engine.next(code === 38);
      });
  }
}

export const EngineServiceProvider: Provider = {
  provide: EngineService, useClass: EngineService
};
