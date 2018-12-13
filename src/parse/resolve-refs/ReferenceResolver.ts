import { resolve } from "url";

export class ReferenceResolver {
  results: { nodes: any; refs: any } = {
    nodes: [],
    refs: []
  };

  constructor(results: { nodes: any; refs: any }) {
    this.results = results;
  }

  private matchRefs(refId: number): Promise<string | null> {
    return new Promise(resolve => {
      for (const ref of this.results.refs) {
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
          if (prop == "type") {
            if (nodes[prop] === "reference" && nodes.id) {
              const refPath = await this.matchRefs(nodes.id);
              if (refPath) {
                nodes.refPath = refPath;
              }
            }
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
    await this.findTypes(this.results.nodes);

    // Append ref paths for refs
    await this.findTypes(this.results.refs);
  }
}
