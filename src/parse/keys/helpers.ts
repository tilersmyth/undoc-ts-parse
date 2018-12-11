export const keyField = (obj: any, value: any, prop?: string) => {
  return prop && (obj[prop] = value);
};

export const filePath = (obj: any, value: any) => {
  return (obj["path"] = value.substring(value.indexOf("src")));
};

export const kind = (obj: any, value: any) => {
  return (obj["kind"] = value);
};

export const comment = (obj: any, value: any) => {
  const comment: any = value && (obj["comment"] = {});
  const options = ["shortText", "text"];

  for (const prop in value) {
    if (options.indexOf(prop) > -1) {
      comment[prop] = value[prop];
    }
  }

  return comment;
};
