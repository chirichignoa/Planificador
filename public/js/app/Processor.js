define(["Instruction","InstructionNode", "FunctionalUnit"], function (Instruction,InstructionNode, FunctionalUnit) {
    'use strict';

   function Processor(fu) {
        this.nodes = [];
        this.planned = [],
        this.terminals = [],
        this.criticalPath = [],
        this.functionalUnits = fu;  
        this.availablesUF = fu.length;
        this.currentCycle = 0;      
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
                //this.printNodes();
            },           

            isFullyProcessed: function () {
                return this.planned.length == 0;
            },

            canRun: function (node) {
            //Verifica si una instruccion puede ejecutarse si sus dependencias estas ejecutadas
                console.log("Verificando si puedo ejecutar");
                var dependencies = node.getDependencies();
                if(dependencies.length > 0) {
                    for(var i in dependencies) {
                        if(!(this.nodes[dependencies[i]]).getExecuted()) {//No puede ejecutarse
                            return false;
                        }
                    }
                }
                return true;
            },

            availableUF: function(type) {
                console.log("Buscando UF");
                var ufMulti = -1;
                for(var uf in this.functionalUnits) {
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
                console.log("Desbloqueando CC");
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
                    if(this.currentCycle > 0) {
                        for(var fu in this.functionalUnits) {
                            if(functionalUnits[fu].nextCycle()) {
                                availablesUF +=1;
                            }
                        }
                        this.currentCycle += 1;
                        console.log("Ciclo numero: "+ this.currentCycle);
                    }
                    this.nextCycle();
                }
            },

            updatePlanned: function (index) {
                console.log("Actualizando planned");
                var dependents = this.nodes[this.planned[index]].getDependents(); //obtengo sus dependientes
                for (var d in dependents) {
                    if(this.canRun(this.nodes[dependents[d]])) {
                        this.planned.push(d); //agregamos a planificables
                    }
                }
                this.planned.splice(index,1); //saco la instr ejecutada
            },

            nextCycle: function () {
                var instrCritical = this.criticalPath[0];
                var fu = this.availableUF(instrCritical.getInstr().getType());
                if(this.canRun(instrCritical)) { //Se puede ejecutar 
                    if(fu != -1) { //Hay UF disponibles
                        console.log("Ejecutando instruccion del CC");
                        this.functionalUnits[fu].execute(instrCritical);
                        this.availablesUF -= 1;
                        var indexNodes = this.nodes.indexOf(instrCritical);
                        this.nodes[indexNodes].setExecuted();
                        this.updatePlanned(this.planned.indexOf(this.nodes.indexOf(instrCritical)));
                        this.criticalPath.splice(0,1);
                    } 
                }
                else {
                    //Aca me complique porque hay que hacer la recursion en el metodo hasta encontrar un nodo a ejecutar
                    // y ademas habria que asegurarse de ese nodo pueda ser satisfecho con las UF disponibles**FUNDAMENTAL
                    // sino va a quedar ciclando como loco
                    var index = this.unlockCC(instrCritical);
                    if(index != -1) {
                        fu = this.availableUF(this.nodes[index].getInstr().getType());
                        if(fu != -1) {
                            console.log("Ejecutando para destrabar el CC");
                            this.functionalUnits[fu].execute(this.nodes[index].getInstr());
                            this.availablesUF -= 1;
                            this.nodes[index].setExecuted();
                            updatePlanned(this.planned.indexOf(index)); 
                        }
                    }
                }
                // Puede que salte todos los if y hasta aca no ejecute nada 
                //Depende de las UF que haya libres, las instr q se van a ejecutar aca, no simplemente la primera
                if(this.availablesUF > 0) {
                    var fu = this.functionalUnits.length - 1;
                    while(fuCount >= 0){
                        if(!(this.functionalUnits[fu].isOccupied())){
                            for(var instr in this.planned){
                                var possibleInstruction = this.planned[instr].getInstr();
                                if( (possibleInstruction.getType() == this.functionalUnits[fu].getType()) || (possibleInstruction.getType() == "multi_type") ){
                                    console.log("Hay mas UFs libres y encontre instruccion para dicha UF.");
                                    this.functionalUnits[fu].execute(this.planned[instr].getInstr());
                                    this.availablesUF -= 1;
                                    this.nodes[this.planned[instr]].setExecuted();
                                    updatePlanned(instr);
                                    break;
                                }
                            }
                        }
                        uf--;
                    }
                }
            },

            printNodes: function () {
                for(var node in this.nodes) {
                    console.log("///////////////////");
                    this.nodes[node].printInstructionNode();
                    console.log("///////////////////");
                }
            },
        }


    }
    )();

   return Processor;
});