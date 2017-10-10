/**
 * 2D or 3D point
 */
export interface Point {
    x: number
    y: number
    z?: number
}

export interface VertexData {
    id: string | number
    parent? : string | number
    props?  : any
}

/**
 *
 */
export interface Vertex {
    group?: string
    data: VertexData
    position?: Point
    classes?: string
}

export interface EdgeData {
    id?: string | number
    source: string | number
    target: string | number
    props?  : any
}

export interface Edge {
    group?: string
    data: EdgeData
    classes?: string
}

export type CyGraphElem = Vertex | Edge

export interface GraphData {
    meta?  : GraphData
    nodes : Vertex[]
    edges : Edge[]
    props? : any
}

export abstract class GraphDataProvider {
    protected config: any;
    abstract async configure(config:any): Promise<any>;
}

export abstract class StaticGraphDataProvider extends GraphDataProvider {
    abstract loadAll(): Promise<GraphData>;
    abstract load(callbackObj: {onVertex: (vl: Array<Vertex>)=>void, onEdge: (el: Array<Edge>)=>void, onEnd?: (data: GraphData)=>void});
}
