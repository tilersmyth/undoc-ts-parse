import { HandleParse } from "./parse/HandleParse";

export const parse = async (): Promise<{ nodes: any; refs: any }> => {
  try {
    return new HandleParse().run();
  } catch (err) {
    throw err;
  }
};
