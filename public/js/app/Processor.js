define(["Instruction","InstructionNode", "FunctionalUnit", "Dispatch"], function (Instruction,InstructionNode, FuntionalUnit, Dispatch) {
    'use strict';

   function Processor() {
        this.instructionNode = [];
        this.planned = [];
        
    }

   Gestionator.prototype = (function () {
        return { 
            constructor: Processor,

            addNode: function (instruction) {
                var iN = new InstructionNode(instruction); //sin cargar dependencias
                this.instructionNode.push(iN);
                if(instruction.hasDependencies()) { //SI instruction tiene dependencias
                    var arrDependencies = getInstrucNodeDep(instruction.getDependencies,instruction.getDependenciesWAW);
                    for(instrucN in arrDependencies) {
                        //vincularlas
                        //vincualar dependientes
                }
                else { //Si no tiene
                    this.planned.push(); //AGREGAR A LA LISTA DE PLANIFICABLES
                }
                //calcular acumLatency
            },

            getInstrucNodeDep: function(/*llegan max 3 instr*/) {

                    //Busca 

            }


       }




   })();

   return Processor;
});