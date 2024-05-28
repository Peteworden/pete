window.addEventListener("load",function(){
    getOrientation();
    screen.orientation.onchange=function(){
      getOrientation();;
    }
  });
  function getOrientation(){
    let ori="";
    if(type=="portrait-primary"){
      ori="縦向き(上部が上)";
    }else if(type=="portrait-secondary"){
      ori="縦向き(上部が下)";
    }else if(type=="landscape-primary"){
      ori="横向き(上部が左)";
    }else if(type=="landscape-secondary"){
      ori="横向き(上部が右)";
    }
    document.getElementById("ori").innerHTML=
      ori+" "+screen.orientation.angle+"度<br>"
  }