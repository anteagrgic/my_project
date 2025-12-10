CREATE TABLE "tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"refresh_token" varchar(255) NOT NULL,
	"firebase_token" varchar(255) DEFAULT null,
	"user_id" uuid NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"user_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255),
	"password" varchar(255),
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"phone" varchar(20),
	"profile_photo_url" varchar(500),
	"is_verified" boolean DEFAULT false NOT NULL,
	"account_type" varchar(20) DEFAULT 'FREEMIUM' NOT NULL,
	"trial_start_date" date,
	"trial_end_date" date,
	"subscription_status" varchar(20) DEFAULT 'ACTIVE',
	"notification_email" boolean DEFAULT true,
	"notification_push" boolean DEFAULT true,
	"location_services" boolean DEFAULT false,
	"dark_mode" varchar(20) DEFAULT 'SYSTEM',
	"auth_provider" varchar(50),
	"auth_provider_id" varchar(255),
	"last_login_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_key" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification_codes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar(255) NOT NULL,
	"type" varchar(50) NOT NULL,
	"user_id" uuid NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tokens" ADD CONSTRAINT "tokens_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_tokens_user" ON "tokens" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_tokens_refresh_token" ON "tokens" USING btree ("refresh_token");--> statement-breakpoint
CREATE INDEX "idx_users_email" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "idx_users_auth" ON "users" USING btree ("auth_provider","auth_provider_id");--> statement-breakpoint
CREATE INDEX "idx_verification_codes_user" ON "verification_codes" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_verification_codes_code" ON "verification_codes" USING btree ("code");