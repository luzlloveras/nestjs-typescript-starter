import {
  Controller,
  Param,
  Get,
  Post,
  Delete,
  Body,
  Put,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBody,
  ApiNoContentResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ProductsService } from './products.service';
import { Product } from './interfaces/products';
import { CreateProductDto } from './dto/create-product';
import { UpdateProductDto } from './dto/update-product';

@ApiTags('Products')
@Controller('products')
@UseGuards(ThrottlerGuard)
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'List products' })
  @ApiOkResponse({
    description: 'Returns all products.',
    schema: {
      example: [
        {
          id: '64cfa2f3d3f1a12b0c9a0001',
          name: 'Sample product',
          price: 49.9,
          currency: 'USD',
          categories: ['category'],
          measurements: { height: 10, width: 5, weight: 1 },
        },
      ],
    },
  })
  findAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by id' })
  @ApiOkResponse({
    description: 'Returns a single product.',
    schema: {
      example: {
        id: '64cfa2f3d3f1a12b0c9a0001',
        name: 'Sample product',
        price: 49.9,
        currency: 'USD',
        categories: ['category'],
        measurements: { height: 10, width: 5, weight: 1 },
      },
    },
  })
  findOne(@Param('id') id: string): Promise<Product> {
    return this.productsService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a product' })
  @ApiBody({
    schema: {
      example: {
        name: 'Sample product',
        price: 49.9,
        currency: 'USD',
        categories: ['category'],
        measurements: { height: 10, width: 5, weight: 1 },
      },
    },
  })
  @ApiCreatedResponse({ description: 'Product created.' })
  create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productsService.create(createProductDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a product' })
  @ApiBody({
    schema: {
      example: {
        name: 'Updated product',
        price: 59.9,
        currency: 'USD',
        categories: ['category'],
        measurements: { height: 12, width: 6, weight: 1.2 },
      },
    },
  })
  @ApiOkResponse({ description: 'Product updated.' })
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a product' })
  @ApiNoContentResponse({
    description: 'Product deleted.',
    schema: { example: null },
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.productsService.remove(id);
  }
}