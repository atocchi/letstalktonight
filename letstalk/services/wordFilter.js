const words = require('./bannedwords.js')

function wordFilter (text) {
    let newStr = text
    let arr = words
    for(let i=0;i<words.length;i++){
        newStr = newStr.split(arr[i]).join("####")
    }
    return newStr;
}
export default wordFilter;