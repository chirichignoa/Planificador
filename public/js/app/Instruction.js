define(function () {
    'use strict';

    function Instruction(id, writeReg, readRegs, str, type, cycles) {
        this.instructionId = id;
        this.writeRegister = writeReg;
        this.readRegisters = [].concat(readRegs);
        this.dependencies = [];
        this.instructionString = str;
        this.type = type;
        this.cycles = cycles; //NUEVO
        console.log("CREANDOSE INSTRUCCION");
        this.execute = false;
    }

    var countDependencies = function (dependencies) {  //Devuelve la cantidad de dependencias
        var size = 0, key;
        for (key in dependencies) {
            if (dependencies.hasOwnProperty(key))
                size++;
        }
        return size;
    };

    //public methods.
    Instruction.prototype = (function () {

        return {
            constructor: Instruction,

            getWriteRegister: function () {
                return this.writeRegister;
            },

            getOperands: function () {
                return this.readRegisters;
            },

            getId: function () {
                return this.instructionId;
            },

            depends: function (anotherInstruction) {     //Este mira si algunos de los reg de lectura se estan por escribir en otra instruc
                this.readRegisters.some(function (element) {
                    return (element == anotherInstruction.getWriteRegister());
                });
            },

            sameOperands: function () {
                var same = false,
            previousReg;
                this.readRegisters.some(function (register) {
                    if (previousReg && previousReg == register)
                        same = true;

                    previousReg = register;
                });
                return same;
            },

            registerExistsInDependency: function (register) { //Si el registro tiene alguna dependencia
                for (var key in this.dependencies)
                    if (this.dependencies[key] == register)
                        return true;
                return false;
            },

            setDependency: function (anotherInstruction) {
                var writeRegister = anotherInstruction.getWriteRegister(); ;

                for (var i = 0; i < this.readRegisters.length; i++)
                    if (countDependencies(this.dependencies) == 0) {
                        if (this.readRegisters[i] == writeRegister) {
                            this.dependencies.push(anotherInstruction);
                            break;
                        }
                    }
                    else {
                        if (countDependencies(this.dependencies) < 2 && !this.sameOperands())
                            console.log("DEPENDENCIA POR " + this.dependencies[0].getWriteRegister());
                            if (anotherInstruction.getWriteRegister() != this.dependencies[0].getWriteRegister() && this.readRegisters[i] == writeRegister) {
                                this.dependencies.push(anotherInstruction);
                                break;
                            }
                    }

            },

            dependencyExists: function (anotherId) {
                return (anotherId in this.dependencies);
            },

            getDependencies: function () {
                return this.dependencies;
            },

            getRegistersInDependency: function (anotherInstruction) {
                return this.dependencies[anotherInstruction];
            },

            hasDependencies: function () {
                return (this.countDependencies(this.dependencies) > 0) ? true : false;
            },

            toString: function () {
                return this.instructionString;
            },

            getType: function () {
                return this.type;
            },

            getCycles: function () { //NUEVO
                return this.cycles;
            },

            isExecute: function () {
                return this.execute;
            },

            setExecute: function () {
                this.execute = true;
            }

        }
    })();

    return Instruction;

});