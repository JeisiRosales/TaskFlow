import { IsNotEmpty, IsString, IsOptional, Matches } from 'class-validator';

export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty()
    category_name: string;

    @IsString()
    @IsOptional()
    category_descrip?: string;

    @IsString()
    @IsOptional()
    @Matches(/^#[0-9A-Fa-f]{6}$/, { message: 'Color debe ser formato HEX (#RRGGBB)' })
    category_color?: string;
}
