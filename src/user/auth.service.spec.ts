import { Test } from "@nestjs/testing";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserService } from "./user.service";
import { User } from "./user.entity";

describe('AuthService', () => {
  let service: AuthService;
  let fakeUserService: Partial<UserService>;

  beforeEach(async () => {
    const users: User[] = [];
    fakeUserService = {
      find: (email:string) => {
        const filteredUsers = users.filter(user => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email:string, password: string) => {
        const user = { id: Math.floor(Math.random() * 999999), email, password} as User;
        users.push(user);
        return Promise.resolve(user);
      }
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: fakeUserService
        }
      ]
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const plainTextPassword = 'abc123456'; 
    
    const user = await service.signUp('unit-test@test.com', plainTextPassword);

    expect(user.password).not.toEqual(plainTextPassword);

    const [salt, hash] = user.password.split('.');

    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    await service.signUp('test@test.com', 'abc123456');

    await expect(service.signUp('test@test.com', 'abc123456')).rejects.toThrow(BadRequestException);
  });

  it('throws an error if sign in is called with an unused email', async () => {
    await expect(
      service.signIn('signin@unit.test', 'abc123456')
    ).rejects.toThrow(NotFoundException);
  });

  it('throw an error if an invalid password is provided', async () =>  {
    await service.signUp('test@test.com', 'abc123456');

    await expect(service.signIn('test@test.com', 'password'))
      .rejects.toThrow(BadRequestException);
  });

  it('returns a user if correct password if provided', async () => {
    await service.signUp('test@test.com', 'abc123');

    const user = await service.signIn('test@test.com', 'abc123');
    
    expect(user).toBeDefined();
  });
});