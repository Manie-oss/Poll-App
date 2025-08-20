import bcrypt from "bcrypt";

export async function encryptText(text: string) : Promise<string>{
const saltRounds = 10;
 return bcrypt.hash(text, saltRounds);
}

export async function compareText(text: string, hashedPass: string) : Promise<boolean>{
  return bcrypt.compare(text, hashedPass);
}

export async function catchError<T>(
  promise: Promise<T>
): Promise<[undefined, T] | [Error, undefined]> {
  return promise
    .then((data) => [undefined, data] as [undefined, T])
    .catch((error) => [error, undefined]);
}
