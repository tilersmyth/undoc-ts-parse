export class ReferenceResolver {
  results: any = [];

  constructor(results: any) {
    this.results = results;
  }

  private matchRefs(refId: number): Promise<string | null> {
    return new Promise(resolve => {
      for (const ref of this.results) {
        const filter =
          ref && ref.children.filter((child: any) => child.id === refId);

        if (filter.length > 0) {
          resolve(`${ref.path}#${filter[0].name}`);
          return;
        }
      }

      resolve();
    });
  }

  private findTypes(nodes: any): Promise<void> {
    return new Promise(async resolve => {
      if (nodes instanceof Array) {
        for (const node of nodes) {
          this.findTypes(node);
        }
      } else {
        for (const prop in nodes) {
          if (prop === "type") {
            if (nodes[prop] === "reference" && nodes.id) {
              const refPath = await this.matchRefs(nodes.id);
              if (refPath) {
                nodes.refPath = refPath;
              }
            }
          }

          // Remove unnecessary keys
          if (prop === "id") {
            delete nodes[prop];
          }
          if (nodes[prop] instanceof Object || nodes[prop] instanceof Array) {
            this.findTypes(nodes[prop]);
          }
        }
      }
      resolve();
    });
  }

  async run() {
    // Append ref path for nodes
    await this.findTypes(this.results);
  }
}
