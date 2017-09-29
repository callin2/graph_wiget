import * as cytoscape from 'cytoscape';

import * as undoRedo from 'cytoscape.js-undo-redo/cytoscape-undo-redo.js'
import * as viewUtilities from 'cytoscape-view-utilities'
import * as cxtmenu from 'cytoscape-cxtmenu';
import * as cyqtip from 'cytoscape-qtip';
import * as panzoom from 'cytoscape-panzoom';

require('cytoscape-panzoom/cytoscape.js-panzoom.css');

import * as euler from 'cytoscape-euler';

import * as jquery from 'jquery'

import {EventEmitter} from "./EventEmitter";

//----------------------------------------------------------------------------------
var defaultStyle = [
    {
        selector: 'core',
        css: {
            "selection-box-color": "#11bf1c",
            "selection-box-opacity": 0.25,
            "selection-box-border-color": "#aaa",
            "selection-box-border-width": 1,
            // "panning-cursor": "grabbing",
        }
    }, {
        selector: 'node',
        css: {
            'label': 'data(name)',
            'text-halign': 'center',    // text-halign: left, center, right
            'text-valign': 'center',       // text-valign: top, center, bottom
            'color': 'white',
            'font-weight': 700,
            'text-opacity': 1,
            'text-outline-width': 2,
            'text-outline-color': '#1abde8',
            'background-color': '#1abde8',
            // 'shape': 'eclipse',
            'width': '100px',
            'height': '100px',
            'border-width': '2',
            'border-color': 'white'
        }
    }, {
        selector: 'node:parent',
        css: {
            'label': 'data(name)',
            'text-valign': 'bottom',
            'color': 'white',
            'text-outline-width': 1,
            'text-outline-color': '#888',
            'border-width': 0,
            'border-color': 'white'
        }
    }, {
        selector: 'node:locked',
        css: {
            'background-color': '#444444',
            'text-outline-color': '#444444',
            'border-color': 'white',
            'border-width': 3,
            'opacity': 1
        }
    }, {
        selector: 'node.expand',                /// 기존과 다른 엣지버전의 변화
        css: {
            'text-valign': 'center',               // text-valign: top, center, bottom
            'text-halign': 'center',                // text-halign: left, center, right
            'font-size': '4',
            'opacity': 0.6,
            'color': 'black',
            'text-outline-width': 0,
            'text-opacity': 0.8,
            'line-color': 'yellow',
            'background-color': 'yellow',
            'border-width': 1,
            'width': '50px',
            'height': '50px',
            // 'shape': 'eclipse',
            'border-color': 'white'
        }
    }, {
        selector: ':selected',                /// 선택한 노드의 변화 (.highlighted로 인해 선택된 노드를 강조하고자 하려면 border값으로 변화를 줘야함)
        css: {
            'background-color': 'white',
            'text-outline-color': '#3f51b5',
            'text-outline-width': 2,
            'target-arrow-color': 'black',
            'source-arrow-color': 'black',
            'line-color': '#3f51b5',
            'border-style': 'double',
            'border-color': '#3f51b5',
            'border-width': 10,
        }
    }, {
        selector: 'edge',
        css: {
            'label': 'data(label)',
            'color': '#1abde8',
            'opacity': 1,
            'text-outline-width': 2,
            'text-outline-color': 'white',
            'line-color': '#1abde8',
            'line-style': 'solid',            // line-style: solid, dotted, dashed
            'width': 2,
            'curve-style': 'bezier',
            'target-arrow-shape': 'triangle',
            'target-arrow-color': '#1abde8',
            'source-arrow-shape': 'none',
            'source-arrow-color': '#1abde8',
            'font-size': 12
        }
    }, {
        selector: 'edge:selected',             /// 엣지만 클릭했을 경우 변화
        css: {
            // 'background-color': '#3f51b5',
            'target-arrow-color': '#3f51b5',
            'source-arrow-color': '#3f51b5',
            'line-color': '#3f51b5',
            'width': 3,
            'opacity': 1,
            'color': '#3f51b5',
            'text-outline-width': 2,
            'text-outline-color': 'white',
        }
    }, {
        selector: 'edge:locked',              /// 엣지를 잠궜을 때 변화
        css: {
            // 'width': 4,
            'opacity': 1,
            'line-color': 'red',
            'target-arrow-color': 'red',
            'source-arrow-color': 'red'
        }
    }, {
        selector: 'edge.expand',             /// 기존과 다른 엣지버전의 변화
        css: {
            // 'width': 3,
            'opacity': 0.3,
            'font-size': '4',
            'color': 'yellow',
            'line-color': 'yellow',
            'target-arrow-color': 'yellow',
            'source-arrow-color': 'yellow',
        }
    }, {
        selector: '.highlighted',      // 노드 클릭시 노드 및 엣지 변화(연결된 노드도 같이 변화됨)
        css: {
            'background-color': '#3f51b5',
            'line-color': '#3f51b5',
            'text-outline-width': 2,
            'text-outline-color': '#3f51b5',
            'target-arrow-color': '#3f51b5',
            'transition-property': 'background-color, line-color, target-arrow-color',
            'transition-duration': '0.2s',
            'color': 'white'
        }
    }, {
        selector: 'edge.highlighted',
        'width': 3,
        'target-arrow-color': '#3f51b5',
        'source-arrow-color': '#3f51b5',
        css: {}
    }, {
        selector: '.traveled',
        css: {
            'background-color': '#11bf1c',
            'line-color': '#11bf1c',
            'target-arrow-color': 'black',
            'transition-property': 'background-color, line-color, target-arrow-color',
            'transition-duration': '0.2s'
        }
    }, {
        selector: '.edgehandles-hover',   /// 엣지 드래그한 후 선택한 노드의 변화
        css: {
            'background-color': '#d80001'
        }
    }, {
        selector: '.edgehandles-source',    /// 선택된 노드의 드래그시 변화
        css: {
            'border-width': 10,
            'border-color': '#d80001',
            'background-color': '#d80001',
            'text-outline-color': '#d80001',
        }
    }, {
        selector: '.edgehandles-target',   /// 엣지연결할 타겟의 노드변화
        css: {
            'border-width': 2,
            'border-color': 'white',
            'text-outline-color': '#d80001',
        }
    }, {
        selector: '.edgehandles-preview, .edgehandles-ghost-edge', /// 선택된 노드에 연결될 엣지의 예상변화
        css: {
            'line-color': '#d80001',
            'target-arrow-color': '#d80001',
            'source-arrow-color': '#d80001',
        }
    }
];

