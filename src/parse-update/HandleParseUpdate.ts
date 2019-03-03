import { FindUpdatedNodes } from "./FindUpdatedNodes";
import { ReduceUpdatedNodes } from "./ReduceUpdatedNodes";
import { ParseNodeRefs } from "../parse-new/reference-nodes/ParseNodeRefs";
import { HandleParseNew } from "../parse-new/HandleParseNew";

interface HandleParseUpdateReturn {
  updateResults: any;
  addedResults: any;
}

export class HandleParseUpdate {
  addedFiles: string[];
  modifiedFileUpdateDetail: any;

  constructor(addedFiles: string[], modifiedFileUpdateDetail: any) {
    this.addedFiles = addedFiles;
    this.modifiedFileUpdateDetail = modifiedFileUpdateDetail;
  }

  async run(): Promise<HandleParseUpdateReturn> {
    try {
      const updatedNodes = await new FindUpdatedNodes(
        this.modifiedFileUpdateDetail
      ).run();

      const { updateResults, updateRefIds } = new ReduceUpdatedNodes(
        this.modifiedFileUpdateDetail,
        updatedNodes
      ).run();

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

      return { updateResults, addedResults };
    } catch (err) {
      throw err;
    }
  }
}
