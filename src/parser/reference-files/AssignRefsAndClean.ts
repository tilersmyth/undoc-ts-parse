export class AssignRefsAndClean {
  private refs: any;

  constructor(refs: any) {
    this.refs = refs;
  }

  added = (entity: string, node: any): any => {
    return Object.keys(node).reduce((acc: any, prop: any) => {
      if (Array.isArray(node[prop])) {
        acc[prop] = node[prop].map(this.added.bind(null, prop));
        return acc;
      }

      if (typeof node[prop] === "object") {
        acc[prop] = this.added(prop, node[prop]);
        return acc;
      }

      if (prop !== "id") {
        acc[prop] = node[prop];
        return acc;
      }

      // If prop IS id and parent entity IS children then we return
      // because children.id is used as reference not to reference
      if (entity === "children") {
        return acc;
      }

      const reference = this.refs[node[prop]];

      if (reference) {
        acc["file"] = reference.file;
      }

      return acc;
    }, {});
  };

  modified = (file: any) => {
    if (!file) {
      return;
    }

    const updates = file.updates.map((update: any) => {
      const node = update.newNode;

      const newNode = Object.keys(node).reduce((acc: any, prop: any) => {
        if (prop !== "id") {
          return [{ key: prop, value: node[prop] }, ...acc];
        }

        const reference = this.refs[node[prop]];

        if (reference) {
          return [{ key: file, value: reference.file }, ...acc];
        }

        return acc;
      }, []);

      return { ...update, newNode };
    });

    return { ...file, updates };
  };
}
