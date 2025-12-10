import { InferInsertModel, InferSelectModel } from 'drizzle-orm';

import { User } from 'src/common/drizzle/schema';

export interface ICreateUser extends InferInsertModel<User> {}
export interface IUser extends InferSelectModel<User> {}
