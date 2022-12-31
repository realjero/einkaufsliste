const fs = require('fs');
const express = require('express');
const server = express();

class Eintrag {
    public wer: string;
    public was: string;
    public wo: string;
    public wann: Date;

    constructor(wer: string, was: string, wo: string, wann: string) {
        this.wer = wer;
        this.was = was;
        this.wo = wo;
        this.setDate(wann);
    }

    getDate(): string {
        if(this.wann === null) return "";
        return [this.wann.getDate(),
                this.wann.getMonth()+1,
                this.wann.getFullYear()].join('.')+' '+
            [this.wann.getHours(),
                this.wann.getMinutes()].join(':');
    }

    setDate(datetime: string) {
        console.log(datetime);
        if(datetime !== null && datetime.match(/\d\d?\.\d\d?\.\d\d\d\d \d\d:\d\d.*/)) {
            const [date, time] = datetime.replace("<br>", "").split(" ");
            const [day, month, year] = date.split(".");
            const [hours, minutes] = time.split(":");
            this.wann = new Date(+year, +month - 1, +day, +hours, +minutes);
        } else {
            this.wann = null;
        }
    }
}

class Einkaufsliste {
    private list: Eintrag[] = [];

    constructor() {
    }

    addItem(wer: string, was: string, wo: string, wann: string): void {
        this.list.push(new Eintrag(wer, was, wo, wann));
    }

    removeItem(e: number): void {
        this.list.splice(e, 1);
    }

    updateItem(n: number, u: Eintrag): void {
        this.list[n].wer = u.wer;
        this.list[n].was = u.was;
        this.list[n].wo = u.wo;
        this.list[n].wann = u.wann;
    }

    getHTML(): string {
        let html: string;
        let index: number = 0;
        html = '<tr>' +
            '<th>Wer</th>' +
            '<th>Was</th>' +
            '<th>Wo</th>' +
            '<th>Wann</th>' +
            '<th>Update/Back/Delete</th>' +
            '</tr>'
        this.list.forEach(x => {
            html = html + '<tr>' +
                '<td id="table_element' + (index + 1) + '0" contenteditable="false">' + x.wer + '</td>' +
                '<td id="table_element' + (index + 1) + '1" contenteditable="false">' + x.was + '</td>' +
                '<td id="table_element' + (index + 1) + '2" contenteditable="false">' + x.wo + '</td>' +
                '<td id="table_element' + (index + 1) + '3" contenteditable="false">' + x.getDate() + '</td>' +
                '<td id="button_holder' + (index + 1) + '"></td>' +
                '</tr>';
            index++;
        });
        return html;
    }

    saveJSON(): void {
        Date.prototype.toJSON = function () {
            return [this.getDate(),
                    this.getMonth()+1,
                    this.getFullYear()].join('.')+' '+
                [this.getHours(),
                    this.getMinutes()].join(':');
        }
       fs.writeFile("data.json", JSON.stringify(this.list), (err) => {
           if(err) console.log("Cannot Save JSON");
       });
    }

    loadJSON(): void {
        this.list = [];
        let data = JSON.parse(fs.readFileSync("data.json"));
        for(let i = 0; i < data.length; i++) {
            this.addItem(data[i].wer, data[i].was, data[i].wo, data[i].wann);
        }
    }
}



const ek = new Einkaufsliste();

server.use("/scripts", express.static(__dirname + "/scripts"));
server.use("/styles", express.static(__dirname + "/styles"));
server.use(express.json());

server.get('/', (req, res) => {
    res.status(200);
    res.sendFile(__dirname + "/html/index.html");
});

server.post('/new', (req, res) => {
    ek.loadJSON();
    ek.addItem(req.body.name, "", "", "");
    ek.saveJSON();
    res.status(200);
    res.send("Successfully added: " + req.body.name);
});

server.get('/save', (req, res) => {
    ek.saveJSON();
    res.status(200);
    res.send("Successfully saved");
});

server.post('/update', (req, res) => {
    const eintrag = new Eintrag(req.body.wer, req.body.was, req.body.wo, req.body.wann);
    ek.updateItem(req.body.id, eintrag);
    ek.saveJSON();
    res.status(200);
    res.send("Successfully updated");
});

server.post('/remove', (req, res) => {
    ek.removeItem(req.body.id);
    ek.saveJSON();
    res.status(200);
    res.send("Successfully removed");
});

server.get('/get', (req, res) => {
    ek.loadJSON();
    res.status(200);
    res.send(ek.getHTML());
});

server.listen('8080');