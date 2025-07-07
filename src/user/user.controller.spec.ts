import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { SerializeInterceptor } from 'src/interceptors/serialize.interceptor';
import { NotFoundException } from '@nestjs/common';

describe('UserController', () => {
  let controller: UserController;
  let fakeUserService: Partial<UserService>;
  let fakeAuthService: Partial<AuthService>;
  let fakeSerializeInterceptor: Partial<SerializeInterceptor>;

  beforeEach(async () => {
    fakeUserService = {
      findOne: (id: number) => { 
        return Promise.resolve({id, email: 'test@test.com', password: 'password'} as User)
      },
      find: (email:string) => {
        return Promise.resolve([{ id: 1, email, password: 'password123'} as User])
      },
      // remove: () => {},
      // update: () => {}
    };
    fakeAuthService = {
      // signUp: () => {},
      signIn: (email:string, password:string) => {
        return Promise.resolve({id: 1, email, password} as User)
      }
    };
    fakeSerializeInterceptor = {};

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: fakeUserService
        },
        {
          provide: AuthService,
          useValue: fakeAuthService
        }
      ]
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers returns a list of users with the given email', async () => {
    const users = await controller.findAllUsers('test@test.com');

    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('test@test.com');
  });

  it('findUser returns a single user with the given id', async () => {
    const user = await controller.findUser('1');

    expect(user).toBeDefined();
  })

  it('throws an error if user with given id is not found', async () => {
    fakeUserService.findOne = () => null;

    expect(controller.findUser('1')).rejects.toThrow(NotFoundException);
  });

  it('signIn updates session object and returns user', async () => {
    const session = { userId: -1 };

    const user = await controller.signIn({email: 'test@test.com', password: 'password'}, session);

    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });
});
