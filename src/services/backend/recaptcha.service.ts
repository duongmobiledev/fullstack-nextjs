import axios from 'axios';

class RecaptchaService {
  private verificationUrl: string;

  constructor(responseToken: string) {
    this.verificationUrl =
      'https://www.google.com/recaptcha/api/siteverify?secret=' +
      process.env.NEXT_PUBLIC_SECRET_RECAPCHA +
      '&response=' +
      responseToken;
  }

  async verify(): Promise<{ success: true }> {
    const res = await axios.get(this.verificationUrl);
    return res.data;
  }
}

export default RecaptchaService;
