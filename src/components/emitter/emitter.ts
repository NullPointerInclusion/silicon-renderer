import type { CallbackFunction, Enforce } from "broadutils/types";
import { tryCatch } from "../utils.ts";

const reportListenerError = (
  error: unknown,
  context: [
    emitter: EventEmitter<any>,
    event: string,
    args: any[],
    listener: CallbackFunction<any>,
  ],
) => {
  const [emitter, event, args, listener] = context;
  console.error("Error in event listener:", { emitter, event, args, listener, error });
};

class EventEmitter<EventMap> {
  #listeners: Map<keyof EventMap, Set<CallbackFunction<any>>> = new Map();

  public addListener<K extends keyof EventMap>(
    event: K,
    listener: CallbackFunction<Enforce<EventMap[K], any[]>>,
  ): EventEmitter<EventMap> {
    const listeners = this.#listeners.get(event) ?? new Set();
    this.#listeners.set(event, listeners);
    listeners.add(listener);
    return this;
  }

  public removeListener<K extends keyof EventMap>(
    event: K,
    listener: CallbackFunction<Enforce<EventMap[K], any[]>>,
  ): EventEmitter<EventMap> {
    const listeners = this.#listeners.get(event);
    listeners?.delete(listener);
    return this;
  }

  public queryListeners<K extends keyof EventMap>(
    event: K,
  ): CallbackFunction<Enforce<EventMap[K], any[]>>[] {
    return Array.from(this.#listeners.get(event) ?? new Set());
  }

  public hasListener<K extends keyof EventMap>(
    event: K,
    listener: CallbackFunction<Enforce<EventMap[K], any[]>>,
  ): boolean {
    const listeners = this.#listeners.get(event);
    return listeners ? listeners.has(listener) : false;
  }

  public emit<K extends keyof EventMap>(event: K, args: EventMap[K]): boolean {
    const listeners = this.#listeners.get(event);
    if (!listeners || listeners.size === 0) return false;

    listeners.forEach((listener) =>
      tryCatch(listener, reportListenerError, args as any[], [this, event, args, listener]),
    );
    return true;
  }
}

export { EventEmitter };
