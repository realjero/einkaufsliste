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
}
