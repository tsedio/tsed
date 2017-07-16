# Installation

You can get the latest release using npm:

```batch
$ npm install --save ts-express-decorators express@4 @types/express
```

> **Important!** TsExpressDecorators requires Node >= 4, Express >= 4, TypeScript >= 2.0 and 
the `experimentalDecorators`, `emitDecoratorMetadata`, `types` and `lib` compilation 
options in your `tsconfig.json` file.

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["es6", "dom"],
    "types": ["reflect-metadata"],
    "module": "commonjs",
    "moduleResolution": "node",
    "experimentalDecorators":true,
    "emitDecoratorMetadata": true,
    "sourceMap": true,
    "declaration": false
  },
  "exclude": [
    "node_modules"
  ]
}
```

> **Note** : target can be set to ES2015/ES6.`.

### Optional
You can copy this example of package.json to develop your application:

```json
{
  "name": "test-ts-express-decorator",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "build": "npm run tsc:es5",
    "coverage": "npm run test-cov && npm run test-remap",
    "postinstall": "npm run build",
    "tslint": "tslint ./*.ts ./lib/*.ts",
    "test": "mocha --reporter spec --check-leaks --bail test/",
    "tsc": "tsc",
    "tsc:w": "tsc -w",
    "tsc:es5": "tsc --project tsconfig.json",
    "start": "concurrently \"npm run tsc:w\" \"nodemon app.js --ignore *.ts\""
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@types/node": "^6.0.38",
    "body-parser": "^1.15.2",
    "compression": "^1.6.2",
    "cookie-parser": "^1.4.3",
    "express": "^4.14.0",
    "express-session": "^1.14.2",
    "method-override": "^2.3.6",
    "morgan": "^1.7.0",
    "ts-express-decorators": "1.1.0",
    "typescript": "^2.0.2"
  },
  "devDependencies": {
    "concurrently": "^3.1.0",
    "nodemon": "^1.11.0"
  }
}
```

> Use the command `npm start` to start you server with the Typescript auto compilation and the nodemon task.
 Nodemon restart automatically your server when a file is modified.
