import { Inject, Injectable, LoggerService } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { JwksClient } from 'jwks-rsa';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { AppleConfig } from 'src/common/config/env.validation';
import { PropertyPilotUnauthorizedException } from 'src/common/exceptions/custom.exception';

import { SocialProvider } from '../../enums/social-provider.enum';
import { ISocialUser } from '../../interfaces/social-providers/social-user.interface';
import { ISocialAuthProvider } from '../../interfaces/social-providers/social.provider.interface';

export const AppleAuthProviderToken = Symbol('AppleAuthProviderToken');

@Injectable()
export class AppleAuthProviderService implements ISocialAuthProvider {
  apppleAuthClient: JwksClient;
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly appleConfig: AppleConfig,
  ) {
    this.apppleAuthClient = new JwksClient({
      jwksUri: this.appleConfig.APIURL,
    });
  }

  async verifyUser(data: { idToken?: string }): Promise<ISocialUser> {
    if (data.idToken) {
      return this.handleIdToken(data.idToken);
    }
    throw new Error('idToken must be provided');
  }

  private async handleIdToken(idToken: string): Promise<ISocialUser> {
    try {
      const decodedHeader = jwt.decode(idToken, { complete: true });
      if (!decodedHeader) {
        throw new PropertyPilotUnauthorizedException('Invalid Apple Token');
      }

      const key = await this.apppleAuthClient.getSigningKey(
        decodedHeader.header.kid,
      );
      const publicKey = key.getPublicKey();
      const payload: any = jwt.verify(idToken, publicKey, {
        audience: this.appleConfig.CLIENTID,
      });

      return {
        email: payload.email,
        firstName: payload.firstName || '',
        lastName: payload.lastName || '',
        provider: SocialProvider.APPLE,
      };
    } catch (e) {
      throw new PropertyPilotUnauthorizedException(
        'Invalid Apple Token: ' + e.message,
      );
    }
  }
}
