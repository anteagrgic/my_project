import {
  Inject,
  Injectable,
  LoggerService,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { utc } from 'moment';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { JwtConfig } from 'src/common/config/env.validation';
import { CryptoUtils } from 'src/common/utils/crypto.utils';

import { RefreshTokenDto } from '../../dtos/refresh-token.dto';
import { IJWTProvider } from '../../interfaces/jwt-token/jwt-provider.service.interface';
import {
  ICreateToken,
  IJWTTokenGeneratePayload,
  IJwtTokenData,
  IJwtTokenPair,
} from '../../interfaces/jwt-token/token.interface';
import {
  ITokenRepository,
  TokenRepositoryToken,
} from '../../interfaces/jwt-token/token.repository.interface';

@Injectable()
export class JWTProvider implements IJWTProvider {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly jwtService: JwtService,
    private readonly jwtConfig: JwtConfig,
    @Inject(TokenRepositoryToken)
    private readonly tokenRepository: ITokenRepository,
  ) {}

  verify(token: string): IJwtTokenData {
    try {
      return this.jwtService.verify<IJwtTokenData>(token, {
        secret: this.jwtConfig.ACCESSTOKENSECRET,
      });
    } catch (error) {
      this.logger.error(error);
      throw new UnauthorizedException('Token is invalid');
    }
  }

  generatePair(data: IJWTTokenGeneratePayload): IJwtTokenPair {
    const accessTokenExpiration = utc()
      .add(this.jwtConfig.ACCESSTOKENEXPIRATION, 's')
      .unix();

    const tokenData: IJwtTokenData = {
      subject: data.id,
      expiration: accessTokenExpiration,
    };

    const accessToken = this.jwtService.sign(tokenData, {
      secret: this.jwtConfig.ACCESSTOKENSECRET,
    });

    const refreshToken = CryptoUtils.generateToken(128);

    return { accessToken, refreshToken };
  }

  async generatePairAndSave(
    data: IJWTTokenGeneratePayload,
  ): Promise<IJwtTokenPair> {
    const userId = data.id;
    const tokenPair = this.generatePair(data);

    if (tokenPair.accessToken && tokenPair.refreshToken) {
      const tokens = await this.tokenRepository.getTokensByUserId(userId);
      const expiresAt = utc()
        .add(this.jwtConfig.REFRESHEXPIRESINSECONDS, 's')
        .toDate();

      if (tokens.length >= this.jwtConfig.MAXREFRESHTOKENS) {
        await this.tokenRepository.deleteTokenById(tokens[0].id);
      }

      const tokenToCreate = {
        userId,
        refreshToken: tokenPair.refreshToken,
        firebaseToken: data.firebaseToken,
        expiresAt,
      } as ICreateToken;

      await this.tokenRepository.createToken(tokenToCreate);
    }
    return tokenPair;
  }

  async refreshToken(data: RefreshTokenDto): Promise<IJwtTokenPair> {
    const token = await this.tokenRepository.getTokenByRefreshToken(
      data.refreshToken,
    );

    if (!token) {
      throw new UnauthorizedException('Refresh token is invalid');
    }

    if (utc().isAfter(utc(token.expiresAt))) {
      throw new UnauthorizedException('Refresh token has expired');
    }

    const tokens = await this.generatePairAndSave({
      id: token.userId,
      firebaseToken: token.firebaseToken,
    });
    await this.tokenRepository.deleteTokenById(token.id);

    return tokens;
  }

  async deleteRefreshTokensForUser(userId: string): Promise<void> {
    await this.tokenRepository.deleteTokensByUserId(userId);
  }

  async deleteByUserAndFirebaseToken(
    userId: string,
    firebaseToken: string,
  ): Promise<void> {
    await this.tokenRepository.deleteByUserIdAndFirebaseToken(
      userId,
      firebaseToken,
    );
  }

  async deleteByUser(userId: string): Promise<void> {
    await this.tokenRepository.deleteTokensByUserId(userId);
  }
}
