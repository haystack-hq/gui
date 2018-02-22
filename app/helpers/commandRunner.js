const exec = require('child_process').exec;

class CommandRunner {
    constructor(command){
        this.command = command;
    }

    get_output(callback) {
        return exec(this.command, (err, out, stderr) => {
            callback(err, out, stderr);
        });
    }

    run() {
        return exec(this.command);
    }
}

module.exports = CommandRunner;
