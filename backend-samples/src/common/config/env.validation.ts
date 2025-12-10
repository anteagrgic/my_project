import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { Environment } from '../constants/environment.enum';

export class NodeConfig {
  @IsEnum(Environment, {
    message: `NODE_ENV must be one of the following values: ${Object.values(
      Environment,
    )}`,
  })
  public readonly ENV!: Environment;
}

export class ProjectConfig {
  @IsString({ message: 'PROJECT_NAME must be a string' })
  public readonly NAME!: string;

  @IsString({ message: 'PROJECT_DESCRIPTION must be a string' })
  public readonly DESCRIPTION!: string;

  @IsString({ message: 'PROJECT_VERSION must be a string' })
  public readonly VERSION!: string;
}

export class SwaggerConfig {
  @IsString({ message: 'SWAGGER_USERNAME must be a string' })
  public readonly USERNAME!: string;

  @IsString({ message: 'SWAGGER_PASSWORD must be a string' })
  public readonly PASSWORD!: string;
}

export class AppConfig {
  @Transform(({ value }) => Number(value))
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'PORT must be a number' },
  )
  public readonly PORT!: number;

  @Type(() => NodeConfig)
  @ValidateNested()
  public readonly NODE!: NodeConfig;

  @Transform(({ value }) => Boolean(value))
  @IsBoolean()
  public readonly CLUSTERING!: boolean;
}

export class DrizzleOrmConfig {
  @IsString({ message: 'POSTGRES_HOST must be a string' })
  public readonly HOST!: string;

  @Transform(({ value }) => Number(value))
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'POSTGRES_PORT must be a number' },
  )
  public readonly PORT!: number;

  @IsString({ message: 'POSTGRES_USERNAME must be a string' })
  public readonly USERNAME!: string;

  @IsString({ message: 'POSTGRES_PASSWORD must be a string' })
  public readonly PASSWORD!: string;

  @IsString({ message: 'POSTGRES_DBNAME must be a string' })
  public readonly DBNAME!: string;
}
export class SendgridConfig {
  @IsString({ message: 'SENDGRID_APIKEY must be a string' })
  APIKEY!: string;
}

export enum EmailProvider {
  SENDGRID = 'sendgrid',
}

export class MailerConfig {
  @IsString({ message: 'MAILER_EMAIL must be a string' })
  @IsEmail({}, { message: 'MAILER_EMAIL must be a valid email address' })
  EMAIL!: string;

  @IsEnum(EmailProvider, {
    message: 'EMAIL_PROVIDER must be: sendgrid',
  })
  PROVIDER!: EmailProvider;
}

export class FirebaseConfig {
  @IsString({ message: 'FIREBASE_PROJECTID must be a string' })
  public readonly PROJECTID!: string;

  @IsString({ message: 'FIREBASE_PRIVATEKEY must be a string' })
  @Transform(({ value }) => value.replace(/\\n/gm, '\n'))
  public readonly PRIVATEKEY!: string;

  @IsString({ message: 'FIREBASE_EMAIL must be a string' })
  public readonly EMAIL!: string;
}

export class S3Config {
  @IsString({ message: 'S3_ACCESSKEY must be a string' })
  ACCESSKEY!: string;

  @IsString({ message: 'S3_SECRET must be a string' })
  SECRET!: string;

  @IsString({ message: 'S3_BUCKET must be a string' })
  BUCKET!: string;

  @IsString({ message: 'S3_REGION must be a string' })
  REGION!: string;

  @IsString({ message: 'S3_ENDPOINT must be a string' })
  ENDPOINT!: string;
}

export class JwtConfig {
  @IsString({ message: 'JWT_ACCESS_TOKEN_SECRET must be a string' })
  public readonly ACCESSTOKENSECRET!: string;

  @IsString({ message: 'JWT_ACCESS_TOKEN_EXPIRATION must be a string' })
  public readonly ACCESSTOKENEXPIRATION!: string;

