import { hash } from 'bcrypt';
import { Service } from 'typedi';
import { CreateUserDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/httpException';
import { User } from '@interfaces/users.interface';
import { UserModel } from '@models/users.model';
const FCM = require('fcm-node');
import { FIREBASE_CONFIG_ACCOUNT, PRIVATE_KEY } from '@/config/firebase';
import * as admin from "firebase-admin";

@Service()
export class UserService {
  private fcm: any;
  private certPath: admin.credential.Credential;

  constructor() {
    this.fcm = new FCM(PRIVATE_KEY);
    admin.initializeApp({
      credential: admin.credential.cert(FIREBASE_CONFIG_ACCOUNT),
    });

    this.certPath = admin.credential.cert(FIREBASE_CONFIG_ACCOUNT);
  }

  public async findAllUser(): Promise<User[]> {
    const users: User[] = UserModel;
    return users;
  }

  public async findUserById(userId: number): Promise<User> {
    const findUser: User = UserModel.find(user => user.id === userId);
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }

  public async createUser(userData: CreateUserDto): Promise<User> {
    const findUser: User = UserModel.find(user => user.email === userData.email);
    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const createUserData: User = { id: UserModel.length + 1, ...userData, password: hashedPassword };

    return createUserData;
  }

  public async updateUser(userId: number, userData: CreateUserDto): Promise<User[]> {
    const findUser: User = UserModel.find(user => user.id === userId);
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    const hashedPassword = await hash(userData.password, 10);
    const updateUserData: User[] = UserModel.map((user: User) => {
      if (user.id === findUser.id) user = { id: userId, ...userData, password: hashedPassword };
      return user;
    });

    return updateUserData;
  }

  public async deleteUser(userId: number): Promise<User[]> {
    const findUser: User = UserModel.find(user => user.id === userId);
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    const deleteUserData: User[] = UserModel.filter(user => user.id !== findUser.id);
    return deleteUserData;
  }

  public async sendNotification({ content, title }: { title: string; content: string }) {
    const token_client = 'd80n3dwTp_tIb-6ys0xWVz:APA91bGiRafNGCDRAZuzFNxYgXUYgXjGyAgzN3H0tG45VSG_QOVAEwIddkkT4jvNgCsZ4Wqxfvp5mHMjPfW31QpBYop37IIopr0zXUE_3yHXmki21oVRIhLmcNhehsYvu0QVtCuTeCHq'
    
    return new Promise((resolve, reject) => {
      let message = {
        to: token_client,
        notification: {
          title,
          body: content,
        },
      };
      this.fcm.send(message, function (err, resp) {
        if (err) {
          reject({
            message: err,
          });
        } else {
          resolve({
            message: resp,
          });
        }
      });
    });
  }
}
