export const format = (message: string, object: any) => {
   for(let i = 0  ; i  < 3;i++){
    console.log("***********")
   }
   
    for(let i =  0 ;i < 6 ; i++){
            console.log(`---------${i===0 ? message:"-"}---------`)
    }
    console.log(object);
    
    for(let i =  0 ;i < 6 ; i++){
        console.log(`---------${i===0 ? message:"-"}---------`)
}


    for(let i = 0  ; i  < 3;i++){
        console.log("***********")
       }
}
