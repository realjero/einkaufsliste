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
    private liste: Eintrag[];

    constructor(liste: Eintrag[]) {
        this.liste = liste;
    }

    get(): Eintrag[] {
        return this.liste;
    }

    add(wer: string, was: string, wo: string, wann: Date): void {
        this.liste.push(new Eintrag(wer, was, wo, wann));
    }

    remove(e: Eintrag): void {
        const index: number = this.liste.indexOf(e);
        if (index != -1) {
            this.liste.splice(index, 1);
        }
    }

    update(e: Eintrag, u: Eintrag): void {
        const index: number = this.liste.indexOf(e);
        if (index != -1) {
            this.liste[index].wer = u.wer;
            this.liste[index].was = u.was;
            this.liste[index].wo = u.wo;
            this.liste[index].wo = u.wo;
        }
    }

    getAsHTML(): string {
        let html: string;
        html = '<table>' +
            '<tr>' +
            '<th>Wer</th>' +
            '<th>Was</th>' +
            '<th>Wo</th>' +
            '<th>Wann</th>' +
            '<th>Update/Back/Delete</th>' +
            '</tr>'
        this.liste.forEach(x => {
            html = html + '<tr>' +
                '<td contenteditable>' + x.was + '</td>' +
                '<td contenteditable>' + x.wer + '</td>' +
                '<td contenteditable>' + x.wo + '</td>' +
                '<td contenteditable>' + x.wann + '</td>' +
                '<td></td>' +
                '</tr>'
        });
        html = html + '</table>'
        return html;
    }
}


server.use("/script", express.static(__dirname + "/script"));
server.use("/styles", express.static(__dirname + "/styles"));
server.use(express.json());

server.get('/', (req, res) => {
    res.status(200);
    res.sendFile(__dirname + "/html/index.html");
});

server.get('/new', (req, res) => {
    res.status(200);
});

server.get('/save', (req, res) => {
    res.status(200);
});

server.post('/update', (req, res) => {
    res.status(200);
});

server.get('/back', (req, res) => {
    res.status(200);
});

server.post('/delete', (req, res) => {
    res.status(200);
});

server.listen('8080');