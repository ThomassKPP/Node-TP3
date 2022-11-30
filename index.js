var express = require('express');
var app = express();
var port = 3000;
var unzip = require('unzip-stream');

app.get('/tp2', function (req, res) {
    var csv = require('csv-parser');
    var fs = require('fs');
    var download = require('download');
    var transfertSiege = 0;
    var Total = 0;

    function pourcentage() {
        fs.createReadStream('data/StockEtablissementLiensSuccession_utf8.zip')
            .pipe(unzip.Parse())
            .on('entry', function (entry) {
            var fileName = entry.path;
            if (fileName === "StockEtablissementLiensSuccession_utf8.csv") {
                entry.pipe(csv())
                    .on('data', function (data) {
                    if (data.transfertSiege == 'true') {
                        transfertSiege += 1;
                    }
                    Total += 1;
                })
                    .on('end', function () {
                    var percentage = transfertSiege / Total * 100;
                    var z = percentage.toFixed(2);
                    res.send("".concat(z, "% des compagnies ont transfere leur siege social avant le 1er Novembre 2022"));
                });
            }
            else {
                entry.autodrain();
            }
        });
    }
    
    if (fs.existsSync('data/StockEtablissementLiensSuccession_utf8.zip')) {
        console.log('Le fichier existe déjà');
        pourcentage();
    }
    else {
        download('https://files.data.gouv.fr/insee-sirene/StockEtablissementLiensSuccession_utf8.zip', 'data').then(function () {
            console.log('Le fichier a été téléchargé');
            pourcentage();
        });
    }
});
app.listen(port, function () { return console.log("TP Node est en marche sur ".concat(port, "!")); });

    })
})

app.listen(port, () => console.log(`TP Node est en marche sur ${port}!`))
