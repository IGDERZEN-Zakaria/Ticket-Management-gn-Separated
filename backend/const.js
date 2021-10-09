const PENDING = 'PENDING'; 
const IN_PROGRESS = 'IN_PROGRESS'; 
const FINISHED = 'FINISHED';
const FAILED = 'FAILED';

const ASSISTANT_FR = 'ASSISTANT_FR';
const ASSISTANT_DZ = 'ASSISTANT_DZ';
const ADMIN = 'ADMIN';

const USER_ROLE = [ASSISTANT_FR, ASSISTANT_DZ, ADMIN];

const TICKET_STATUS = [PENDING, IN_PROGRESS, FINISHED,FAILED];


exports.USER_ROLE = USER_ROLE;
exports.ADMIN = ADMIN;
exports.ASSISTANT_DZ = ASSISTANT_DZ;
exports.ASSISTANT_FR = ASSISTANT_FR;


exports.TICKET_STATUS = TICKET_STATUS;
exports.PENDING = PENDING;
exports.IN_PROGRESS = IN_PROGRESS;
exports.FINISHED = FINISHED;
exports.FAILED = FAILED;
