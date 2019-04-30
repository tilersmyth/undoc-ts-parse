import { ParseNewFiles } from "./ParseNewFiles";
import { JsonStream } from "./JsonStream";
import { ParseNodeRefs } from "./reference-nodes/ParseNodeRefs";
import { ReferenceResolver } from "./resolve-refs/ReferenceResolver";

export class HandleParseNew {
  newFiles: string[];

  constructor(newFiles: string[]) {
    this.newFiles = newFiles;
  }

  async run(): Promise<[]> {
    try {
      if (this.newFiles.length === 0) {
        return [];
      }

      const newFiles = await new JsonStream(this.newFiles).newFiles();

      const parseFiles = new ParseNewFiles();

      const { refIds, files } = newFiles.reduce(parseFiles.reduce, {
        files: [],
        refIds: [],
        parent: "files"
      });

      if (refIds.length > 0) {
        const refs = await new ParseNodeRefs().run(refIds);

        [...refs, ...files];

        // Resolve references (place reference path in owner)
        new ReferenceResolver(files).run();
      }

      return files;
    } catch (err) {
      throw err;
    }
  }
}
