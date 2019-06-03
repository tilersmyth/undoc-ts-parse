import { keyValueFormat, valueFormat } from "./entityKeyFormat";

export class EntityFields {
  constructor(private purpose: "args" | "new" | "update") {
    this.purpose = purpose;
  }

  format = (key: string) => {
    // Field formatter type
    const formatter = this.purpose === "args" ? keyValueFormat : valueFormat;

    // Conditional fields
    const idKey = this.purpose === "args" ? "" : "id";
    const positionKey = this.purpose === "new" ? "position" : "";

    switch (key) {
      case "files":
        return {
          name: formatter.defaultKey,
          originalName: formatter.pathKey,
          kindString: formatter.kindKey
        };
      case "children":
        return {
          [idKey]: formatter.defaultKey,
          [positionKey]: formatter.defaultKey,
          tagged: formatter.defaultKey,
          name: formatter.defaultKey,
          kindString: formatter.kindKey
        };

      case "signatures":
      case "getSignature":
      case "indexSignature":
      case "parameters":
        return {
          [positionKey]: formatter.defaultKey,
          name: formatter.defaultKey,
          kindString: formatter.kindKey
        };

      case "comment":
        return {
          shortText: formatter.defaultKey,
          text: formatter.defaultKey
        };

      case "typeParameter":
        return {
          [idKey]: formatter.defaultKey,
          [positionKey]: formatter.defaultKey,
          name: formatter.defaultKey,
          kindString: formatter.kindKey
        };

      case "type":
      case "types":
      case "typeArguments":
        return {
          [idKey]: formatter.defaultKey,
          [positionKey]: formatter.defaultKey,
          type: formatter.defaultKey,
          name: formatter.defaultKey
        };

      default:
        return null;
    }
  };
}
