import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { BaseDto } from '../base-dto/base.dto';

export class ProductResDto extends BaseDto {
  @ApiProperty({ required: false })
  @IsNumber()
  readonly id?: number;

  @ApiProperty({ required: true })
  @IsString()
  readonly articleId?: string;

  @ApiProperty({ required: false })
  @IsString()
  readonly productCode?: string;

  @ApiProperty({ required: false })
  @IsString()
  readonly prodName?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  readonly productTypeNo?: number;

  @ApiProperty({ required: false })
  @IsString()
  readonly productTypeName?: string;

  @ApiProperty({ required: false })
  @IsString()
  readonly productGroupName?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  readonly graphicalAppearanceNo?: number;

  @ApiProperty({ required: false })
  @IsString()
  readonly graphicalAppearanceName?: string;

  @ApiProperty({ required: false })
  @IsString()
  readonly colourGroupCode?: string;

  @ApiProperty({ required: false })
  @IsString()
  readonly colourGroupName?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  readonly perceivedColourValueId?: number;

  @ApiProperty({ required: false })
  @IsString()
  readonly perceivedColourValueName?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  readonly perceivedColourMasterId?: number;

  @ApiProperty({ required: false })
  @IsString()
  readonly perceivedColourMasterName?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  readonly departmentNo?: number;

  @ApiProperty({ required: false })
  @IsString()
  readonly departmentName?: string;

  @ApiProperty({ required: false })
  @IsString()
  readonly indexCode?: string;

  @ApiProperty({ required: false })
  @IsString()
  readonly indexName?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  readonly indexGroupNo?: number;

  @ApiProperty({ required: false })
  @IsString()
  readonly indexGroupName?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  readonly sectionNo?: number;

  @ApiProperty({ required: false })
  @IsString()
  readonly sectionName?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  readonly garmentGroupNo?: number;

  @ApiProperty({ required: false })
  @IsString()
  readonly garmentGroupName?: string;

  @ApiProperty({ required: false })
  @IsString()
  readonly detailDesc?: string;

  @ApiProperty({ required: true })
  @IsString()
  readonly sku?: string;

  @ApiProperty({ required: true })
  @IsNumber()
  readonly categoryId?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  readonly inventoryId?: number;

  @ApiProperty({ required: true })
  @IsNumber()
  readonly discountId?: number;

  @ApiProperty({ required: true })
  @IsNumber()
  readonly price?: number;

  @ApiProperty({ required: false })
  @IsString()
  readonly imageUrl?: string;
}
