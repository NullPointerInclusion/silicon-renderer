import type { CallbackFunction, Enforce } from "broadutils/types";
declare class EventEmitter<EventMap> {
    #private;
    addListener<K extends keyof EventMap>(event: K, listener: CallbackFunction<Enforce<EventMap[K], any[]>>): EventEmitter<EventMap>;
    removeListener<K extends keyof EventMap>(event: K, listener: CallbackFunction<Enforce<EventMap[K], any[]>>): EventEmitter<EventMap>;
    queryListeners<K extends keyof EventMap>(event: K): CallbackFunction<Enforce<EventMap[K], any[]>>[];
    hasListener<K extends keyof EventMap>(event: K, listener: CallbackFunction<Enforce<EventMap[K], any[]>>): boolean;
    emit<K extends keyof EventMap>(event: K, args: EventMap[K]): boolean;
}
export { EventEmitter };
//# sourceMappingURL=emitter.d.ts.map