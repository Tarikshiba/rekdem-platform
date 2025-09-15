import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {

    // On récupère la clé
    const secret = configService.get<string>('JWT_SECRET');

    // On vérifie qu'elle existe bien, sinon on lance une erreur claire
    if (!secret) {
      throw new Error('JWT_SECRET n\'est pas défini dans le fichier .env');
    }

    // Si tout va bien, on continue
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: any) {
    return { id: payload.sub, email: payload.email, role: payload.role };
  }
}