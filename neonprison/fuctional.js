'use strict';
const config = {
    eyeFriction: 0.9,
    eyeSpeed: 0.5,
    playerSpeed: 1,
    jump: 13,
    gravity: 0.3,
    bottom: 0,
    //Don't change
    x:"x",y:"y",zero: 0, one: 1
};
const cofnig = Object.map(v=>R.always(v));

I=R.identity;
inc=R.curry(x=>x+1);
gt = R.curry((o, k) => o[k]);
st=R.curry((o,k,v)=>o[k]=v);
isFalse=R.curry(x=>!x);
isTrue=pipes(isFalse,isFalse);
//mutate=R.curry((o,k,v)=>Object.assign({},o,{[k]:v}));
updateWith=R.curry((k, fn, o) => R.set(R.lensPath(k), fn(R.path(k, o), k, o), o));
// key => fn => obj => obj
updatePlus=R.curry((k, fn, o) => updateWith(k,(v,k,O)=>v+fn(v,k,O)),o);
updateMinus=R.curry((k, fn, o) => updateWith(k,(v,k,O)=>v-fn(v,k,O)),o);
equals0=R.equals(0);

isMovingLeft=checkKeys("KeyD","ArrowRight");
isMovingRight=checkKeys("KeyA","ArrowLeft");
isJumping=checkKeys("KeyW","ArrowUp");
isSuiciding=checkKeys("KeyR");
isRestarting=checkKeys("KeyS");

direction=pipes([isMovingRight,isMovingLeft],R.subtract);
increaseDeaths=updatePlus(["state","player","deaths"],cofnig.one);
die=pipes(increaseDeaths,loadLevel);
restart=pipes(updateLazy({state:{player:{deaths:0},startTime:0,lvl:1}}),loadLevel);

_playerX=["state","player","p","x"];
_playerY=["state","player","p","y"];
_playerVX=["state","player","v","x"];
_playerVY=["state","player","v","y"];
_playerSX=["state","player","s","x"];
_playerSY=["state","player","s","y"];
_grounded=["state","player","grounded"];
getPlayerX=R.path(_playerX);
getPlayerY=R.path(_playerY);
getPlayerVX=R.path(_playerVX);
getPlayerVY=R.path(_playerVY);
getPlayerSX=R.path(_playerSX);
getPlayerSY=R.path(_playerSY);
getNewPlayerX=pipes([getPlayerX,getPlayerVX],R.add);
getNewPlayerY=pipes([getPlayerY,getPlayerVY],R.add);

getPlayerBottom=pipes([getPlayerY,getPlayerSY],R.subtract);
getPlayerTop=pipes([getPlayerY,getPlayerSY],R.add);
getPlayerLeft=pipes([getPlayerY,getPlayerSX],R.subtract);
getPlayerRight=pipes([getPlayerY,getPlayerSX],R.add);
getNewPlayerBottom=pipes([getNewPlayerY,getPlayerSY],R.subtract);
getNewPlayerTop=pipes([getNewPlayerY,getPlayerSY],R.add);
getNewPlayerLeft=pipes([getNewPlayerY,getPlayerSX],R.subtract);
getNewPlayerRight=pipes([getNewPlayerY,getPlayerSX],R.add);

_stopAt=R.curry((k,v)=>({state:{player:{v:{[k]:0},p:{[k]:v}}}}));//k,v=>obj
_stopAtX=stopAt("x");//v=>obj
_stopAtY=stopAt("y");//v=>obj
stopAt=pipes([[[0,1],_stopAt],2],updateLazy);//k,v,X=>X
stopAtX=pipes([[0,_stopAtX],1],updateLazy);//v,X=>X
stopAtY=pipes([[0,_stopAtY],1],updateLazy);//v,X=>X

boundaryBottomFn=R.if(lessThan(pipes(1,getNewPlayerBottom),pipes(0)),fn);
boundaryTopFn=R.if(lessThan(pipes(1,getNewPlayerTop),pipes(0)),pipes([1,0],fn));
boundaryLeftFn=R.if(lessThan(pipes(1,getNewPlayerLeft),pipes(0)),fn);
boundaryRightFn=R.if(lessThan(pipes(1,getNewPlayerRight),pipes(0)),fn);
boundaryBottom=boundaryBottomFn(stopAtY);
boundaryTop=pipes(stopAtY,boundaryTopFn);
boundaryLeft=pipes(stopAtX,boundaryLeftFn);
boundaryRight=pipes(stopAtX,boundaryRightFn);

        checkPaused=pipes(gt(["state","paused"]),isTrue);//X=>bool
                    checkSuicide=R.if(isSuiciding,die);
                    checkRestart=R.if(isRestarting,restart);
                checkSelfDeath=pipes(checkSuicide,checkRestart);
                    shouldStart=and(or(direction,isJumping),pipes(R.path(["state","startTime"]),equals0));
                checkStart=R.if(shouldStart,updateWith(["state","startTime"],Date.now));
                checkMovement=updatePlus(_playerVX,pipes(direction,R.multiply(config.playerSpeed)));
                    stand=updateWith(_playerVY,R.ifElse(pipes(2,isJumping),cofnig.jump,cofnig.zero));
                    fall=updateMinus(_playerVY,cofnig.gravity);
                checkJump=R.ifElse(R.path(_grounded),stand,fall);
                    //Split up checkBottom into newVelocity_XisLessThan(0)
                    checkBottom=R.ifElse(,updateLazy({state:{player:{grounded:false,v:{y:0},p:{y:0}}}}),updateWith(["state","player","grounded"],R.F));
                checkBoundaries=pipes(checkBottom,checkSides);
            checkAll=pipes(checkSelfDeath,checkStart,checkMovement,checkJump,checkBoundaries);
                    moveEyeBasedOnKeys=pipes([direction,cofnig.eyeSpeed],R.divide);//X=>v
                    applyEyeFriction=R.multiply(config.eyeFriction);//v=>v
                calculateEyes=pipes([0,[2,moveEyeBasedOnKeys]],R.add,applyEyeFriction);//v,k,X=>v
            updateEyes=updateWith(["state","player","eyePosition"],calculateEyes);//X=>X
        step=pipes(checkAll,checkHitboxes,stepPlayer,updateEyes);//X=>X
    update=R.ifElse(checkPaused,wait,step);//X=>X
updateAndDraw=pipes(update,draw);//X=>X