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
                var max = 0, index = -1;
                for(var node in arrNodes) {
                    var aux = arrNodes[node].getAcumLatency();
                    if( aux > max) {
                        max = aux;
                        index = node;
                    }
                }
                return index;
            },

            generateCriticalPath: function (){
                this.printNodes();
                var index = this.findMaxAcumLatency(this.terminals);
                var node, dependencies, criticalPath = [];
                console.log("Indice: "+ index);
                if(index != -1){
                    node = this.nodes[this.findMaxAcumLatency(this.terminals)];
                }
                node.setCriticalPath();
                criticalPath.unshift(node);
                index = this.findMaxAcumLatency(node.getDependencies());
                while (index != -1){
                    dependencies = node.getDependencies();
                    node = dependencies[index];
                    node.setCriticalPath();
                    criticalPath.unshift(node);
                    index = this.findMaxAcumLatency(node.getDependencies());
                }
                console.log("Camino critico: "+ criticalPath.toString());
            },

            printNodes: function () {
                for(var node in this.nodes) {
                    console.log("///////////////////");
                    this.nodes[node].printInstructionNode();
                    console.log("///////////////////");
                }
            },
        }


    }
    )();

   return Processor;
});