var exec = require('child_process').exec;

exec("./deployProd.bash", function (error, stdout, stderr) {
   
   if (error === null) {
	console.log('ok');
   }
   else{
	console.log(error);
   }
});  
