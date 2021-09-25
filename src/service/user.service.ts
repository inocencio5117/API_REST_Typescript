import { DocumentDefinition } from 'mongoose';
import User, { UserDocument } from '../model/user.model';

export async function createUser(input: DocumentDefinition<UserDocument>): Promise<any> {
  try {
    return await User.create(input);
  } catch (error: any) {
    throw new Error(error);
  }
}

// function findUser() {}
