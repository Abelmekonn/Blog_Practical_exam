import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { ValidationException } from '../exceptions';

@Injectable()
export class EnhancedValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    // Transform plain object to class instance
    const object = plainToInstance(metatype, value);

    // Validate the object
    const errors = await validate(object, {
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      disableErrorMessages: false,
      validateCustomDecorators: true,
    });

    if (errors.length > 0) {
      // Format validation errors
      const formattedErrors = errors.map((error) => {
        const constraints = error.constraints || {};
        const field = error.property;
        const value = error.value;

        const messages = Object.values(constraints);
        const message = messages.length > 0 ? messages[0] : 'Validation failed';

        return new ValidationException(field, value, message as string);
      });

      // Throw the first validation error
      throw formattedErrors[0];
    }

    return object;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
