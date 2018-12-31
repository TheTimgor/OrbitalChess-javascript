var canvas 
var context


function init(){
	canvas = document.getElementById("canvas")
	context = canvas.getContext("2d")
	resize()
}

function resize(){
	canvas.width = window.innerWidth - 10
	canvas.height = window.innerHeight -110
	drawBoard()

}

function drawTile(rad, theta){
	var rTotal = Math.min(canvas.width,canvas.height)/2 - 5
	var r =  rad * rTotal/8

	context.beginPath()
	context.arc(canvas.width/2,canvas.height/2,r,0,2*Math.PI)
	context.stroke()
}

function drawBoard(){
	drawTile(8)
	drawTile(7)
}