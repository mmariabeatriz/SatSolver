//Muda os 0 e 1 para testar todas as possibilidades
function nextAssignment(variables) {
    stop=false;
    for(let i=variables.length-1; i>=0 && stop==false ; i--) {
        let aux=variables[i];
        if (aux==0) {
            variables[i]=true;
            stop=true;
        } else {
            variables[i]=false;
        }
    }
    return variables
}

//retorna resultado do SAT
function doSolve(clauses, assignment) {
    let isSat = false;
    let cont=0;
    let testTotal=Math.pow(2, assignment.length);
    let clausulasE;
    let clausulasOU;
    while ((!isSat) && cont<testTotal) {
        clausulasE=true;
        for (let i=0; i<clauses.length && clausulasE; i++) {
            clausulasOU=false;
            for(let j=0; j<assignment.length && !clausulasOU; j++){
                for (let k=0; k<clauses[i].length; k++) {
                    if (clauses[i][k]>0) {
                        clausulasOU = clausulasOU || assignment[j];
                    } else if (clauses[i][k]<0) {
                        clausulasOU = clausulasOU || !assignment[j];
                    }
                }
            }
            isSat = clausulasE && clausulasOU;
        }
        if (!isSat) {
           assignment=nextAssignment(assignment);
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
    let data = fs.readFileSync('./sat-master/' + fileName, "utf8");
    let text = data.split ('\n');
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
            clausulas += text[i]+' ' ; //add clausulas
        }
    }

    let arrayAux=[];
    arrayAux=clausulas.split(" 0");
    arrayAux.pop(); //remove o ultimo elemento

    return arrayAux;
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
        variaveisArray[i] = false;
    }
    return variaveisArray;
}

//Verifica clausulas e variaveis
function checkProblemSpecification(text, clauses, variables) {
    let p = "";
    for (let i = 0; i <text.length; i++) {
        if (text[i].charAt(0) === 'p') {
            p = text[i]; // se a linha se inicia por p, a string é salva em p
            i = text.length;
        }
    }
    let pSeparado = p.split(' ');
    p = [parseInt(pSeparado[2]), parseInt(pSeparado[3])]; // salva a qnt de variáveis e de clausulas
    return p[0] === variables.length && p[1] === clauses.length;

}

function solve(fileName){
    var formula = readFormula(fileName);
    return doSolve(formula.clauses, formula.variables);
}
console.log(solve('arquivo.cnf'));
