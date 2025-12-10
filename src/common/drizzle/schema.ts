import { sql } from 'drizzle-orm';
import {
  boolean,
  date,
  index,
  pgTable,
  timestamp,
  unique,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const UserTable = pgTable(
  'users',
  {
    id: uuid('user_id')
      .notNull()
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    email: varchar('email', { length: 255 }),
    password: varchar('password', { length: 255 }),
    firstName: varchar('first_name', { length: 100 }).notNull(),
    lastName: varchar('last_name', { length: 100 }).notNull(),
    phone: varchar('phone', { length: 20 }).notNull(),
    profilePhotoUrl: varchar('profile_photo_url', { length: 500 }),
    isVerified: boolean('is_verified').notNull().default(false),
    accountType: varchar('account_type', { length: 20 })
      .notNull()
      .default('FREEMIUM'),
    trialStartDate: date('trial_start_date'),
    trialEndDate: date('trial_end_date'),
    subscriptionStatus: varchar('subscription_status', { length: 20 }).default(
      'ACTIVE',
    ),
    notificationEmail: boolean('notification_email').default(true),
    notificationPush: boolean('notification_push').default(true),
    locationServices: boolean('location_services').default(false),
    darkMode: varchar('dark_mode', { length: 20 }).default('SYSTEM'),
    authProvider: varchar('auth_provider', { length: 50 }),
    authProviderId: varchar('auth_provider_id', { length: 255 }),
    lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (users) => ({
    emailUnique: unique('users_email_key').on(users.email),
    idxEmail: index('idx_users_email').on(users.email),
    idxAuth: index('idx_users_auth').on(
      users.authProvider,
      users.authProviderId,
    ),
  }),
);

export type User = typeof UserTable;

export const TokenTable = pgTable(
  'tokens',
  {
    id: uuid('id')
      .notNull()
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    refreshToken: varchar('refresh_token', { length: 255 }).notNull(),
    firebaseToken: varchar('firebase_token', { length: 255 }).default(null),
    userId: uuid('user_id')
      .notNull()
      .references(() => UserTable.id, { onDelete: 'cascade' }),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    idxUser: index('idx_tokens_user').on(t.userId),
    idxRefreshToken: index('idx_tokens_refresh_token').on(t.refreshToken),
  }),
);

export type Token = typeof TokenTable;

export const VerificationCodeTable = pgTable(
  'verification_codes',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    code: varchar('code', { length: 255 }).notNull(),
    type: varchar('type', { length: 50 }).notNull(), // now varchar
    userId: uuid('user_id').notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (vc) => ({
    idxUser: index('idx_verification_codes_user').on(vc.userId),
    idxCode: index('idx_verification_codes_code').on(vc.code),
  }),
);

export type VerificationCode = typeof VerificationCodeTable;
