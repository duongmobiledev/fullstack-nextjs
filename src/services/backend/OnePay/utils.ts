import crypto from 'crypto';

const urlRegExp = /https?:\/\/.*/;

export { urlRegExp };

/**
 * Global function to convert String to upper case, with type checking
 *
 * @param {string} s
 * @return {string} all upper case string
 */
export function toUpperCase(s: string = ''): string {
  if (typeof s !== 'string') {
    throw new Error('toUpperCase:param must be string');
  }

  return s.toUpperCase();
}

/**
 * Equivalent to PHP's `pack` function, using Node native Buffer
 * <br>
 * Note: PHP
 * <br>
 * <pre>    <code>pack('H*', data)</code></pre>
 * is equivalent to Node:
 * <br>
 * <pre>    <code>Buffer.from(data, 'hex')</code></pre>
 *
 * @param {*} data
 * @param {*} encoding
 * @return {Buffer} Buffer of data encoded with `encoding` method
 */
export function pack(data: any, encoding: BufferEncoding = 'hex'): Buffer {
  return Buffer.from(data, encoding);
}

/**
 * Equivalent to PHP's `hash_hmac` function.
 *
 * @param  {string} algorithm  hashing algorithm
 * @param  {*}      data       data string to be hashed
 * @param  {Buffer} secret     Secret key used to hash data, generated with `pack` method
 * @return {string}            digested hash
 */
export function hashHmac(algorithm: string, data: any, secret: Buffer): string {
  const hmac = crypto.createHmac(algorithm, secret);
  hmac.update(data);

  return hmac.digest('hex');
}
