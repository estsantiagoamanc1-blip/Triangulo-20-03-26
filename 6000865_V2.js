// Esperar a que cargue el documento
document.addEventListener("DOMContentLoaded", function(){

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const escala = 25;
const origenX = canvas.width / 2;
const origenY = canvas.height / 2;


/*================================================
DIBUJAR UN PUNTO
ctx = contexto del canvas
x,y = coordenadas
size = tamaño del punto
================================================*/
function drawPoint(ctx, x, y, size) {
    ctx.fillRect(x - size/2, y - size/2, size, size);
}


/*================================================
CONVERTIR COORDENADAS CANVAS → CARTESIANAS
================================================*/
function canvasToCartesiana(p1, height) {
    return [p1.x, height - p1.y];
}


/*================================================
CONVERTIR CARTESIANAS → CANVAS
================================================*/
function cartesianToCanvas(x, y) {

    return {
        x: origenX + x * escala,
        y: origenY - y * escala
    };

}


/*================================================
DIBUJAR GRID Y EJES
================================================*/
function drawGrid(){

    ctx.clearRect(0,0,canvas.width,canvas.height);

    ctx.strokeStyle="#ddd";

    for(let x=0; x<canvas.width; x+=escala){
        ctx.beginPath();
        ctx.moveTo(x,0);
        ctx.lineTo(x,canvas.height);
        ctx.stroke();
    }

    for(let y=0; y<canvas.height; y+=escala){
        ctx.beginPath();
        ctx.moveTo(0,y);
        ctx.lineTo(canvas.width,y);
        ctx.stroke();
    }

    // Ejes principales
    ctx.strokeStyle="black";
    ctx.lineWidth=2;

    ctx.beginPath();
    ctx.moveTo(0,origenY);
    ctx.lineTo(canvas.width,origenY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(origenX,0);
    ctx.lineTo(origenX,canvas.height);
    ctx.stroke();

    ctx.lineWidth=1;

    // Numeración
    ctx.font="10px Arial";
    ctx.fillStyle="black";

    for(let i=-10;i<=10;i++){

        ctx.fillText(i, origenX + i*escala, origenY + 12);
        ctx.fillText(i, origenX + 4, origenY - i*escala);

    }
}


/*================================================
FUNCION GENERAL PARA DIBUJAR LINEAS
================================================*/
function drawLine(x1, y1, x2, y2, size, method){

    if(method==="dda"){
        drawDDA(x1,y1,x2,y2,size);
    }
    else{
        drawBresenham(x1,y1,x2,y2,size);
    }

}


/*================================================
ALGORITMO DDA
================================================*/
function drawDDA(x1,y1,x2,y2,size){

    let dx = x2-x1;
    let dy = y2-y1;

    let steps = Math.max(Math.abs(dx),Math.abs(dy));

    let xInc = dx/steps;
    let yInc = dy/steps;

    let x = x1;
    let y = y1;

    for(let i=0;i<=steps;i++){

        drawPoint(ctx,Math.round(x),Math.round(y),size);

        x += xInc;
        y += yInc;
    }

}


/*================================================
ALGORITMO BRESENHAM
================================================*/
function drawBresenham(x1,y1,x2,y2,size){

    let dx = Math.abs(x2-x1);
    let dy = Math.abs(y2-y1);

    let sx = (x1<x2)?1:-1;
    let sy = (y1<y2)?1:-1;

    let err = dx - dy;

    while(true){

        drawPoint(ctx,x1,y1,size);

        if(x1===x2 && y1===y2) break;

        let e2 = 2*err;

        if(e2>-dy){
            err -= dy;
            x1 += sx;
        }

        if(e2<dx){
            err += dx;
            y1 += sy;
        }

    }

}


/*================================================
VERIFICAR SI FORMAN TRIANGULO
================================================*/
function esTriangulo(x1,y1,x2,y2,x3,y3){

    let area =
        x1*(y2-y3) +
        x2*(y3-y1) +
        x3*(y1-y2);

    return area !== 0;

}


/*================================================
OBTENER DATOS DEL FORMULARIO
================================================*/
function obtenerDatos(){

    return {

        x1: parseFloat(document.getElementById("x1").value),
        y1: parseFloat(document.getElementById("y1").value),

        x2: parseFloat(document.getElementById("x2").value),
        y2: parseFloat(document.getElementById("y2").value),

        x3: parseFloat(document.getElementById("x3").value),
        y3: parseFloat(document.getElementById("y3").value)

    }

}


/*================================================
FUNCION PRINCIPAL
================================================*/
function dibujar(){

    drawGrid();

    let data = obtenerDatos();

    if(Object.values(data).some(v=>isNaN(v))){
        document.getElementById("mensaje").innerText="Ingrese coordenadas válidas";
        return;
    }

    let method = document.getElementById("method").value;

    let A = cartesianToCanvas(data.x1,data.y1);
    let B = cartesianToCanvas(data.x2,data.y2);
    let C = cartesianToCanvas(data.x3,data.y3);

    drawPoint(ctx,A.x,A.y,8);
    drawPoint(ctx,B.x,B.y,8);
    drawPoint(ctx,C.x,C.y,8);

    if(esTriangulo(data.x1,data.y1,data.x2,data.y2,data.x3,data.y3)){

        document.getElementById("mensaje").innerText="✔ Los puntos SI forman un triángulo";

        drawLine(A.x,A.y,B.x,B.y,3,method);
        drawLine(B.x,B.y,C.x,C.y,3,method);
        drawLine(C.x,C.y,A.x,A.y,3,method);

    }
    else{

        document.getElementById("mensaje").innerText="✖ Los puntos NO forman un triángulo";

    }

}


/*================================================
LIMPIAR CANVAS
================================================*/
function limpiar(){

    drawGrid();
    document.getElementById("mensaje").innerText="";

}


// Exponer funciones a botones HTML
window.dibujar = dibujar;
window.limpiar = limpiar;


// dibujar plano inicial
drawGrid();

});