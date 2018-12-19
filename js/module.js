const module={
    _exports:{},
    moduleNames:[],
    addExport(name,val){
        this.moduleNames.push(name);
        this._exports[name]=val;
    },
    updateExport(){
        this._exports[name]=val;
    },
    get exports(){
        return new Proxy({},{
            get(obj,name){
                console.log(obj,name);
                if(this.moduleNames.includes(name))return this._exports[name];
                else throw new ReferenceError(`Module ${name} doesn't exist! Come back when it does.`)
            },
            set(obj,name,val){
                if(this.moduleNames.includes(name)){
                    console.warn(`Hey hey hey! Module ${name} already exists but I'll update it for you because I'm a human-friendly AI.`);
                    this.updateExport(name,val);
                }
                this.addExport(name,val);
                obj[name]=val;
                return val;
            }
        })
    },
    set exports(val){
        if(val.name)this.addExport(val.name,val);
        else throw new Error("Make sure to name your exports.");
    }
};
const require=name=>{
    return module.exports[name];
};

(module=>{

})(module);