define(["Instruction", "Stack", "Processor", "FunctionalUnit", "Parser", "Graph", "UiManager", "jquery", "./libs/ace/ace", "./libs/ace/mode/assembly_x86", "./libs/ace/theme/tomorrow", "./libs/fullPage/jquery.fullPage", "./libs/notification/notification"], function (Instruction, stack, Processor, FunctionalUnit, Parser, Graph, UI, $, ace, mode, theme, fullpage, notification) {
    var editor = ace.edit("editor");
    editor.setTheme(theme);
    editor.getSession().setMode("./mode/assembly_x86");

    var UiManager = new UI("#cycle-counter-table", "#planned-table", "#choosed-table");

    var functionalUnits         = [], 
        booleanFunctionalUnits  = [], 
        instructionsCycles      = {};
 

    function addFunctionalUnits(type,number) {
        booleanFunctionalUnits[number] = false;
        for(var i = 0; i < parseInt($("#"+type).val()); i++) {
            functionalUnits.push(new FunctionalUnit(type));
            if(booleanFunctionalUnits[number] == false) {
                booleanFunctionalUnits[number] = true;
            }
        }
    }

    function initFunctionalUnits() {     
        addFunctionalUnits("multi_type",0);
        addFunctionalUnits("arith_int",1);
        addFunctionalUnits("arith_float",2);
        addFunctionalUnits("mem_int",3);
        addFunctionalUnits("mem_float",4);
    }

    function initInstructionsCycles(){
      instructionsCycles["ADD"] = parseInt($("#addCycles").val());
      instructionsCycles["ADDF"] = parseInt($("#addfCycles").val());
      instructionsCycles["SUB"] = parseInt($("#subCycles").val());
      instructionsCycles["SUBF"] = parseInt($("#subfCycles").val());
      instructionsCycles["MUL"] = parseInt($("#mulCycles").val());
      instructionsCycles["MULF"] = parseInt($("#mulfCycles").val());
      instructionsCycles["DIV"] = parseInt($("#divCycles").val());
      instructionsCycles["DIVF"] = parseInt($("#divfCycles").val());
      instructionsCycles["LD"] = parseInt($("#ldCycles").val());
      instructionsCycles["LW"] = parseInt($("#lwCycles").val());
      instructionsCycles["SD"] = parseInt($("#sdCycles").val());
      instructionsCycles["SW"] = parseInt($("#swCycles").val());
    }

    function generateTablesHeaders(str, number) {
        headers = [];
        for(var i = 0; i < number; i++)
            headers [i] = str + i;
        return headers;
    }

    function reset() {
        Parser.reset();
        functionalUnits = [];
        $('#keys-list').html('');
        $('#dependencies-list').html('');
    }

    function runParser(_parser, lines) {
        Parser.setConfig(instructionsCycles,booleanFunctionalUnits);
        try {
            for (var i = 0; i < lines.length; i++)
                _parser.parse(lines[i]);
            return true;
        }
        catch(e) {
            return false;
        }
    }

    $(document).ready(function () {

        $("#about").click(function(){
            $.notify({
                    message: "Trabajo final de cátedra de <i>Arquitectura de Computadoras y Técnicas Digitales</i>. Implementado por <strong>Tomás Juárez</strong> y <strong>Guillermo Pacheco</strong>, a cargo de los docentes <strong>Ing. Martín Menchón</strong> e <strong>Ing. Marcerlo Tosini</strong>."
                },{
                    type: 'success'
            });
        });

        $('#fullpage').fullpage({
            menu: '#header',
            anchors:['firstPage', 'secondPage', 'thirdPage'],
            scrollingSpeed: 1000
        });

        var cpu;
        var graph;

        $("#init").click(function(){

            reset();
            var lines = editor.getSession().doc.getAllLines();
            initInstructionsCycles();
            initFunctionalUnits();

            if (runParser(Parser, lines)) {

                graph = new Graph();

                if((functionalUnits.length > 0) && (!Parser.getErrorNoUF())) {

                    $("#non-tables").alert("close");

                    UiManager.constructTables();

                    var instr = Parser.getStack().getInstructions();
                    cpu = new Processor(functionalUnits);

                    for (var i in instr) {
                        $("#keys-list").append("<li><pre>" + instr[i].getId() + ": " + instr[i].toString() + "</pre></li>");
                        cpu.addNode(instr[i]);

                        graph.addNode(instr[i].getId(), i, instr.length);

                        var dependencies = instr[i].getDependencies();
                        for (var dependency in dependencies) {
                            $("#dependencies-list").append("<li><pre>" + instr[i].getId() + " depende de " + dependencies[dependency].getId() + " por " + dependencies[dependency].getWriteRegister() + "</pre></li>");
                            
                            graph.addEdge(instr[i].getId(), dependencies[dependency].getId());
                        }
                    }

                    graph.draw($);
                    cpu.generateCriticalPath();
                    cpu.run();
                }
                else {
                     $.notify({
                        message: "Debes establecer al menos una unidad funcional para ejecutar las instrucciones."
                    },{
                        type: 'warning'
                    });
                }
            }
            else {
                $.notify({
                    message: "<strong>:'(</strong> ocurrió un error durante la etapa de parsing. Por favor, revisa tus instrucciones."
                },{
                    type: 'danger'
                });

            }
        });


        $("#nextCycle").click(function () {
            if(!cpu.isFullyProcessed()) {
                //UiManager.addRows(cpu.getCurrentCycle(), cpu.getDispatcherState(), cpu.getReservStationsState(), cpu.getFunctionalUnitsState(), cpu.getRobInstructions(), cpu.getRobStates());
            }
            else {
                $.notify({
                    message: "<strong>:D</strong> La ejecución de las instrucciones fueron completadas con éxito."
                },{
                    type: 'success'
                });
            }

        });

    });
});
