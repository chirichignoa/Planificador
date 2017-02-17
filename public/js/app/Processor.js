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
                var arrDependencies = instruction.getDependencies();
                this.terminals.push(this.nodes.length);
                if(arrDependencies.length > 0) { //SI instruction tiene dependencias
                    for(var d in arrDependencies) {
                        for(var n in this.nodes){
                            if(arrDependencies[d] == this.nodes[n].getInstr()){
                                newNode.vinculateDependencies(n);
                                this.nodes[n].vinculateDependents(this.nodes.length);
                                this.removeNodeTerminals(n);
                                break;                                
                            }
                        }
                    }
                }
                else { //Si no tiene
                    this.planned.push(this.nodes.length); //AGREGAR A LA LISTA DE PLANIFICABLES
                }
                this.calculateAcumLatency(newNode);
                this.nodes.push(newNode);
                //newNode.printInstructionNode();
            },

            calculateAcumLatency: function(node){
                if(node.getDependencies() == []){
                    node.setAcumLatency(0);
                }
                else {
                    var maxLatency = 0;
                    var dependencies = node.getDependencies();
                    for(var dep in dependencies) {
                        var aux = (this.nodes[dependencies[dep]]).getAcumLatency();
                        if(aux > maxLatency){
                            maxLatency = aux;
                        }
                    }
                    node.setAcumLatency(maxLatency);
                }
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
                    var indexNode = arrNodes[node];
                    if(indexNode < this.nodes.length){
                        var aux = this.nodes[indexNode].getAcumLatency();
                        if( aux > max) {
                            max = aux;
                            index = node;
                        }
                    }
                }
                return index;
            },

            generateCriticalPath: function (){
                var index = this.findMaxAcumLatency(this.terminals);
                var node, dependencies, criticalPath = [];
                if(index != -1){
                    node = this.nodes[this.findMaxAcumLatency(this.terminals)];
                }
                node.setCriticalPath();
                criticalPath.unshift(node);
                index = this.findMaxAcumLatency(node.getDependencies());
                while (index != -1){
                    dependencies = node.getDependencies();
                    node = this.nodes[dependencies[index]];
                    node.setCriticalPath();
                    criticalPath.unshift(node);
                    index = this.findMaxAcumLatency(node.getDependencies());
                }
                console.log("Camino critico: "+ criticalPath.length);
                this.printNodes();
            },

            printNodes: function () {
                for(var node in this.nodes) {
                    console.log("///////////////////");
                    this.nodes[node].printInstructionNode();
                    console.log("///////////////////");
                }
            }
        }


    }
    )();

   return Processor;
});