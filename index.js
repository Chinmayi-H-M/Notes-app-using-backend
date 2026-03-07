const express=require('express');
const app=express();
const path=require('path');
const fs = require('fs');

app.set('view engine','ejs');
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));

app.get('/',function(req,res){
    fs.readdir('./files',function(err,files){
        res.render('index',{files:files});
    })
    
})
app.get('/file/:filename',function(req,res){
    const filename = req.params.filename;
    fs.readFile(`./files/${filename}`, 'utf8', function(err, data){
        if(err){
            res.status(404).send('File not found');
        } else {
            res.render('show',{
                filename: filename,
                data: data
            });
        }
    });
})
app.get('/edit/:filename', function(req,res){

    fs.readFile(`./files/${req.params.filename}`, "utf-8", function(err,data){

        res.render("edit", {
            filename: req.params.filename,
            details: data
        });

    });

});

app.post('/create',function(req,res){
    fs.writeFile(`./files/${req.body.title.split(" ").join('')}.txt`,req.body.details,function(err){
        res.redirect('/');
    });
})
// app.post('/edit',function(req,res){
//     fs.rename(`./files/${req.body.previousName}`,`./files/${req.body.newName}`,function(err){
//         res.redirect('/');
//     })
// })

app.post('/edit', function(req,res){

    let oldPath = `./files/${req.body.previousName}`;
    let newName = req.body.newName || req.body.previousName;
    let newPath = `./files/${newName}`;

    // rename file
    fs.rename(oldPath, newPath, function(err){

        if(err){
            console.log(err);
        }

        // update file content
        fs.writeFile(newPath, req.body.newDetails, function(err){

            if(err){
                console.log(err);
            }

            res.redirect('/');
        });

    });

});
app.listen(3000);