var layoutPreset = {
    euler: {
        name: 'euler',
        springLength: edge => 80,
        springCoeff: edge => 0.0008,
        mass: node => 4,
        gravity: -1.2,
        theta: 0.666,
        dragCoeff: 0.02,
        movementThreshold: 1,
        timeStep: 20,
        refresh: 10,
        animate: true,
        animationDuration: undefined,
        animationEasing: undefined,
        maxIterations: 1000,
        maxSimulationTime: 4000,
        ungrabifyWhileSimulating: false,
        fit: true,
        padding: 30,
        boundingBox: undefined,
        randomize: false
    },
    grid: {
        name: 'grid',
        fit: true, // whether to fit the viewport to the graph
        padding: 30, // padding used on fit
        boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
        avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
        avoidOverlapPadding: 10, // extra spacing around nodes when avoidOverlap: true
        nodeDimensionsIncludeLabels: false, // Excludes the label when calculating node bounding boxes for the layout algorithm
        spacingFactor: undefined, // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
        condense: false, // uses all available space on false, uses minimal space on true
        rows: undefined, // force num of rows in the grid
        cols: undefined, // force num of columns in the grid
        position: function (node) {
        }, // returns { row, col } for element
        sort: undefined, // a sorting function to order the nodes; e.g. function(a, b){ return a.data('weight') - b.data('weight') }
        animate: false, // whether to transition the node positions
        animationDuration: 500, // duration of animation in ms if enabled
        animationEasing: undefined, // easing of animation if enabled
    },
    random: {
        name: 'random',
        fit: true, // whether to fit to viewport
        padding: 30, // fit padding
        boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
        animate: false, // whether to transition the node positions
        animationDuration: 500, // duration of animation in ms if enabled
        animationEasing: undefined, // easing of animation if enabled
    },
    breadthfirst: {
        name: 'breadthfirst',
        fit: true, // whether to fit the viewport to the graph
        directed: false, // whether the tree is directed downwards (or edges can point in any direction if false)
        padding: 30, // padding on fit
        circle: false, // put depths in concentric circles if true, put depths top down if false
        spacingFactor: 1.75, // positive spacing factor, larger => more space between nodes (N.B. n/a if causes overlap)
        boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
        avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
        nodeDimensionsIncludeLabels: false, // Excludes the label when calculating node bounding boxes for the layout algorithm
        roots: undefined, // the roots of the trees
        maximalAdjustments: 0, // how many times to try to position the nodes in a maximal way (i.e. no backtracking)
        animate: false, // whether to transition the node positions
        animationDuration: 500, // duration of animation in ms if enabled
        animationEasing: undefined, // easing of animation if enabled
    },
    circle: {
        name: 'circle',
        fit: true, // whether to fit the viewport to the graph
        padding: 30, // the padding on fit
        boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
        avoidOverlap: true, // prevents node overlap, may overflow boundingBox and radius if not enough space
        nodeDimensionsIncludeLabels: false, // Excludes the label when calculating node bounding boxes for the layout algorithm
        spacingFactor: undefined, // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
        radius: undefined, // the radius of the circle
        startAngle: 3 / 2 * Math.PI, // where nodes start in radians
        sweep: undefined, // how many radians should be between the first and last node (defaults to full circle)
        clockwise: true, // whether the layout should go clockwise (true) or counterclockwise/anticlockwise (false)
        sort: undefined, // a sorting function to order the nodes; e.g. function(a, b){ return a.data('weight') - b.data('weight') }
        animate: false, // whether to transition the node positions
        animationDuration: 500, // duration of animation in ms if enabled
        animationEasing: undefined, // easing of animation if enabled
    },
    concentric: {
        name: 'concentric',
        fit: true, // whether to fit the viewport to the graph
        padding: 30, // the padding on fit
        startAngle: 3 / 2 * Math.PI, // where nodes start in radians
        sweep: undefined, // how many radians should be between the first and last node (defaults to full circle)
        clockwise: true, // whether the layout should go clockwise (true) or counterclockwise/anticlockwise (false)
        equidistant: false, // whether levels have an equal radial distance betwen them, may cause bounding box overflow
        minNodeSpacing: 10, // min spacing between outside of nodes (used for radius adjustment)
        boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
        avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
        nodeDimensionsIncludeLabels: false, // Excludes the label when calculating node bounding boxes for the layout algorithm
        height: undefined, // height of layout area (overrides container height)
        width: undefined, // width of layout area (overrides container width)
        spacingFactor: undefined, // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
        concentric: function (node) { // returns numeric value for each node, placing higher nodes in levels towards the centre
            return node.degree();
        },
        levelWidth: function (nodes) { // the variation of concentric values in each level
            return nodes.maxDegree() / 4;
        },
        animate: false, // whether to transition the node positions
        animationDuration: 500, // duration of animation in ms if enabled
        animationEasing: undefined, // easing of animation if enabled
    },
    cola: {
        name: 'cola',
        animate: true, // whether to show the layout as it's running
        refresh: 1, // number of ticks per frame; higher is faster but more jerky
        maxSimulationTime: 4000, // max length in ms to run the layout
        ungrabifyWhileSimulating: false, // so you can't drag nodes during layout
        fit: true, // on every layout reposition of nodes, fit the viewport
        padding: 30, // padding around the simulation
        boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
        // positioning options
        randomize: true, // use random node positions at beginning of layout
        avoidOverlap: true, // if true, prevents overlap of node bounding boxes
        handleDisconnected: true, // if true, avoids disconnected components from overlapping
        nodeSpacing: function (node) {
            return 10;
        }, // extra spacing around nodes
        flow: undefined, // use DAG/tree flow layout if specified, e.g. { axis: 'y', minSeparation: 30 }
        alignment: undefined, // relative alignment constraints on nodes, e.g. function( node ){ return { x: 0, y: 1 } }
        // different methods of specifying edge length
        // each can be a constant numerical value or a function like `function( edge ){ return 2; }`
        edgeLength: undefined, // sets edge length directly in simulation
        edgeSymDiffLength: undefined, // symmetric diff edge length in simulation
        edgeJaccardLength: undefined, // jaccard edge length in simulation
        // iterations of cola algorithm; uses default values on undefined
        unconstrIter: undefined, // unconstrained initial layout iterations
        userConstIter: undefined, // initial layout iterations with user-specified constraints
        allConstIter: undefined, // initial layout iterations with all constraints including non-overlap
        // infinite layout options
        infinite: false // overrides all other options for a forces-all-the-time mode
    },
    cose: {
        name: 'cose',
        animate: true,    // Whether to animate while running the layout
        // The layout animates only after this many milliseconds
        animationThreshold: 250,    // (prevents flashing on fast runs)
        // Number of iterations between consecutive screen positions update
        refresh: 20,    // (0 -> only updated on the end)
        fit: true,    // Whether to fit the network view after when done
        padding: 30,    // Padding on fit
        boundingBox: undefined,   // Constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
        nodeDimensionsIncludeLabels: false,   // Excludes the label when calculating node bounding boxes for the layout algorithm
        randomize: true,   // Randomize the initial positions of the nodes (true) or use existing positions (false)
        componentSpacing: 100,    // Extra spacing between components in non-compound graphs
        nodeRepulsion: function (node) {
            return 400000;
        },    // Node repulsion (non overlapping) multiplier
        nodeOverlap: 10,    // Node repulsion (overlapping) multiplier
        idealEdgeLength: function (edge) {
            return 10;
        },    // Ideal edge (non nested) length
        edgeElasticity: function (edge) {
            return 100;
        },    // Divisor to compute edge forces
        nestingFactor: 5,   // Nesting factor (multiplier) to compute ideal edge length for nested edges
        gravity: 80,    // Gravity force (constant)
        numIter: 1000,    // Maximum number of iterations to perform
        initialTemp: 200,   // Initial temperature (maximum node displacement)
        coolingFactor: 0.95,    // Cooling factor (how the temperature is reduced between consecutive iterations
        minTemp: 1.0,   // Lower temperature threshold (below this point the layout will end)
        weaver: false   // Pass a reference to weaver to use threads for calculations
    },
    "cose-bilkent": {
        name: 'cose-bilkent',
        refresh: 0,   // Number of iterations between consecutive screen positions update (0 -> only updated on the end)
        fit: true,    // Whether to fit the network view after when done
        padding: 10,    // Padding on fit
        incremental: true,    // Whether to enable incremental mode
        debug: false,   // Whether to use the JS console to print debug messages
        nodeRepulsion: 4500,    // Node repulsion (non overlapping) multiplier
        nodeOverlap: 10,    // Node repulsion (overlapping) multiplier
        idealEdgeLength: 50,    // Ideal edge (non nested) length
        edgeElasticity: 0.45,   // Divisor to compute edge forces
        nestingFactor: 0.1,   // Nesting factor (multiplier) to compute ideal edge length for nested edges
        gravity: 0.4,   // Gravity force (constant)
        numIter: 2500,    // Maximum number of iterations to perform
        initialTemp: 200,   // Initial temperature (maximum node displacement)
        coolingFactor: 0.95,    // Cooling factor (how the temperature is reduced between consecutive iterations
        minTemp: 1,   // Lower temperature threshold (below this point the layout will end)
        tile: true,   // For enabling tiling
        animate: true   //whether to make animation while performing the layout
    },
    dagre: {
        name: 'dagre',
        fit: true, // whether to fit to viewport
        padding: 30, // fit padding
        spacingFactor: undefined, // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
        animate: true, // whether to transition the node positions
        animationDuration: 500, // duration of animation in ms if enabled
        animationEasing: undefined, // easing of animation if enabled
        boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
        // dagre algo options, uses default value on undefined
        nodeSep: undefined, // the separation between adjacent nodes in the same rank
        edgeSep: undefined, // the separation between adjacent edges in the same rank
        rankSep: undefined, // the separation between adjacent nodes in the same rank
        rankDir: undefined, // 'TB' for top to bottom flow, 'LR' for left to right
        minLen: function (edge) {
            return 1;
        }, // number of ranks to keep between the source and target of the edge
        edgeWeight: function (edge) {
            return 1;
        }, // higher weight edges are generally made shorter and straighter than lower weight edges
    }
};

