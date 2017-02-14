define(["Instruction", "Stack", "Processor", "FunctionalUnit", "Parser", "Graph", "UiManager", "jquery", "./libs/ace/ace", "./libs/ace/mode/assembly_x86", "./libs/ace/theme/tomorrow", "./libs/fullPage/jquery.fullPage", "./libs/notification/notification"], function (Instruction, stack, Processor, FunctionalUnit, Parser, Graph, UI, $, ace, mode, theme, fullpage, notification) {
    var editor = ace.edit("editor");
    editor.setTheme(theme);
    editor.getSession().setMode("./mode/assembly_x86");

    var UiManager = new UI("#cycle-counter-table", "#dispatcher-table", "#reserv-stations-table", "#functional-unities-table", "#rob-table");

    var reservationStationsSize = 0,
        dispatcherSize          = 0,
        functionalUnits         = [],
        instructionsCycles      = {};

    function addFunctionalUnits(type) {
        for(var i = 0; i < parseInt($("#"+type).val()); i++)
            functionalUnits.push(new FunctionalUnit(type));
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
        reservationStationsSize = 0;
        dispatcherSize = 0;
        functionalUnits = [];
        $('#keys-list').html('');
        $('#dependencies-list').html('');
    }

    function runParser(_parser, lines) {
        Parser.setInstructionsCycles(instructionsCycles);
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

            var lines = editor.getSession().doc.getAllLines();

            Parser.clearStack();
            initInstructionsCycles();

            if (runParser(Parser, lines)) {

                console.log("TAMANO DE LA PILA"+Parser.getStack().size());
                reset();
                graph = new Graph();

                dispatcherSize = parseInt($("#dispatcherSize").val());
                reservationStationsSize = parseInt($("#reservationStationSize").val());

                addFunctionalUnits("multi_type");
                addFunctionalUnits("arith_int");
                addFunctionalUnits("arith_float");
                addFunctionalUnits("mem_int");
                addFunctionalUnits("mem_float");

                if(functionalUnits.length > 0) {

                    FUTableHeader = generateTablesHeaders("UF", functionalUnits.length);
                    dispatcherTableHeader = generateTablesHeaders("D", dispatcherSize);
                    rsTableHeader = generateTablesHeaders("ER",reservationStationsSize);

                    $("#non-tables").alert("close");

                    UiManager.constructTables(dispatcherTableHeader, rsTableHeader, FUTableHeader);

                    var instr = Parser.getStack().getInstructions();
                    //cpu = new Processor(instr, dispatcherSize, reservationStationsSize, functionalUnits);

                    for (var i in instr) {
                        console.log("INSTRUCCION: "+instr[i].toString());
                        $("#keys-list").append("<li><pre>" + instr[i].getId() + ": " + instr[i].toString() + "</pre></li>");
                    }

                    for (var i in instr) {
                        graph.addNode(instr[i].getId(), i, instr.length);

                        var dependenciesRAW = instr[i].getDependencies();
                        var dependenciesWAW = instr[i].getDependenciesWAW();

                        if(dependenciesWAW.length == 0) { //La dependencia es solo RAW
                            for (var dependency in dependenciesRAW) {
                                $("#dependencies-list").append("<li><pre>" + instr[i].getId() + " depende de " + dependenciesRAW[dependency].getId() + " por " + dependenciesRAW[dependency].getWriteRegister() + "</pre></li>");
                                graph.addEdge(instr[i].getId(), dependenciesRAW[dependency].getId(),"#11BFAE");
                            }
                        }
                        else {
                            var drawWAW = false;
                            for (var dependency in dependenciesRAW) {
                                if(dependenciesRAW[dependency] != dependenciesWAW[0]) { //La dependencia es solo RAW 
                                    $("#dependencies-list").append("<li><pre>" + instr[i].getId() + " depende de " + dependenciesRAW[dependency].getId() + " por " + dependenciesRAW[dependency].getWriteRegister() + "</pre></li>");
                                    graph.addEdge(instr[i].getId(), dependenciesRAW[dependency].getId(),"#11BFAE");
                                }
                                else { //La dependencia entre las instr es RAW y WAW                           
                                    $("#dependencies-list").append("<li><pre>" + instr[i].getId() + " depende de " + dependenciesRAW[dependency].getId() + " por " + dependenciesRAW[dependency].getWriteRegister() + "</pre></li>");
                                    graph.addEdge(instr[i].getId(), dependenciesRAW[dependency].getId(),"#DFDF00");
                                    drawWAW = true;
                                }
                            }               
          
                            if(!drawWAW) { //La dependencia es solo WAW                                                                                       
                                $("#dependencies-list").append("<li><pre>" + instr[i].getId() + " depende de " + dependenciesWAW[0].getId() + " por " + dependenciesWAW[0].getWriteRegister() + "</pre></li>");
                                graph.addEdge(instr[i].getId(), dependenciesWAW[0].getId(),"#FF0018");
                            }
                        }
                    }

                    graph.draw($);
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
                cpu.nextCycle();
                UiManager.addRows(cpu.getCurrentCycle(), cpu.getDispatcherState(), cpu.getReservStationsState(), cpu.getFunctionalUnitsState(), cpu.getRobInstructions(), cpu.getRobStates());
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
