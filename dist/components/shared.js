import { EventEmitter } from "./emitter/emitter.js";
const emitterMap = new WeakMap();
export const getEmitter = (obj) => {
    if (!emitterMap.has(obj)) {
        emitterMap.set(obj, new EventEmitter());
    }
    return emitterMap.get(obj);
};
export const zSort = (a, b) => {
    return a.position()[2] - b.position()[2];
};
//# sourceMappingURL=shared.js.map