class StatusConverter{
    static getStatusString(status) {
        const statusMap = {
            0: 'mount-error',   //mount is broken
            1: 'mount-active', //no activity, mounted
            2: 'mount-pending', //activity is happening
            3: 'mount-none'
        };

        return statusMap[status];
    }
}
module.exports = StatusConverter;