import { tryCatch } from "../utils.js";
const reportListenerError = (error, context) => {
    const [emitter, event, args, listener] = context;
    console.error("Error in event listener:", { emitter, event, args, listener, error });
};
class EventEmitter {
    #listeners = new Map();
    addListener(event, listener) {
        const listeners = this.#listeners.get(event) ?? new Set();
        this.#listeners.set(event, listeners);
        listeners.add(listener);
        return this;
    }
    removeListener(event, listener) {
        const listeners = this.#listeners.get(event);
        listeners?.delete(listener);
        return this;
    }
    queryListeners(event) {
        return Array.from(this.#listeners.get(event) ?? new Set());
    }
    hasListener(event, listener) {
        const listeners = this.#listeners.get(event);
        return listeners ? listeners.has(listener) : false;
    }
    emit(event, args) {
        const listeners = this.#listeners.get(event);
        if (!listeners || listeners.size === 0)
            return false;
        listeners.forEach((listener) => tryCatch(listener, reportListenerError, args, [this, event, args, listener]));
        return true;
    }
}
export { EventEmitter };
//# sourceMappingURL=emitter.js.map