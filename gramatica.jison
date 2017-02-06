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
")" {return '(';}
[R-r][0-9]/d* {return 'REGISTER';}
[0-9]\d* {return 'NUMBER';}

/lex

%start Instruccion

%% /* language grammar */

Instruccion :
           Instruccion_Aritmetica Operando","Operando","Operando Instruccion
         | Instruccion_Aritmetica Operando","Operando","Operando {console.log("Instruccion");}
         | Instruccion_Memoria Operando "," Offset "(" Operando ")" Instruccion
         | Instruccion_Memoria Operando "," Offset "(" Operando ")"
         | Instruccion_Memoria Operando "," Operando Instruccion
         | Instruccion_Memoria Operando "," Operando
;

Instruccion_Aritmetica : Instruccion_Entera
                        | Instruccion_PFlotante
;

Instruccion_Entera : ADD {console.log("ADD");}
		| SUB {console.log("SUB");}
		| MUL {console.log("MUL");}
		| DIV {console.log("DIV");}
;

Instruccion_PFlotante : ADDF
		    | SUBF
		    | MULF
		    | DIVF
;

Instruccion_Memoria : Instruccion_Memoria_Entera
         | Instruccion_Memoria_PFlotante
;

Instruccion_Memoria_Entera : LD
			| SD
;

Instruccion_Memoria_PFlotante : LW
		    	     | SW
;

Operando: REGISTER;

Offset : NUMBER
;
