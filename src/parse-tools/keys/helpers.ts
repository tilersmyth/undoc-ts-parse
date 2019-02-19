export const keyFieldHelper = (obj: any, value: any, prop?: string) => {
  return prop && (obj[prop] = value);
};

export const pathHelper = (obj: any, value: any) => {
  return (obj["path"] = value.substring(value.indexOf("src")));
};

export const kindHelper = (obj: any, value: any) => {
  return (obj["kind"] = value);
};

export const commentHelper = (obj: any, value: any) => {
  const comment: any = value && (obj["comment"] = {});
  const options = ["shortText", "text"];

  for (const prop in value) {
    if (options.indexOf(prop) > -1) {
      comment[prop] = value[prop];
    }
  }

  return comment;
};
