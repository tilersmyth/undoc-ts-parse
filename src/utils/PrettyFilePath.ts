export class PrettyFilePath {
  path: string;

  constructor(path: string) {
    this.path = path;
  }

  prettify() {
    const directories = this.path.split("/");

    return directories
      .map((directory: string, i: number) =>
        directories.length === i + 1 ? directory : directory.charAt(0)
      )
      .join("/");
  }
}
