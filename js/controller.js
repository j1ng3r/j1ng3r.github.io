window.Controller=function(){
	function print(a){console.log(a);return a;}
	function Controller(name,scheme){
		if(/[[\]:,|]/.test(name))throw"Cannot have [],:| in a Controller name.";
		this.name=name;
		if(Controller.getSchemeByName(this.name))this._getScheme();
		else this.scheme=Controller.parseScheme(scheme);
		Controller.window.addEventListener("keydown",this._event.bind(this));
		Controller.window.addEventListener("keyup",this._event.bind(this));
	}
	Object.assign(Controller,{
		prototype:Object.assign(Controller.prototype,{
			input:{},
			events:{},
			oldInput:{},
			endStep(){
				this.oldInput=Object.assign([],this.input);
			},
			addEventListener(name,cb){
				this.events[name]=cb;
			},
			getNewInput(n){
				return this.getInput(n)&&!this.oldInput[n];
			},
			getInput(n){
				if(!this.scheme.hasOwnProperty(n))throw`No property ${n} exists on this controller.`;
				this.gamePads=[];
				for(var _ = this.scheme[n].split("|"),a=Controller.window.navigator.getGamepads(),b,i=0,j;i<a.length;i++)
					if(a[i]&&a[i].buttons&&a[i].buttons.length)
						this.gamePads.push(a[i]);
				for(j=0;j<_.length;j++){
					i=_[j].trim();
					b=(i.match(/\d+/g)||[])[1];
					if(i.slice(0,3)=="Pad"){
						if(a=this.gamePads[i[3]])this.input[n]=(
							i.slice(4,8)!="Axis"?
								a.buttons[b].value
							:/[+-]$/.test(i)?
								Math.max(0,(i.slice(-1)+"1")*a.axes[b]):
								a.axes[b]
						);
					}
					if(this.input[n]){
						return this.input[n];
					}
				}
				return 0;
			},
			scheme:{},
			_activate(a,v){
				for(var i in this.scheme)
					if(this.scheme[i].match(RegExp(`(\\||^)\\s*${a}\\s*(\\||$)`,"i"))){
						this.input[i]=v;
						(this.events[i]||(_=>0))(v);
					}
				return v;
			},
			_getScheme(){
				return this.scheme=Controller.parseScheme(Controller.getSchemeByName(this.name).data);
			},
			saveScheme(){
				var a=this.name+"[",i,b=Controller.get(),c=Controller.getSchemeByName(this.name);
				for(i in this.scheme)
					a+=(a?',':'')+i+":"+this.scheme[i];
				Controller.set(b.slice(0,c.start)+a+"]"+b.slice(c.end));
			},
			changeControl(name,key){
				if(key)for(var i in this.scheme)
					if(this.scheme[i]==key)
						this.scheme[i]=this.scheme[name];
				this.scheme[name]=key;
			},
			resetAllInputs(i){
				for(i of Controller._buttonNames)
					this.input[i]=!0;
			},
			defaultPrevented:false,
			defaultWhiteList:[],
			defaultBlackList:[],
			preventDefault(m,w){
				this.allowDefault();
				this["default"+m]=w;
				this.defaultPrevented=true;
			},
			allowDefault(){
				this.defaultWhiteList=[];
				this.defaultBlackList=[];
				this.defaultPrevented=false;
			},
			_event(e){
				var n=Controller.parseEvent(e);
				if(this.defaultPrevented&&(
					(this.defaultWhiteList.length&&!this.defaultWhiteList.includes(n))||
					(this.defaultBlackList.length&&this.defaultBlackList.includes(n))||
					!(this.defaultBlackList.length||this.defaultWhiteList.length))){
						e.preventDefault();
				}
				if(e.type.slice(0,3)=="key")
					this._activate(n,e.type=="keydown"?1:0);
			},
			addControl(c){
				Controller.buttonNames.push(""+c);
			}
		}),
		window:window,
		parseEvent(e){
			if(e.type.slice(0,3)=="key"){
				if((e.key.length==1&&e.key!=' ')||e.key.match(/^f\d$/i))return e.key;
				if(e.key.match(/^Arrow/))return e.key.slice(5)+" Arrow";
				if(e.code.match(/Left$/))return"L"+e.code.slice(0,-4);
				if(e.code.match(/Right$/))return"R"+e.code.slice(0,-5);
				return e.code;
			}
		},
		buttonNames:[],
		getSchemeByName(name,o,d=Controller.get().split(']'),a=0){
			for(;a<d.length;a++)
				if(d[a]!=(o=d[a].replace(RegExp(`^${name}\\[`),"")))
					return {
						data:o,
						start:a,
						end:a+o.length
					};
			return null;
		},
		setWindow(w){
			Controller.window=w;
		},
		get(){return Controller.window.localStorage.getItem('controls');},
		set(a){Controller.window.localStorage.setItem('controls',a);},
		parseScheme(scheme){
			if(typeof scheme=="object")return scheme;
			if(typeof scheme!="string")return {};
			var b={},a;
			scheme=scheme.trim().replace(/,$/,'').split(',');
			for(a of scheme)
				b[a.split(':')[0].trim()]=a.split(':')[1].trim();
			return b;
		}
	});
	Controller.set(Controller.get()||"");
	return Controller;
}();
