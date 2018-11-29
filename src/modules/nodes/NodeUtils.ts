export class NodeUtils {
  static filePath(path: string) {
    return path.substring(path.indexOf("src"));
  }

  static isPublic(flags: any): boolean {
    if (!flags.isExported) {
      return false;
    }
    return true;
  }

  static description(comment: any): string {
    return comment && comment.shortText;
  }
}
