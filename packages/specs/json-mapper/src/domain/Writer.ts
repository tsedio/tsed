export class Writer {
  static object = {
    assign(...args: string[]) {
      return `{ ${args.filter(Boolean).join(", ")} }`;
    }
  };

  protected _root?: Writer;
  protected body: (string | Writer)[] = [];
  private _indent: boolean;

  constructor(root?: Writer) {
    this._root = root;
  }

  static indent(lines: string[]) {
    return lines.map((p) => `\t${p}`);
  }

  static mapper(mapperId: string, key: string, options: string) {
    return `execMapper('${mapperId}', ${key}, ${options})`;
  }

  static mapperFrom(key: string, options: string) {
    return `execMapper(nameOf(classOf(${key})), ${key}, ${options})`;
  }

  static options(...args: string[]) {
    args = args.filter(Boolean);
    return !args.length ? "options" : Writer.object.assign("...options", ...args);
  }

  add(...lines: (undefined | string | Writer)[]) {
    lines = lines.filter((line) => line !== undefined);

    lines.length && this.body.push(...(lines as string | Writer[]));

    return this;
  }

  arrow(...args: string[]) {
    this.add(`(${args}) => {`);

    const writer = this.new();

    this.add("}");

    return writer;
  }

  build(): string[] {
    const result = this.body.flatMap((line) => {
      return line instanceof Writer ? line.build() : line;
    });

    return this._indent ? result.map((item) => "\t" + item) : result;
  }

  callMapper(id: string, key: string, ...options: string[]) {
    return this.set(key, Writer.mapper(id, key, Writer.options(...options)));
  }

  returnCallMapper(id: string, key: string, ...options: string[]) {
    return this.return(Writer.mapper(id, key, Writer.options(...options)));
  }

  const(name: string, line: string) {
    this.add(`const ${name} = ${line};`);
    return this;
  }

  each(iterable: string, args: string[] = []) {
    const writer = this.add(iterable + ".forEach((" + args.join(", ") + ") => {").new();

    this.add("});");

    return writer;
  }

  if(condition: string) {
    const writer = new IfWriter(condition, this);

    this.add(writer);

    return writer;
  }

  switch(input: string) {
    const sw = new SwitchWriter(input);

    this.add(sw);

    return sw;
  }

  indent(indent: boolean) {
    this._indent = indent;
    return this;
  }

  new(indent = true) {
    const writer = new Writer(this.root());
    writer.indent(indent);
    this.add(writer);

    return writer;
  }

  return(line: string) {
    this.add(`return ${line};`);
    return this.root();
  }

  root() {
    return this._root || this;
  }

  set(left: string, right: string) {
    this.add(`${left} = ${right};`);
    return this;
  }

  toString() {
    return this.build().join("\n");
  }
}

class IfWriter extends Writer {
  protected elseWriter?: Writer;

  constructor(
    protected condition: string,
    root: Writer
  ) {
    super();
    this._root = root;
  }

  else() {
    const writer = new Writer(this._root);

    this.elseWriter = writer;

    return writer;
  }

  build() {
    return [
      `if (${this.condition}) {`,
      ...Writer.indent(super.build()),
      "}",
      this.elseWriter ? [`else {`, ...Writer.indent(this.elseWriter.build()), "}"] : []
    ].flat();
  }
}

class SwitchWriter extends Writer {
  #map = new Map<string, Writer>();

  constructor(private input: string) {
    super();
  }

  case(condition: string) {
    const writer = new Writer();
    this.#map.set(condition, writer);
    return writer;
  }

  build() {
    return [
      `switch (${this.input}) {`,
      ...Writer.indent(
        Array.from(this.#map.entries()).flatMap(([condition, writer]) => {
          return [condition === "default" ? `${condition}:` : `case ${condition}:`, ...Writer.indent(writer.build())];
        })
      ),
      "}"
    ].flat();
  }
}
