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
  modifiedFileLineDetail: any
): Promise<{}> => {
  try {
    ParserEvents.emitter = undocEventEmitter;

    ParserEvents.emitter(
      "parser_init",
      "Searching for modified nodes in TypeDoc JSON"
    );

    return new HandleParseUpdate(addedFiles, modifiedFileLineDetail).run();
  } catch (err) {
    throw err;
  }
};
