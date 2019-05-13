import ParserEvents from "./Events";
import { FileParser } from "./parser/FileParser";
import { AssignRefsAndClean } from "./parser/reference-files/AssignRefsAndClean";

interface ModifiedFile {
  path: string;
  oldPath: string;
}

interface ParserFiles {
  tracked: string[];
  added: string[];
  modified: ModifiedFile[];
}

export const parse = async (
  undocEventEmitter: any,
  files: ParserFiles
): Promise<{}> => {
  try {
    ParserEvents.emitter = undocEventEmitter;

    ParserEvents.emitter("parser_init", "Parsing TypeDoc JSON");

    const parser = new FileParser(files);
    const added = await parser.added();
    const modified: any = await parser.modified();
    const references: any = await parser.references(added, modified);

    const allAdded = [...references.files, ...added.files];

    // Note: even if publish has no references we still run below to
    // remove node ids

    const assignRefs = new AssignRefsAndClean(references.refs);
    const addedWithRefs = allAdded.map(assignRefs.added.bind(null, "file"));
    const modifiedWithRefs = modified.files.map(assignRefs.modified);

    return { added: addedWithRefs, modified: modifiedWithRefs };
  } catch (err) {
    throw err;
  }
};
