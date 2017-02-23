Game.properties={
    "Falco":{
        "slowwalk speed":2,
        "walk speed":5,
        "run speed":8,
    }
};

this.name="Falco";
this.properties=Game.properties[this.name];

/*Step function*/


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
    if(this.isGroundAction(this.state)){
        this.actions[this.state.action]();
    } else {
        this.setState({action:"land"});
    }
}

if(this.onground){
    if(this.state.action=="stand"){
        if(this.state.action=="slowwalk")
            this.setVel(this.direction*this.properties["slowwalk speed"],0);
        if(this.state.action=="walk")
            this.setVel(this.direction*this.properties["walk speed"],0);
        if(pad.getInput("dodge")){
            if(axis.y<-0.5){
                this.setState({
                    action:"move",
                    type:"wavedash",
                    dir:axis.x,
                });
            } else if(axis.y>0.5){
                this.setState({
                    action:"move",
                    type:"dodge",
                    dir:axis,
                });
            } else if(abs.x>0.5){
                this.setState({
                    action:"move",
                    type:"roll",
                    dir:Math.sign(axis.x)
                });
            } else {
                this.setState({
                    action:"shield"
                });
            }
        } else if(pad.getInput("jump")){
            this.setState({
                action:"move",
                type:"jumpsquat",
            });
        } else if(xis=="c"){
            this.setState({
                action:"attack",
                type:"smash",
                dir:cxis,
            });
        } else if(pad.getNewInput("smash")){
            this.setState({
                action:"charge",
                type:"smash",
                dir:axis
            });
        } else if(pad.getNewInput("grab")){
            this.setState({
                action:"attack",
                type:"grab"
            });
        } else if(pad.getNewInput("special")){
            this.setState({
                action:"attack",
                type:"special",
                dir:axis,
            });
        } else if(pad.getNewInput("tilt")){
            this.setState({
                action:"attack",
                type:"tilt",
                dir:axis
            });
        } else if(axis.y<-0.5){
            this.setState({
                action:"stand",
                type:"crouch"
            });
        } else if(abs.x>0.75){
            this.setState({
                action:"move",
                type:"run",
                dir:Math.sign(axis.x)
            });
        } else if(abs.x>0.5){
            this.setState({
                action:"stand",
                type:"walk",
                dir:Math.sign(axis.x)
            });
        } else if(abs.x>0.25){
            this.setState({
                action:"stand",
                type:"slowwalk",
                dir:Math.sign(axis.x)
            });
        }
    }
}
