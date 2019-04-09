import { LineReducer } from "./LineReducer";
import { PrettyFilePath } from "../utils/PrettyFilePath";

import ParserEvents from "../Events";

interface HandleParseUpdateReturn {
  updateResults: any;
  updateRefIds: number[];
}

export class ReduceUpdatedNodes {
  updates: any;
  nodes: any;
  updateNodeRefs: any = [];

  constructor(updates: any, nodes: any) {
    this.updates = updates;
    this.nodes = nodes;
  }

  private mapNodes = (update: any) => {
    const node = this.nodes.find((node: any) =>
      node.originalName.includes(update.file)
    );

    const reducer = new LineReducer();

    const added = update.lines.added.reduce(
      reducer.modified.bind(this, null, node),
      { nodes: [], refs: [] }
    );

    const modified = update.lines.modified.reduce(
      reducer.modified.bind(this, null, null, node),
      { nodes: [], refs: [] }
    );
    // .filter((line: any) => line.update);

    const filePath = new PrettyFilePath(update.file);

    const context = `${filePath.prettify()} [+${added.nodes.length}, \u2605${
      modified.nodes.length
    }]`;
    ParserEvents.emitter("parser_update_file_node_line_updates", context);

    return { file: update.file, modified: modified.nodes, added: added.nodes };
  };

  run(): HandleParseUpdateReturn {
    const updateResults = this.updates.map(this.mapNodes);

    return {
      updateResults,
      updateRefIds: this.updateNodeRefs
    };
  }
}
