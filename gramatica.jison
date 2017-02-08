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
           Instruccion_Aritmetica REGISTER","REGISTER","REGISTER Instruccion
         | Instruccion_Aritmetica REGISTER","REGISTER","REGISTER
         | Instruccion_Memoria REGISTER "," OFFSET "(" REGISTER ")" Instruccion
         | Instruccion_Memoria REGISTER "," OFFSET "(" REGISTER ")"
;

Instruccion_Aritmetica : Instruccion_Entera
                        | Instruccion_PFlotante
;

Instruccion_Entera : ADD {console.log("Gramat: ADD");}
		| SUB {console.log("Gramat: SUB");}
		| MUL {console.log("Gramat: MUL");}
		| DIV {console.log("Gramat: DIV");}
;

Instruccion_PFlotante : ADDF {console.log("Gramat: ADDF");}
		    | SUBF {console.log("Gramat: SUBF");}
		    | MULF {console.log("Gramat: MULF");}
		    | DIVF {console.log("Gramat: DIVF");}
;

Instruccion_Memoria : Instruccion_Memoria_Entera
         | Instruccion_Memoria_PFlotante
;

Instruccion_Memoria_Entera : LD {console.log("Gramat: LD");}
			| SD {console.log("Gramat: SD");}
;

Instruccion_Memoria_PFlotante : LW {console.log("Gramat: LW");}
		    	     | SW {console.log("Gramat: SW");}
;
