import { Stream } from "../tools";
import { StreamEvents } from "../Events";

/**
 * Find nodes in generated TypeDoc file
 */
export class AddedFileStream extends StreamEvents {
  addedFiles: string[];

  constructor(addedFiles: string[]) {
    super();
    this.addedFiles = addedFiles;
  }

  private isNewFile(row: any): boolean {
    if (!row.originalName) {
      return true;
    }

    return this.addedFiles.some((filePath: any) =>
      row.originalName.includes(filePath)
    );
  }

  private filter = (row: any, _: any, cb: any) => {
    if (!this.isNewFile(row)) {
      cb(null, null);
      return;
    }

    const filter =
      row.children &&
      row.children.find((child: any) => {
        if (child.comment && child.comment.tags) {
          const hasTag = child.comment.tags.find((t: any) => t.tag === "undoc");
          if (hasTag) {
            child.tagged = true;
            return hasTag;
          }
        }
      });

    cb(null, filter && row);
    return;
  };

  async newFiles(): Promise<[]> {
    try {
      const files = await new Stream("children.*").many(
        "new",
        this.filter,
        this.addModule
      );

      this.addModule("stop");

      return files;
    } catch (err) {
      throw err;
    }
  }
}
