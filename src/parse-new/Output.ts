import chalk from "chalk";
import * as readline from "readline";

export class Output {
  nodeCount: number = 1;
  nodeRefCount: number = 1;

  private static writeOutput(value: string) {
    readline.clearLine(process.stdout, 0);
    readline.cursorTo(process.stdout, 0);
    process.stdout.write(chalk.white(`${value}`));
  }

  logger = (event: string, context: any) => {
    switch (event) {
      case "nodes_begin":
        console.log(chalk.white("Looking for modules..."));
        break;
      case "nodes_found":
        Output.writeOutput(`Found ${this.nodeCount++} modules`);
        break;
      case "nodes_end":
        console.log(chalk.white(""));
        break;
      case "node_refs_begin":
        console.log(chalk.white("Resolving module reference set"));
        break;
      case "node_refs_found":
        Output.writeOutput(`Found ${this.nodeRefCount++} module references`);
        break;
      case "node_refs_end":
        console.log(chalk.white(""));
        break;
    }
  };
}
