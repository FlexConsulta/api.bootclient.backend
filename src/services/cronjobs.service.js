const { CronJob } = require('cron');

module.exports = class CronManager {
    constructor() {
        this._jobs = {};
    }
    add(name, periodText, fn) {
        this._jobs[name] = {
            name,
            cron: new CronJob(periodText, fn, null, true)
        };
    }
    stop(name) {
        delete this._jobs[name];
    }
    delete(name) {
        delete this._jobs[name];
    }
    stopAll() {
        for (let cron in this._jobs) {
            let activeCron = this._jobs[cron].cron.running;
            if (activeCron.running) {
                activeCron.stop();
            }
        }
    }
    list() {
        return this._jobs;
    }
    running(name) {
        return this._jobs[name].cron.running;
    }
    lastDate(name) {
        return this._jobs[name].cron.lastDate();
    }
    nextDates(name) {
        return this._jobs[name].cron.nextDates();
    }
}