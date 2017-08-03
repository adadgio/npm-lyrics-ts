# npm-lyrics-ts

A NodeJS application framework written in typescript.

## Install

Get master branch from repository.

`wget https://github.com/adadgio/npm-lyrics-ts/archive/master.zip && unzip master.zip && rm master.zip`

Rename the project to your own project name (`acme`)

`mv npm-lyrics-ts-master acme`

## Get started

```bash
cd acme
npm install
npm start
```

You can test the **Acme demo bundle** endpoints included in the framework by downloading
the [postman demo collection](./docs/lyrics.postman.json) file.

## Documentation

- [Config](./docs/CONFIG.md)
- [Controllers](./docs/CONTROLLERS.md)
- [Routing](./docs/ROUTING.md)
- [Services and DI](./docs/SERVICES.md)
- [Security](./docs/SECURITY.md)
- [Events](./docs/EVENTS.md)

## Miscellaneous

To see how your system performs, open `http://localhost:8182/_system/load` on your browser  (8182 beeing your default express port in your config `yml` file).

## Development and building for production

Working in development, you simply run `npm start`.

For building the project in plain NodeJS and running the app, do:

```bash
npm run build
cd dist
npm install
node src/index --env=dev
```


## Load tests

Install Artillery.js and run.

`artillery quick --duration 60 --rate 10 -n 20 http://localhost:8182/rest/get`
