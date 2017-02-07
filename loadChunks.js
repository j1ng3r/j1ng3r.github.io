var map={
    map:[],
    _getChar(x,y){
        return this.map[y]&&this.map[y][x];
    },
    getChar(x,y){
        if(this._getChar(x,y))this._setChar(" ",x,y);
        return this._getChar(x,y);
    },
    _setChar(s,x,y){
        if(!this[y])this.map[y]=[];
        this.map[y][x]=s;
        return this._getChar();
    },
    setChar(s,x,y){
        if(" S".includes(this.getChar(x,y))){
            this._setChar(s,x,y);
            return true;
        }
        return false;
    },
    changeChar(s,x,y){
        this._setChar(s,x,y);
    },
    addChunk(a,x,y){
        var MAP=Object.assign([],this),Y,X;
        for(Y in a)
            for(X in a[Y])
                if(a[Y][X]!=" "&&!MAP.setChar(a[Y][X],x- -X,y- -Y))//jshint ignore:line
                    return false;
        this.map=MAP.map;
        return true;
    }
};
