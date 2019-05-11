import { EntityFields } from "./tools/keys/EntityFields";
import { AddedFileStream } from "./added-files/JsonStream";
import { ParseNewFiles } from "./added-files/ParseNewFiles";
import { ModifiedJsonStream } from "./modified-files/JsonStream";
import { UpdatedNodeDiff } from "./modified-files/UpdatedNodeDiff";
import { CompileUpdates } from "./modified-files/CompileUpdates";
import { ParseNodeRefs } from "./reference-files/ParseNodeRefs";
import { AssignRefsAndClean } from "./reference-files/AssignRefsAndClean";

import { FileUtils } from "./tools/FileUtils";

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

    const entityFields = new EntityFields(false, true);
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

    // Find updated nodes in current form
    const modifiedJsonStream = new ModifiedJsonStream();

    const fileDiffs: any = new UpdatedNodeDiff(modifiedJsonStream, modified);
    const currentNodes = await fileDiffs.current();

    const fileUpdates: any = await Promise.all(
      currentNodes.map(fileDiffs.compare)
    );

    const compileUpdates = new CompileUpdates();

    const files = fileUpdates.reduce(
      compileUpdates.reduce.bind(null, currentNodes),
      { updates: [], refIds: [] }
    );

    modifiedJsonStream.modNode("stop", 0);

    return { files: files.updates, refIds: files.refIds };
  };

  references = async (
    added: any,
    modified: any
  ): Promise<{ files: []; refs: {} } | null> => {
    // Ensure modified refIds are unique (dupes already removed from added files)
    const modifiedRefIds = modified.refIds.filter(
      (refId: number) => !added.refIds.includes(refId)
    );

    const refIds = [...modifiedRefIds, ...added.refIds];

    if (refIds.length === 0) {
      return null;
    }

    const parseNodeRefs = new ParseNodeRefs(this.files.tracked);
    return await parseNodeRefs.find(refIds);
  };
}
