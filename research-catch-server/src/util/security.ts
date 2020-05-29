import fs = require('fs');
import crypto = require('crypto');

const { promisify } = require('util');
const jwt = require('jsonwebtoken');
import SHA3 = require('crypto-js/sha3');

export const randomBytes = promisify(crypto.randomBytes);

export const signJwt = promisify(jwt.sign);


let cert, privkey, pubkey;
if (fs.existsSync('cert.pem')) {
  // Look for production keys, if available
  console.log('Loading production certs.')
  cert = fs.readFileSync('cert.pem');
  privkey = fs.readFileSync('key.pem');
  pubkey = fs.readFileSync('public.key');
} else {
  // TEMPORARY Keys used for signing JWT - NOT SECURE! (Publicly committed)
  cert = fs.readFileSync('src/keys/temp-cert.pem');
  privkey = fs.readFileSync('src/keys/temp-priv-key.pem');
  pubkey = fs.readFileSync('src/keys/temp-pub-key.pem');
}
export const RSA_CERT = cert;
export const RSA_PRIVATE_KEY = privkey;
export const RSA_PUBLIC_KEY = pubkey;

export async function decodeJwt(token: string) {
  const payload = await jwt.verify(token, RSA_PUBLIC_KEY);
  // console.log('Decoded JWT payload', payload);
  return payload;
}

export async function decodeJwtObject(token: string) {
  if (!token) {
    console.log('No token passed', token);
    return undefined;
  }
  const payload = await jwt.verify(token, RSA_PUBLIC_KEY);
  if (payload && payload.sub) {
    return JSON.parse(payload.sub);
  } else {
    return undefined;
  }
}

interface JwtPayload {
  iat: number,
  exp: number,
  sub: any
}

export async function checkRoles(payload: JwtPayload, application: string, roles: string[]) { // Decoded JWT payload expected
  if (!roles || !payload.sub) {
    throw new Error('Cannot check roles: bad payload or roles.');
  }
  const userinfo = JSON.parse(payload.sub);

  for (let desiredRole of roles) {
    for (let role of userinfo.roles) {
      if (userinfo.applicationName == application && userinfo.roles.includes(desiredRole)) {
        console.log('Valid Matched role: ' + application + ' ' + role);
        return true;
      }
    }
  }
  console.error('User has no matching roles. Required: ' + roles);
  return false;
}
