import Dexie, { Table } from "dexie";

export class Database extends Dexie {

    albuns!: Table<DatabaseAlbum, number>;

    constructor() {
        super('ngdexieliveQuery');
        this.version(1).stores({
            albuns: '++id, &nome'
        });
    }
    
}

export interface DatabaseAlbum {
    nome: string,
    uriSpotify: string,
    urlImagem: string,
    artistas: string[]
}

export const database = new Database();