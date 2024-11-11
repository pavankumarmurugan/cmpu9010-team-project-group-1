import { validate } from 'class-validator';
import { UserReqDTO } from 'src/core/dto/user/user-req.dto';

describe('UserReqDTO', () => {
  it('should validate a valid UserReqDTO', async () => {
    const dto = new UserReqDTO();
    dto.username = 'testuser';
    dto.firstname = 'John';
    dto.lastname = 'Doe';
    dto.password = 'password123';
    dto.role = 'user';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation if username is missing', async () => {
    const dto = new UserReqDTO();
    dto.firstname = 'John';
    dto.lastname = 'Doe';
    dto.password = 'password123';
    dto.role = 'user';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail validation if role is invalid', async () => {
    const dto = new UserReqDTO();
    dto.username = 'testuser';
    dto.firstname = 'John';
    dto.lastname = 'Doe';
    dto.password = 'password123';
    dto.role = 'invalidrole';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
