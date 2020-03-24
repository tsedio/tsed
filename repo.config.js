module.exports = {
  npmScope: "@tsed",
  npmAccess: "public",
  versionPlaceholder: "0.0.0-PLACEHOLDER",
  packagesDir: "./packages",
  projectsDir: "./examples",
  outputDir: "./dist",

  pkgTemplate: (pkgName, {repository, bugs, author, license, gitHead, contributors}) => (json) => {
    Object.assign(json, {
      main: "lib/index.js",
      typings: "lib/index.d.ts",
      repository,
      bugs,
      homepage: `https://github.com/TypedProject/tsed/packages/${pkgName}`,
      author,
      contributors,
      license,
      gitHead
    });

    return json;
  },
  doc: {
    publish: true,
    url: "https://github.com/TypedProject/tsed.git",
    branch: "gh-pages",
    cname: "tsed.io"
  },
  examples: {
    "getting-started": {
      url: "https://github.com/TypedProject/tsed-getting-started.git"
    },
    "aws": {
      url: "https://github.com/TypedProject/tsed-example-aws.git"
    },
    "mongoose": {
      url: "https://github.com/TypedProject/tsed-example-mongoose.git"
    },
    "multer": {
      url: "https://github.com/TypedProject/tsed-example-multer.git"
    },
    "passportjs": {
      url: "https://github.com/TypedProject/tsed-example-passportjs.git"
    },
    "typeorm": {
      url: "https://github.com/TypedProject/tsed-example-typeorm.git"
    },
    "session": {
      "url": "https://github.com/TypedProject/tsed-example-session.git"
    },
    "socketio": {
      url: "https://github.com/TypedProject/tsed-example-socketio.git"
    },
    "passport-azure-ad": {
      url: "https://github.com/TypedProject/tsed-example-passport-azure-ad.git"
    },
    "vuejs": {
      url: "https://github.com/TypedProject/tsed-example-vuejs.git"
    },
    "react": {
      url: "https://github.com/TypedProject/tsed-example-react.git"
    }
  },
  tsdoc: require('./tsdoc.config.js')
};
