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
                //console.log("BOOLEAN: "+instruction);
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
                newNode.printInstructionNode();
                console.log("CANT TERMINALES: "+terminals.length);
            },

            removeNodeTerminals: function (nodo) {
                var index = this.terminals.indexOf(nodo);
                if (index > -1) {
                    terminals.splice(index, 1);
                }
            }
        }


    }
    )();

   return Processor;
});