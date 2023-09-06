import bcrypt from 'bcrypt';

export const encode = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt)
}
export const decode = async (password: string, hashedpassword: string): Promise<boolean> => {
    return await bcrypt.compare(password, hashedpassword)
}
