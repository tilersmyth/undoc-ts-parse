import { FindUpdatedNodes } from "./FindUpdatedNodes";
import { ReduceUpdatedNodes } from "./ReduceUpdatedNodes";

interface HandleParseUpdateReturn {
  updateResults: any;
  updateRefIds: number[];
  updateFilePaths: string[];
}

export class HandleParseUpdate {
  updates: any;

  constructor(updates: any) {
    this.updates = updates;
  }

  async run(): Promise<HandleParseUpdateReturn> {
    try {
      const updatedNodes = await new FindUpdatedNodes(this.updates).run();
      return new ReduceUpdatedNodes(this.updates, updatedNodes).run();
    } catch (err) {
      throw err;
    }
  }
}
