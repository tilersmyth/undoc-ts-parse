import {
  keyFieldHelper,
  pathHelper,
  kindHelper,
  commentHelper
} from "./entityKeyFormat";

export const entityKeys = <any>{
  files: [
    {
      name: keyFieldHelper,
      originalName: pathHelper,
      kindString: kindHelper
    }
  ],
  children: [
    {
      tagged: keyFieldHelper,
      name: keyFieldHelper,
      comment: commentHelper,
      kindString: kindHelper
    }
  ],
  signatures: [
    {
      name: keyFieldHelper,
      kindString: kindHelper,
      comment: commentHelper
    }
  ],
  comment: [
    {
      shortText: keyFieldHelper,
      text: keyFieldHelper
    }
  ],
  getSignature: [
    {
      name: keyFieldHelper,
      kindString: kindHelper
    }
  ],
  indexSignature: [
    {
      name: keyFieldHelper,
      kindString: kindHelper
    }
  ],
  parameters: [
    {
      name: keyFieldHelper,
      kindString: kindHelper
    }
  ],
  typeArguments: [
    {
      name: keyFieldHelper,
      type: keyFieldHelper
    }
  ],
  typeParameter: [
    {
      name: keyFieldHelper,
      kindString: kindHelper
    }
  ],
  type: [{ type: keyFieldHelper, name: keyFieldHelper }],
  types: [{ type: keyFieldHelper, name: keyFieldHelper }]
};
