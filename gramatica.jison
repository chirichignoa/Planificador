/* lexical grammar */
%lex
%%

\s+                   /* skip whitespace */
"ADD" {return 'ADD';}
"ADDF" {return 'ADDF';}
"SUB" {return 'SUB';}
"SUBF" {return 'SUBF';}
"MUL" {return 'MUL';}
"MULF" {return 'MULF';}
"DIV" {return 'DIV';}
"DIVF" {return 'DIVF';}
"LD" {return 'LD';}
"LW" {return 'LW';}
"SD" {return 'SD';}
"SW" {return 'SW';}
"," {return ',';}
"(" {return '(';}
")" {return ')';}
[R-r][0-9]\d* {return 'REGISTER';}
[0-9]\d* {return 'OFFSET';}

/lex

%start Instruccion

%% /* language grammar */

Instruccion :
           Instruccion_Aritmetica REGISTER","REGISTER","REGISTER {var instructionId = "s" + instructionCounter;
								  instruction = new Instruction(instructionId, $2, [$4,$6], $1,type,instructionsCycles[$1]);
								  stack.addInstruction(instruction);
								  instructionCounter++;}
         | Instruccion_Memoria REGISTER "," OFFSET "(" REGISTER ")" {var instructionId = "s" + instructionCounter;
								    if(($1 == "LD") || ($1 == "LW")){
								        instruction = new Instruction(instructionId, $2, [$4,$6], $1,type,instructionsCycles[$1]);
								    }
								    else {
								        instruction = new Instruction(instructionId, $6, [$4,$2], $1,type,instructionsCycles[$1]);
								    }
								    stack.addInstruction(instruction);
								    instructionCounter++;}
;

Instruccion_Aritmetica : Instruccion_Entera {type = "arith_int";
					     $$ = $1;
					     if((!booleanFunctionalUnits[0]) && (!booleanFunctionalUnits[1])) {
						errorNoUF = true;
						$.notify({
							message: "No hay unidades funcionales de aritmética de enteros capas de satisfacer ciertas instrucciones ingresadas."
						},{
							type: 'danger'
						});
					     }}
                        | Instruccion_PFlotante {type = "arith_float";
					         $$ = $1;
					     if((!booleanFunctionalUnits[0]) && (!booleanFunctionalUnits[2])) {
						  errorNoUF = true;
						  $.notify({
							message: "No hay unidades funcional de aritmética de punto flotante capas de satisfacer ciertas instrucciones ingresadas."
						  },{
							type: 'danger'
						});
					     }}
;

Instruccion_Entera : ADD {console.log("Gramat: ADD");
			  $$ = "ADD";}
		| SUB {console.log("Gramat: SUB");
			  $$ = "SUB";}
		| MUL {console.log("Gramat: MUL");
			  $$ = "MUL";}
		| DIV {console.log("Gramat: DIV");
			  $$ = "DIV";}
;

Instruccion_PFlotante : ADDF {console.log("Gramat: ADDF");
			      $$ = "ADDF";}
		    | SUBF {console.log("Gramat: SUBF");
			    $$ = "SUBF";}
		    | MULF {console.log("Gramat: MULF");
			    $$ = "MULF";}
		    | DIVF {console.log("Gramat: DIVF");
			    $$ = "DIVF";}
;

Instruccion_Memoria : Instruccion_Memoria_Entera {type = "mem_int";
					         $$ = $1;
					    	 if((!booleanFunctionalUnits[0]) && (!booleanFunctionalUnits[3])) {
						        errorNoUF = true;
 							$.notify({
							message: "No hay unidades funcionales de Acceso a memoria para enteros capas de satisfacer ciertas instrucciones ingresadas."
						  },{
							type: 'danger'
						 });
					    	 }}
		    | Instruccion_Memoria_PFlotante {type = "mem_float";
						 $$ = $1;
					    	 if((!booleanFunctionalUnits[0]) && (!booleanFunctionalUnits[4])) {
						        errorNoUF = true;
 							$.notify({
							message: "No hay unidades funcionales de De acceso a memoria de punto flotante capas de satisfacer ciertas instrucciones ingresadas."
						  },{
							type: 'danger'
						 }); 
					     	 }}
;

Instruccion_Memoria_Entera : LD {console.log("Gramat: LD");
			         $$ = "LD";}
			| SD {console.log("Gramat: SD");
			         $$ = "SD";}
;

Instruccion_Memoria_PFlotante : LW {console.log("Gramat: LW");
			            $$ = "LW";}
		    	     | SW {console.log("Gramat: SW");
			           $$ = "SW";}
;
