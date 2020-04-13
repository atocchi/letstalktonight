function ghostLogic (){
    let ouiji = [" ","A","B","C","D","E","F","G","H","I","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
    let response =[];
    for(i=255;i > 0; i--){
        response.push(ouiji[Math.floor((Math.random() * ouiji.length))])
    }
    console.log(response.toString().replace(/,/g,""))
}
ghostLogic()