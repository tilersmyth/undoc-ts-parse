import ParserEvents from "../Events";

export class StreamEvents {
  private addModFound: number = 0;
  private addRefFound: number = 0;
  private modNodeFound: number = 0;

  private pluralizer = (count: number, text: string) => {
    return `${count} ${text}${count === 1 ? "" : "s"}`;
  };

  private streamEnd = () => {
    ParserEvents.emitter("parser_end");
  };

  addModule = (type: string): void => {
    if (type === "data") {
      this.addModFound++;
      const text = `${this.pluralizer(this.addModFound, "new module")} found`;
      ParserEvents.emitter("parser_moduleBegin", text);
      return;
    }

    if (type === "stop") {
      if (this.addModFound === 0) {
        ParserEvents.emitter("parser_moduleBegin", "0 modules found");
      }
      this.streamEnd();
    }
  };

  addRef = (type: string): void => {
    if (type === "data") {
      this.addRefFound++;
      const text = `${this.pluralizer(this.addRefFound, "reference")} found`;
      ParserEvents.emitter("parser_refBegin", text);
      return;
    }

    if (type === "stop") {
      if (this.addRefFound === 0) {
        ParserEvents.emitter("parser_refBegin", "0 references found");
      }
      this.streamEnd();
    }
  };

  modNode = (type: string, count: number): void => {
    if (type === "data") {
      this.modNodeFound = this.modNodeFound + count;
      const text = `${this.pluralizer(this.modNodeFound, "node update")} found`;
      ParserEvents.emitter("parser_nodeBegin", text);
      return;
    }

    if (type === "stop") {
      if (this.modNodeFound === 0) {
        ParserEvents.emitter("parser_nodeBegin", "0 node updates found");
      }
      this.streamEnd();
    }
  };
}
