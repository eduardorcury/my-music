import { Album } from "./album.model";

export enum OrderingType {

    DECADA = "por década",
    ARTISTA = "por artista",
    NOTA = "por nota"

}

export class OrderedAlbumList {

    public albuns: Album[];
    private _albunsAgrupados = new Map();

    constructor(albuns: Album[]) {
        this.albuns = albuns;
    }

    orderBy(type: OrderingType): void {
        this._albunsAgrupados = new Map();
        switch (type) {
            case OrderingType.DECADA:
                this.albuns.forEach(album => {
                    const lancamento = Math.floor(+album.dataDeLancamento.split("-")[0] / 10) * 10;
                    const collection = this.albunsAgrupados.get(lancamento);
                    if (!collection) {
                        this.albunsAgrupados.set(lancamento, [album])
                    } else {
                        collection.push(album)
                    }
                })
                this.sortByRating();
                break;
            case OrderingType.ARTISTA: 
                this.albuns.forEach(album => {
                    const collection = this.albunsAgrupados.get(album.artistas[0]);
                    if (!collection) {
                        this.albunsAgrupados.set(album.artistas[0], [album])
                    } else {
                        collection.push(album)
                    }
                })
                this.sortByRating();
                break;
            case OrderingType.NOTA:
                this.albuns.forEach(album => {
                    const collection = this.albunsAgrupados.get(Math.floor(+album.nota));
                    if (!collection) {
                        this.albunsAgrupados.set(Math.floor(+album.nota), [album])
                    } else {
                        collection.push(album)
                    }
                })
                this.sortByRating();
                break;
            default:
                this.sortByRating();
                break;
        }
    }

    public get albunsAgrupados() {
        return this._albunsAgrupados;
    }

    private sortByRating() {
        this.albunsAgrupados.forEach((list: Album[]) => {
            list.sort((a, b) => parseFloat(b.nota) - parseFloat(a.nota));
        });
    }

}

