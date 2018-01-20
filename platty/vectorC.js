Object.assign(Number,{
    eval(n,a){
        return"number"==typeof n?n:Number.eval(typeof n=="function"?n(a):n&&n.hasOwnProperty(a)?n[a]:+n||0,a);
    }
});
class Vector{
    constructor(x,y,z){
        this.set.apply(this,[].slice.call(arguments));
        return this;
    }
    clone(){
        return this.add();
    }
    set(x,y,z){
        switch(typeof x){
            case"string":
            case"number":
                this._set(x,y,z);
                break;
            case"object":
                this.set(x.x||x[0],x.y||x[1],x.z||x[2]);
                break;
            case"function":
                this.set(x([].slice.call(arguments).slice(1)));
                break;
            default:
                this._set();
        }
        return this;
    }
    _set(x,y,z){
        this.x=Number.eval(x);
        this.y=+y||0;
        this.z=+z||0;
        return this;
    }
    add(){
        let u=new Vector(arguments);
        return new Vector(this.x+u.x,this.y+u.y,this.z+u.z);
    }
    sub(){
        return this.add(new Vector(arguments).scale(-1));
    }
    scale(n){
        return new Vector(this.x*n,this.y*n,this.z*n);
    }
    shrink(n){
        return this.scale(1/n);
    }
    dot(){
        let u=new Vector(arguments);
        return this.x*u.x+this.y*u.y+this.z*u.z;
    }
    cross(){
        let u=new Vector(arguments);
        return new Vector(this.y*u.z-this.z*u.y,this.z*u.x-this.x*u.z,this.x*u.y-this.y*u.x);
    }
    toArray(){
        return[this.x,this.y,this.z];
    }
    dist(){
        let u=this.sub(arguments);
        return(u.x**2+u.y**2+u.z**2)**0.5;
    }
}