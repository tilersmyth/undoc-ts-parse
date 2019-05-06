import { keyValueFormat, valueFormat } from "./entityKeyFormat";

interface FormatType {
  [key: string]: any;
}

export class EntityFields {
  private keyValueOutput: boolean;
  private includeIds: boolean;

  constructor(keyValueOutput: boolean, includeIds: boolean = false) {
    this.keyValueOutput = keyValueOutput;
    this.includeIds = includeIds;
  }

  format = (): FormatType => {
    const formatter = this.keyValueOutput ? keyValueFormat : valueFormat;
    const idKey = this.includeIds ? "id" : "";

    return {
      files: {
        name: formatter.defaultKey,
        originalName: formatter.pathKey,
        kindString: formatter.kindKey
      },
      children: {
        [idKey]: formatter.defaultKey,
        tagged: formatter.defaultKey,
        name: formatter.defaultKey,
        kindString: formatter.kindKey
      },
      signatures: {
        name: formatter.defaultKey,
        kindString: formatter.kindKey
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
        [idKey]: formatter.defaultKey,
        name: formatter.defaultKey,
        type: formatter.defaultKey
      },
      typeParameter: {
        [idKey]: formatter.defaultKey,
        name: formatter.defaultKey,
        kindString: formatter.kindKey
      },
      type: {
        [idKey]: formatter.defaultKey,
        type: formatter.defaultKey,
        name: formatter.defaultKey
      },
      types: {
        [idKey]: formatter.defaultKey,
        type: formatter.defaultKey,
        name: formatter.defaultKey
      }
    };
  };
}
