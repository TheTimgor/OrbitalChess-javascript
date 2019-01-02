var canvas;
var context;
var blackPiecePaths = {
	"king" 		: "resources/BlackCommandCenter.png",	
	"knight" 	: "resources/BlackHopper.png",	
	"queen" 	: "resources/BlackMothership.png",	
	"bishop" 	: "resources/BlackShuttle.png",	
	"pawn" 		: "resources/BlackSputnik.png",	
	"rook"		: "resources/BlackTurret.png"	
} 

var whitePiecePaths = {
	"king" 		: "resources/WhiteCommandCenter.png",	
	"knight" 	: "resources/WhiteHopper.png",	
	"queen" 	: "resources/WhiteMothership.png",	
	"bishop" 	: "resources/WhiteShuttle.png",	
	"pawn" 		: "resources/WhiteSputnik.png",	
	"rook"		: "resources/WhiteTurret.png"	
}

var highlighted = []

var pieces = []

var selected = '';

var move = 0;
var currentPlayer = 'white'

function init(){

	pieces.push(new Piece(8,3,"king","black"));
	pieces.push(new Piece(8,4,"queen","black"));
	pieces.push(new Piece(8,5,"rook","black"));
	pieces.push(new Piece(8,2,"rook","black"));
	pieces.push(new Piece(7,3,"bishop","black"));
	pieces.push(new Piece(7,4,"bishop","black"));
	pieces.push(new Piece(6,3,"knight","black"));
	pieces.push(new Piece(6,4,"knight","black"));
	pieces.push(new Piece(8,1,"pawn","black"));
	pieces.push(new Piece(7,2,"pawn","black"));
	pieces.push(new Piece(6,2,"pawn","black"));
	pieces.push(new Piece(5,3,"pawn","black"));
	pieces.push(new Piece(5,4,"pawn","black"));
	pieces.push(new Piece(6,5,"pawn","black"));
	pieces.push(new Piece(7,5,"pawn","black"));
	pieces.push(new Piece(8,6,"pawn","black"));
	
	pieces.push(new Piece(8,12,"king","white"));
	pieces.push(new Piece(8,11,"queen","white"));
	pieces.push(new Piece(8,5+8,"rook","white"));
	pieces.push(new Piece(8,2+8,"rook","white"));
	pieces.push(new Piece(7,3+8,"bishop","white"));
	pieces.push(new Piece(7,4+8,"bishop","white"));
	pieces.push(new Piece(6,3+8,"knight","white"));
	pieces.push(new Piece(6,4+8,"knight","white"));
	pieces.push(new Piece(8,1+8,"pawn","white"));
	pieces.push(new Piece(7,2+8,"pawn","white"));
	pieces.push(new Piece(6,2+8,"pawn","white"));
	pieces.push(new Piece(5,3+8,"pawn","white"));
	pieces.push(new Piece(5,4+8,"pawn","white"));
	pieces.push(new Piece(6,5+8,"pawn","white"));
	pieces.push(new Piece(7,5+8,"pawn","white"));
	pieces.push(new Piece(8,6+8,"pawn","white"));
	

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
		
		if(selected == '' && typeof pieceAt(rad,angle) !== 'undefined'){
			if(pieceAt(rad,angle).pColor == currentPlayer){
				selected = pieceAt(rad,angle);
			}
		} else if(isMoveLegal(rad,angle,selected) ){
			var index = pieces.indexOf(pieceAt(rad, angle));
			if (index !== -1) pieces.splice(index, 1);
			selected.move(rad,angle);
			selected = '';
			move++;
			if(currentPlayer=='white'){
				currentPlayer = 'black';
			} else {
				currentPlayer = 'white';
			}
		}

		console.log(selected);

		redraw();

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

	drawTile(rad,angle,"rgba(0, 0, 139,0.5)");

}

function drawTile(rad, angle, color){

	if(rad > 0){
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

	} else if(rad == 0){
		context.beginPath()
		var r = rTotal / 8;
		context.arc(canvas.width/2,canvas.height/2,r,0,2*Math.PI);
		context.fillStyle = color
		context.fill()
		context.stroke();
	}
}

function drawBoard(){
	console.log("drawing board")
	for (var j = 1; j < 8 ; j+=2) {
		for (var i = 0; i < 16; i+=2) {
			drawTile(j,i,"wheat");
			drawTile(j,i+1,"rosybrown")	;
		}
		for (var i = 0; i < 16; i+=2) {
			drawTile(j+1,i+1,"wheat");
			drawTile(j+1,i,"rosybrown");
		}
		
	}
	drawTile(0,0,"wheat")
	
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

	move(rad, angle){
		this.rad = rad;
		this.angle = angle;
	}

	draw(){
		// console.log(this)
		var imgPath
		if(this.pColor == "black"){
			imgPath = blackPiecePaths[this.pType];
		}
		if(this.pColor == "white"){
			imgPath = whitePiecePaths[this.pType];
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

function pieceAt(rad,angle){
	function matchesCoords(p){
		if(rad == 0 ){
			return p.rad == 0;
		}
		return p.rad == rad && p.angle == angle;
	}
	return pieces.filter(matchesCoords)[0];

}

function isMoveLegal(rad,angle,piece){
	var moveTypes = {
		"pawn" : function(rad,angle,piece){
			console.log("checking for pawn")
			if(typeof pieceAt(rad, angle) !== 'undefined'){
				console.log(pieceAt(rad, angle).pColor);
				console.log(piece.pColor);
				if(pieceAt(rad, angle).pColor == piece.pColor){
					return false;
				}
			}
			return true;
		},
		"king" : function(rad,angle,piece){
			console.log("checking for pawn")
			if(typeof pieceAt(rad, angle) !== 'undefined'){
				console.log(pieceAt(rad, angle).pColor);
				console.log(piece.pColor);
				if(pieceAt(rad, angle).pColor == piece.pColor){
					return false;
				}
			}
			return true;
		},
		"knight" : function(rad,angle,piece){
			console.log("checking for pawn")
			if(typeof pieceAt(rad, angle) !== 'undefined'){
				console.log(pieceAt(rad, angle).pColor);
				console.log(piece.pColor);
				if(pieceAt(rad, angle).pColor == piece.pColor){
					return false;
				}
			}
			return true;
		},
		"queen" : function(rad,angle,piece){
			console.log("checking for pawn")
			if(typeof pieceAt(rad, angle) !== 'undefined'){
				console.log(pieceAt(rad, angle).pColor);
				console.log(piece.pColor);
				if(pieceAt(rad, angle).pColor == piece.pColor){
					return false;
				}
			}
			return true;
		},
		"bishop" : function(rad,angle,piece){
			console.log("checking for pawn")
			if(typeof pieceAt(rad, angle) !== 'undefined'){
				console.log(pieceAt(rad, angle).pColor);
				console.log(piece.pColor);
				if(pieceAt(rad, angle).pColor == piece.pColor){
					return false;
				}
			}
			return true;
		},
		"rook" : function(rad,angle,piece){
			console.log("checking for pawn")
			if(typeof pieceAt(rad, angle) !== 'undefined'){
				console.log(pieceAt(rad, angle).pColor);
				console.log(piece.pColor);
				if(pieceAt(rad, angle).pColor == piece.pColor){
					return false;
				}
			}
			return true;
		}

	}
	var legal = moveTypes[piece.pType](rad,angle,piece);
	if(typeof legal == 'undefined'){
		legal = false;
	}
	return legal;
}

$(document).ready(init);