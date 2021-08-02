var socket = io();
		socket.on('draw-line', function(msg) {
			to=msg.split(",")[0];
			from=msg.split(",")[1];
			console.log(from+'  '+to);
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
    var startPLayer=-1;

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
			header=["خليك بالبيت","quedarse en casa","остаться дома","evde kal","stai acasă","rester à la maison","stare a casa","집에있어 라","家にいる","呆在家里","Μείνε σπίτι","stay home"];
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
			if(indexFrom[0]==indexTo[0]) {
				if(indexFrom[1]<indexTo[1]) {
					//from left to right
					if(nodes[indexTo[0]][indexTo[1]].up==p && indexTo[0]-1>=0 && indexTo[1]-1>=0 && nodes[indexTo[0]-1][indexTo[1]-1].right==p && nodes[indexTo[0]-1][indexTo[1]-1].down==p) {
						result[p]+=1;
					} else if(nodes[indexTo[0]][indexTo[1]].down==p && indexTo[0]+1<rows && indexTo[1]-1>=0 && nodes[indexTo[0]+1][indexTo[1]-1].right==p && nodes[indexTo[0]+1][indexTo[1]-1].up==p) {
						result[p]+=1;
					}
				} else {
					//from right to left
					if(nodes[indexFrom[0]][indexFrom[1]].up==p && indexFrom[0]-1>=0 && indexFrom[1]-1>=0 && nodes[indexFrom[0]-1][indexFrom[1]-1].right==p && nodes[indexFrom[0]-1][indexFrom[1]-1].down==p) {
						result[p]+=1;
					} else if(nodes[indexFrom[0]][indexFrom[1]].down==p && indexFrom[0]+1<rows && indexFrom[1]-1>=0 && nodes[indexFrom[0]+1][indexFrom[1]-1].right==p && nodes[indexFrom[0]+1][indexFrom[1]-1].up==p) {
						result[p]+=1;
					}
				}
			} else if(indexFrom[1]==indexTo[1]) {
				if(indexFrom[0]<indexTo[0]){
					if(nodes[indexTo[0]][indexTo[1]].right==p && indexTo[1]+1<cols && indexTo[0]-1>=0 && nodes[indexTo[0]-1][indexTo[1]+1].down==p && nodes[indexTo[0]-1][indexTo[1]+1].left==p) {
						result[p]+=1;
					} else if(nodes[indexTo[0]][indexTo[1]].left==p && indexTo[1]-1>=0 && indexTo[0]-1>=0 && nodes[indexTo[0]-1][indexTo[1]-1].down==p &&nodes[indexTo[0]-1][indexTo[1]-1].right==p) {
						result[p]+=1;
					}
				} else {
					if(nodes[indexFrom[0]][indexFrom[1]].right==p && indexFrom[1]+1<cols && indexFrom[0]-1>=0 && nodes[indexFrom[0]-1][indexFrom[1]+1].down==p && nodes[indexFrom[0]-1][indexFrom[1]+1].left==p) {
						result[p]+=1;
					} else if(nodes[indexFrom[0]][indexFrom[1]].left==p && indexFrom[1]-1>=0 && indexFrom[0]-1>=0 && nodes[indexFrom[0]-1][indexFrom[1]-1].down==p && nodes[indexFrom[0]-1][indexFrom[1]-1].right==p) {
						result[p]+=1;
					}
				}
			}
		}

		const addCircleStyle=( circle, i, j)=> {
			circle.src="5.png";
			circle.setAttribute("id",i+"_"+j);
			circle.setAttribute("class","circle");
			circle.setAttribute("style","left:"+(x_width*j)+"px;top:"+(y_width*i)+"px;");
		}

		const addMouseDownEvent=( circle)=> {
			circle.addEventListener("mousedown",function() {
				event.preventDefault();
				from=event.target.getAttribute("id");
			});
		}

		const drawHeader=()=>{
			info=document.getElementById("header");
			setInterval(function(){
				if(z<header.length) {
					info.innerHTML='<img src="2.png" alt="" width="40px" height="40px">'+header[z]+'<img src="2.png" alt="" width="40px" height="40px">';
					z++;
				}
				if(z>=header.length)
				z=0;
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
			console.log(indexFrom[0]+" "+indexFrom[1]+","+indexTo[0]+" "+indexTo[1]);
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
			//disableUserWrite(p);
			p=p==0?1:0;//~p !p

		}

		const drawBody=()=> {
			for(var i=0;i<rows;i++) {
				for(var j=0;j<cols;j++) {
					var circle = document.createElement("img");
					addCircleStyle(circle,i,j);
					addMouseDownEvent(circle);
					addMouseUpEvent(circle);
					body.appendChild(circle);
				}
			}
		}
