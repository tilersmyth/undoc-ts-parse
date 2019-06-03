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

    const query = file.query.map((query: any) => {
      if (query.update && query.update.type !== "deleted") {
        const { node } = query.update;

        query.update.node = Object.keys(node).reduce((acc: any, prop: any) => {
          return { [prop]: this.added(prop, node[prop]), ...acc };
        }, {});
      }

      return query;
    });

    return {
      ...file,
      query
    };
  };
}
