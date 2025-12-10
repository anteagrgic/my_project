import { relations } from 'drizzle-orm/relations';

import { TokenTable, UserTable, VerificationCodeTable } from './schema';

export const TokenRelations = relations(TokenTable, ({ one }) => ({
  user: one(UserTable, {
    fields: [TokenTable.userId],
    references: [UserTable.id],
  }),
}));

export const VerificationCodeRelations = relations(
  VerificationCodeTable,
  ({ one }) => ({
    user: one(UserTable, {
      fields: [VerificationCodeTable.userId],
      references: [UserTable.id],
    }),
  }),
);
