define(["./libs/go/go-debug"], function (go) {

    var containerId;
    var myDiagram;
    var nodeDataArray = [];
    var linkDataArray = [];
    var i = 0;

    function GraphGo(containerId) {
      var $ = go.GraphObject.make;
      var containerId;
      var myDiagram;
      this.nodeDataArray = [];
      this.linkDataArray = [];

      this.containerId = containerId;

      this.myDiagram =
           $(go.Diagram, this.containerId,  // must name or refer to the DIV HTML element
             {
               initialAutoScale: go.Diagram.Uniform,  // an initial automatic zoom-to-fit
               allowZoom: true,
               "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
               contentAlignment: go.Spot.Center,  // align document to the center of the viewport
               layout:
                 $(go.LayeredDigraphLayout,
                   {direction: 90, layerSpacing: 40, columnSpacing: 30}  // automatically spread nodes apart
             });
         // define each Node's appearance
         this.myDiagram.nodeTemplate =
           $(go.Node, "Auto",  // the whole node panel
               {locationSpot: go.Spot.Center },
             // define the node's outer shape, which will surround the TextBlock
             $(go.Shape, "Rectangle",
               { fill: $(go.Brush, "Linear", { 0: "rgb(254, 201, 0)", 1: "rgb(254, 162, 0)" }), stroke: "black" }),
             $(go.TextBlock,
               { font: "bold 10pt helvetica, bold arial, sans-serif", margin: 4 },
               new go.Binding("text", "text"))
           );
         // replace the default Link template in the linkTemplateMap
         this.myDiagram.linkTemplate =
           $(go.Link,  // the whole link panel
             $(go.Shape,  // the link shape
               { stroke: "black" }),
             $(go.Shape,  // the arrowhead
               { toArrow: "standard", stroke: null }),
             $(go.Panel, "Auto",
               $(go.Shape,  // the label background, which becomes transparent around the edges
                 { fill: $(go.Brush, "Radial", { 0: "rgb(240, 240, 240)", 0.3: "rgb(240, 240, 240)", 1: "rgba(240, 240, 240, 0)" }),
                   stroke: null }),
               $(go.TextBlock,  // the label text
                 { textAlign: "center",
                   font: "10pt helvetica, arial, sans-serif",
                   stroke: "#555555",
                   margin: 4 },
                 new go.Binding("text", "text"))
             )
           );
         }

       GraphGo.prototype.addNode = function (nodeId) {
         var node = {
             key: nodeId,
             text: nodeId,
           }
          this.nodeDataArray.push(node);
       };

       GraphGo.prototype.addEdge = function (nodeIdSource, nodeIdDest, instrLatency, acumLatency) {
         var edge = {
           from: nodeIdDest,
           to: nodeIdSource,
           text: `(${instrLatency},${acumLatency})`
         }
         this.linkDataArray.push(edge);
       };

       GraphGo.prototype.draw = function(){
         this.myDiagram.model = new go.GraphLinksModel(this.nodeDataArray, this.linkDataArray);
         this.nodeDataArray = [];
         this.linkDataArray = [];
       }


    return GraphGo;
});
