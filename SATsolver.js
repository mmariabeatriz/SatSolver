exports.solve = function(fileName) {
    let formula = readFormula(fileName);
    let result = doSolve(formula.clauses, formula.variables);
    console.log(result);
    return result // two fields: isSat and satisfyingAssignment
};

//Muda os 0 e 1 para testar todas as possibilidades
function nextAssignment(variables) {
    for(let i=0; i<variables.length; i++){
        if (variables[i] === 0) {
            variables[i] = 1;
            i=variables.length;
        } else {
            variables[i] = 0;
            i=variables.length;
        }
    }
    return variables;
}

//retorna resultado do SAT
function doSolve(clauses, assignment) {
    let isSat = false;
    let cont=0;
    let testTotal=Math.pow(2, assignment.length);
    let clausulasE;
    let clausulasOU;
    while (!isSat && cont<testTotal) {
        clausulasE=false;
        for (let i = 0; i < clauses.length; i++) {
            clausulasOU=false;
            for(let j = 0; j < assignment.length && !clausulasOU; j++){
                for (let k = 0; k < clauses[j].length; k++) {
                    if (clauses[i][k]=j+1) {
                        clausulasOU = clausulasOU || assignment[j];
                    } else if (clauses[i][k]=-(k+1)) {
                        clausulasOU = clausulasOU || !assignment[j];
                    }
                }
            }
            clausulasE = clausulasE && clausulasOU;
        }
        if (clausulasE) {
            isSat=true;
        }else {
            assignment = nextAssignment(assignment);
        }
        cont++;
    }
    let result = {'isSat': isSat, satisfyingAssignment: null};
    if (isSat) {
        result.satisfyingAssignment = assignment;
    }
    return result
}

//Lê o arquivo e devolve um objeto com atributos clausulas e variaveis
function readFormula(fileName) {
    let fs = require('fs');
    let data = fs.readFileSync(fileName).toString();
    let text = data.split ('\n');// = ...  //  an array containing lines of text extracted from the file.
    let clauses = readClauses(text);
    let variables = readVariables(clauses);
    let specOk = checkProblemSpecification(text, clauses, variables);
    let result = { 'clauses': [], 'variables': [] };
    if (specOk) {
        result.clauses = clauses;
        result.variables = variables;
    }
    return result;
}

//Cria array de clausulas
function readClauses(text) {
    let clausulas = ""; //variavel que recebe todas as clausulas em uma string
    for (let i = 0; i < text.length; i++) {
        if (text[i].charAt(0) !== 'p' && text[i].charAt(0) !== 'c') {
            clausulas += ' '+text[i]; //add clausulas
        }
    }
    let arrayAux=[];
    let clausulasArray=clausulas.split(' 0');
    clausulasArray.pop(); //remove o ultimo elemento
    for(let i=0; i<clausulasArray.length;i++){
        arrayAux=clausulasArray[i].split(' ');
        arrayAux.shift(); //remove o primeiro elemento
        for(let j=0; j<arrayAux.length; j++){
            arrayAux[j]=parseInt(arrayAux);
        }
        clausulasArray[i]=arrayAux;
    }
    return clausulasArray;
}


//Cria array com qtd de variaveis
function readVariables(clauses) {
    let aux = 0; //guarda o maior valor
    let variaveisArray=[];
    for(let i = 0; i < clauses.length; i++){         //percorre o array
        for(let j = 0; j < clauses[i].length; j++) {
            if (Math.abs(clauses[i][j]) > aux) {
                aux = Math.abs(clauses[i][j]);
            }
        }
    }
    for (let i = 0; i < aux; i++) {
        variaveisArray[i] = 0;
    }
    return variaveisArray;
}

//Verifica clausulas e variaveis
function checkProblemSpecification(text, clauses, variables) {
    let p = "";
    for (let i = 0; i <text.length; i++) {
        if (text[i].charAt(0) === 'p') {
            p = text[i]; // se a linha se inicia por p, a string é salva no pLine.
            i = text.length;
        }
    }
    let pSeparado = p.split(' ');
    p = [parseInt(pSeparado[2]), parseInt(pSeparado[3])]; // salva apenas os valores referentes a qnt de variáveis e de clausulas, respectivamente.
    return p[0] === variables.length && p[1] === clauses.length;
}
