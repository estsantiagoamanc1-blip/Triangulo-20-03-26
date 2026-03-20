document.addEventListener("DOMContentLoaded", () => {

/*========================
CONFIGURACIÓN
========================*/
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const mensaje = document.getElementById("mensaje");
const methodSelect = document.getElementById("method");

const inputs = ["x1","y1","x2","y2","x3","y3"]
    .map(id => document.getElementById(id));

const escala = 25;
const origenX = canvas.width / 2;
const origenY = canvas.height / 2;


/*========================
UTILIDADES
========================*/
const drawPoint = (x,y,size=3) =>
    ctx.fillRect(x - size/2, y - size/2, size, size);

const toCanvas = (x,y) => ({
    x: origenX + x * escala,
    y: origenY - y * escala
});

const esTriangulo = (x1,y1,x2,y2,x3,y3) =>
    (x1*(y2-y3) + x2*(y3-y1) + x3*(y1-y2)) !== 0;


/*========================
GRID
========================*/
function drawGrid(){

    ctx.clearRect(0,0,canvas.width,canvas.height);

    ctx.strokeStyle="#ddd";

    for(let i=0;i<=canvas.width;i+=escala){
        ctx.beginPath();
        ctx.moveTo(i,0);
        ctx.lineTo(i,canvas.height);
        ctx.moveTo(0,i);
        ctx.lineTo(canvas.width,i);
        ctx.stroke();
    }

    // ejes
    ctx.strokeStyle="black";
    ctx.lineWidth=2;

    ctx.beginPath();
    ctx.moveTo(0,origenY);
    ctx.lineTo(canvas.width,origenY);
    ctx.moveTo(origenX,0);
    ctx.lineTo(origenX,canvas.height);
    ctx.stroke();

    ctx.lineWidth=1;
}


/*========================
ALGORITMOS
========================*/
function drawDDA(x1,y1,x2,y2,size){
    const dx = x2-x1;
    const dy = y2-y1;

    const steps = Math.max(Math.abs(dx),Math.abs(dy));
    const xInc = dx/steps;
    const yInc = dy/steps;

    let x = x1, y = y1;

    for(let i=0;i<=steps;i++){
        drawPoint(Math.round(x),Math.round(y),size);
        x += xInc;
        y += yInc;
    }
}

function drawBresenham(x1,y1,x2,y2,size){
    let dx=Math.abs(x2-x1), dy=Math.abs(y2-y1);
    let sx = x1<x2?1:-1;
    let sy = y1<y2?1:-1;
    let err = dx-dy;

    while(true){
        drawPoint(x1,y1,size);
        if(x1===x2 && y1===y2) break;

        const e2 = err*2;

        if(e2>-dy){ err-=dy; x1+=sx; }
        if(e2<dx){ err+=dx; y1+=sy; }
    }
}

const drawLine = (x1,y1,x2,y2,size) =>
    methodSelect.value === "dda"
        ? drawDDA(x1,y1,x2,y2,size)
        : drawBresenham(x1,y1,x2,y2,size);


/*========================
DATOS
========================*/
function getData(){
    const values = inputs.map(i => parseFloat(i.value));
    if(values.some(isNaN)) return null;

    const [x1,y1,x2,y2,x3,y3] = values;
    return {x1,y1,x2,y2,x3,y3};
}


/*========================
MAIN
========================*/
function dibujar(){

    drawGrid();

    const data = getData();
    if(!data){
        mensaje.textContent = "Ingrese coordenadas válidas";
        return;
    }

    const {x1,y1,x2,y2,x3,y3} = data;

    const A = toCanvas(x1,y1);
    const B = toCanvas(x2,y2);
    const C = toCanvas(x3,y3);

    [A,B,C].forEach(p => drawPoint(p.x,p.y,8));

    if(esTriangulo(x1,y1,x2,y2,x3,y3)){
        mensaje.textContent = "✔ Forman triángulo";

        drawLine(A.x,A.y,B.x,B.y,3);
        drawLine(B.x,B.y,C.x,C.y,3);
        drawLine(C.x,C.y,A.x,A.y,3);

    } else {
        mensaje.textContent = "✖ No forman triángulo";
    }
}


/*========================
LIMPIAR
========================*/
function limpiar(){
    drawGrid();
    mensaje.textContent="";
}


/*========================
EXPORTAR
========================*/
window.dibujar = dibujar;
window.limpiar = limpiar;

drawGrid();

});