axis=new Point(pad.getInput("axis x"),pad.getInput("axis y"));
abs=new Point(Math.abs(axis.x),Math.abs(axis.y));

cxis=new Point();
if(pad.getInput("cxis x")<0.4&&pad.getInput("cxis y")<0.4){
    xis=1;
} else if(+xis&&Math.abs(pad.getInput("cxis x"))>0.5||Math.abs(pad.getInput("cxis y"))>0.5){
    xis='c';
    cxis=new Point(pad.getInput("cxis x"),pad.getInput("cxis y"));
} else if(xis=="c")xis=0;
cbs=new Point(Math.abs(cxis.x),Math.abs(cxis.y));

if(this.onground){
    if(this.state.action=="stand"){
        if(pad.getInput("dodge")){
            if(axis.y<-0.5){
                this.action="wavedash";
                this.subaction=axis.x;
            } else if(axis.y>0.5){
                this.action="dodge";
                this.subaction=new Point(axis);
            } else if(abs.x>0.5){
                this.action="roll";
                this.subaction=Math.sign(axis.x);
            } else {
                this.action="shield";
            }
        } else if(xis=="c"){
            this.setState({
                action:"attack",
                type:"smash",
                dir:new Point(cxis)
            });
        } else if(pad.getNewInput("smash")){
            this.setState({
                action:"charge",
                type:"smash",
                dir:new Point(axis)
            });
        } else if(pad.getNewInput("grab")){
            this.setState({
                action:"attack",
                type:"grab",
                dir:new Point()
            })
        }
    }
}
