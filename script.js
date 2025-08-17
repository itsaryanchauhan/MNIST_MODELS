const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
ctx.fillStyle = "black";
ctx.fillRect(0,0,canvas.width,canvas.height);

let drawing = false;
canvas.addEventListener("mousedown", () => drawing = true);
canvas.addEventListener("mouseup", () => drawing = false);
canvas.addEventListener("mouseleave", () => drawing = false);
canvas.addEventListener("mousemove", draw);

function draw(e) {
    if (!drawing) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, 2*Math.PI);
    ctx.fill();
}

function clearCanvas() {
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    document.getElementById("result").innerText = "";
}

// Load the model
let model;
(async () => {
    model = await tf.loadLayersModel('tfjs_model/model.json');
})();

async function predict() {
    if (!model) {
        alert("Model is loading...");
        return;
    }

    // Downscale to 28x28
    let tempCanvas = document.createElement('canvas');
    tempCanvas.width = 28;
    tempCanvas.height = 28;
    let tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(canvas, 0, 0, 28, 28);

    let data = tempCtx.getImageData(0,0,28,28).data;
    let grayscale = [];
    for(let i=0; i<data.length; i+=4){
        grayscale.push(data[i]/255); // red channel normalized
    }

    const input = tf.tensor4d(grayscale, [1,28,28,1]);
    const prediction = model.predict(input);
    const digit = prediction.argMax(1).dataSync()[0];

    document.getElementById("result").innerText = "Prediction: " + digit;
}
