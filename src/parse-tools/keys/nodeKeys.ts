import {
  keyFieldHelper,
  pathHelper,
  kindHelper,
  commentHelper
} from "./helpers";

export const nodeKeys = <any>{
  files: [
    {
      id: keyFieldHelper,
      name: keyFieldHelper,
      originalName: pathHelper,
      kindString: kindHelper
    }
  ],
  children: [
    {
      id: keyFieldHelper,
      tagged: keyFieldHelper,
      name: keyFieldHelper,
      comment: commentHelper
    }
  ],
  signatures: [
    {
      id: keyFieldHelper,
      name: keyFieldHelper,
      kindString: kindHelper,
      comment: commentHelper
    }
  ],
  getSignature: [
    {
      id: keyFieldHelper,
      name: keyFieldHelper,
      kindString: kindHelper
    }
  ],
  indexSignature: [
    {
      id: keyFieldHelper,
      name: keyFieldHelper,
      kindString: kindHelper
    }
  ],
  parameters: [
    {
      id: keyFieldHelper,
      name: keyFieldHelper
    }
  ],
  typeArguments: [
    {
      id: keyFieldHelper,
      name: keyFieldHelper,
      type: keyFieldHelper
    }
  ],
  typeParameter: [
    {
      id: keyFieldHelper,
      name: keyFieldHelper
    }
  ],
  type: [{ id: keyFieldHelper, type: keyFieldHelper, name: keyFieldHelper }],
  types: [{ id: keyFieldHelper, type: keyFieldHelper, name: keyFieldHelper }]
};
