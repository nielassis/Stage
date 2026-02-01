import { DocumentType } from '../generated/prisma/enums';

export class DocumentValidator {
  static clean(value: string): string {
    return value.replace(/\D/g, '');
  }

  static validateCPF(cpf: string): boolean {
    cpf = this.clean(cpf);

    if (cpf.length !== 11) return false;
    if (/^(\d)\1+$/.test(cpf)) return false;

    let sum = 0;
    for (let i = 0; i < 9; i++) sum += Number(cpf[i]) * (10 - i);
    let firstDigit = (sum * 10) % 11;
    if (firstDigit === 10) firstDigit = 0;

    if (firstDigit !== Number(cpf[9])) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) sum += Number(cpf[i]) * (11 - i);
    let secondDigit = (sum * 10) % 11;
    if (secondDigit === 10) secondDigit = 0;

    return secondDigit === Number(cpf[10]);
  }

  static validateCNPJ(cnpj: string): boolean {
    cnpj = this.clean(cnpj);

    if (cnpj.length !== 14) return false;

    if (/^(\d)\1+$/.test(cnpj)) return false;

    const calc = (base: number[]) => {
      let i = 0;
      const numbers = cnpj.split('').map(Number);
      return numbers.slice(0, base.length).reduce((acc, num) => {
        acc += num * base[i++];
        return acc;
      }, 0);
    };

    const base1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const base2 = [6, ...base1];

    const digit1 = calc(base1) % 11 < 2 ? 0 : 11 - (calc(base1) % 11);
    if (digit1 !== Number(cnpj[12])) return false;

    const digit2 = calc(base2) % 11 < 2 ? 0 : 11 - (calc(base2) % 11);
    return digit2 === Number(cnpj[13]);
  }

  static validate(
    type: DocumentType,
    value: string,
  ): { valid: boolean; cleaned: string } {
    const cleaned = this.clean(value);

    let valid = false;

    if (type === DocumentType.CPF) valid = this.validateCPF(cleaned);
    if (type === DocumentType.CNPJ) valid = this.validateCNPJ(cleaned);

    return { valid, cleaned };
  }
}
