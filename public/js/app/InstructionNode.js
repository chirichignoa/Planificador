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

        getInstr: function() {
            return this.instr;
        },

        getAcumLatency: function(){
            return this.acumLatency;
        }, 
        
        getDependencies: function(){
            return this.dependencies;
        },

        getDependents: function(){
            return this.dependents;
        },

        getCriticalPath: function(){
            return this.criticalPath;
        },

        setDependencies: function(dependencies){
            this.dependencies = dependencies;
        },

        setDependents: function(dependents){
            this.dependents = dependents;
        },

        setCriticalPath: function(){
            this.criticalPath = true;
        },

        printInstructionNode : function() {
            console.log("Nodo: ");
            console.log("Instr "+ this.instr);
            console.log("AcumLatency: "+ this.acumLatency);
            console.log("Dependencies: "+ this.dependencies.toString());
            console.log("Dependents: "+ this.dependents.toString());
            console.log("CriticalPath: "+ this.criticalPath);
        },

        }

    }
    )();


    return InstructionNode;

});