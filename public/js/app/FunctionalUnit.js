define(function () {
    'use strict';

    function FunctionalUnit(type) {
        this.cycles_execution = 0; //Cant de ciclos que lleva
        this.type = type;
        this.occupied = false;
        this.instruction = [];
        this.current_cycle = 0;
    }


    //public methods.
    FunctionalUnit.prototype = (function () {

        return {

            execute: function (instr) {
                this.instruction.push(instr);
                console.log("EJECUCION DE: "+this.getId);
                this.occupied = true;
            },

            isOccupied: function () {
                return this.occupied;
            },

            getType: function () {
                return this.type;
            },

            nextCycle: function () {
                if (this.occupied == true) {
                    this.cycles_execution += 1;
                    if (this.cycles_execution == instr.cycles) {   //Si son iguales, ya termino
                        console.log("INSTR COMPLETADA: "+this.getId);
                        this.getInstCompleted();
                        this.cycles_execution = 0;
                        this.occupied = false;
                    }
                }
            },

            getInstCompleted: function () {
                return this.instruction.pop();
            },

            /*hasInstruction: function () {
                if (this.instruction.length != 0) {
                    return true;
                }
                return false;
            },*/
            getId: function () {
                if (this.occupied == true) {
                    return this.instruction[0].getId();
                } else {
                    return "-";
                }
            }

        }
    })();

    return FunctionalUnit;
});