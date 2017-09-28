type Callback = (...param: any[])=>void;

export class EventEmitter {
    listeners: any;
    supportEvents: any;

    constructor() {
        this.listeners = {}
        this.supportEvents = {}
    }

    /**
     *
     * @param {string} evtName
     */
    protected addSupportEvent(evtName: string): void {
        this.supportEvents[evtName] = true
    }

    /**
     *
     * @param {string} evtName event name
     * @returns {boolean} 이벤트 지원 여부.
     */
    private checkSupport(evtName: string): boolean {
        return !!this.supportEvents[evtName]
    }

    /**
     *
     * @param {string} eventName
     * @param {Callback} callback
     * @param ctx
     */
    on(eventName: string, callback: Callback, ctx: any): void {
        if(!this.checkSupport(eventName)) {
            console.error(`${eventName}은 지원하지 않는 event 입니다. 제공되는 이벤트는 ${Object.keys(this.supportEvents).join(',')} 입니다.`)
            return
        }

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