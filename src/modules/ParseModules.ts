import * as events from "events";

import { FileNodes } from "./nodes/FileNodes";
import { ModuleNodes } from "./nodes/ModuleNodes";
import { ModuleChildNodes } from "./nodes/ModuleChildNodes";
import { NestedNodes } from "./nodes/NestedNodes";
import { FindRefs } from "./FindRefs";

import { FileUtils } from "../utils/FileUtils";
/**
 * Parse modules in generated TypeDoc file
 */
export class ParseModules extends events.EventEmitter {
  modulesArr: any;

  constructor(modules: any) {
    super();
    this.modulesArr = modules;
  }

  async run(): Promise<[]> {
    const results: any = {
      files: [],
      modules: [],
      refs: []
    };

    const refs: any = [];

    try {
      for (const files of this.modulesArr) {
        new FileNodes(files, results).run();
        for (const modules of files.children) {
          const moduleNode = new ModuleNodes(modules, files.name).run();
          await new NestedNodes(modules, moduleNode, refs).run();
          if (modules.children) {
            for (const moduleChildren of modules.children) {
              const moduleChildNode = new ModuleChildNodes(
                moduleChildren
              ).run();
              await new NestedNodes(
                moduleChildren,
                moduleChildNode,
                refs
              ).run();
              moduleNode.moduleChildren.push(moduleChildNode);
            }
          }
          results.modules.push(moduleNode);
        }
      }

      if (refs.length > 0) {
        const refArr = await new FindRefs(refs).run();

        console.log(refArr);
      }

      // TEST OUTPUT (OUTPUT.JSON) TO VIEW SCHEMA
      await FileUtils.createFile(JSON.stringify(results));

      return [];
    } catch (err) {
      throw err;
    }
  }
}
