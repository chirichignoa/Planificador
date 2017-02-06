/* description: Parses end executes mathematical expressions. */

/* lexical grammar */
%lex
%%

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
[0-9]\d* {return 'NUMBER';}
[R-r][0-9]\d* {return 'REGISTER';}
<<EOF>> {return 'EOF';}

/lex

%start instruccion

%% /* language grammar */

instruccion : 
           Instruccion_Aritmetica operando ‘,’ operando ‘,’ operando instruccion
         | Instruccion_Aritmetica operando ‘,’ operando ‘,’ operando EOF
         | Instruccion_Mem operando ‘,’ offset ‘(‘ operando ‘)’ instruccion
         | Instruccion_Mem operando ‘,’ offset ‘(‘ operando ‘)’ EOF
         | Instruccion_Mem operando ‘,’ operando instruccion
         | Instruccion_Mem operando ‘,’ operando EOF
;

Instruccion_Aritmetica : instruc_entera
			    		| instruc_pflotante 
;

instruc_entera : ADD {console.log("ADD");}
		| SUB
		| MUL
		| DIV
;

instruc_pflotante : ADDF
		    | SUBF
		    | MULF
		    | DIVF
;

instruccion_Mem : instruc_Mem_entera
         | instruc_Mem_pflotante 
;

instruc_Mem_entera : LD
			| SD
;

instruc_Mem_pflotante : LW
		    	     | SW
;	

operando : REGISTER
;

offset : NUMBER
;
