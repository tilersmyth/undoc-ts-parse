import { keyField, filePath, kind, comment } from "./helpers";

export default <any>{
  files: [
    {
      id: keyField,
      name: keyField,
      originalName: filePath,
      kindString: kind
    }
  ],
  children: [
    {
      id: keyField,
      tagged: keyField,
      name: keyField,
      comment: comment
    }
  ],
  signatures: [
    {
      id: keyField,
      name: keyField,
      kindString: kind,
      comment: comment
    }
  ],
  getSignature: [
    {
      id: keyField,
      name: keyField,
      kindString: kind
    }
  ],
  indexSignature: [
    {
      id: keyField,
      name: keyField,
      kindString: kind
    }
  ],
  parameters: [
    {
      id: keyField,
      name: keyField
    }
  ],
  typeArguments: [
    {
      id: keyField,
      name: keyField,
      type: keyField
    }
  ],
  typeParameter: [
    {
      id: keyField,
      name: keyField
    }
  ],
  type: [{ id: keyField, type: keyField, name: keyField }],
  types: [{ id: keyField, type: keyField, name: keyField }]
};
