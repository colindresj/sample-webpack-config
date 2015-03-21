## Sample wepack config

#### Development
Use the webpack dev server to build and serve assets with or without hot
replacement.

```bash
$ npm run dev-server
```

```bash
$ npm run hot-dev-server
```

When using the `dev-server` command, any changes to asset files will force a
page refresh.

When using the `hot-dev-server` command, any changes to asset files will force
a hot module replacement, updating page content without refreshing the page or
changing  the current state.

#### Production
Use webpack to build your assets.

```bash
$ npm run build
```

#### Serve requests
Use express to serve requests. Depending on whether a dev or production build,
the asset resource is either loaded from express's static dir (production) or
from webpack dev server (development).

```bash
$ npm run serve
```
