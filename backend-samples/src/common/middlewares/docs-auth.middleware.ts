/* eslint-disable @typescript-eslint/explicit-function-return-type */

import * as auth from 'express-basic-auth';
export const createDocsAuthMiddleware = (username: string, password: string) =>
  auth({
    challenge: true,
    users: { [username]: password },
  });
