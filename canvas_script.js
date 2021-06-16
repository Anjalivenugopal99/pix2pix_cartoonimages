var canvas, ctx, saveButton, clearButton;
var pos = {x:0, y:0};
var rawImage;
const imgWidth = 256;
const imgHeight = 256;

tf.loadLayersModel('/model/kerasnewweb/model.json').then(function(model) {
    window.model = model;
  });
// await tf.setBackend('cpu');
tf.ready();
// const model = tf.loadLayersModel('/model/kerasweb/model.json');

function setPosition(e){
    pos.x = e.clientX-140;
    pos.y = e.clientY-100;
}
    
function draw(e) {
    if(e.buttons!=1) return;
    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'black';
    ctx.moveTo(pos.x, pos.y);
    setPosition(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    rawImage.src = canvas.toDataURL('image/png');
}
    
function erase() {
    ctx.fillStyle = "white";
    ctx.fillRect(0,0,450,450);
}

// function getAndAddImage(){
//     var imageNameArray = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
     
//     function getRandomNum(min, max){  
//         // generate and return a random number for the image to be displayed   
//         var imgNo = Math.floor(Math.random() * (max - min + 1)) + min;  
//         return imageNameArray[imgNo];  
//     }  
//     var randomLetter = getRandomNum(0, imageNameArray.length - 1);
//     var img_url = "./data/pics/A.png".replace('A',randomLetter);
    
//     // remove the previous images  
//     var images = document.getElementById('letterImg'); 
//     images.src = img_url;
//     images.setAttribute("letter",randomLetter);

// }
    
function save() {
    var raw = tf.browser.fromPixels(rawImage,3);
    var resized = tf.image.resizeBilinear(raw, [256,256]);
    var tensor = resized.expandDims(0);
    var tensor = tensor.div(127.5);
    var tensor = tensor.sub(1);
    
    const prediction = window.model.apply(tensor,{'training':true});
    
    const data = prediction.dataSync();

    var images = document.getElementById('letterImg'); 
    
    const canvas = document.createElement('canvas');
  canvas.width = imgWidth;
  canvas.height = imgHeight;
  const ctx = canvas.getContext('2d');
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);


  for (let i = 0; i < imgWidth * imgHeight; i += 1) {
    const j = i * 4;
    const k = i * 3;
    imageData.data[j + 0] = Math.floor(256 * data[k + 0]);
    imageData.data[j + 1] = Math.floor(256 * data[k + 1]);
    imageData.data[j + 2] = Math.floor(256 * data[k + 2]);
    imageData.data[j + 3] = 255;
  }
  ctx.putImageData(imageData, 0, 0);
  const dataUrl = canvas.toDataURL();

  images.src = dataUrl;
  images.style.width = 450;
  images.style.height = 450;


  
}
    
function init() {
    canvas = document.getElementById('canvas');
    console.log("after canvas");
    rawImage = document.getElementById('canvasimg');
    ctx = canvas.getContext("2d");
    ctx.fillStyle = "white";
    ctx.fillRect(0,0,450,450);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mousedown", setPosition);
    canvas.addEventListener("mouseenter", setPosition);
    document.addEventListener('mouseup', save);
    saveButton = document.getElementById('sb');
    saveButton.addEventListener("click", save);
    clearButton = document.getElementById('cb');
    clearButton.addEventListener("click", erase);
    //getAndAddImage();
}


function run() {
    
    console.log("before init");
    init();
    console.log("after init");

}
console.log("calling run");
run();
