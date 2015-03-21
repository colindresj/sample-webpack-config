import express from 'express';
import path from 'path';
import json from 'jsonfile';

const app = express();
const port = 8080;
const stats = 'public/application/bundle-stats.json';

let scriptURI;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

json.readFile(stats, (err, obj) => {
  if (err) return err;
  scriptURI = obj.publicPath + obj.assetsByChunkName.application;
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index', { scriptURI: scriptURI });
});

app.listen(port);
console.log(`Express running on port ${port}`);

export default app;
