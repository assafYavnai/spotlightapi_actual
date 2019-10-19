import fs from 'fs';
const fileUpload = require('express-fileupload');
const { spawn } = require('child_process');
var log4js = require('log4js');
const logger = log4js.getLogger('custom');

// import multer from 'multer';
// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, '../uploads/');
//     },
//     filename: function (req, file, cb) {
//       cb(null, Date.now() + file.originalname);
//     }
// });

// var upload = multer({ storage: storage });
const envVars = require('../config/env');
 module.exports = (app, db) => {
   try{
app.use(fileUpload());

app.post('/api/uploadconfig', (req, res) => {
    try{
    const {lang,lang1} = req.body;
    console.log(lang);
    if (req.files==null || Object.keys(req.files).length == 0) {
        return res.status(400).send('No files were uploaded.');
      }
    const location =  `${envVars.config_dir}/${lang}/translations`;
    console.log(location);
        fs.rename(`${location}.js`,`${location}_${(new Date()).getTime()}.js`, function(err) {
            //if ( err ) return res.status(500).send({'status':'Error','messagerenmame':err});
            if ( err ) console.log(err);
            
                fs.writeFile(`${location}.js`,req.files.config.data,function(err){
                    if(err) {
                        return  res.status(500).send({'status':'Error','message':err});
                    }
                   return res.status(200).send({'status':'Completed'});
                });
           
            
        });
        
  
    }catch(error){
        logger.error(error.stack);
        console.log(error);
    }
});
app.post('/api/saveconfig', (req, res) => {
    try{
       const langArr=['en_US','iw_IL']; 
    const {en_US,iw_IL} = req.body;
   let cnt=0;
    langArr.forEach(lang=>{
        const location =  `${envVars.config_dir}/${lang}/translations`;
        fs.rename(`${location}.js`,`${location}_${(new Date()).getTime()}.js`, function(err) {
            //if ( err ) return res.status(500).send({'status':'Error','messagerenmame':err});
            if ( err ) console.log(err);
            
                fs.writeFile(`${location}.js`,'export default '+req.body[lang],function(err){
                    cnt=cnt+1;
                    if(cnt==langArr.length) {
                        if(err) {
                            return  res.status(500).send({'status':'Error','message':err});
                        }
                       return res.status(200).send({'status':'Completed'});
                    }
                });
           
            
        });
    });
        
        
  
    }catch(error){
        logger.error(error.stack);
        console.log(error);
    }
});
app.post('/api/startapp', (req, res) => {
    try{
    const {lang,lang1} = req.body;
    var ls = spawn(require.resolve('../spotlight.sh'));
    ls.stdout.on('data', function (data) {
        console.log('stderr: ' + data);
        //return  res.status(200).send({'status':data});
    });
    
    ls.stderr.on('data', function (data) {
        console.log('stderr: ' + data);
        //return  res.status(200).send({'status':data});
    });
    
    ls.on('exit', function (code) {
        if(code>0){
            return  res.status(500).send({'message':'Unable to start application'});  
        }
        else{
            return  res.status(200).send({'status':'Application Started'});
        }
        
    });
}catch(error){
    logger.error(error.stack);
    console.log(error);
    return  res.status(500).send({'message':'There are some problem while restarting application'});  
}
});

   }catch(error){
    logger.error(error.stack);
   }

};





