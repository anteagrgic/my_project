"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerificationCodeTable = exports.TokenTable = exports.UserTable = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
exports.UserTable = (0, pg_core_1.pgTable)('users', {
    id: (0, pg_core_1.uuid)('user_id')
        .notNull()
        .primaryKey()
        .default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    email: (0, pg_core_1.varchar)('email', { length: 255 }).notNull(),
    password: (0, pg_core_1.varchar)('password', { length: 255 }).notNull(),
    firstName: (0, pg_core_1.varchar)('first_name', { length: 100 }).notNull(),
    lastName: (0, pg_core_1.varchar)('last_name', { length: 100 }).notNull(),
    phone: (0, pg_core_1.varchar)('phone', { length: 20 }),
    profilePhotoUrl: (0, pg_core_1.varchar)('profile_photo_url', { length: 500 }),
    isVerified: (0, pg_core_1.boolean)('is_verified').notNull().default(false),
    accountType: (0, pg_core_1.varchar)('account_type', { length: 20 })
        .notNull()
        .default('FREEMIUM'),
    trialStartDate: (0, pg_core_1.date)('trial_start_date'),
    trialEndDate: (0, pg_core_1.date)('trial_end_date'),
    subscriptionStatus: (0, pg_core_1.varchar)('subscription_status', { length: 20 }).default('ACTIVE'),
    notificationEmail: (0, pg_core_1.boolean)('notification_email').default(true),
    notificationPush: (0, pg_core_1.boolean)('notification_push').default(true),
    locationServices: (0, pg_core_1.boolean)('location_services').default(false),
    darkMode: (0, pg_core_1.varchar)('dark_mode', { length: 20 }).default('SYSTEM'),
    authProvider: (0, pg_core_1.varchar)('auth_provider', { length: 50 }),
    authProviderId: (0, pg_core_1.varchar)('auth_provider_id', { length: 255 }),
    lastLoginAt: (0, pg_core_1.timestamp)('last_login_at', { withTimezone: true }),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true })
        .notNull()
        .defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true })
        .notNull()
        .defaultNow(),
}, (users) => ({
    emailUnique: (0, pg_core_1.unique)('users_email_key').on(users.email),
    idxEmail: (0, pg_core_1.index)('idx_users_email').on(users.email),
    idxAuth: (0, pg_core_1.index)('idx_users_auth').on(users.authProvider, users.authProviderId),
}));
exports.TokenTable = (0, pg_core_1.pgTable)('tokens', {
    id: (0, pg_core_1.uuid)('id')
        .notNull()
        .primaryKey()
        .default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    refreshToken: (0, pg_core_1.varchar)('refresh_token', { length: 255 }).notNull(),
    firebaseToken: (0, pg_core_1.varchar)('firebase_token', { length: 255 }).default(null),
    userId: (0, pg_core_1.uuid)('user_id')
        .notNull()
        .references(() => exports.UserTable.id, { onDelete: 'cascade' }),
    expiresAt: (0, pg_core_1.timestamp)('expires_at', { withTimezone: true }).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true })
        .notNull()
        .defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true })
        .notNull()
        .defaultNow(),
}, (t) => ({
    idxUser: (0, pg_core_1.index)('idx_tokens_user').on(t.userId),
    idxRefreshToken: (0, pg_core_1.index)('idx_tokens_refresh_token').on(t.refreshToken),
}));
exports.VerificationCodeTable = (0, pg_core_1.pgTable)('verification_codes', {
    id: (0, pg_core_1.uuid)('id')
        .primaryKey()
        .default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    code: (0, pg_core_1.varchar)('code', { length: 255 }).notNull(),
    type: (0, pg_core_1.varchar)('type', { length: 50 }).notNull(),
    userId: (0, pg_core_1.uuid)('user_id').notNull(),
    expiresAt: (0, pg_core_1.timestamp)('expires_at', { withTimezone: true }).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true })
        .notNull()
        .defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true })
        .notNull()
        .defaultNow(),
}, (vc) => ({
    idxUser: (0, pg_core_1.index)('idx_verification_codes_user').on(vc.userId),
    idxCode: (0, pg_core_1.index)('idx_verification_codes_code').on(vc.code),
}));
//# sourceMappingURL=schema.js.map