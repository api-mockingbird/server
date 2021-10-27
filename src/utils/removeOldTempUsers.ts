import { removeOldTempUsers } from '../service/user.service';

import db from '../db';

removeOldTempUsers(db);
