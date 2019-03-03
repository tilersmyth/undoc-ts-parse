import * as events from "events";

/**
 * Output for TypeDoc generateJson
 */
class ParserEvents extends events.EventEmitter {
  _emitter: any = null;

  constructor() {
    super();
  }

  get emitter() {
    return this._emitter;
  }

  set emitter(value) {
    this._emitter = value;
  }
}

export default new ParserEvents();
