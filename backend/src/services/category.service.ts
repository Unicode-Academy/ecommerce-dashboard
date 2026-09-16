import { NotFoundException } from "../exceptions/NotFoundException";
import { prisma } from "../libs/prisma";
import { CategoryData, CategoryQuery } from "../types/category.type";
import {
  CategoryFindManyArgs,
  CategoryWhereInput,
} from "../generated/prisma/models";

export const categoryService = {
  findAll({ status, s, page = 1, limit = 10 }: CategoryQuery) {
    const filters = {} as CategoryWhereInput;
    if (["true", "false"].includes(status)) {
      filters.status = status === "true";
    }
    if (s) {
      filters.name = {
        contains: s,
      };
    }
    const skip = (page - 1) * limit;
    const options = {
      orderBy: {
        id: "desc",
      },
      where: filters,
      take: +limit,
      skip,
    } as CategoryFindManyArgs;
    if (+limit === -1) {
      delete options.take;
    }
    return Promise.all([
      prisma.category.findMany(options),
      prisma.category.count({
        where: filters,
      }),
    ]);
  },
  create(categoryData: CategoryData) {
    return prisma.category.create({
      data: categoryData,
    });
  },
  async find(id: number) {
    const category = await prisma.category.findUnique({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException("Category not found");
    }
    return category;
  },
  update(categoryData: CategoryData, id: number) {
    return prisma.category.update({
      where: { id },
      data: categoryData,
    });
  },
  delete(id: number) {
    return prisma.category.delete({
      where: { id },
    });
  },
};
