import * as events from "events";

export class ParseEvents extends events.EventEmitter {
  constructor() {
    super();
  }

  parserEmit(event: string, data?: any) {
    this.emit("e", `parser_${event}`, data);
  }
}
