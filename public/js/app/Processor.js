define(["Instruction","InstructionNode"], function (Instruction,InstructionNode) {
    'use strict';

   function Processor() {
        this.nodes = [];
        this.planned = [];
        
    }

   Processor.prototype = (function () {
        return { 
            constructor: Processor,

            addNode: function (instruction) {
                var newNode = new InstructionNode(instruction); //sin cargar dependencias
                this.nodes.push(newNode);
                var arrDependencies = instruction.getDependencies();
                //console.log("BOOLEAN: "+instruction);
                if(arrDependencies.length > 0) { //SI instruction tiene dependencias
                    for(var d in arrDependencies) {
                        for(var n in this.nodes){
                            if(arrDependencies[d] == this.nodes[n].getInstr()){
                                newNode.vinculateDependencies(this.nodes[n]);
                                this.nodes[n].vinculateDependents(newNode);
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
            }
        }


    }
    )();

   return Processor;
});