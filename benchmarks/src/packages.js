import fs from "fs";
import {dirname, join} from "path";
import {createRequire} from "module";

const require = createRequire(import.meta.url);

function readJSON(file) {
  return JSON.parse(fs.readFileSync(file, {encoding: "utf8"}));
}

const {dependencies} = readJSON("package.json");

const packages = {
  // connect: {},
  // "connect-router": {extra: true, package: "router", hasRouter: true},
  express: {
    checked: true,
    hasRouter: true
  },
  "express-injector": {
    checked: true,
    package: "express"
  },
  "express-injector-async-hook": {
    checked: true,
    package: "express"
  },
  "express-injector-http-hook": {
    checked: true,
    package: "express"
  },
  fastify: {hasRouter: true},
  "fastify-injector": {hasRouter: true, package: "fastify", checked: true},
  "fastify-big-json": {extra: true, package: "fastify", hasRouter: true},
  // hapi: {hasRouter: true, package: "@hapi/hapi"},
  koa: {},
  "koa-isomorphic-router": {extra: true, hasRouter: true},
  "koa-router": {extra: true, hasRouter: true},
  // micro: {extra: true},
  // microrouter: {extra: true, hasRouter: true},
  // "micro-route": {extra: true, hasRouter: true},
  // restify: {hasRouter: true},
  nest: {
    package: "@nestjs/common",
    hasRouter: true
  },
  "nest-fastify": {
    package: "@nestjs/platform-fastify",
    hasRouter: true
  },
  "tsed-express": {
    checked: true,
    package: "@tsed/platform-express",
    hasRouter: true
  },
  "tsed-koa": {
    package: "@tsed/platform-koa",
    hasRouter: true
  }
  // "tsed-no-context": {
  //   checked: true,
  //   package: "@tsed/platform-express",
  //   hasRouter: true
  // },
  // "tsed-no-events": {
  //   checked: true,
  //   package: "@tsed/platform-express",
  //   hasRouter: true
  // }
};

const _choices = [];

Object.keys(packages).forEach((pkg) => {
  if (!packages[pkg].version) {
    const module = dependencies[pkg] ? pkg : packages[pkg].package;
    const pkgPath = join(dirname(require.resolve(module)).split(`/${module}`)[0], module, "package.json");

    const {version} = readJSON(pkgPath);

    packages[pkg].version = version;
  }
  _choices.push(pkg);
});

export const choices = _choices.sort();

export const list = (extra = false) => {
  return choices
    .map((c) => {
      return extra === !!packages[c].extra ? Object.assign({}, packages[c], {name: c}) : null;
    })
    .filter((c) => c);
};

export const info = (module) => {
  return packages[module];
};
