define(function () {
    'use strict';

    function InstructionNode(instr) {
        this.instr = instr;
        this.acumLatency = 0;
        this.dependencies = [];
        this.dependents = [];
        this.criticalPath = false;
        this.executed = false;
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

        getExecuted: function() {
            return this.executed;
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

        setExecuted: function() {
            this.executed = true;
        },

        toString : function() {
            var result = "\nNodo: ";
            result += "Instr " + this.instr + "\n";
            result += "AcumLatency: "+ this.acumLatency + "\n";;
            result += "Dependencies: "+ this.dependencies.length+ "\n";
            result += "Dependents: "+ this.dependents.length+ "\n";
            result += "CriticalPath: "+ this.criticalPath+ "\n";
            return result;
        },

        }

    }
    )();


    return InstructionNode;

});