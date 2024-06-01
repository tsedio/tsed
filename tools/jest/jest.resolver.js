module.exports = (path, options) => {
  // Apelle defaultResolver, ainsi nous utilisons son cache, sa gestion d'erreur, etc.
  if (path.match(/\.\/.*.js$/)) {
    path = path.replace(".js", "");
  }

  return options.defaultResolver(path, options);
};
