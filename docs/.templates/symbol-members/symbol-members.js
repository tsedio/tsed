export default {
  name: "symbolMembers",
  trim: false,
  method(symbol) {
    const flattenMembers = symbol.getMembers();
    const construct = flattenMembers.filter((member) => member.overview.match("constructor"))[0];
    const hasConstructor = construct && (construct.description || !construct.overview.match("constructor()"));
    let hasConstructorOverview = hasConstructor && construct.overview.match("constructor()");
    const members = flattenMembers
      .filter((member) => !member.overview.includes("#private"))
      .filter((member) => !member.overview.match("constructor"));

    return {
      hasConstructor,
      hasConstructorOverview,
      members,
      construct
    };
  }
};
