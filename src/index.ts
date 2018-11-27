import { ParseModules } from "./parser/ParseModules";

export const parse = async (): Promise<[]> => {
  return new ParseModules().run();
};
