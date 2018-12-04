import { NodeUtils } from "./NodeUtils";
import { NestedNodes } from "./NestedNodes";
import { TypeNodes } from "./TypeNodes";

export class SignatureNodes {
  node: any;
  refs: any;

  constructor(node: any, refs: any) {
    this.node = node;
    this.refs = refs;
  }

  async handleSignature(signature: any) {
    const obj: any = {
      parent: this.node.name,
      name: signature.name,
      kind: signature.kindString,
      description: NodeUtils.description(signature.comment)
    };

    await new TypeNodes(this.refs).run(obj, signature);
    await new NestedNodes(signature, obj, this.refs).run();

    return obj;
  }

  run() {
    const signatures = this.node["signatures"] || this.node["getSignature"];
    return new Promise(async (resolve, reject) => {
      try {
        if (signatures instanceof Array) {
          const resultsArr: any = [];
          for (const sig of signatures) {
            resultsArr.push(await this.handleSignature(sig));
          }
          resolve(resultsArr);
          return;
        }

        const results = [await this.handleSignature(signatures)];
        resolve(results);
      } catch (err) {
        reject(err);
      }
    });
  }
}
