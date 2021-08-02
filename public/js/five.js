var socket = io();
socket.on('draw-line', function(msg) {
	to=msg.split(",")[1];
	from=msg.split(",")[0];
	draw();
});

class node {
	constructor(){
		this.left=null;
		this.right=null;
		this.up=null;
		this.down=null;
	}
}

var cols,rows;
var x_width,y_width;
var from,to;
var info,players;
var nodes;
var indexFrom;
var indexTo;
var result;
var body;
var p,colors;
var z;
var header;

window.addEventListener("load",async ()=>{
	await init();
	await drawHeader();
	await fillNodeArray();
	drawBody();
});

const init=async ()=> {
	cols=26;
	rows=13;
	x_width=59;
	y_width=39;
	players=new Array(2);
	players[0]=document.getElementById("0");
	players[1]=document.getElementById("1");
	body=document.getElementById("body");
	nodes=new Array(rows);
	indexFrom=new Array(2);;
	indexTo=new Array(2);;
	result=[0,0];
	p=0;
	colors=["#FF007F","#FFFF00"];
	z=0;
	header=["Do Good And Good Will Come To You...","The Best View Comes After The Hardest Climb.","You Do Not Find The Happy Life. You Make It."];
}

const fillNodeArray=async ()=>{
	for (var i = 0; i < rows; i++) {
		nodes[i] = new node(cols);
		for(var j=0;j<cols;j++) {
			nodes[i][j]=new node();
		}
	}
}

const drawLine=()=>{
  var c = document.createElement("canvas");
  var ctx = c.getContext("2d");
  c.setAttribute("width",(x_width*cols)+"px");
  c.setAttribute("height",(y_width*rows)+"px");
  c.setAttribute("style","block:none;position:absolute;opacity: 1;");
  ctx.moveTo(x_width*indexTo[1]+10, y_width*indexTo[0]+10);
  ctx.lineTo(x_width*indexFrom[1]+10, y_width*indexFrom[0]+10);
  ctx.strokeStyle =colors[p];
  ctx.lineWidth = 5;
  ctx.stroke();
  body.appendChild(c);
}

const isWin=()=> {
	var x1=parseInt(indexFrom[0]);
	var y1=parseInt(indexFrom[1]);
	var x2=parseInt(indexTo[0]);
	var y2=parseInt(indexTo[1]);
	console.log(x1+" "+y1+","+x2+" "+y2);
	if(x1==x2) {
		if(y1<y2) {
			if(nodes[x2][y2].up==p && x2-1>=0 && y2-1>=0 && nodes[x2-1][y2-1].right==p && nodes[x2-1][y2-1].down==p) {
				result[p]+=1;
			} else if(nodes[x2][y2].down==p && x2+1<rows && y2-1>=0 && nodes[x2+1][y2-1].right==p && nodes[x2+1][y2-1].up==p) {
				result[p]+=1;
			}
		} else {
			if(nodes[x1][y1].up==p && x1-1>=0 && y1-1>=0 && nodes[x1-1][y1-1].right==p && nodes[x1-1][y1-1].down==p) {
				result[p]+=1;
			} else if(nodes[x1][y1].down==p && x1+1<rows && y1-1>=0 && nodes[x1+1][y1-1].right==p && nodes[x1+1][y1-1].up==p) {
				result[p]+=1;
			}
		}
	} else if(y1==y2) {
		if(x1<x2){
			if(nodes[x2][y2].right==p && y2+1<cols && x2-1>=0 && nodes[x2-1][y2+1].down==p && nodes[x2-1][y2+1].left==p) {
				result[p]+=1;
			} else if(nodes[x2][y2].left==p && y2-1>=0 && x2-1>=0 && nodes[x2-1][y2-1].down==p &&nodes[x2-1][y2-1].right==p) {
				result[p]+=1;
			}
		} else {
			if(nodes[x1][y1].right==p && y1+1<cols && x1-1>=0 && nodes[x1-1][y1+1].down==p && nodes[x1-1][y1+1].left==p) {
				result[p]+=1;
			} else if(nodes[x1][y1].left==p && y1-1>=0 && x1-1>=0 && nodes[x1-1][y1-1].down==p && nodes[x1-1][y1-1].right==p) {
				result[p]+=1;
			}
		}
	}
}

const addCircleStyle=( circle, i, j)=> {
	circle.innerHTML="&#9898;";
	circle.setAttribute("id",i+"_"+j);
	circle.setAttribute("class","circle");
	circle.setAttribute("style","left:"+(x_width*j)+"px;top:"+(y_width*i)+"px;cursor:pointer");
}

const addMouseDownEvent=( circle)=> {
	circle.addEventListener("mousedown",function() {
		event.preventDefault();
		from=event.target.getAttribute("id");
	});
}

const drawHeader=()=>{
	info=document.getElementById("header");
	info.innerHTML='&#127802;'+header[z]+'&#127802;';
	setInterval(function(){
		if(z<header.length-1) {
			z++;
		} else {
			z=0;
		}
		info.innerHTML='&#127802;'+header[z]+'&#127802;';
  }, 3500);
}

const addMouseUpEvent=( circle)=> {
	circle.addEventListener("mouseup",function() {
		to=event.target.getAttribute("id");
		draw();
	});
}

const draw=()=> {
	 indexFrom[0]=from.split("_")[0];
	 indexTo[0]=to.split("_")[0];
	 indexFrom[1]=from.split("_")[1];
	 indexTo[1]=to.split("_")[1];
	if(indexFrom[0]==indexTo[0] && indexTo[1]-indexFrom[1]==1 && nodes[indexFrom[0]][indexFrom[1]].right==null) {
		nodes[indexFrom[0]][indexFrom[1]].right=p;
		nodes[indexTo[0]][indexTo[1]].left=p;
	} else if(indexFrom[0]==indexTo[0] && indexFrom[1]-indexTo[1]==1 && nodes[indexFrom[0]][indexFrom[1]].left==null) {
		nodes[indexFrom[0]][indexFrom[1]].left=p;
		nodes[indexTo[0]][indexTo[1]].right=p;
	} else if(indexFrom[1]==indexTo[1] && indexFrom[0]-indexTo[0]==1 && nodes[indexFrom[0]][indexFrom[1]].up==null) {
		nodes[indexFrom[0]][indexFrom[1]].up=p;
		nodes[indexTo[0]][indexTo[1]].down=p;
	} else if(indexFrom[1]==indexTo[1] && indexTo[0]-indexFrom[0]==1 && nodes[indexFrom[0]][indexFrom[1]].down==null) {
		nodes[indexFrom[0]][indexFrom[1]].down=p;
		nodes[indexTo[0]][indexTo[1]].up=p;
	} else {
		return;
	}

	socket.emit('draw-line',from+','+to);
	drawLine();
	isWin();
	players[0].innerHTML="player1:"+result[0];
	players[1].innerHTML="player2:"+result[1];
	p=p==0?1:0;//~p !p

}

const drawBody=()=> {
	for(var i=0;i<rows;i++) {
		for(var j=0;j<cols;j++) {
			var circle = document.createElement("circle");
			addCircleStyle(circle,i,j);
			addMouseDownEvent(circle);
			addMouseUpEvent(circle);
			body.appendChild(circle);
		}
	}
}
