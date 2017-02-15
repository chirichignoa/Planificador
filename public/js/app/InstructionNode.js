define(function () {
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

        calculateAcumLatency: function(){
            if(this.dependencies == []){
                return this.instr.getCycles();
            }
            else {
                var maxLatency = 0;
                for(var dep in dependencies) {
                    var aux = getAcumLatency
                    if(aux > maxLatency){
                        maxLatency = aux;
                    }
                }
                return (maxLatency + instr.getCycles());
            }
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