import { describe, it, expect } from 'vitest'
import { emailToDocId, emailToToken, tokenToEmail } from './email'

describe('emailToDocId', () => {
  it('replaces every non-alphanumeric character with an underscore', () => {
    expect(emailToDocId('juan.delacruz+ph@gmail.com')).toBe('juan_delacruz_ph_gmail_com')
  })
})

describe('emailToToken / tokenToEmail', () => {
  it('round-trips an email through the token', () => {
    const token = emailToToken('Juan@Gmail.com')
    expect(tokenToEmail(token)).toBe('juan@gmail.com') // normalized to lowercase
  })

  it('trims and lowercases before encoding', () => {
    expect(emailToToken('  HELLO@X.COM  ')).toBe(emailToToken('hello@x.com'))
  })

  it('returns null for an invalid token', () => {
    expect(tokenToEmail('@@@@')).toBeNull()
  })
})
