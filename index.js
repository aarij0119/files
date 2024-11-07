const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs')

app.set("view engine", 'ejs')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))



app.get('/', function (req, res) {
    fs.readdir('./files', function (err, files) {
        res.render("index", { files: files })
    })
})

app.get('/file/:filename', function (req, res) {
    const filename = req.params.filename.trim();
    fs.readFile(`./files/${filename}`, "utf-8", function (err, filedata) {
        if (err) {
            console.log(err)
        } else {
            res.render('show', { filename: filename, filedata: filedata });  // Render the file content
        }
    });
});


app.get('/edit/:filename', function (req, res) {
    res.render('edit', { filename: req.params.filename })
})

app.post('/edit', function (req, res) {
    const previousName = req.body.previousname.trim();
    const newName = req.body.newname.trim();
    fs.rename(`./files/${previousName}`, `./files/${newName}.txt`, function (err) {
        if (err) {
            console.log("Error is", err)
        } else {
            res.redirect('/')
        }
    })
})

app.post('/create', function (req, res) {
    const filename = req.body.title.trim().split(' ').join('') + '.txt';
    fs.writeFile(`./files/${filename}`, req.body.desc, function (err) {
        if (err) {
            console.error("Error writing file:", err);
            return res.status(500).send("Error saving file");
        }
        res.redirect('/');
    });
});



app.listen(3000)