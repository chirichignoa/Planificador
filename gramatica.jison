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
           Instruccion_Aritmetica REGISTER","REGISTER","REGISTER Instruccion {var instructionId = "s" + instructionCounter;
								              instruction = new Instruction(instructionId, $2, [$4,$6], $1.instr, $1.type,instructionsCycles[$1.instr]);
									      stack.addInstruction(instruction);
									      instructionCounter++;}
         | Instruccion_Aritmetica REGISTER","REGISTER","REGISTER {var instructionId = "s" + instructionCounter;
								  instruction = new Instruction(instructionId, $2, [$4,$6], $1.instr, $1.type,instructionsCycles[$1.instr]);
								  stack.addInstruction(instruction);
								  instructionCounter++;}
         | Instruccion_Memoria REGISTER "," OFFSET "(" REGISTER ")" Instruccion {var instructionId = "s" + instructionCounter;
									         instruction = new Instruction(instructionId, $2, [$4,$6], $1.instr, $1.type,instructionsCycles[$1.instr]);
										 stack.addInstruction(instruction);
										 instructionCounter++;}
         | Instruccion_Memoria REGISTER "," OFFSET "(" REGISTER ")" {var instructionId = "s" + instructionCounter;
							             instruction = new Instruction(instructionId, $2, [$4,$6], $1.instr, $1.type,instructionsCycles[$1.instr]);
								     stack.addInstruction(instruction);
								     instructionCounter++;}
;

Instruccion_Aritmetica : Instruccion_Entera {$$.type = "arith_int"}
                        | Instruccion_PFlotante {$$.type = "arith_float"}
;

Instruccion_Entera : ADD {console.log("Gramat: ADD");
			  $$.instr = "ADD";}
		| SUB {console.log("Gramat: SUB");
			  $$.instr = "SUB";}
		| MUL {console.log("Gramat: MUL");
			  $$.instr = "MUL";}
		| DIV {console.log("Gramat: DIV");
			  $$.instr = "DIV";}
;

Instruccion_PFlotante : ADDF {console.log("Gramat: ADDF");
			      $$.instr = "ADDF";}
		    | SUBF {console.log("Gramat: SUBF");
			    $$.instr = "SUBF";}
		    | MULF {console.log("Gramat: MULF");
			    $$.instr = "MULF";}
		    | DIVF {console.log("Gramat: DIVF");
			    $$.instr = "DIVF";}
;

Instruccion_Memoria : Instruccion_Memoria_Entera {$$.type = "mem_int"}
         | Instruccion_Memoria_PFlotante {$$.type = "mem_float"}
;

Instruccion_Memoria_Entera : LD {console.log("Gramat: LD");
			         $$.instr = "LD";}
			| SD {console.log("Gramat: SD");
			         $$.instr = "SD";}
;

Instruccion_Memoria_PFlotante : LW {console.log("Gramat: LW");
			            $$.instr = "LW";}
		    	     | SW {console.log("Gramat: SW");
			           $$.instr = "SW";}
;
