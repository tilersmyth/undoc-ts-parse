import chalk from "chalk";
import { JSONStream } from "../stream/JSONStream";

/**
 * Parse modules in generated TypeDoc file
 */
export class ParseModules {
  private handler(data: any, cb: any) {
    // handle data
    cb(data);
  }

  async run() {
    console.log(chalk.white("Extracting modules"));
    return await new JSONStream("children.*.children").parser(this.handler);
  }
}
