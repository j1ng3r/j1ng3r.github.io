var pad=new Controller("jigsaw",{
    "go":"Z|Space|Enter",
    "y-":"Up Arrow",
    "y+":"Down Arrow",
    "x+":"Right Arrow",
    "x-":"Left Arrow"
}),map={
    list:null,
    rows:6,
    cols:6,
    x:0,
    y:0,
    ox:-1,
    oy:-1,
    scale:0.5,
    width:0,
    height:0,
    playing:0
};
camera.init();
camera.setCenterPercent({x:0,y:0});
pad.preventDefault();
function getXY(n){
    return{
        x:Math.floor(n/map.cols),
        y:n%map.cols
    };
}
function loadImage(){
    camera.clearAllSprites();
    Object.assign(new FileReader,{
        onload(e){
            var img=camera.createSprite("base",e.target.result);
            img.onload=function(){
                var t=map.rows*map.cols,d=[],n,q,p,x,y,c=document.createElement("canvas");
                //map.scale=Math.round(600/Math.min(img.width,img.height));
                c.width=map.width=img.width/map.cols*map.scale;
                c.height=map.height=img.height/map.rows*map.scale;
                map.list=[];
                for(y=0;y<map.rows;y++){
                    map.list.push([]);
                    for(x=0;x<map.cols;x++){
                        c.getContext("2d").drawImage(img,x*map.width/map.scale,y*map.height/map.scale,map.width/map.scale,map.height/map.scale,0,0,c.width,c.height);
                        camera.createSprite(x+' '+y,c.toDataURL());
                    }
                }
                while(d.length<t){
                    if(!d.includes(n=Math.floor(Math.rand(0,t)))){
                        p=getXY(d.length);
                        q=getXY(n);
                        map.list[p.y][p.x]=q.x+' '+q.y;
                        d.push(n);
                    }
                }
                map.playing=1;
            };
        }
    }).readAsDataURL(files.files[0]);
}
function step(){
    if(map.playing){
        if(pad.getNewInput("go")&&map.x<map.cols&&map.y<map.rows){
            if(map.ox>=0){
                [map.list[map.oy][map.ox],map.list[map.y][map.x]]=
                [map.list[map.y][map.x],map.list[map.oy][map.ox]];
                map.ox=-1;
                map.oy=-1;
            } else {
                map.ox=map.x;
                map.oy=map.y;
            }
        }
        map.y+=pad.getNewInput("y+")-pad.getNewInput("y-");
        map.x+=pad.getNewInput("x+")-pad.getNewInput("x-");
        map.y=Math.min(map.rows,Math.max(0,map.y));
        map.x=Math.min(map.cols,Math.max(0,map.x));
    } else if(pad.getNewInput("go")){
        loadImage();
    }
    pad.endStep();
}
function draw(x,y){
    camera.background("#fff");
    for(y in map.list){
        for(x in map.list[y]){
            camera.draw(map.list[y][x],x*map.width,y*map.height);
        }
    }
    camera.fill("rgba(100,100,255,0.5)");
    camera.drawRect(map.x*map.width,map.y*map.height,map.width,map.height);
    camera.drawRect(map.ox*map.width,map.oy*map.height,map.width,map.height);
}
window.onload=function(){
    document.body.appendChild(camera.c);
    interval(step,draw,60);
};
/*

function init(){
    var image = camera.createSprite("base",dir);
    image.onload = function(){
        for(var x=0,y;x<rows;x++){
            for(y=0;y<cols;y++){
                var canvas = document.createElement('canvas');
                canvas.width = w;
                canvas.height = h;
                var context = canvas.getContext('2d');
                context.drawImage(image, x * w, y * h, w, h, 0, 0, canvas.width, canvas.height);
                camera.createSprite(x+","+y,canvas.toDataURL());
            }
        }
    };
    document.body.appendChild(camera.c);
    interval(step,draw,60);
}
function step(){

}
function draw(){
    for(var x=0,y;x<rows;x++){
        for(y=0;y<cols;y++){
            camera.draw(x+','+y,camera.c.width-x*w,camera.c.height-y*h);
        }
    }
}

window.onload=init;
*/
