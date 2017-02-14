define(function () {
    'use strict';

    function InstructionNode(instr, latenciaAcum) {
        this.instr = instr;
        this.latenciaAcum = latenciaAcum;
        this.dependencias = [];
        this.dependientes = [];
        this.caminoCritico = false;
    }

    InstructionNode.prototype = (function () {

        return {
            constructor: InstructionNode,
        }

    }
    )();


    return InstructionNode;

});