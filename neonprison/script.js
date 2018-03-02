const config = {
    eyeFriction: 0.9,
    eyeSpeed: 0.5,
    playerSpeed: 1,
    jump: 13,
    gravity: 0.3,
    //Don't change
    zero: 0, one: 1
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

        checkPaused=pipes(gt(["state","paused"]),isTrue);//X=>bool
                    checkSuicide=R.if(isSuiciding,die);
                    checkRestart=R.if(isRestarting,restart);
                checkSelfDeath=pipes(checkSuicide,checkRestart);
                    shouldStart=and(or(direction,isJumping),pipes(R.path(["state","startTime"]),equals0));
                checkStart=R.if(shouldStart,updateWith(["state","startTime"],Date.now));
                checkMovement=updatePlus(["state","player","v","x"],pipes(direction,R.multiply(config.playerSpeed)));
                    stand=updateWith(["state","player","v","y"],R.ifElse(pipes(2,isJumping),cofnig.jump,cofnig.zero));
                    fall=updateMinus(["state","player","v","y"],cofnig.gravity);
                checkJump=R.ifElse(R.path(["state","player","grounded"]),stand,fall);
                    //Split up checkBottom into newVelocity_XisLessThan(0)
                    checkBottom=R.ifElse(pipes(addVelocity,R.path(["state","player","p","y"]),isPositive,isFalse),updateLazy({state:{player:{grounded:false,v:{y:0},p:{y:0}}}}),updateWith(["state","player","grounded"],R.F));
                checkBoundaries=pipes(checkBottom,checkSides);
            checkAll=pipes(checkSelfDeath,checkStart,checkMovement,checkJump,checkBoundaries);
                    moveEyeBasedOnKeys=pipes([direction,cofnig.eyeSpeed],R.divide);//X=>v
                    applyEyeFriction=R.multiply(config.eyeFriction);//v=>v
                calculateEyes=pipes([0,[2,moveEyeBasedOnKeys]],R.add,applyEyeFriction);//v,k,X=>v
            updateEyes=updateWith(["state","player","eyePosition"],calculateEyes);//X=>X
        step=pipes(checkAll,checkHitboxes,stepPlayer,updateEyes);//X=>X
    update=R.ifElse(checkPaused,wait,step);//X=>X
next=pipes(update,draw);//X=>X