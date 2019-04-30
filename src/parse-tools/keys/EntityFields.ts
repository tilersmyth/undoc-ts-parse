import { keyValueFormat, valueFormat } from "./entityKeyFormat";

interface FormatType {
  [key: string]: any;
}

export class EntityFields {
  private keyValueOutput: boolean;

  constructor(keyValueOutput: boolean) {
    this.keyValueOutput = keyValueOutput;
  }

  format = (): FormatType => {
    const formatter = this.keyValueOutput ? keyValueFormat : valueFormat;

    return {
      files: {
        name: formatter.defaultKey,
        originalName: formatter.pathKey,
        kindString: formatter.kindKey
      },
      children: {
        tagged: formatter.defaultKey,
        name: formatter.defaultKey,
        // comment: formatter.commentKey,
        kindString: formatter.kindKey
      },
      signatures: {
        name: formatter.defaultKey,
        kindString: formatter.kindKey
        // comment: formatter.commentKey
      },
      comment: {
        shortText: formatter.defaultKey,
        text: formatter.defaultKey
      },
      getSignature: {
        name: formatter.defaultKey,
        kindString: formatter.kindKey
      },
      indexSignature: {
        name: formatter.defaultKey,
        kindString: formatter.kindKey
      },
      parameters: {
        name: formatter.defaultKey,
        kindString: formatter.kindKey
      },
      typeArguments: {
        name: formatter.defaultKey,
        type: formatter.defaultKey
      },
      typeParameter: {
        name: formatter.defaultKey,
        kindString: formatter.kindKey
      },
      type: { type: formatter.defaultKey, name: formatter.defaultKey },
      types: { type: formatter.defaultKey, name: formatter.defaultKey }
    };
  };
}
