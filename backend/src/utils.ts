export function Random(len: number){
    let options = "qwertyuiopasdfghjklzxcvbnm1234567890";
    let ans = "";
    for(let i=0;i<len;i++){
        ans += options[Math.floor(Math.random())*len]
    }
    return ans;
}