var defaultSetting = {
    // container: document.getElementById('agens-graph'),
    container: null,
    style: defaultStyle,
    elements: {nodes: [], edges: []},   // agens.graph.demoData[0],
    layout: layoutPreset.cose,
    // initial viewport state:
    zoom: 1,
    pan: {x: 0, y: 0},
    // interaction options:
    minZoom: 1e-25,
    maxZoom: 1e1,
    zoomingEnabled: true,
    userZoomingEnabled: true,
    panningEnabled: true,
    userPanningEnabled: true,
    boxSelectionEnabled: true,
    selectionType: 'single',
    touchTapThreshold: 8,
    desktopTapThreshold: 4,
    autolock: false,
    autoungrabify: false,
    autounselectify: false,
    // rendering options:
    headless: false,
    styleEnabled: true,
    hideEdgesOnViewport: false,
    hideLabelsOnViewport: false,
    textureOnViewport: false,
    motionBlur: false,
    motionBlurOpacity: 0.2,
    wheelSensitivity: 0.7,
    pixelRatio: 'auto',
    extension: {
        // 'cyqtip' : true,
        // 'panzoom': {
        //     zoomFactor: 0.05, // zoom factor per zoom tick
        //     zoomDelay: 45, // how many ms between zoom ticks
        //     minZoom: 0.1, // min zoom level
        //     maxZoom: 10, // max zoom level
        //     fitPadding: 50, // padding when fitting
        //     panSpeed: 10, // how many ms in between pan ticks
        //     panDistance: 10, // max pan distance per tick
        //     panDragAreaSize: 75, // the length of the pan drag box in which the vector for panning is calculated (bigger = finer control of pan speed and direction)
        //     panMinPercentSpeed: 0.25, // the slowest speed we can pan by (as a percent of panSpeed)
        //     panInactiveArea: 8, // radius of inactive area in pan drag box
        //     panIndicatorMinOpacity: 0.5, // min opacity of pan indicator (the draggable nib); scales from this to 1.0
        //     autodisableForMobile: true, // disable the panzoom completely for mobile (since we don't really need it with gestures like pinch to zoom)
        //     // icon class names
        //     sliderHandleIcon: 'fa fa-minus',
        //     zoomInIcon: 'fa fa-plus',
        //     zoomOutIcon: 'fa fa-minus',
        //     resetIcon: 'fa fa-expand'
        // },
        'cxtmenu': {
            // node: [
                // {evtname: 'node-lock', label: 'Lock', select: "handleNodeLock", emit: true},
                // {evtname: 'node-prop', label: 'Property', select: "handleNodeProp", emit: true},
                // {evtname: 'node-expand', label: 'Expand', select: null, emit: true},
                // {evtname: 'node-remove', label: 'Remove', select: "handleNodeLock", emit: true},
                // {evtname: 'node-hide', label: 'Hide', select: "handleNodeLock", emit: false}
            // ],
            // edge: [
            //     {evtname: 'edge-prop', label: 'Property', select: "handleEdgeProp", emit: true},
            //     {evtname: 'edge-remove', label: 'Remove', select: "handleEdgeRemove", emit: true},
            //     {evtname: 'edge-hide', label: 'Hide', select: "handleEdgeHide", emit: false}
            // ],
            // core: [
            //     {evtname: 'node-add', label: 'Add Node', select: "handleAddNode", emit: true},
            //     {evtname: 'show-all', label: 'Show All', select: "handleShowAll", emit: true},
            //     {evtname: 'hide-expand', label: 'Hide Expand', select: "handleAddNode", emit: true},
            //     {evtname: 'unlock-all', label: 'Unlock All', select: "handleAddNode", emit: true}
            // ]
        },
        'undoRedo': true,
        // 'viewUtilities': {
        //     neighbor: (node)=>node.closedNeighborhood(),
        //     neighborSelectTime: 1000
        // }
    },

    ready: null
};

