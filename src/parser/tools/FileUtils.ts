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

  /**
   * Creates a file with the given content in the given path
   */
  static async createFile(
    filePath: string,
    content: string,
    override: boolean = true
  ): Promise<string> {
    await FileUtils.createDirectories(path.dirname(filePath));
    return new Promise<string>((ok, fail) => {
      if (override === false && fs.existsSync(filePath)) return ok(filePath);

      fs.writeFile(filePath, content, err => (err ? fail(err) : ok(filePath)));
    });
  }
}
