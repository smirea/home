
const util = require('util');

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Setp', 'Oct', 'Nov', 'Dec'];

const logHelper = (method, color, args) => {
    const date = new Date;
    let dateStr = util.format('[%s %s %s:%s:%s]',
        pad(date.getDate()),
        MONTHS[date.getMonth()],
        pad(date.getHours()),
        pad(date.getMinutes()),
        pad(date.getSeconds())
    );
    if (color) dateStr = dateStr[color];

    const msg = util.format.apply(util, args);

    console[method](
        msg.split('\n').map(line => `${dateStr} ${line}`).join('\n')
    );
};

const log = (...args) => logHelper('log', 'bold', args);
const info = (...args) => logHelper('info', 'cyan', args);
const warn = (...args) => logHelper('warn', 'yellow', args);
const error = (...args) => logHelper('error', 'red', args);

const pad = num => ('00' + num).slice(-2);

module.exports = {
    log,
    info,
    warn,
    error,
};
