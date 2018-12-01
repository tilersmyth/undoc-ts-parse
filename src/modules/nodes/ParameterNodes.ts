import { NestedNodes } from "./NestedNodes";
import { TypeNodes } from "./TypeNodes";

export class ParameterNodes {
  node: any;
  results: any;

  constructor(node: any, results: any) {
    this.node = node;
    this.results = results;
  }

  private async handleParams(param: any) {
    const obj: any = {
      name: param.name
    };

    await new TypeNodes(this.results).run(obj, param);
    await new NestedNodes(param, obj, this.results).run();
    return obj;
  }

  run(): Promise<{}> {
    const parameters = this.node["parameters"];
    return new Promise(async (resolve, reject) => {
      try {
        const resultsArr: any = [];
        for (const param of parameters) {
          resultsArr.push(await this.handleParams(param));
        }

        resolve(resultsArr);
      } catch (err) {
        reject(err);
      }
    });
  }
}
