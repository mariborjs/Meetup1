import { RxExpress } from '../lib/rxexpress';

const app = RxExpress();

app.get('/').subscribe(({ req, res, next }) => {
  res.status(200).json({ message: 'Hello MariborJS!' });
});

app.listen(3000).subscribe(() => console.log('Listening ...'));
