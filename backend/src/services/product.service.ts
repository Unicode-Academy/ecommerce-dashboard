import { NotFoundException } from "../exceptions/NotFoundException";
import { ProductFindManyArgs, ProductWhereInput } from "../generated/prisma/models";
import { prisma } from "../libs/prisma";
import { ProductData, ProductQuery } from "../types/product.type";

export const productService = {
  findAll({ status, s, category, page = 1, limit = 10 }: ProductQuery) {
    const filters = {} as ProductWhereInput;
    if (["true", "false"].includes(status)) {
      filters.status = status === "true";
    }
    if (category) {
      filters.categoryId = +category;
    }
    if (s) {
      filters.name = {
        contains: s,
      };
    }
    const skip = (page - 1) * limit;
    const options = {
      orderBy: {
        createdAt: "desc",
      },
      include: {
        category: true,
        images: true,
      },
      where: filters,
      take: +limit,
      skip,
    } as ProductFindManyArgs;
    return Promise.all([
      prisma.product.findMany(options),
      prisma.product.count({
        where: filters,
      }),
    ]);

  },
  async find(id: number) {
    const product = await prisma.product.findUnique({
      where: {
        id
      },
      include: {
        images: true
      }
    });

    if (!product) {
      throw new NotFoundException("Product not found");
    }

    return product
  },
  async create({ images, ...productData }: ProductData) {
    return prisma.product.create({
      data: {
        ...productData,
        images: {
          create: images.map((image) => ({
            image,
          })),
        },
      },
    });
  },
  async update({ images = [], ...productData }: ProductData, id: number) {
    const productImagesOnDb = await prisma.productImage.findMany({
      where: {
        productId: id
      }
    });

    const imageCreate = images.filter((image) => !productImagesOnDb.find(val => val.image === image));

    const imageDelete = productImagesOnDb.filter((val) => !images.includes(val.image)).map((val) => val.id);

    const [products] = await prisma.$transaction([
      prisma.product.update({
        where: {
          id
        },
        include: {
          images: true
        },
        data: {
          ...productData,
          images: {
            createMany: {
              data: imageCreate.map((val: string) => ({
                image: val
              }))
            }
          },
        },
      }),
      prisma.productImage.deleteMany({
        where: {
          id: {
            in: imageDelete
          }
        }
      })
    ]);

    return products;
  },

  async delete(id: number) {
    const [product] = await prisma.$transaction([
      prisma.productImage.deleteMany({
        where: {
          productId: id
        }
      }),
      prisma.product.delete({
        where: {
          id
        },
      })
    ])
    return product;
  }
};
