import ParserEvents from "./Events";
import { FileParser } from "./parser/FileParser";

interface ModifiedFile {
  path: string;
  oldOid: string;
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

    const parser = new FileParser(files);

    const added = await parser.added();

    const modified: any = await parser.modified();

    const results: any = await parser.referenced(added, modified);

    return results;
  } catch (err) {
    throw err;
  }
};
