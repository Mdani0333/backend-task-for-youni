import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateProductDto, UpdateProductDto } from 'src/app/dtos';
import { Product } from '../app/models/entities/products.entity';
import { ProductsService } from '../app/products/products.service';

describe('ProductsService', () => {
  let productsService: ProductsService;
  let productRepository: Repository<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useClass: Repository,
        },
      ],
    }).compile();

    productsService = module.get<ProductsService>(ProductsService);
    productRepository = module.get<Repository<Product>>(
      getRepositoryToken(Product),
    );
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Product 1',
        price: 9,
        description: 'Description 1',
      };
      const expectedResult = { ...createProductDto, id: 1 } as Product;

      jest.spyOn(productRepository, 'create').mockReturnValue(expectedResult);
      jest.spyOn(productRepository, 'save').mockResolvedValue(expectedResult);
      const result = await productsService.create(createProductDto);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const expectedResult = [
        { id: 1, name: 'Product 1', price: 9, description: 'Description 1' },
      ] as Product[];

      jest.spyOn(productRepository, 'find').mockResolvedValue(expectedResult);
      const result = await productsService.findAll();

      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should return a product by id', async () => {
      const productId = 1;
      const expectedResult = {
        id: productId,
        name: 'Product 1',
        price: 9,
        description: 'Description 1',
      } as Product;

      jest
        .spyOn(productRepository, 'findOneBy')
        .mockResolvedValue(expectedResult);
      const result = await productsService.findOne(productId);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    it('should update a product by id', async () => {
      const productId = 1;
      const updateProductDto: UpdateProductDto = { name: 'Updated Product' };
      const existingProduct = {
        id: productId,
        name: 'Product 1',
        price: 9,
        description: 'Description 1',
      } as Product;
      const expectedResult = {
        ...existingProduct,
        ...updateProductDto,
      } as Product;

      jest
        .spyOn(productRepository, 'findOneBy')
        .mockResolvedValue(existingProduct);
      jest.spyOn(productRepository, 'update').mockResolvedValue(undefined);
      jest
        .spyOn(productRepository, 'findOneBy')
        .mockResolvedValue(expectedResult);
      const result = await productsService.update(productId, updateProductDto);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('remove', () => {
    it('should remove a product by id', async () => {
      const productId = 1;
      const existingProduct = {
        id: productId,
        name: 'Product 1',
        price: 9,
        description: 'Description 1',
      } as Product;

      jest
        .spyOn(productRepository, 'findOneBy')
        .mockResolvedValue(existingProduct);
      jest.spyOn(productRepository, 'remove').mockResolvedValue(undefined);
      const result = await productsService.remove(productId);

      expect(result).toEqual({
        message: `Product with id ${productId} is removed successfully!`,
      });
    });
  });
});
