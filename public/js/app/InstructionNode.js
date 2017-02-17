define(["Processor"], function (Processor) {
    'use strict';

    function InstructionNode(instr) {
        this.instr = instr;
        this.acumLatency = 0;
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

        addDependents: function(dependents){
            this.dependents.push(dependents);
        },

        setCriticalPath: function(){
            this.criticalPath = true;
        },

        vinculateDependencies: function(dependencie){
            this.dependencies.push(dependencie);
        },

        vinculateDependents: function(dependent){
            this.dependents.push(dependent);
        },

        setAcumLatency: function(latency) {
            this.acumLatency = latency + this.instr.getCycles();
        },

        toString : function() {
            console.log("Instr "+ this.instr);
        },

        printInstructionNode : function() {
            console.log("Nodo: ");
            console.log("Instr "+ this.instr);
            console.log("AcumLatency: "+ this.acumLatency);
            console.log("Dependencies: "+ this.dependencies.length);
            console.log("Dependents: "+ this.dependents.length);
            console.log("CriticalPath: "+ this.criticalPath);
        },

        }

    }
    )();


    return InstructionNode;

});