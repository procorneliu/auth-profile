import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';

describe('UsersService', () => {
  let service: UsersService;
  let userModel: any;

  beforeEach(async () => {
    userModel = {
      findByIdAndUpdate: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getModelToken('User'), useValue: userModel },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should update user data', async () => {
    userModel.findByIdAndUpdate.mockResolvedValueOnce({
      id: '1',
      firstName: 'Nest',
    });

    const result = await service.update('1', { firstName: 'Nest' });

    expect(result.firstName).toBe('Nest');
  });
});
