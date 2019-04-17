import * as fs from "fs";
import * as path from "path";
import mkdirp = require("mkdirp");

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

  /**
   * Reads everything from a given file and returns its content as a string
   */
  static async readFile(filePath: string): Promise<string> {
    const root = FileUtils.rootDirectory();
    return new Promise<string>(ok => {
      fs.readFile(`${root}/${filePath}`, (err, data) =>
        err ? ok() : ok(data.toString())
      );
    });
  }

  /**
   * HERE DOWN IS ONLY USED FOR TESTING OUTPUT (OUTPUT.JSON)
   */
  static createDirectories(directory: string) {
    return new Promise((ok, fail) =>
      mkdirp(directory, (err: any) => (err ? fail(err) : ok()))
    );
  }

  static async createFile(
    content: string,
    override: boolean = true
  ): Promise<void> {
    await FileUtils.createDirectories(path.dirname(".undoc/output.json"));
    return new Promise<void>((ok, fail) => {
      const root = FileUtils.rootDirectory();
      if (override === false && fs.existsSync(`${root}/.undoc/output.json`))
        return ok();

      fs.writeFile(`${root}/.undoc/output.json`, content, err =>
        err ? fail(err) : ok()
      );
    });
  }
}
