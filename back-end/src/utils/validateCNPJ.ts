function clean(value: string): string {
  return value.replace(/\D/g, '');
}

export function validateCNPJ(cnpj: string): boolean {
  cnpj = clean(cnpj);

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

export function normalizeCNPJ(value: string): string {
  return clean(value);
}
