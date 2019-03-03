import { HandleParseNew } from "./parse-new/HandleParseNew";
import { HandleParseUpdate } from "./parse-update/HandleParseUpdate";

import ParserEvents from "./Events";

export const parseNew = async (
  undocEventEmitter: any,
  newFiles: string[]
): Promise<[]> => {
  try {
    ParserEvents.emitter = undocEventEmitter;

    ParserEvents.emitter(
      "parser_init",
      "Looking for tagged modules in TypeDoc JSON"
    );

    return await new HandleParseNew(newFiles).run();
  } catch (err) {
    throw err;
  }
};

export const parseUpdate = async (
  undocEventEmitter: any,
  addedFiles: string[],
  modifiedFileUpdateDetail: any
): Promise<{}> => {
  try {
    ParserEvents.emitter = undocEventEmitter;

    ParserEvents.emitter("parser_init", "Collecting updates from TypeDoc JSON");

    const { updateResults, addedResults } = await new HandleParseUpdate(
      addedFiles,
      modifiedFileUpdateDetail
    ).run();

    return { updated: updateResults, added: addedResults };
  } catch (err) {
    throw err;
  }
};
