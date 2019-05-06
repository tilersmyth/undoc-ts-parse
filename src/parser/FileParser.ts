import { EntityFields } from "./tools/keys/EntityFields";
import { AddedFileStream } from "./added-files/JsonStream";
import { ParseNewFiles } from "./added-files/ParseNewFiles";
import { ModifiedJsonStream } from "./modified-files/JsonStream";
import { UpdatedNodeDiff } from "./modified-files/UpdatedNodeDiff";
import { CompileUpdates } from "./modified-files/CompileUpdates";
import { ParseNodeRefs } from "./reference-files/ParseNodeRefs";
import { AssignRefsAndClean } from "./reference-files/AssignRefsAndClean";

interface ModifiedFile {
  path: string;
  oldOid: string;
}

interface ParserFiles {
  tracked: string[];
  added: string[];
  modified: ModifiedFile[];
}

interface ParserOutput {
  files: [];
  refIds: [];
}

export class FileParser {
  private files: ParserFiles;
  constructor(files: ParserFiles) {
    this.files = files;
  }

  added = async (): Promise<ParserOutput> => {
    const { added } = this.files;

    if (added.length === 0) {
      return { files: [], refIds: [] };
    }

    const taggedFiles = await new AddedFileStream(added).newFiles();

    const entityFields = new EntityFields(false);
    const parseFiles = new ParseNewFiles(entityFields);

    return taggedFiles.reduce(parseFiles.reduce, {
      files: [],
      refIds: [],
      parent: "files"
    });
  };

  modified = async (): Promise<ParserOutput> => {
    const { modified } = this.files;

    if (modified.length === 0) {
      return { files: [], refIds: [] };
    }

    const modifiedNodes: any = await new ModifiedJsonStream(modified).newFile();

    const fileDiffs: any = new UpdatedNodeDiff(modified);

    const fileUpdates: any = await Promise.all(
      modifiedNodes.map(fileDiffs.map)
    );

    const compileUpdates = new CompileUpdates();

    const files = fileUpdates.reduce(
      compileUpdates.reduce.bind(null, modifiedNodes),
      { updates: [], refIds: [] }
    );

    return { files: files.updates, refIds: files.refIds };
  };

  referenced = async (added: any, modified: any): Promise<{}> => {
    // Ensure refIds are unique - already removed dupes from added
    const modifiedRefIds = modified.refIds.filter(
      (refId: number) => !added.refIds.includes(refId)
    );

    const refIds = [...modifiedRefIds, ...added.refIds];

    if (refIds.length === 0) {
      return { added: added.files, modified: modified.files };
    }

    const parseNodeRefs = new ParseNodeRefs(this.files.tracked);

    const nodeRefs: any = await parseNodeRefs.find(refIds);

    const mergeAdded = [...nodeRefs.files, ...added.files];

    const assignRefs = new AssignRefsAndClean(nodeRefs.refs);

    const addedRef = mergeAdded.map(assignRefs.added.bind(null, "file"));

    const modifiedRef = modified.files.map(assignRefs.modified);

    return { added: addedRef, modified: modifiedRef };
  };
}
