import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsIn,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import {
  CATEGORY_SUBCATEGORY_MAP,
  VALID_COLORS,
  VALID_MATERIALS,
  VALID_OCCASIONS,
  VALID_PATTERNS,
} from './categories.map';

@ValidatorConstraint({ name: 'isValidSubcategory', async: false })
export class IsValidSubcategory implements ValidatorConstraintInterface {
  validate(type: string, args: ValidationArguments) {
    const category = (args.object as any).category;
    if (!category || !CATEGORY_SUBCATEGORY_MAP[category]) {
      return false; // Invalid category
    }
    const validSubcategories = CATEGORY_SUBCATEGORY_MAP[category];
    return validSubcategories.includes(type); // Validate type
  }

  defaultMessage(args: ValidationArguments) {
    const category = (args.object as any).category;
    const validSubcategories =
      CATEGORY_SUBCATEGORY_MAP[category]?.join(', ') || 'None';
    return `Type must be one of: ${validSubcategories}`;
  }
}

@ValidatorConstraint({ name: 'isValidOccasion', async: false })
export class IsValidOccasion implements ValidatorConstraintInterface {
  validate(occasion: string): boolean {
    return VALID_OCCASIONS.includes(occasion);
  }

  defaultMessage(args: ValidationArguments): string {
    return `Occasion must be one of: ${VALID_OCCASIONS.join(', ')}`;
  }
}

@ValidatorConstraint({ name: 'isValidColor', async: false })
export class IsValidColor implements ValidatorConstraintInterface {
  validate(color: string): boolean {
    return VALID_COLORS.includes(color);
  }

  defaultMessage(args: ValidationArguments): string {
    return `Color must be one of: ${VALID_COLORS.join(', ')}`;
  }
}

@ValidatorConstraint({ name: 'isValidMaterial', async: false })
export class IsValidMaterial implements ValidatorConstraintInterface {
  validate(material: string): boolean {
    return VALID_MATERIALS.includes(material);
  }

  defaultMessage(args: ValidationArguments): string {
    return `Material must be one of: ${VALID_MATERIALS.join(', ')}`;
  }
}

@ValidatorConstraint({ name: 'isValidPattern', async: false })
export class IsValidPattern implements ValidatorConstraintInterface {
  validate(pattern: string): boolean {
    return VALID_PATTERNS.includes(pattern);
  }

  defaultMessage(args: ValidationArguments): string {
    return `Pattern must be one of: ${VALID_PATTERNS.join(', ')}`;
  }
}

export class FilterProductsDto {
  @ApiPropertyOptional({
    example: 1,
    description: 'Page number for pagination',
  })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => parseInt(value, 10) || 1)
  page?: number;

  @ApiPropertyOptional({ example: 10, description: 'Number of items per page' })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => parseInt(value, 10) || 10)
  limit?: number;

  @ApiPropertyOptional({ example: 10, description: 'Minimum price filter' })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) =>
    value !== undefined ? parseFloat(value) : undefined,
  )
  minPrice?: number;

  @ApiPropertyOptional({ example: 200, description: 'Maximum price filter' })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) =>
    value !== undefined ? parseFloat(value) : undefined,
  )
  maxPrice?: number;

  @ApiPropertyOptional({ example: 'Black', description: 'Color filter' })
  @IsOptional()
  @IsString()
  @Validate(IsValidColor)
  color?: string;

  @ApiPropertyOptional({
    example: 'Cotton-blend',
    description: 'Material filter (e.g., Cotton-blend, Synthetic)',
  })
  @IsOptional()
  @Validate(IsValidMaterial)
  material?: string;

  @ApiPropertyOptional({
    example: 'Casual/evening',
    description: 'Occasion filter (e.g., Casual/evening, Party)',
  })
  @IsOptional()
  @Validate(IsValidOccasion)
  occasion?: string;

  @ApiPropertyOptional({
    example: 'Ladieswear',
    description: 'Category filter',
  })
  @IsOptional()
  @IsIn(Object.keys(CATEGORY_SUBCATEGORY_MAP), {
    message: `Category must be one of: ${Object.keys(CATEGORY_SUBCATEGORY_MAP).join(', ')}`,
  })
  category?: string;

  @ApiPropertyOptional({
    example: 'Top',
    description: 'Type filter (subcategory)',
  })
  @IsOptional()
  @Validate(IsValidSubcategory)
  type?: string;

  @ApiPropertyOptional({
    example: 'true',
    description: 'Filter for trail products',
  })
  @IsOptional()
  trail?: boolean;

  @ApiPropertyOptional({
    example: 'Chain and geometric',
    description: 'Pattern filter (e.g., Floral, Solid)',
  })
  @IsOptional()
  @Validate(IsValidPattern)
  pattern?: string;
}
