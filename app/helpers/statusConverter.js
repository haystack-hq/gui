class StatusConverter{
    static getStateFromStatus(status) {
        const statusMap = {
            'pending': 'pending',
            'running': 'active',
            'starting': 'pending',
            'terminating': 'pending',
            'stopped': 'inactive'
        };

        return statusMap[status] ? statusMap[status] : status;
    }
}
module.exports = StatusConverter;