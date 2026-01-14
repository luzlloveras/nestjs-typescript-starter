import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ProductsService } from './products.service';
import { Product } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product';
import { UpdateProductDto } from './dto/update-product';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('ProductsService', () => {
  let service: ProductsService;
  let model: any;

  const mockProduct = {
    _id: '507f1f77bcf86cd799439011',
    name: 'Test Product',
    price: 99.99,
    currency: 'USD',
    categories: ['Electronics'],
    measurements: {
      height: 10,
      width: 20,
      weight: 0.5,
    },
  };

  const mockProductModel = {
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    exec: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getModelToken(Product.name),
          useValue: mockProductModel,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    model = module.get(getModelToken(Product.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const mockQuery = {
        exec: jest.fn().mockResolvedValue([mockProduct]),
      };
      mockProductModel.find.mockReturnValue(mockQuery);

      const result = await service.findAll();

      expect(result).toEqual([mockProduct]);
      expect(model.find).toHaveBeenCalled();
    });

    it('should throw BadRequestException on error', async () => {
      mockProductModel.find.mockReturnValue({
        exec: jest.fn().mockRejectedValue(new Error('Database error')),
      });

      await expect(service.findAll()).rejects.toThrow(BadRequestException);
    });
  });

  describe('findOne', () => {
    it('should return a product by id', async () => {
      const mockQuery = {
        exec: jest.fn().mockResolvedValue(mockProduct),
      };
      mockProductModel.findById.mockReturnValue(mockQuery);

      const result = await service.findOne('507f1f77bcf86cd799439011');

      expect(result).toEqual(mockProduct);
      expect(model.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });

    it('should throw BadRequestException for invalid ID format', async () => {
      await expect(service.findOne('invalid-id')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException when product not found', async () => {
      const mockQuery = {
        exec: jest.fn().mockResolvedValue(null),
      };
      mockProductModel.findById.mockReturnValue(mockQuery);

      await expect(service.findOne('507f1f77bcf86cd799439011')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const createProductDto: CreateProductDto = {
        name: 'New Product',
        price: 199.99,
        currency: 'USD',
        categories: ['Electronics'],
        measurements: {
          height: 15,
          width: 25,
          weight: 1.0,
        },
      };

      const mockCreatedProduct = {
        ...mockProduct,
        ...createProductDto,
        save: jest.fn().mockResolvedValue(mockProduct),
      };

      mockProductModel.create.mockReturnValue(mockCreatedProduct);

      const result = await service.create(createProductDto);

      expect(model.create).toHaveBeenCalledWith(createProductDto);
      expect(result).toBeDefined();
    });

    it('should throw BadRequestException on error', async () => {
      const createProductDto: CreateProductDto = {
        name: 'New Product',
        price: 199.99,
        currency: 'USD',
        categories: ['Electronics'],
        measurements: {
          height: 15,
          width: 25,
          weight: 1.0,
        },
      };

      mockProductModel.create.mockImplementation(() => {
        throw new Error('Database error');
      });

      await expect(service.create(createProductDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const updateProductDto: UpdateProductDto = {
        name: 'Updated Product',
      };

      const mockQuery = {
        exec: jest.fn().mockResolvedValue({
          ...mockProduct,
          ...updateProductDto,
        }),
      };
      mockProductModel.findByIdAndUpdate.mockReturnValue(mockQuery);

      const result = await service.update(
        '507f1f77bcf86cd799439011',
        updateProductDto,
      );

      expect(result).toMatchObject(updateProductDto);
      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        updateProductDto,
        { new: true },
      );
    });

    it('should throw NotFoundException when product not found', async () => {
      const updateProductDto: UpdateProductDto = {
        name: 'Updated Product',
      };

      const mockQuery = {
        exec: jest.fn().mockResolvedValue(null),
      };
      mockProductModel.findByIdAndUpdate.mockReturnValue(mockQuery);

      await expect(
        service.update('507f1f77bcf86cd799439011', updateProductDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a product', async () => {
      const mockQuery = {
        exec: jest.fn().mockResolvedValue(mockProduct),
      };
      mockProductModel.findByIdAndDelete.mockReturnValue(mockQuery);

      await service.remove('507f1f77bcf86cd799439011');

      expect(model.findByIdAndDelete).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
      );
    });

    it('should throw NotFoundException when product not found', async () => {
      const mockQuery = {
        exec: jest.fn().mockResolvedValue(null),
      };
      mockProductModel.findByIdAndDelete.mockReturnValue(mockQuery);

      await expect(service.remove('507f1f77bcf86cd799439011')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
