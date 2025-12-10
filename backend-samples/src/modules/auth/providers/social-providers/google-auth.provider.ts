import { Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';

import { GoogleConfig } from 'src/common/config/env.validation';
import {
  PropertyPilotUnauthorizedException,
  PropertyPilotValidationException,
} from 'src/common/exceptions/custom.exception';

import { SocialProvider } from '../../enums/social-provider.enum';
import { ISocialUser } from '../../interfaces/social-providers/social-user.interface';
import { ISocialAuthProvider } from '../../interfaces/social-providers/social.provider.interface';

export const GoogleOAuthToken = Symbol('GoogleOAuthToken');

@Injectable()
export class GoogleOAuthProvider implements ISocialAuthProvider {
  googleAuthClient: OAuth2Client;

  constructor(private readonly googleConfig: GoogleConfig) {
    this.googleAuthClient = new OAuth2Client({
      clientId: this.googleConfig.CLIENTID,
      clientSecret: this.googleConfig.CLIENTSECRET,
      redirectUri: this.googleConfig.REDIRECTURL,
    });
  }

  verifyUser(data: { code?: string; idToken?: string }): Promise<ISocialUser> {
    if (data.code) {
      return this.handleSignupWithCode(data.code);
    } else if (data.idToken) {
      return this.handleSignupWithIdToken(data.idToken);
    }
    throw new PropertyPilotValidationException(
      'Code or idToken should be provided',
    );
  }

  private async handleSignupWithCode(code: string): Promise<ISocialUser> {
    try {
      const tokenResponse = await this.googleAuthClient.getToken(code);
      const ticket = await this.googleAuthClient.verifyIdToken({
        idToken: tokenResponse.tokens.id_token as string,
      });
      const data = ticket.getPayload();
      return {
        email: data.email,
        firstName: data.given_name,
        lastName: data.family_name,
        provider: SocialProvider.GOOGLE,
      };
    } catch (e) {
      throw new PropertyPilotUnauthorizedException(
        'Invalid Google Token: ' + e.message,
      );
    }
  }

  private async handleSignupWithIdToken(idToken: string): Promise<ISocialUser> {
    try {
      const ticket = await this.googleAuthClient.verifyIdToken({
        idToken,
      });
      const data = ticket.getPayload();
      return {
        email: data.email,
        firstName: data.given_name,
        lastName: data.family_name,
        provider: SocialProvider.GOOGLE,
      };
    } catch (e) {
      throw new PropertyPilotUnauthorizedException(
        'Invalid Google Token: ' + e.message,
      );
    }
  }
}
