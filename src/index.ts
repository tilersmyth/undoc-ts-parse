import { HandleParseNew } from "./parse-new/HandleParseNew";
import { HandleParseUpdate } from "./parse-update/HandleParseUpdate";

export const parseNew = async (): Promise<[]> => {
  try {
    return await new HandleParseNew([], []).run();
  } catch (err) {
    throw err;
  }
};

export const parseUpdate = async (updates: any): Promise<{}> => {
  try {
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
