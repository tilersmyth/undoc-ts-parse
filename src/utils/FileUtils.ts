import * as fs from "fs";

/**
 * Command line utils functions.
 */
export class FileUtils {
  /**
   * Returns root directory of project
   */
  static rootDirectory() {
    return process.cwd();
  }

  /**
   * Read stream for large json files
   */
  static readStream(filePath: string): any {
    const root = FileUtils.rootDirectory();
    return fs.createReadStream(`${root}/${filePath}`, {
      encoding: "utf8"
    });
  }
}
