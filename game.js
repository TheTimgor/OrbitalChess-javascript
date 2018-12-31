var canvas 
var context


function init(){
	$("body").on("resize",resize)
	canvas = $("#canvas").get()[0]
	context = canvas.getContext("2d")
	resize()
}

function resize(){
	canvas.width = window.innerWidth - 10
	canvas.height = window.innerHeight -110
	drawBoard()

}

function drawTile(rad, theta, color){
	var rTotal = Math.min(canvas.width,canvas.height)/2 - 20
	var r1 =  rad * rTotal/8
	var r2 =  (rad + 1) * rTotal/8

	context.beginPath()
	context.arc(canvas.width/2,canvas.height/2,r1,theta,Math.PI/8 + theta)
	context.arc(canvas.width/2,canvas.height/2,r2,Math.PI/8 + theta,theta,true)
	context.lineTo(canvas.width/2 + r1*Math.cos(theta),canvas.height/2 +r1*Math.sin(theta))
	context.closePath()
	context.fillStyle = color;
	context.fill()
	context.stroke()
}

function drawBoard(){
	drawTile(8,0,"rosybrown")

}

$(document).ready(init)