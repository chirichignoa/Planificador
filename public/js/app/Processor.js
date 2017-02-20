define(["Instruction","InstructionNode", "FunctionalUnits"], function (Instruction,InstructionNode, FunctionalUnits) {
    'use strict';

   function Processor(fu) {
        this.nodes = [];
        this.planned = [],
        this.terminals = [],
        this.criticalPath = [],
        this.functionalUnits = fu;        
    }

   Processor.prototype = (function () {
        return { 
            constructor: Processor,

            addNode: function (instruction) {
                var newNode = new InstructionNode(instruction); //sin cargar dependencias
                var arrDependencies = instruction.getDependencies();
                this.terminals.push(this.nodes.length);
                if(arrDependencies.length > 0) { //SI instruction tiene dependencias
                    for(var d in arrDependencies) {
                        for(var n in this.nodes){
                            if(arrDependencies[d] == this.nodes[n].getInstr()){
                                newNode.vinculateDependencies(n);
                                this.nodes[n].vinculateDependents(this.nodes.length);
                                this.removeNodeTerminals(n);
                                break;                                
                            }
                        }
                    }
                }
                else { //Si no tiene
                    this.planned.push(this.nodes.length); 
                }
                this.calculateAcumLatency(newNode);
                this.nodes.push(newNode);
            },

            calculateAcumLatency: function(node){
                if(node.getDependencies() == []){
                    node.setAcumLatency(0);
                }
                else {
                    var maxLatency = 0;
                    var dependencies = node.getDependencies();
                    for(var dep in dependencies) {
                        var aux = (this.nodes[dependencies[dep]]).getAcumLatency();
                        if(aux > maxLatency){
                            maxLatency = aux;
                        }
                    }
                    node.setAcumLatency(maxLatency);
                }
            },

            removeNodeTerminals: function (nodo) {
                var index = this.terminals.indexOf(nodo);
                if (index > -1) {
                    this.terminals.splice(index, 1);
                }
            },

            findMaxAcumLatency: function (arrNodes) {
                var max = 0, index = -1;
                for(var node in arrNodes) {
                    var indexNode = arrNodes[node];
                    if(indexNode < this.nodes.length){
                        var aux = this.nodes[indexNode].getAcumLatency();
                        if( aux > max) {
                            max = aux;
                            index = node;
                        }
                    }
                }
                return index;
            },

            generateCriticalPath: function (){
                var index = this.findMaxAcumLatency(this.terminals);
                var node, dependencies;
                if(index != -1){
                    node = this.nodes[this.findMaxAcumLatency(this.terminals)];
                }
                node.setCriticalPath();
                this.criticalPath.unshift(node);
                index = this.findMaxAcumLatency(node.getDependencies());
                while (index != -1){
                    dependencies = node.getDependencies();
                    node = this.nodes[dependencies[index]];
                    node.setCriticalPath();
                    this.criticalPath.unshift(node);
                    index = this.findMaxAcumLatency(node.getDependencies());
                }
                console.log("Camino critico: "+ this.criticalPath.length);
                this.printNodes();
            },           

            isFullyProcessed: function () {
                return this.planned.length == 0;
            },

            canRun: function (node) {
            //Verifica si una instruccion puede ejecutarse si sus dependencias estas ejecutadas
                var dependencies = node.getDependencies();
                if(dependencies.length > 0) {
                    for(i in dependencies) {
                        if(!(this.nodes[dependencies[i]]).getExecuted()) {//No puede ejecutarse
                            return false;
                        }
                    }
                }
                return true;
            }

            availableUF: function (type) {
                var ufMulti = -1;
                for(uf in this.functionalUnits) {
                    if(!this.functionalUnits[uf].isOccupied()) {  //No esta ocupada
                        if(this.functionalUnits[uf].getType() == "multi_type") { //Si  es multi
                            ufMulti = uf;
                        }
                        else {
                            if(this.functionalUnits[uf].getType() == type) { //Mismo tipo y libre se asigna
                                return uf;
                            }
                        }
                    }
                }
                return ufMulti;
            },

            unlockCC: function(instrCritical) {
                var index = -1;
                while (index != -1) { //Recursion
                    var dependencies = instrCritical.getDependencies();
                    if(dependencies.length > 0) {
                        for(var i in dependencies) {
                            var d = this.nodes[dependencies[i]];
                            if(!d.getExecuted()) { //Si no ha sido ejecutada
                                if(this.canRun(d)) { //Si se puede ejecutar
                                    if(this.availableUF(this.nodes[index].getInstr().getType()) != -1) { //Hay UF disponible
                                        return dependents[i];
                                    } 
                                }
                                else { //Entonces tiene dependencias no ejecutadas, recursionamos
                                    return unlockCC(d);
                                }
                            } 
                        }
                    }
                }
                return index;
            },

            run: function () {
                while (this.planned.length != 0) {
                    this.nextCycle();
                }
            },

            nextCycle: function () {
                var instrCritical = this.criticalPath[0];
                var UF = this.availableUF(instrCritical.getInstr().getType());
                if(this.canRun(instrCritical)) { //Se puede ejecutar 
                    if(UF != -1) { //Hay UF disponibles
                        ejecutarla
                    } 
                }
                else {
                    //Aca me complique porque hay que hacer la recursion en el metodo hasta encontrar un nodo a ejecutar
                    // y ademas habria que asegurarse de ese nodo pueda ser satisfecho con las UF disponibles**FUNDAMENTAL
                    // sino va a quedar ciclando como loco
                    var index = this.unlockCC(instrCritical);
                    if(index != -1) {
                        UF = this.availableUF(this.nodes[index].getInstr().getType());
                        if(UF != -1) {
                            ejecutarla
                        }
                    }
                }

                
                // Puede que salte todos los if y hasta aca no ejecute nada 
                //Depende de las UF que haya libres, las instr q se van a ejecutar aca, no simplemente la primera
                if( quedan mas UF libres) {
                    ejecutar las primeras de planned segun la #UF
                }
            }

            printNodes: function () {
                for(var node in this.nodes) {
                    console.log("///////////////////");
                    this.nodes[node].printInstructionNode();
                    console.log("///////////////////");
                }
            }
        }


    }
    )();

   return Processor;
});