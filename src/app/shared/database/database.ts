import Dexie, { Table } from "dexie";

export class Database extends Dexie {

    albuns!: Table<DatabaseAlbum, number>;

    constructor() {
        super('ngdexieliveQuery');
        this.version(2).stores({
            albuns: '++id, uriSpotify'
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