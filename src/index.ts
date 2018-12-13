import { HandleParse } from "./parse/HandleParse";

export const parse = async (): Promise<[]> => {
  try {
    return new HandleParse().run();
  } catch (err) {
    throw err;
  }
};
