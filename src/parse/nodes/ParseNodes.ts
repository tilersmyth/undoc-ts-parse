import { FindModules } from "./FindNodes";
import { ParseReduce } from "../utils/ParseReducer";

/**
 * Parse modules in generated TypeDoc file
 */
export class ParseNodes {
  async run(): Promise<any> {
    try {
      const nodes = await new FindModules().run();
      return await new ParseReduce("files", nodes).run();
    } catch (err) {
      throw err;
    }
  }
}
