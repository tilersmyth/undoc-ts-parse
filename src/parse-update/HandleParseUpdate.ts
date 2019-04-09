import { FindUpdatedNodes } from "./FindUpdatedNodes";
import { ReduceUpdatedNodes } from "./ReduceUpdatedNodes";
import { ParseNodeRefs } from "../parse-new/reference-nodes/ParseNodeRefs";
import { HandleParseNew } from "../parse-new/HandleParseNew";

interface HandleParseUpdateReturn {
  updated?: any;
  added?: any;
}

export class HandleParseUpdate {
  addedFiles: string[];
  modifiedFileLineDetail: any;

  constructor(addedFiles: string[], modifiedFileLineDetail: any) {
    this.addedFiles = addedFiles;
    this.modifiedFileLineDetail = modifiedFileLineDetail;
  }

  async run(): Promise<HandleParseUpdateReturn[]> {
    try {
      const results: any = [];

      const updatedNodes = await new FindUpdatedNodes(
        this.modifiedFileLineDetail
      ).run();

      const { updateResults, updateRefIds } = new ReduceUpdatedNodes(
        this.modifiedFileLineDetail,
        updatedNodes
      ).run();

      results.push({ updated: updateResults });

      if (updateRefIds.length > 0) {
        const refs = await new ParseNodeRefs().run(updateRefIds);

        // to do: similar to ParseNew, will need to append ref path to
        // node if found
      }

      const addedResults: any = [];
      if (this.addedFiles.length > 0) {
        const results = await new HandleParseNew(this.addedFiles).run();
        addedResults.push(...results);
      }

      if (addedResults.length > 0) {
        results.push({ added: addedResults });
      }

      return results;
    } catch (err) {
      throw err;
    }
  }
}
