import {Edge, GraphData, StaticGraphDataProvider, Vertex} from "./GraphTypes";
import * as gexf from "gexf";

export enum UrlType {URL, FILE}

export interface GexfConf {
  url: string
  type: UrlType
}

function isGexfConf(obj: any): obj is GexfConf {
  return (<GexfConf>obj).url !== undefined
}


var defaultMapper = {
    node: {
        data: (n)=>({id:n.id}),
        position: (n)=>n.viz.position,
    },
    edge:{
        data: e=>({source: e.source, target: e.target})
    }
};

export class GexfDataProvider extends StaticGraphDataProvider {
  protected config: GexfConf
  protected worker: Worker

  loadAll(): Promise<GraphData> {
    throw new Error("Method not implemented.");
  }

  /**
   *
   * @param {{onVertex: ((vl: Array<Vertex>) => void); onEdge: ((el: Array<Edge>) => void); onEnd?: ((gd: GraphData) => void)}} callbackObj
   * @param mapper
   */
  load(
    callbackObj: {
      onVertex: (vl: Array<Vertex>) => void;
      onEdge: (el: Array<Edge>) => void;
      onEnd?: (gd: GraphData)=>void;
    },
    mapper:any = defaultMapper
  ): void {
    var buf;
    var p =fetch(this.config.url).then((res)=>res.text());

    p.then((gexfText: string)=>{
      var graph = gexf.parse(gexfText);
      graph.nodes.forEach((n) => {
        callbackObj.onVertex([{
          data : (mapper.node && mapper.node.data) ? mapper.node.data(n) : defaultMapper.node.data(n),
          position : (mapper.node && mapper.node.position) ? mapper.node.position(n) : defaultMapper.node.position(n)
        }]);
      });

      graph.edges.forEach((e) => {
        callbackObj.onEdge([{
          data: {
              source: e.source,
              target: e.target
          },
        }]);
      });

      if(typeof callbackObj.onEnd == 'function') {
        callbackObj.onEnd(null)
      }
    });
  }

  configure(config: string | GexfConf): Promise<GexfDataProvider> {
    if (typeof config == 'string') {
      if (config.startsWith('file://')) {
        this.config = {type: UrlType.FILE, url: config.substr(7)}
      } else {
        this.config = {type: UrlType.URL, url: config}
      }
    } else if (isGexfConf(config)) {
      this.config = config;
    }

    return Promise.resolve(this);
  }
}
