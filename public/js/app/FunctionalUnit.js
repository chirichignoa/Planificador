define(function () {
    'use strict';

    function FunctionalUnit(type) {
        this.cycles_execution = 0; //Cant de ciclos que lleva
        this.type = type;
        this.occupied = false;
        this.nodeInstr = 0;
        this.current_cycle = 0;
    }


    //public methods.
    FunctionalUnit.prototype = (function () {

        return {

            execute: function (nodeInstr) {
                this.nodeInstr = nodeInstr;
                console.log("EJECUCION DE: "+ this.nodeInstr.getInstr().getId());
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
                    if (this.cycles_execution == this.nodeInstr.getInstr().getCycles()) {   //Si son iguales, ya termino
                        console.log("INSTR COMPLETADA: "+ this.nodeInstr.getInstr().getId());
                        this.nodeInstr.setExecuted();
                        this.cycles_execution = 0;
                        this.occupied = false;
                        return true;
                    }
                }
                return false;
            },

            getId: function () {
                if (this.occupied == true) {
                    return this.nodeInstr.getInstr().getId();
                } else {
                    return "-";
                }
            }

        }
    })();

    return FunctionalUnit;
});