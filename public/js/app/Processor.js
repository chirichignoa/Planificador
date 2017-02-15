define(["Instruction","InstructionNode", "FunctionalUnit", "Dispatch"], function (Instruction,InstructionNode, FuntionalUnit, Dispatch) {
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
                if(instruction.hasDependencies()) { //SI instruction tiene dependencias
                    var arrDependencies = getInstrucNodeDep(instruction.getDependencies);
                    for(instrucN in arrDependencies) {
                        //vincularlas
                        //vincualar dependientes
                    }
                }
                else { //Si no tiene
                    this.planned.push(); //AGREGAR A LA LISTA DE PLANIFICABLES
                }
                //calcular acumLatency
            }
        }


    }
    )();

   return Processor;
});