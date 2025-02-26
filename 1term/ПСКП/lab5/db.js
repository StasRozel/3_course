export default class Database {
    _db = [];

    constructor(arr) {
        this._db = arr;
    }

    select() {
        return this._db;
    }

    insert(string) {
        let obj = {
            id: this._db[this._db.length-1].id + 1,
            name: string.name,
            bday: string.bday
        }
        this._db.push(obj);
        return this._db;
    }

    update(obj) {
        this._db[obj.id - 1] = obj;
        return this._db;
    }

    delete(numberString) {
        return this._db.splice(numberString, 1);
    }
}