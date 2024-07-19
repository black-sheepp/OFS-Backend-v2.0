// src/types/express/index.d.ts

import { IUser } from "../../utils/interface";

declare global {
	namespace Express {
		interface Request {
			user?: IUser;
		}
	}
}
