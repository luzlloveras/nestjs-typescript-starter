import { IsString, IsNumber, IsArray, IsObject, Min, ArrayMinSize, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class MeasurementsDto {
  @ApiProperty()
  @IsNumber()
  @Min(0)
  height!: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  width!: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  weight!: number;
}

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  price!: number;

  @ApiProperty()
  @IsString()
  currency!: string;

  @ApiProperty()
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  categories!: string[];

  @ApiProperty({ type: MeasurementsDto })
  @IsObject()
  @ValidateNested()
  @Type(() => MeasurementsDto)
  measurements!: MeasurementsDto;
}