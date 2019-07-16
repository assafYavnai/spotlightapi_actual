import fs from 'fs';
const fileUpload = require('express-fileupload');

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
   
app.use(fileUpload());

app.post('/api/uploadconfig', (req, res) => {
    const {lang,lang1} = req.body;
    console.log(lang);
    if (req.files==null || Object.keys(req.files).length == 0) {
        return res.status(400).send('No files were uploaded.');
      }
    const location =  `${envVars.config_dir}/${lang}/translations`;
    console.log(location);
        fs.rename(`${location}.js`,`${location}_${(new Date()).getTime()}.js`, function(err) {
            //if ( err ) return res.status(500).send({'status':'Error','messagerenmame':err});
            
                fs.writeFile(`${location}.js`,req.files.config.data,function(err){
                    if(err) {
                        return  res.status(500).send({'status':'Error','message':err});
                    }
                   return res.status(200).send({'status':'Completed'});
                });
           
            
        });
        
  
   
});
};





