const fs = require('fs');
const express = require('express');
const server = express();

class Eintrag {
    public wer: string;
    public was: string;
    public wo: string;
    public wann: Date;

    constructor(wer: string, was: string, wo: string, wann: Date) {
        this.wer = wer;
        this.was = was;
        this.wo = wo;
        this.wann = wann;
    }
}

class Einkaufsliste {
    private list: Eintrag[] = [];

    constructor() {
    }

    getItems(): Eintrag[] {
        return this.list;
    }

    addItem(wer: string, was: string, wo: string, wann: Date): void {
        this.list.push(new Eintrag(wer, was, wo, wann));
    }

    removeItem(e: number): void {
        this.list.splice(e, 1);
    }

    updateItem(n: number, u: Eintrag): void {
        this.list[n].wer = u.wer;
        this.list[n].was = u.was;
        this.list[n].wo = u.wo;
        this.list[n].wo = u.wo;
    }

    getHTML(): string {
        let html: string;
        html = '<tr>' +
            '<th>Wer</th>' +
            '<th>Was</th>' +
            '<th>Wo</th>' +
            '<th>Wann</th>' +
            '<th>Update/Back/Delete</th>' +
            '</tr>'
        this.list.forEach(x => {
            html = html + '<tr>' +
                '<td contenteditable>' + x.wer + '</td>' +
                '<td contenteditable>' + x.was + '</td>' +
                '<td contenteditable>' + x.wo + '</td>' +
                '<td contenteditable>' + x.wann + '</td>' +
                '<td></td>' +
                '</tr>'
        });
        return html;
    }

    saveJSON(): void {
       fs.writeFile("data.json", JSON.stringify(this.list), (err) => {
           if(err) console.log("Cannot Save JSON")
       });
    }

    loadJSON(): void {
        let data = JSON.parse(fs.readFileSync("data.json"));
        for(let i = 0; i < data.length; i++) {
            this.addItem(data[i].wer, data[i].was, data[i].wo, data[i].wann);
        }
    }
}



const ek = new Einkaufsliste();

ek.loadJSON();

server.use("/scripts", express.static(__dirname + "/scripts"));
server.use("/styles", express.static(__dirname + "/styles"));
server.use(express.json());

server.get('/', (req, res) => {
    res.status(200);
    res.sendFile(__dirname + "/html/index.html");
});

server.post('/new', (req, res) => {
    ek.addItem(req.body.name, "", "", new Date(Date.now()));

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
    res.status(200);
    res.send("Successfully updated");
});

server.post('/remove', (req, res) => {
    ek.removeItem(req.body.id);
    res.status(200);
    res.send("Successfully removed");
});

server.get('/get', (req, res) => {
    res.status(200);
    res.send(ek.getHTML());
});

server.listen('8080');