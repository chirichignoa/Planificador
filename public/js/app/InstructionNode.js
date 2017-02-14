define(function () {
    'use strict';

    function InstructionNode(instr, acumLatency) {
        this.instr = instr;
        this.acumLatency = acumLatency;
        this.dependencies = [];
        this.dependents = [];
        this.criticalPath = false;
    }

    InstructionNode.prototype = (function () {

        return {
            constructor: InstructionNode,
        }

    }
    )();


    return InstructionNode;

});