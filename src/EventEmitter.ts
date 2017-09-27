type Callback = (...param: any[])=>void;

export class EventEmitter {
    listeners: any;

    constructor() {
        this.listeners = {}
    }

    on(eventName: string, callback: Callback, ctx: any) {
        let evtListeners = this.listeners[eventName];
        if(evtListeners ) {
            evtListeners.push({cb: callback, ctx:ctx})
        }else {
            this.listeners[eventName] = [{cb: callback, ctx:ctx}]
        }
    }

    off(eventName: string, callback: Callback) {
        let evtListeners = this.listeners[eventName];
        if(!evtListeners) return;
        let idx = evtListeners.findIndex((v)=>v.cb==callback)
        if(idx<0) return;

        evtListeners.splice(idx,1)
    }

    fire(eventName: string, ...param: any[]) {
        let evtListeners = this.listeners[eventName];
        if(!evtListeners) return;

        evtListeners.forEach((v)=>v.cb.apply(v.ctx,param))
    }
}