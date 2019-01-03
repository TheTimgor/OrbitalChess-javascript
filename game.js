var canvas;		
var context;
var blackPieceImgs = {
	"king" 		: makeImage("resources/BlackCommandCenter.png"),	
	"knight" 	: makeImage("resources/BlackHopper.png"),	
	"queen" 	: makeImage("resources/BlackMothership.png"),	
	"bishop" 	: makeImage("resources/BlackShuttle.png"),	
	"pawn" 		: makeImage("resources/BlackSputnik.png"),	
	"rook"		: makeImage("resources/BlackTurret.png")	
} 

var whitePieceImgs = {
	"king" 		: makeImage("resources/WhiteCommandCenter.png"),	
	"knight" 	: makeImage("resources/WhiteHopper.png"),	
	"queen" 	: makeImage("resources/WhiteMothership.png"),	
	"bishop" 	: makeImage("resources/WhiteShuttle.png"),	
	"pawn" 		: makeImage("resources/WhiteSputnik.png"),	
	"rook"		: makeImage("resources/WhiteTurret.png")	
}

var highlighted = []

var pieces = []

var rotationRules = [0, 8, 8, 4, 4, 2, 2, 0, 0]

var rTotal;

var selected = null;

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
		var rotateBoardThisTurn = false;
		console.log(pieceAt(rad,angle));
		if(selected == null && typeof pieceAt(rad,angle) !== 'undefined'){
			
			if(pieceAt(rad,angle).pColor == currentPlayer){
				console.log("selected")
				selected = pieceAt(rad,angle);
			}
		} else if(isMoveLegal(rad,angle,selected) ){
			var index = pieces.indexOf(pieceAt(rad, angle));
			if (index !== -1) pieces.splice(index, 1);
			selected.move(rad,angle);
			selected = null;
			move++;
			redraw();
			if(currentPlayer=='white'){
				currentPlayer = 'black';
			} else {
				currentPlayer = 'white';
				rotateBoardThisTurn = true;
			}
		}

		console.log(selected);

		redraw();

		if(rotateBoardThisTurn == true){
			rotateBoard();
		}


	});

	window.onresize = redraw;
	redraw();

}

function redraw(h=0){
	context.clearRect(0, 0, canvas.width, canvas.height);
	canvas.width = window.innerWidth - 10;
	canvas.height = window.innerHeight -110;
	rTotal = Math.min(canvas.width,canvas.height)/2 - 35;
	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
		rTotal -= 50;
	}
	drawBoard(h);
	for(var i of highlighted){
		highlightTile(i[0],i[1]);
	}
	
	for(var i of pieces){
		coeff = rotationRules[i.rad];
		i.draw(i.rad,i.angle+h*coeff);
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

function drawBoard(h){
	console.log("drawing board");
	for (var j = 1; j < 8; j+=2) {
		coeff = rotationRules[j];
		for (var i = 0; i < 16; i+=2) {
			drawTile(j,i+(h*coeff),"wheat");
			drawTile(j,i+(h*coeff)+1,"rosybrown")	;
		}
		coeff = rotationRules[j+1];
		for (var i = 0; i < 16; i+=2) {
			drawTile(j+1,i+(h*coeff)+1,"wheat");
			drawTile(j+1,i+(h*coeff),"rosybrown");
		}
		
	}
	drawTile(0,0,"wheat")
	
}

function rotateBoard(){
	console.log("rotateBoard")
	
	var time = 200;
	var interval = 10;
	var step = interval/time;
	var h = 0;

	var tid = setInterval(function(){
		h += step;
		redraw(h);
		checkStop();
	},interval)
	
	function checkStop(){
		if(h >= 1){
			clearInterval(tid);
			for(p of pieces){
				p.move(p.rad,p.angle+rotationRules[p.rad])
			}
		}
	}

	

}

// function onClick(event){
// 	var x = event.pageX - canvas.offsetLeft;
// 	var y = event.pageY- canvas.offsetTop;
// 	console.log("(")
// }

function makeImage(src){
	var img = new Image();
	img.src = src;
	return img;
}

class Piece {
	
	constructor (rad, angle, pType, pColor){
		this.rad = rad;
		this.angle = angle;
		this.pType = pType;
		this.pColor = pColor;
	
	}

	move(rad, angle){
		this.rad = rad;
		while(angle>15){
			angle -= 16
		}
		this.angle = angle;
	}

	draw(optRad=this.rad,optAngle=this.angle){
		// console.log(this)

		var img
		if(this.pColor == "black"){
			img = blackPieceImgs[this.pType];
		}
		if(this.pColor == "white"){
			img = whitePieceImgs[this.pType];
		}

		console.log(img.src);

		
		if(optRad == 0){
			optAngle = 11.5
			optRad = -0.5
		}
		context.save()
		var theta = (-optAngle-1) * (Math.PI/8) + Math.PI/16 - Math.PI/2;
		var r =  optRad * rTotal/8 + 2;
		context.translate(canvas.width/2,canvas.height/2);
		context.rotate(theta);
		if(optRad == 1){
			var imgHeight = rTotal/8 - 12;
		} else {
			var imgHeight = rTotal/8 - 4;
		}
		var imgWidth = (imgHeight/img.height) * img.width;
		context.drawImage(img,-imgWidth/2,r+2,imgWidth,imgHeight);
		context.restore();
		
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
	var legal;
	if(piece){
		legal = moveTypes[piece.pType](rad,angle,piece);
	}
	if(typeof legal == 'undefined'){
		legal = false;
	}
	return legal;
}

$(document).ready(init);