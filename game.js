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

	var side = ["black","white"];
	for(i in side){
		console.log(i,side[i]);
		pieces.push(new Piece(8,5+8*i,"rook",side[i]));
		pieces.push(new Piece(8,2+8*i,"rook",side[i]));
		pieces.push(new Piece(7,3+8*i,"bishop",side[i]));
		pieces.push(new Piece(7,4+8*i,"bishop",side[i]));
		pieces.push(new Piece(6,3+8*i,"knight",side[i]));
		pieces.push(new Piece(6,4+8*i,"knight",side[i]));
		pieces.push(new Piece(8,1+8*i,"pawn",side[i]));
		pieces.push(new Piece(7,2+8*i,"pawn",side[i]));
		pieces.push(new Piece(6,2+8*i,"pawn",side[i]));
		pieces.push(new Piece(5,3+8*i,"pawn",side[i]));
		pieces.push(new Piece(5,4+8*i,"pawn",side[i]));
		pieces.push(new Piece(6,5+8*i,"pawn",side[i]));
		pieces.push(new Piece(7,5+8*i,"pawn",side[i]));
		pieces.push(new Piece(8,6+8*i,"pawn",side[i]));

	}
	pieces.push(new Piece(8,3,"king","black"));
	pieces.push(new Piece(8,4,"queen","black"));
	pieces.push(new Piece(8,12,"king","white"));
	pieces.push(new Piece(8,11,"queen","white"));

	// pieces.push(new Piece(8,0,"bishop","black"));
	// pieces.push(new Piece(8,8,"queen","white"));

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

		if(rad==0){
			angle = 0;
		}

		// console.log('('+x+','+y+')');
		// console.log(rad);
		// console.log(angle);

		for (var i = highlighted.length - 1; i >= 0; i--) {
			highlighted.splice(i);
		}

		var rotateBoardThisTurn = false;
		console.log(pieceAt(rad,angle));
		if(selected == null && typeof pieceAt(rad,angle) !== 'undefined'){
			
			if(pieceAt(rad,angle).pColor == currentPlayer){
				console.log("selected")
				selected = pieceAt(rad,angle);
				highlighted.push([rad,angle]);
				for (var j = 0; j <= 8; j++) {
					for (var i = 0; i < 16; i++) {
						if(isMoveLegal(j,i,selected)){
							highlighted.push([j,i]);
						}
					}
				}
			}


		} else if(isMoveLegal(rad,angle,selected) ){
			var index = pieces.indexOf(pieceAt(rad, angle));
			if (index !== -1) pieces.splice(index, 1);
			selected.move(rad,angle);
			selected.hasMoved = true;
			selected = null;
			move++;
			redraw();
			if(currentPlayer=='white'){
				currentPlayer = 'black';
			} else {
				currentPlayer = 'white';
				rotateBoardThisTurn = true;
			}
		} else {
			selected = null;
		}

		console.log(selected);

		redraw();

		if(rotateBoardThisTurn == true){
			rotateBoard();
		}


	});

	window.onresize = redraw;

	for(var i in blackPieceImgs){
		blackPieceImgs[i].onload = redraw;
	}

	for(var i in whitePieceImgs){
		whitePieceImgs[i].onload = redraw;
	}

	redraw();

}

// function redrawTwice(){
// 	redraw();
// 	redraw();
// }

