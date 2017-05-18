import { RxExpress } from '../lib/rxexpress';
import { readFile } from 'fs';
import { resolve } from 'path';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/bindNodeCallback';
import 'rxjs/add/operator/map';

const app = RxExpress();

function getFileStream(filePath: string): Observable<Buffer> {
  const readFileAsObservable = Observable.bindNodeCallback(readFile);
  return readFileAsObservable(resolve(__dirname, filePath));
}

app.get('/data').subscribe(({ req, res, next }) => {
  getFileStream('../../data/data.json')
    .map(buf => JSON.parse(buf.toString()))
    .subscribe(data => {
      return res.status(200).json(data);
    }, err => {
      return res.status(404).json(err)
    });
});

app.listen(3000).subscribe(() => console.log('Listening ...'));
