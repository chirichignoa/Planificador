define(["Instruction","InstructionNode"], function (Instruction,InstructionNode) {
    'use strict';

   function Processor() {
        this.nodes = [];
        this.planned = [],
        this.terminals = [];
        
    }

   Processor.prototype = (function () {
        return { 
            constructor: Processor,

            addNode: function (instruction) {
                var newNode = new InstructionNode(instruction); //sin cargar dependencias
                this.nodes.push(newNode);
                this.terminals.push(newNode);
                var arrDependencies = instruction.getDependencies();
                if(arrDependencies.length > 0) { //SI instruction tiene dependencias
                    for(var d in arrDependencies) {
                        for(var n in this.nodes){
                            if(arrDependencies[d] == this.nodes[n].getInstr()){
                                newNode.vinculateDependencies(this.nodes[n]);
                                this.nodes[n].vinculateDependents(newNode);
                                this.removeNodeTerminals(this.nodes[n]);
                                break;                                
                            }
                        }
                    }
                }
                else { //Si no tiene
                    this.planned.push(newNode); //AGREGAR A LA LISTA DE PLANIFICABLES
                }
                newNode.calculateAcumLatency();
                //newNode.printInstructionNode();
            },

            removeNodeTerminals: function (nodo) {
                var index = this.terminals.indexOf(nodo);
                if (index > -1) {
                    this.terminals.splice(index, 1);
                }
            },

            findMaxAcumLatency: function (arrNodes) {
                var max = 0, index = 0;
                for(var node in arrNodes) {
                    var aux = arrNodes[node].getAcumLatency();
                    if( aux > max) {
                        max = aux;
                        index = node;
                    }
                }
                return node;
            },

            generateCriticalPath: function (){
                var node = this.nodes[this.findMaxAcumLatency(this.terminals)];
                var dependencies, criticalPath = [];
                node.setCriticalPath();
                criticalPath.unshift(node);
                while (node.getDependencies() !== undefined){
                    dependencies = node.getDependencies();
                    node = dependencies[this.findMaxAcumLatency(dependencies)];
                    node.setCriticalPath();
                    criticalPath.unshift(node);
                }
                console.log("Camino critico: "+ criticalPath.toString());
            },

            printNodes: function () {
                for(var node in this.nodes) {
                    console.log("///////////////////");
                    nodes[node].printInstructionNode();
                    console.log("///////////////////");
                }
            },
        }


    }
    )();

   return Processor;
});