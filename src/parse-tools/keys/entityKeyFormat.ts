export const keyFieldHelper = (value: any, key?: string) => {
  return key ? [{ key, value }] : [];
};

export const pathHelper = (value: any) => {
  return [{ key: "path", value: value.substring(value.indexOf("src")) }];
};

export const kindHelper = (value: any) => {
  return [{ key: "kind", value }];
};

export const commentHelper = (value: any) => {
  const comment: any = [];
  const options = ["shortText", "text"];

  for (const prop in value) {
    if (options.indexOf(prop) > -1) {
      comment.push({ key: prop, value: value[prop] });
    }
  }

  return comment;
};
