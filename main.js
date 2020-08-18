// Path find algorith
// copyright The Coding Train Chanel for youtube.com

/* f(n) = g()n + h(n)
    f = função de procura;
    g = caminho atual;
    h = hipotese de caminho;
*/

//remove elemnto da matriz caso seja um caminho invalido;
function removeFromArray(arr, elt) {
    for (var i = arr.length - 1; i >= 0; i--) {
        if (arr[i] == elt) {
            arr.splice(i, 1);//deleta o elemento e quantos a partir dele
        }
    }
}

function heuristic(a, b) {//calcula a hipose mais curta
    var distancia = dist(a.i, a.j, b.i, b.j);//pega a casa atual e o final;
    //var distancia = abs(a.i - b.i) + abs(a.j - b.j);
    return distancia;
}

var cols = 100;// determina colunas;
var rows = 100;// determina linhas
var grid = new Array(cols); // cria tebela


var openSet = [];// determina os avlores possiveis do caminho;
var closeSet = [];// retira os valores impossiveis;

var start;
var end;
var w, h;//altura e largura de nossa tela;
var path = [];//caminho


function Spot(i, j) {
    this.i = i;
    this.j = j;
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.neighbors = [];//vizinhos
    this.previus = undefined;
    this.wall = false;//parede;
    this.res = (random(1) < 0.5);

    if (this.res) {//soerteia uma parede
        // console.log(this.res);
        this.wall = true;//posiciona o valor da casa como verdadeiro
    }

    this.show = function (col) {//printa a tabela
       // fill(col);
        if (this.wall) {//verifica se a casa estiver como verdade
            fill(0);//pinta a casa de preto
            noStroke();
           // ellipse(this.i * w + w / 2, this.j * h + h / 2, w / 2, h / 2);
           rect(i * w, j * h, w - 1, h - 1);
        }
        
    }

    this.addNeighbors = function (grid) {//verifica as casas vizinhas
        var i = this.i;
        var j = this.j;
        if (i < cols - 1) {
            this.neighbors.push(grid[i + 1][j]);
        }
        if (i > 0) {
            this.neighbors.push(grid[i - 1][j]);
        }
        if (j < rows - 1) {
            this.neighbors.push(grid[i][j + 1]);
        }
        if (j > 0) {
            this.neighbors.push(grid[i][j - 1]);
        }
        if (i > 0 && j > 0) {
            this.neighbors.push(grid[i - 1][j - 1]);
        }
        if (i < cols - 1 && j > 0) {
            this.neighbors.push(grid[i + 1][j - 1]);
        }
        if (i > 0 && j < rows - 1) {
            this.neighbors.push(grid[i - 1][j + 1]);
        }
        if (i < cols - 1 && j < rows - 1) {
            this.neighbors.push(grid[i + 1][j + 1]);
        }
    }


}

function setup() {
    // idcializa os valores de tabela;
    createCanvas(400, 400);
    //console.log('A*');

    //divide o numero deculunas pelo tamanho da tela
    w = width / cols;
    h = height / rows;


    // Matriz 2D
    for (var i = 0; i < cols; i++) {
        grid[i] = new Array(rows);
    }
   // console.log(grid);

    //determina a posição do ponteiro da matriz
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            grid[i][j] = new Spot(i, j);//declara a clase Spot(local)
        }
    }
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            grid[i][j].addNeighbors(grid);
        }
    }

    start = grid[0][0];
    end = grid[cols - 1][rows - 1];
    start.wall = false;
    end.wall = false;
    openSet.push(start);//posiciona na primenira casa 
}


function draw() {
    //desenha a tela com uma biblioteca <https://cdn.jsdelivr.net/npm/p5@1.1.4/lib/p5.min.js>

    if (openSet.length > 0) {//se a casa estiver caminhos vai rodar
        //vai rodar

        var winner = 0;
        for (var i = 0; i < openSet.length; i++) {
            if (openSet[i].f < openSet[winner].f) {
                winner = i;//
            }
        }
        var current = openSet[winner];

        if (current === end) {//se a casa for a de destino acabou aqui

            noLoop();
            console.log("Deu certo o fim");
        }

        removeFromArray(openSet, current);//remove a casa da lista pra visitar;
        closeSet.push(current);//adiciona a casa em ja visitadas

        var neighbors = current.neighbors;// procurando um caminho
        for (var i = 0; i < neighbors.length; i++) {
            var neighbor = neighbors[i];

            if (!closeSet.includes(neighbor) && !neighbor.wall) {//se for uma casa diferente de vizitada adciona ao local
                var tempG = current.g + 1;                      //ou se a casa for de valor verdairo(preta)

                var newPath = false;
                if (openSet.includes(neighbor)) {
                    if (tempG < neighbor.g) {
                        neighbor.g = tempG;
                        newPath = true;
                    }
                } else {
                    neighbor.g = tempG;
                    openSet.push(neighbor);
                    newPath = true;
                }

                if (newPath) {

                    neighbor.h = heuristic(neighbor, end);

                    neighbor.f = neighbor.g + neighbor.h;
                    neighbor.previus = current;
                }
            }

        }

    } else {
        console.log("sem solução né");

        noLoop();
        //sem soslução
        return;
    }
    
    background(255);
    

    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            grid[i][j].show(color(255));//desenha tabela
        }
    }

    for (var i = 0; i < closeSet.length; i++) {//marca as casas que ja foram visitadas
        //closeSet[i].show(color(255, 0, 0));
    }

    for (var i = 0; i < openSet.length; i++) {//marca as casas vizinhas
       // openSet[i].show(color(0, 255, 0));
    }


    //mostra ao caminho e esta sendo percorrido
    path = [];
    var temp = current;
    path.push(temp);
    while (temp.previus) {
        path.push(temp.previus);
        temp = temp.previus;
    }


    for (var i = 0; i < path.length; i++) {//marca o caminho
        //  path[i].show(color(0, 0, 255));
    }


    noFill();
    stroke(255, 0, 255);
    strokeWeight(w / 2);
    beginShape();
    for (var i = 0; i < path.length; i++) {
        vertex(path[i].i * w + w / 2, path[i].j * h + h / 2);
    }
    endShape();


}