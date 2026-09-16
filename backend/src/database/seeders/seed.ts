import { prisma } from "../../libs/prisma";
import { faker } from "@faker-js/faker";
const main = async () => {
  const data = [];
  await prisma.category.deleteMany({});
  for (let i = 0; i < 50; i++) {
    data.push({
      name: faker.lorem.words(5),
      status: faker.datatype.boolean(),
    });
  }
  await prisma.category.createMany({
    data,
  });
};

main()
  .then(() => {
    console.log("Thành công");
    process.exit(1);
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
