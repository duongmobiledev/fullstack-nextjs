import crypto from 'crypto';
import fs from 'fs';
import jwt from 'jsonwebtoken';

import { getUnixTimestamp } from '@common/utils/backend';

import { ROLE_SCOPE } from '@constants/backend';

import keys_jwt from './keys_jwt.json';

class JWTService {
  isReady: boolean = false;
  private key: {
    privateKey: string;
    publicKey: string;
  };
  option = {};

  private setIsReady(state: boolean) {
    this.isReady = state;
  }
  private setKey(key: { privateKey: string; publicKey: string }) {
    this.key = key;
  }

  async initialize() {
    if (this.isReady) return;
    if (keys_jwt.privateKey && keys_jwt.publicKey) {
      this.setIsReady(true);
      this.setKey({
        privateKey: keys_jwt.privateKey,
        publicKey: keys_jwt.publicKey,
      });
      console.log('✅ =>> JWT is ready to sign');
    } else {
      const key = crypto.generateKeyPairSync('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
          type: 'spki',
          format: 'pem',
        },
        privateKeyEncoding: {
          type: 'pkcs8',
          format: 'pem',
        },
      });
      const data = JSON.stringify(key);
      fs.writeFileSync('./src/services/backend/keys_jwt.json', data, {
        encoding: 'utf-8',
      });
      this.setIsReady(true);
      this.setKey(key);
      console.log('✅ =>> JWT is ready to sign');
    }
  }
  // unit expiresIn is second
  createJWT(scope: ROLE_SCOPE, email: string, expiresIn: number) {
    return jwt.sign({ scope, iat: getUnixTimestamp() }, this.key.privateKey, {
      issuer: process.env.TOKEN_ISS,
      subject: email,
      expiresIn,
      algorithm: 'RS256',
    });
  }

  verify(token: string) {
    const value = jwt.verify(token, this.key.publicKey);
    return value as {
      scope: 'read' | 'read write' | 'read write admin';
      sub: string;
      iat: number;
      exp: number;
    };
  }
}

const instance = new JWTService();

export default instance;
