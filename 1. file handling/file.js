const fs = require('fs');

// fs.writeFileSync('./test.txt','HELLO FILE'); // sync'ly make a file that contains 'HELLO FILE' in current directory
// fs.writeFileSync('./test.txt','HELLO FILE AGAIN'); // this will just override the contents of the exisiting file

// fs.writeFile('./test.txt','HELLO FILE Async', (e)=>{
//     console.log('Some Error Occored : ', e)
// }) // Async function, if no error occured : output will be the file + "Some Error Occored :  null"

// to read file: 
// const result = fs.readFileSync("./contact.txt", 'utf-8') //reads the file sync'ly with utf-8 encoding, directly returns the text, and error are handeled using try and catch
// console.log(result) 

// to read file (Async):

// fs.readFile('./contact.txt', 'utf-8', (err, result)=>{ // here we have a callback with 2 variables , 1st is the error that is caused during execution 
// // and other is the value read within the file
//     if(err){
//         console.log('Some Error Occured : ', err); 
//     } else {
//         console.log(result)
//     }
// })

// now to add data in file: (without overriding as seen in writeFile) this works by appending the string at the end of the last line ( + )
// fs.appendFileSync('./test.txt', '\n hello again');
// fs.appendFileSync('./test.txt', new Date().getDate().toLocaleString());

// to delete files : 
// fs.unlinkSync('./dum.txt') // use unlink to delete files

// to see stats of a file
// console.log(fs.statSync('./test.txt'))

// to make directory
// fs.mkdirSync('MY-DIR/a/b', {recursive : true}) // make multiple dir at onces


// const os = require('os');
// console.log(os.cpus().length)