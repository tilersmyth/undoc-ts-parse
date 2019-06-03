import { AddedFileStream } from "./added-files/JsonStream";
import { ParseNewFiles } from "./added-files/ParseNewFiles";
import { ModifiedJsonStream } from "./modified-files/JsonStream";
import { UpdatedNodeDiff } from "./modified-files/UpdatedNodeDiff";
import { ParseNodeRefs } from "./reference-files/ParseNodeRefs";

interface ModifiedFile {
  path: string;
  oldPath: string;
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

    const parseFiles = new ParseNewFiles();
    return taggedFiles.reduce(parseFiles.files, {
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

    const modifiedJsonStream = new ModifiedJsonStream();

    const fileDiffs: any = new UpdatedNodeDiff(modifiedJsonStream, modified);

    // Find updated nodes to compare
    const newNodes = await modifiedJsonStream.newFile(modified);

    const diffs: any = await newNodes.reduce(
      fileDiffs.compare,
      Promise.resolve({ files: [], refIds: [] })
    );

    modifiedJsonStream.modNode("stop", 0);

    return diffs;
  };

  references = async (
    added: any,
    modified: any
  ): Promise<{ files: []; refs: {} }> => {
    // Ensure modified refIds are unique (dupes already removed from added files)
    const modifiedRefIds = modified.refIds.filter(
      (refId: number) => !added.refIds.includes(refId)
    );

    const refIds = [...modifiedRefIds, ...added.refIds];

    if (refIds.length === 0) {
      return { files: [], refs: {} };
    }

    const parseNodeRefs = new ParseNodeRefs(this.files.tracked);
    return await parseNodeRefs.find(refIds);
  };
}
