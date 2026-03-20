const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const SIZE = 4;

/*-------------------------------------------------------
 drawPoint
 Dibuja un punto en el canvas como un pequeño cuadrado.

 ctx  -> contexto del canvas
 x,y  -> coordenadas
 size -> tamaño del punto
-------------------------------------------------------*/
function drawPoint(ctx, x, y, size) {
    ctx.fillRect(x - size/2, y - size/2, size, size);
}


/*-------------------------------------------------------
 canvasToCartesiana

 Convierte coordenadas del canvas (origen arriba izquierda)
 al sistema cartesiano (origen abajo izquierda).
-------------------------------------------------------*/
function canvasToCartesiana(p1, height) {
    return [p1.x, height - p1.y];
}


/*-------------------------------------------------------
 drawAxes

 Dibuja los ejes X e Y y coloca marcas numéricas
 para identificar la posición en el plano.
-------------------------------------------------------*/
function drawAxes(){

    ctx.clearRect(0,0,canvas.width,canvas.height);

    ctx.strokeStyle="black";

    // eje X
    ctx.beginPath();
    ctx.moveTo(0, canvas.height/2);
    ctx.lineTo(canvas.width, canvas.height/2);
    ctx.stroke();

    // eje Y
    ctx.beginPath();
    ctx.moveTo(canvas.width/2,0);
    ctx.lineTo(canvas.width/2,canvas.height);
    ctx.stroke();

    ctx.font="10px Arial";
    ctx.fillStyle="black";

    for(let i=0;i<=canvas.width;i+=50){
        ctx.fillText(i-canvas.width/2, i, canvas.height/2+12);
    }

    for(let j=0;j<=canvas.height;j+=50){
        ctx.fillText(canvas.height/2-j, canvas.width/2+5, j);
    }
}


/*-------------------------------------------------------
 drawDDA

 Algoritmo DDA (Digital Differential Analyzer)

 Idea:
 - Se calcula dx y dy entre los puntos.
 - El número de pasos es el mayor valor entre |dx| y |dy|.
 - Se incrementa x e y en pequeños pasos fraccionarios.

 Ventaja: simple de implementar.
 Desventaja: usa números reales.
-------------------------------------------------------*/
function drawDDA(x1,y1,x2,y2,size){

    let dx = x2-x1;
    let dy = y2-y1;

    let steps = Math.max(Math.abs(dx), Math.abs(dy));

    let xinc = dx/steps;
    let yinc = dy/steps;

    let x=x1;
    let y=y1;

    for(let i=0;i<=steps;i++){

        drawPoint(ctx,x,y,size);

        x += xinc;
        y += yinc;
    }
}


/*-------------------------------------------------------
 drawBresenham

 Algoritmo de Bresenham

 Idea:
 - Usa únicamente operaciones enteras.
 - Calcula un parámetro de error.
 - Determina cuándo avanzar en Y mientras se avanza en X.

 Ventaja: más eficiente que DDA para gráficos raster.
-------------------------------------------------------*/
function drawBresenham(x1,y1,x2,y2,size){

    let dx = Math.abs(x2-x1);
    let dy = Math.abs(y2-y1);

    let sx = (x1 < x2) ? 1 : -1;
    let sy = (y1 < y2) ? 1 : -1;

    let err = dx - dy;

    while(true){

        drawPoint(ctx,x1,y1,size);

        if(x1 === x2 && y1 === y2) break;

        let e2 = 2*err;

        if(e2 > -dy){
            err -= dy;
            x1 += sx;
        }

        if(e2 < dx){
            err += dx;
            y1 += sy;
        }
    }
}


/*-------------------------------------------------------
 drawLine

 Función general que centraliza el trazado de líneas.
 Según el método seleccionado llama a:
 - DDA
 - Bresenham
-------------------------------------------------------*/
function drawLine(x1, y1, x2, y2, size, method) {

    if(method === "dda"){
        drawDDA(x1,y1,x2,y2,size);
    }
    else{
        drawBresenham(x1,y1,x2,y2,size);
    }
}


/*-------------------------------------------------------
 verificaTriangulo

 Determina si tres puntos forman un triángulo.

 Si el área del triángulo es 0 -> los puntos son colineales.
-------------------------------------------------------*/
function verificaTriangulo(x1,y1,x2,y2,x3,y3){

    let area = x1*(y2-y3) +
               x2*(y3-y1) +
               x3*(y1-y2);

    return area !== 0;
}


/*-------------------------------------------------------
 procesar

 Lee las coordenadas ingresadas,
 verifica si forman triángulo
 y dibuja los resultados en el canvas.
-------------------------------------------------------*/
function procesar(){

    drawAxes();

    let x1 = parseFloat(document.getElementById("x1").value);
    let y1 = parseFloat(document.getElementById("y1").value);

    let x2 = parseFloat(document.getElementById("x2").value);
    let y2 = parseFloat(document.getElementById("y2").value);

    let x3 = parseFloat(document.getElementById("x3").value);
    let y3 = parseFloat(document.getElementById("y3").value);

    let method = document.getElementById("method").value;

    drawPoint(ctx,x1,y1,SIZE);
    drawPoint(ctx,x2,y2,SIZE);
    drawPoint(ctx,x3,y3,SIZE);

    let esTriangulo = verificaTriangulo(x1,y1,x2,y2,x3,y3);

    if(esTriangulo){

        document.getElementById("resultado").innerHTML =
        "Los puntos SI forman un triángulo.";

        drawLine(x1,y1,x2,y2,SIZE,method);
        drawLine(x2,y2,x3,y3,SIZE,method);
        drawLine(x3,y3,x1,y1,SIZE,method);
    }
    else{

        document.getElementById("resultado").innerHTML =
        "Los puntos NO forman un triángulo (son colineales).";
    }
}


/*-------------------------------------------------------
 Inicialización
-------------------------------------------------------*/
drawAxes();