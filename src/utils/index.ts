import bcrypt from "bcrypt";

export async function encrypt(text: string) : Promise<string>{
const saltRounds = 10;
 return bcrypt.hash(text, saltRounds);
}

export async function catchError<T>(
  promise: Promise<T>
): Promise<[undefined, T] | [Error, undefined]> {
  return promise
    .then((data) => [undefined, data] as [undefined, T])
    .catch((error) => [error, undefined]);
}
