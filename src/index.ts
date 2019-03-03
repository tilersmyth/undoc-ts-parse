import { HandleParseNew } from "./parse-new/HandleParseNew";
import { HandleParseUpdate } from "./parse-update/HandleParseUpdate";

import ParserEvents from "./Events";

export const parseNew = async (undocEventEmitter: any): Promise<[]> => {
  try {
    ParserEvents.emitter = undocEventEmitter;

    ParserEvents.emitter(
      "parser_init",
      "Looking for tagged modules in TypeDoc JSON"
    );

    return await new HandleParseNew([], []).run();
  } catch (err) {
    throw err;
  }
};

export const parseUpdate = async (
  undocEventEmitter: any,
  updates: any
): Promise<{}> => {
  try {
    ParserEvents.emitter = undocEventEmitter;

    ParserEvents.emitter("parser_init", "Collecting updates from TypeDoc JSON");

    const {
      updateResults,
      updateFilePaths,
      updateRefIds
    } = await new HandleParseUpdate(updates).run();

    const newResults = await new HandleParseNew(
      updateFilePaths,
      updateRefIds
    ).run();

    return { updated: updateResults, added: newResults };
  } catch (err) {
    throw err;
  }
};
