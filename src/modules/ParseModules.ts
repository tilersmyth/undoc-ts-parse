import * as events from "events";

import { FileNodes } from "./nodes/FileNodes";
import { ModuleNodes } from "./nodes/ModuleNodes";
import { ModuleChildNodes } from "./nodes/ModuleChildNodes";
import { NestedNodes } from "./nodes/NestedNodes";

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
    try {
      const results = {
        files: [],
        modules: [],
        module_children: [],
        signatures: [],
        parameters: []
      };
      for (const files of this.modulesArr) {
        new FileNodes(files, results).run();
        for (const modules of files.children) {
          new ModuleNodes(modules, files.name, results).run();

          for (const module_children of modules.children) {
            new ModuleChildNodes(module_children, modules.name, results).run();
            new NestedNodes(module_children, results).run();
          }
        }
      }

      console.log(results);

      return [];
    } catch (err) {
      throw err;
    }
  }
}
