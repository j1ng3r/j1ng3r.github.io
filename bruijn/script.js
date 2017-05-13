function R(n){let v=1+"0".repeat(n),_=a=>v.match(RegExp(`(?=${v.slice(-n)})`,"g")).length>1;while(v.length<2**n+n-1||_())v=_()?v.replace(/01*$/,1):v+0;return v;}
function getMap(n,m){
	for(var a=r(n),q=[],i=0;i<a.length;
        q.push(a.slice(i,i+=m).replace(/0/g," ").replace(/1/g,"#"))
    );
	return q;
}
ctx=null;
hasgraph=false;
map=[];
scale=1;
window.onload=function(){
    ctx=c.getContext("2d");
};
function submit(){
    num=+N.value||8;
    size=+L.value||~~(2**(num/2));
    scale=+S.value||1;
    map=getMap(num,size);
    //if(map[map.length-1].length!=map[0].length)map.pop();
    c.width=c.height=scale*map.length;
    if(!hasgraph){
        interval(step,draw,60);
    }
    hasgraph=true;
}
function step(){

}
function draw(){
    for(let y=0,x,color={" ":"#000","#":"#852","~":"#d22"};y<map.length;y++){
        for(x=0;x<map[y].length;x++){
            ctx.fillStyle=color[map[y][x]];
            ctx.fillRect(x*scale,y*scale,scale,scale);
        }
    }
}
function click(){

}
