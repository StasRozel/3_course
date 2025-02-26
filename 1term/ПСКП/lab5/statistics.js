export default class Statistics {
    _jobFlag = false;
    _requestCount;
    _commitCount;
    _startStat;
    _endStat = ' ';

    constructor() {
        this._requestCount = 0;
        this._commitCount = 0;
    }

    init() {
        this._jobFlag = true;
        this._requestCount = 0;
        this._commitCount = 0;
        this._startStat = new Date();
    }

    close() {
        this._jobFlag = false;
        this._endStat = new Date();
        return {
            'start': this._startStat,
            'finish': this._endStat,
            'requstCount': this._requestCount,
            'commitCount': this._commitCount
        }
    }

    get getStatistics() {
        return {
            'start': this._startStat,
            'finish': this._endStat,
            'requstCount': this._requestCount,
            'commitCount': this._commitCount
        }
    }

    get requestCount() {
        return this._requestCount;
    }

    set requestCount(count) {
        if (this._jobFlag) this._requestCount++;
    }

    get commitCount() {
        return this._commitCount;
    }

    set commitCount(count) {
        if (this._jobFlag) this._commitCount++;
    }
}