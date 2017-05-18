# knell

*MariborJS*

This is experiment with `RxJS` in a conjunction with `ExpressJS` to create reactive web server.

## Quick Setup

```sh
git clone https://github.com/bleenco/MariborJS.git
cd MariborJS/rxjs/knell
npm install # or yarn
```

This will also run `postinstall` script to compile source TypeScript files.

## Usage

```ts
import { RxExpress } from './src/lib/rxexpress';

const app = RxExpress();

app.get('/').subscribe(({ req, res, next}) => {
  res.status(200).json({ message: 'Hello MariborJS!' });
});

app.listen(3000).subscribe(() => console.log('Listening on port 3000...'));
```

## Author

Jan Kuri <jan@bleenco.com>

## LICENCE

MIT
