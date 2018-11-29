import { FindModules } from "./modules/FindModules";
import { ParseModules } from "./modules/ParseModules";

export const parse = async (): Promise<[]> => {
  try {
    const modules = await new FindModules().run();
    return new ParseModules(modules).run();
  } catch (err) {
    throw err;
  }
};
