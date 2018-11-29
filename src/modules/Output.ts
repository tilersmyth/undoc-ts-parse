import chalk from "chalk";

export class Output {
  logger = (event: string, context: any) => {
    console.log(event, context);
  };
}
