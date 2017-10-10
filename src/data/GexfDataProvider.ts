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

export class GexfDataProvider extends StaticGraphDataProvider {
  protected config: GexfConf
  protected worker: Worker

  loadAll(): Promise<GraphData> {
    throw new Error("Method not implemented.");
  }

  load(callbackObj: { onVertex: (vl: Array<Vertex>) => void; onEdge: (el: Array<Edge>) => void; onEnd?: (gd: GraphData)=>void; }): void {
    var buf;
    var p =fetch(this.config.url).then((res)=>res.text());

    p.then((gexfText: string)=>{
      var graph = gexf.parse(gexfText);
      graph.nodes.forEach((n) => {
        callbackObj.onVertex([{
          data : {id: 'n' + n.id},
          position: n.viz.position
        }]);
      });

      graph.edges.forEach((e) => {
        callbackObj.onEdge([{
          data: {
              source: 'n' + e.source,
              target: 'n' + e.target
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