  @IsString({ message: 'JWT_REFRESH_TOKEN_SECRET must be a string' })
  public readonly REFRESHTOKENSECRET!: string;

  @IsString({ message: 'JWT_REFRESH_TOKEN_EXPIRATION must be a string' })
  public readonly REFRESHTOKENEXPIRATION!: string;

  @Transform(({ value }) => Number(value))
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'JWT_MAX_REFRESH_TOKENS must be a number' },
  )
  public readonly MAXREFRESHTOKENS!: number;

  @IsString({ message: 'JWT_REFRESH_EXPIRES_IN_SECONDS must be a string' })
  public readonly REFRESHEXPIRESINSECONDS!: string;
}

export class OpenAiConfig {
  @IsString({ message: 'OPENAI_AI_APIKEY must be a string' })
  public readonly APIKEY!: string;
}

export class GoogleConfig {
  @IsString({ message: 'GOOGLE_CLIENTID must be a string' })
  public readonly CLIENTID!: string;

  @IsString({ message: 'GOOGLE_CLIENTSECRET must be a string' })
  public readonly CLIENTSECRET!: string;

  @IsString({ message: 'GOOGLE_REDIRECTURL must be a string' })
  public readonly REDIRECTURL!: string;
}

export class AppleConfig {
  @IsString({ message: 'APPLE_APIURL must be a string' })
  public readonly APIURL!: string;

  @IsString({ message: 'APPLE_CLIENTID must be a string' })
  public readonly CLIENTID!: string;
}

export class TwilioConfig {
  @IsString({ message: 'TWILIO_SID must be a string' })
  public readonly SID!: string;

  @IsString({ message: 'TWILIO_TOKEN must be a string' })
  public readonly TOKEN!: string;

  @IsString({ message: 'TWILIO_PHONE must be a string' })
  public readonly PHONE!: string;

  @IsString({ message: 'TWILIO_APISID must be a string' })
  public readonly APISID!: string;

  @IsString({ message: 'TWILIO_APISECRET must be a string' })
  public readonly APISECRET!: string;

  @IsString({ message: 'TWILIO_APPSID must be a string' })
  public readonly APPSID!: string;
}

export class FrontendConfig {
  @IsString({ message: 'FRONTEND_URL must be a string' })
  public readonly URL!: string;
}

export class RootConfig {
  @Type(() => AppConfig)
  @ValidateNested()
  public readonly APP!: AppConfig;

  @Type(() => ProjectConfig)
  @ValidateNested()
  public readonly PROJECT!: ProjectConfig;

  @Type(() => SwaggerConfig)
  @ValidateNested()
  public readonly SWAGGER!: SwaggerConfig;

  @Type(() => DrizzleOrmConfig)
  @ValidateNested()
  public readonly POSTGRES!: DrizzleOrmConfig;

  @Type(() => SendgridConfig)
  @ValidateNested()
  public readonly SENDGRID!: SendgridConfig;

  @Type(() => MailerConfig)
  @ValidateNested()
  public readonly MAILER!: MailerConfig;

  @Type(() => FirebaseConfig)
  @ValidateNested()
  public readonly FIREBASE!: FirebaseConfig;

  @Type(() => S3Config)
  @ValidateNested()
  public readonly S3!: S3Config;

  @Type(() => JwtConfig)
  @ValidateNested()
  public readonly JWT!: JwtConfig;

  @Type(() => OpenAiConfig)
  @ValidateNested()
  public readonly OPENAI!: OpenAiConfig;

  @Type(() => GoogleConfig)
  @ValidateNested()
  public readonly GOOGLE!: GoogleConfig;

  @Type(() => AppleConfig)
  @ValidateNested()
  public readonly APPLE!: AppleConfig;

  @Type(() => TwilioConfig)
  @ValidateNested()
  public readonly TWILIO!: TwilioConfig;

  @Type(() => FrontendConfig)
  @ValidateNested()
  public readonly FRONTEND!: FrontendConfig;
}