function redraw(h=0){
	
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
	
	var time = 1000;
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
		this.hasMoved = false;
	
	}

	move(rad, angle){
		this.rad = rad;
		while(angle>15){
			angle -= 16
		}
		if(rad == 0){
			angle = 0;
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
			// console.log("checking for pawn")
			if(typeof pieceAt(rad, angle) !== 'undefined'){
				// console.log(pieceAt(rad, angle).pColor);
				// console.log(piece.pColor);
				if(pieceAt(rad, angle).pColor == piece.pColor){
					return false;
				}

				var da = Math.abs(angle-piece.angle);
				da = Math.min(da, 16 - da);
				if(da == 1 && rad == piece.rad-1){
					return true;
				}
			}

			if(typeof pieceAt(piece.rad-1, angle) !== 'undefined'){
				// console.log(pieceAt(rad, angle).pColor);
				// console.log(piece.pColor);
				if(pieceAt(piece.rad-1, angle).pColor == piece.pColor){
					return false;
				}
			}

			if(angle == piece.angle && rad == piece.rad-1){
				return true;
			}

			if(!piece.hasMoved && angle == piece.angle && rad == piece.rad-2){
				return true;
			}

			return false;
		},
		"king" : function(rad,angle,piece){
			// console.log("checking for pawn")
			if(typeof pieceAt(rad, angle) !== 'undefined'){
				// console.log(pieceAt(rad, angle).pColor);
				// console.log(piece.pColor);
				if(pieceAt(rad, angle).pColor == piece.pColor){
					return false;
				}

				if(Math.abs(angle - piece.angle) <= 1 && Math.abs(rad - piece.rad) <= 1){
					return true;
				}

			}

			if(Math.abs(angle - piece.angle) <= 1 && Math.abs(rad - piece.rad) <= 1){
				return true;
			}

			return true;
		},
		"knight" : function(rad,angle,piece){
			// console.log("checking for pawn")

			if(typeof pieceAt(rad, angle) !== 'undefined'){
				// console.log(pieceAt(rad, angle).pColor);
				// console.log(piece.pColor);
				if(pieceAt(rad, angle).pColor == piece.pColor){
					return false;
				}

				if(Math.abs(angle - piece.angle) == 3 && Math.abs(rad - piece.rad) == 2){
					return true;
				}

				if(Math.abs(angle - piece.angle) == 2 && Math.abs(rad - piece.rad) == 3){
					return true;
				}

			}

			if(piece.rad == 0 && rad <= 2){
				return true;
			}

			if(Math.abs(angle - piece.angle) == 2 && Math.abs(rad - piece.rad) == 1){
				return true;
			}

			if(Math.abs(angle - piece.angle) == 1 && Math.abs(rad - piece.rad) == 2){
				return true;
			}

			return false;
		},
		"queen" : function(rad,angle,piece){
			// console.log("checking for pawn")
			return isMoveLegal(rad,angle,new Piece(piece.rad,piece.angle,"bishop",piece.pColor)) || isMoveLegal(rad,angle,new Piece(piece.rad,piece.angle,"rook",piece.pColor))
		},
		"bishop" : function(rad,angle,piece){
			// console.log("checking for pawn")
			if(typeof pieceAt(rad, angle) !== 'undefined'){
				// console.log(pieceAt(rad, angle).pColor);
				// console.log(piece.pColor);
				if(pieceAt(rad, angle).pColor == piece.pColor){
					return false;
				}

				// if(rad-angle == piece.rad-piece.angle){
				// 	return true;
				// }

			}
			
			var moves = [[1,1],[1,-1],[-1,1],[-1,-1]]
			for(m of moves){
				var hasBounced = false
				var dR = m[0];
				var dA = m[1];
				var cR = piece.rad;
				var cA = piece.angle;
				var blocked = false;

				while(cR >= 0 && cR <= 8 ){
					if(cR == rad && cA == angle && !blocked){
						return true;
					}
					cR += dR;
					cA += dA;
					cA -= (cA > 15 ? 16 : 0);
					cA += (cA < 0 ? 16 : 0);
					if(cR==8 && !hasBounced){
						dR = - dR
						hasBounced = true;
					}
					if(typeof pieceAt(cR,cA) !== 'undefined' && !(cR == rad && cA == angle)){
						blocked = true;
					}
				}
			}

			if(rad == 0){

			}


			return false;
		},
		"rook" : function(rad,angle,piece){

			if(rad == 0){
				return false;
			}
			// console.log("checking for pawn")
			if(!(piece.rad == rad || piece.angle == angle)){
				return false;
			}

			if(typeof pieceAt(rad, angle) !== 'undefined'){
				// console.log(pieceAt(rad, angle).pColor);
				// console.log(piece.pColor);
				if(pieceAt(rad, angle).pColor == piece.pColor){
					return false;				
				}
			}

			if(piece.rad == rad){
				
				var i = angle+1;
				var canMoveCW = true;
				var canMoveCCW = true;

				while(i != piece.angle){
					highlightTile(rad,i);	
					if(typeof pieceAt(rad, i) !== 'undefined'){
						canMoveCCW = false;
					}
					i++;
					if(i>15){
						i -= 16;

					}

				}

				i = angle - 1;
				if(i<0){
					i += 16;
				}

				while(i != piece.angle){
					highlightTile(rad,i);	
					if(typeof pieceAt(rad, i) !== 'undefined'){
						canMoveCW = false;
					}
					i--;
					if(i<0){
						i += 18;
					}

				}

				if(!canMoveCW && !canMoveCCW){
					return false;
				}

			}
			if(piece.angle == angle && piece.rad < rad){
				//out
				console.log("out")
				console.log(piece.rad,rad,rad>piece.rad)
				for(var i = piece.rad+1; i < rad; i++){
					if(typeof pieceAt(i, angle) !== 'undefined'){
						return false;
					}
				}
			}
			if(piece.angle == angle && piece.rad > rad){
				//in
				console.log("in")
				console.log(rad,piece.rad,rad<piece.rad)
				for(var i = rad+1; i < piece.rad; i++){
					console.log("============= checking for in")
					if(typeof pieceAt(i, angle) !== 'undefined'){
						return false;
					}
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
	if(rad > 8 || rad < 0){
		legal = false;
	}

	console.log("isMoveLegal:",legal);
	return legal;
}

$(document).ready(init);