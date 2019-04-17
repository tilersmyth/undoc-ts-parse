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
  modifiedFiles: any
): Promise<{}> => {
  try {
    ParserEvents.emitter = undocEventEmitter;

    ParserEvents.emitter(
      "parser_init",
      "Searching for modified nodes in TypeDoc JSON"
    );

    const added = await new HandleParseNew(addedFiles).run();
    const modified = await new HandleParseUpdate(modifiedFiles).run();

    return { added, modified };
  } catch (err) {
    throw err;
  }
};
