var canvas;
var context;
var blackPeicePaths = {
	"king" 		: "resources/BlackCommandCenter.png",	
	"knight" 	: "resources/BlackHopper.png",	
	"queen" 	: "resources/BlackMothership.png",	
	"bishop" 	: "resources/BlackShuttle.png",	
	"pawn" 		: "resources/BlackSputnik.png",	
	"rook"		: "resources/BlackTurret.png"	
} 

var whitePeicePaths = {
	"king" 		: "resources/WhiteCommandCenter.png",	
	"knight" 	: "resources/WhiteHopper.png",	
	"queen" 	: "resources/WhiteMothership.png",	
	"bishop" 	: "resources/WhiteShuttle.png",	
	"pawn" 		: "resources/WhiteSputnik.png",	
	"rook"		: "resources/WhiteTurret.png"	
}

var highlighted = [
	[1,2],
	[4,6],
	[8,15],
	[0,0]
]

var pieces = []


function init(){

	pieces.push(new Piece(1,2,"king","black"));
	pieces.push(new Piece(0,0,"pawn","white"));
	pieces.push(new Piece(4,6,"queen","white"));
	pieces.push(new Piece(8,15,"bishop","black"));

	canvas = $("#canvas").get()[0];
	context = canvas.getContext("2d");

	// onclick function (IMPORTANT)
	canvas.addEventListener('click', function(event){
		var x = (event.pageX - canvas.offsetLeft) - canvas.width/2;
		var y = canvas.height/2 - (event.pageY- canvas.offsetTop);
		var r = Math.sqrt(x*x+y*y)
		var rad = parseInt(8 * r / rTotal); 
		var theta = -Math.atan2(y,-x) + (Math.PI);
		var angle = parseInt(theta / (Math.PI / 8))

		if(rad>8){
			rad = -1;
		}

		// console.log('('+x+','+y+')');
		// console.log(rad);
		// console.log(angle);

		highlightTile(rad,angle);

	});

	window.onresize = redraw;
	redraw();
}

function redraw(){
	canvas.width = window.innerWidth - 10;
	canvas.height = window.innerHeight -110;
	rTotal = Math.min(canvas.width,canvas.height)/2 - 35;
	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
		rTotal -= 50;
	}
	drawBoard();
	for(var i of highlighted){
		highlightTile(i[0],i[1]);
	}
	
	for(var i of pieces){
		i.draw();
	}
	
}

function highlightTile(rad, angle){
	if(rad > 0){
		drawTile(rad,angle,"rgba(0, 0, 139,0.5)");
	} else {
		context.beginPath()
		var r = rTotal / 8;
		context.arc(canvas.width/2,canvas.height/2,r,0,2*Math.PI);
		context.fillStyle = "rgba(0, 0, 139,0.5)"
		context.fill()
	}

}

function drawTile(rad, angle, color){
	var r1 =  rad * rTotal/8;
	var r2 =  (rad + 1) * rTotal/8;
	var theta = (-angle-1) * (Math.PI/8);

	context.beginPath();
	context.arc(canvas.width/2,canvas.height/2,r1,theta,Math.PI/8 + theta);
	context.arc(canvas.width/2,canvas.height/2,r2,Math.PI/8 + theta,theta,true);
	context.lineTo(canvas.width/2 + r1*Math.cos(theta),canvas.height/2 +r1*Math.sin(theta));
	context.closePath();
	context.fillStyle = color;
	context.fill();
	context.stroke();
}

function drawBoard(){
	console.log("drawing board")
	for (var j = 1; j < 8 ; j+=2) {
		for (var i = 0; i < 16; i+=2) {
			drawTile(j,i,"rosybrown");
			drawTile(j,i+1,"white")	;
		}
		for (var i = 0; i < 16; i+=2) {
			drawTile(j+1,i+1,"rosybrown");
			drawTile(j+1,i,"white");
		}
		
	}
	
}

// function onClick(event){
// 	var x = event.pageX - canvas.offsetLeft;
// 	var y = event.pageY- canvas.offsetTop;
// 	console.log("(")
// }

class Piece {
	
	constructor (rad, angle, pType, pColor){
		this.rad = rad;
		this.angle = angle;
		this.pType = pType;
		this.pColor = pColor;
	
	}

	draw(){
		console.log(this)
		var imgPath
		if(this.pColor == "black"){
			imgPath = blackPeicePaths[this.pType];
		}
		if(this.pColor == "white"){
			imgPath = whitePeicePaths[this.pType];
		}

		var img = new Image()
		var imageLoad = function(rad, angle){
			if(rad == 0){
				angle = 11.5
				rad = -0.5
			}
			context.save()
			var theta = (-angle-1) * (Math.PI/8) + Math.PI/16 - Math.PI/2;
			var r =  rad * rTotal/8 + 2;
			context.translate(canvas.width/2,canvas.height/2);
			context.rotate(theta);
			if(rad == 1){
				var imgHeight = rTotal/8 - 12;
			} else {
				var imgHeight = rTotal/8 - 4;
			}
			var imgWidth = (imgHeight/this.height) * this.width;
			context.drawImage(this,-imgWidth/2,r+2,imgWidth,imgHeight);
			context.restore();
		}
		img.src = imgPath;
		img.onload = imageLoad.bind(img, this.rad, this.angle)
			
	}
	
}

$(document).ready(init);