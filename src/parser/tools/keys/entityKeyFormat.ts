export const keyValueFormat = {
  defaultKey: (value: any, key?: string) => {
    return key ? [{ key, value }] : [];
  },
  pathKey: (value: string) => {
    return [{ key: "path", value: value.substring(value.indexOf("src")) }];
  },
  kindKey: (value: string) => {
    return [{ key: "kind", value }];
  },
  commentKey: (value: any) => {
    const comment: any = [];
    const options = ["shortText", "text"];

    for (const prop in value) {
      if (options.indexOf(prop) > -1) {
        comment.push({ key: prop, value: value[prop] });
      }
    }

    return comment;
  }
};

export const valueFormat = {
  defaultKey: (value: any, key?: string) => {
    return key && { [key]: value };
  },
  pathKey: (value: string) => {
    return { path: value.substring(value.indexOf("src")) };
  },
  kindKey: (value: string) => {
    return { kind: value };
  },
  commentKey: (value: any) => {
    const comment: any = {};
    const options = ["shortText", "text"];

    for (const prop in value) {
      if (options.indexOf(prop) > -1) {
        comment[prop] = value[prop];
      }
    }

    return comment;
  }
};