function makeid(): string {
    var text = "_id_";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

/**
 * 2D or 3D point
 */
interface Point {
    x: number
    y: number
    z?: number
}

interface VertexData {
    id: string | number
    parent?: string | number
}

/**
 *
 */
interface Vertex {
    group?: string
    data: VertexData
    position?: Point
    classes?: string
}

interface EdgeData {
    id?: string | number
    source: string | number
    target: string | number
}

/**
 *
 */
interface Edge {
    group?: string
    data: EdgeData
    classes?: string
}

type CyGraphElem = Vertex | Edge


/**
 *
 */
export interface IGraphWidget {
    doLayout: (layoutConfig: any) => void
    add: (data: CyGraphElem | CyGraphElem[]) => void
    export: () => void
    selectAllNodeByLabel: (label: string) => void
    selectAllEdgeByLabel: (label: string) => void
}

/**
 * cytoscape.js 를 wrapping 한 graph widget
 * @see http://js.cytoscape.org/
 */
export class GraphWidget extends EventEmitter implements IGraphWidget {
    _afterInitFn: { resolve: (value?: any) => void; reject: (reason?: any) => void; };
    cy: any;
    lastMousePosition: Point;
    ext_unre: any = null;
    rootElement: HTMLElement;
    removeElementWhenDestroy: boolean;
    layout: any

    /**
     *
     * @param {string | HTMLElement} rootElement
     */
    constructor(rootElement?: string | HTMLElement, protected config?: any) {
        super()

        this.initRoot(rootElement);

        this.config = this.config ? this.config : {};

        this.config = Object.assign({}, defaultSetting, this.config, {
            container: this.rootElement,
            ready: (e) => {
                this.cy = e.cy
                this.onReady()
            }
        });

        this.initExtLayout_euler()
        this.cy = cytoscape(this.config)
    }

    /**
     * GraphWidget 이 attach 될 root element를 초기화 한다.
     * @param {string | HTMLElement} rootElement
     */
    private initRoot(rootElement: string | HTMLElement) {
        this.removeElementWhenDestroy = false;

        if (typeof rootElement == 'undefined' || rootElement == null) {
            this.removeElementWhenDestroy = true;
            this.rootElement = document.createElement("div");
            this.rootElement.style.width = "800px";
            this.rootElement.style.height = "600px";

            document.querySelector('body').appendChild(this.rootElement)
        }
        if (rootElement != null && typeof rootElement == 'string') {
            // noinspection TypeScriptUnresolvedFunction
            this.rootElement = <HTMLElement>document.querySelector(rootElement);
        } else if (rootElement != null && rootElement instanceof HTMLElement) {
            this.rootElement = rootElement;
        }
    }

    public export(): void {

    }


    public selectAllNodeByLabel(label: string): void {

    }

    public selectAllEdgeByLabel(label: string): void {

    }


    /**
     * GraphWidget에 vertex 또는 Edge 또는 둘 다 추가한다.
     * @param elements [string|number]
     */
    public add(elements): void {
        this.cy.add(elements);
    }

    /**
     *
     * @param layoutConfig [optional] 없을경우 default layout 설정으로 layout 을 수행.
     * 있을경우 default layout 읅 변경후 layout 을 수행
     */
    public doLayout(layoutConfig?: any) {
        if (this.layout) this.layout.stop();

        if (layoutConfig) {
            this.config.layout = layoutConfig
        }

        this.layout = this.cy.makeLayout(this.config.layout)
        this.layout.run()
    }

    //--------------------------------  event handler -------------------------

    private initExt_undoRedo() {
        undoRedo(cytoscape);
        this.ext_unre = this.cy.undoRedo()
    }

    private initExtLayout_euler() {
        console.log('initExt_euler')
        // cytoscape.use(euler);
        euler(cytoscape);
    }

    private initExt_cyqtip() {
        cyqtip(cytoscape);

        this.cy.qtip({
            content: function () {
                var name = this.data('name');
                var label = this.data('label');
                var id = this.id();
                return `id: ${id}<br>\nlabel: ${label}<br>\nname: ${name}`;
            },
            position: {
                my: 'bottom left',  // Position my top left...
                at: 'top right', // at the bottom right of...
            },
            style: {
                classes: 'qtip-tipsy qtip-shadow qtip-rounded',
                tip: {
                    width: 16,
                    height: 8
                }
            }
        });
    }

    private initExt_viewUtilities(option) {
        viewUtilities(cytoscape, jquery)
        this.cy.viewUtilities(option)
    }

    private initExt_panzoom(option) {
        console.log('panzoom 44')
        panzoom(cytoscape, jquery)
        this.cy.panzoom(option)
    }

    private initExt_cxtmenu(cxtOption) {
        cxtmenu(cytoscape);

        Object.keys(cxtOption).forEach((k) => {
            this.cy.cxtmenu({
                selector: k,
                menuRadius: 80,
                fillColor: 'rgba(50, 0, 0, 0.65)',
                commands: cxtOption[k].map((menu) => {
                    if(menu.emit) this.addSupportEvent(menu.evtname);
                    return {
                        content: `<span style="display:inline-block; width:20px; font-size:10pt">${menu.label}</span>`,
                        select: (param) => {
                            if (menu.select) {
                                this[menu.select](param)
                            }
                            if (menu.emit) {
                                this.fire(menu.evtname, param)
                            }
                        }
                    }
                })
            })
        });
    }

    initExtension() {
        Object.keys(this.config.extension).forEach((key) => {
            this['initExt_' + key](this.config.extension[key])
        });

        this._afterInitFn.resolve();
        this._afterInitFn = null;
        delete this._afterInitFn
    }

    afterInitExtension(): Promise<any> {
        return new Promise((resolve, reject)=>{
            this._afterInitFn = {resolve, reject}
        })
    }

    onReady() {
        this.initExtension()

        this.layout = this.cy.makeLayout(this.config.layout)
        this.layout.run()

        // ==========================================
        // ==  cy events 등록
        // ==========================================

        this.cy.on('tap', function (e) {
            console.log(e)
            // if (e.cyTarget === this.cy) {
            //     this.api.view.removeHighlights();
            //     this.cy.$(':selected').unselect();
            //     this.graph.pivotNode = null;
            // }

            this.lastMousePosition = e.position;
        });

        this.cy.on('tap', 'node', function (e) {
            console.log(e)
            // this.graph.pivotNode = e.cyTarget;
            // this.api.view.removeHighlights();
            // this.api.view.highlightNeighbors(e.cyTarget);
        });

        this.cy.on('cxttapstart', function (e) {
            this.lastMousePosition = e.position;
        });

        // 화면에 맞게 elements 정렬
        this.cy.fit(this.cy.elements(), 50); // fit to all the layouts
    }
}
