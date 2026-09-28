import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function deleteAllData() {
  const tablenames = [
    "TaskAssignment",
    "Comment",
    "Attachment",
    "Task",
    "ProjectTeam",
    "User",
    "Project",
    "Team",
  ];

  for (const tablename of tablenames) {
    try {
      await prisma.$executeRawUnsafe(
        `TRUNCATE TABLE "${tablename}" RESTART IDENTITY CASCADE;`
      );
      console.log(`Cleared data from ${tablename}`);
    } catch (error) {
      console.error(`Error clearing data from ${tablename}:`, error);
    }
  }
}

async function main() {
  const dataDirectory = path.join(__dirname, "seedData");

  const orderedFileNames = [
    "team.json",
    "project.json",
    "projectTeam.json",
    "user.json",
    "task.json",
    "attachment.json",
    "comment.json",
    "taskAssignment.json",
  ];

  await deleteAllData();

  for (const fileName of orderedFileNames) {
    const filePath = path.join(dataDirectory, fileName);
    const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const modelName = path.basename(fileName, path.extname(fileName));
    const model: any = prisma[modelName as keyof typeof prisma];

    try {
      for (const data of jsonData) {
        await model.create({ data });
      }
      console.log(`Seeded ${modelName} with data from ${fileName}`);
    } catch (error) {
      console.error(`Error seeding data for ${modelName}:`, error);
    }
  }

  await resetSequences();
}

async function resetSequences() {
  const tables = [
    { name: "User", idCol: "userId" },
    { name: "Team", idCol: "id" },
    { name: "Project", idCol: "id" },
    { name: "ProjectTeam", idCol: "id" },
    { name: "Task", idCol: "id" },
    { name: "TaskAssignment", idCol: "id" },
    { name: "Attachment", idCol: "id" },
    { name: "Comment", idCol: "id" },
  ];

  for (const table of tables) {
    try {
      await prisma.$executeRawUnsafe(
        `SELECT setval(pg_get_serial_sequence('"${table.name}"', '${table.idCol}'), coalesce(max("${table.idCol}"), 0) + 1, false) FROM "${table.name}";`
      );
      console.log(`Reset sequence for ${table.name}`);
    } catch (error) {
      console.error(`Error resetting sequence for ${table.name}:`, error);
    }
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());










// import { PrismaClient } from "@prisma/client";
// import fs from "fs";
// import path from "path";
// const prisma = new PrismaClient();

// async function deleteAllData(orderedFileNames: string[]) {
//   const modelNames = orderedFileNames.map((fileName) => {
//     const modelName = path.basename(fileName, path.extname(fileName));
//     return modelName.charAt(0).toUpperCase() + modelName.slice(1);
//   });

//   for (const modelName of modelNames) {
//     const model: any = prisma[modelName as keyof typeof prisma];
//     try {
//       await model.deleteMany({});
//       console.log(`Cleared data from ${modelName}`);
//     } catch (error) {
//       console.error(`Error clearing data from ${modelName}:`, error);
//     }
//   }
// }

// async function main() {
//   const dataDirectory = path.join(__dirname, "seedData");

//   const orderedFileNames = [
//     "team.json",
//     "project.json",
//     "projectTeam.json",
//     "user.json",
//     "task.json",
//     "attachment.json",
//     "comment.json",
//     "taskAssignment.json",
//   ];

//   await deleteAllData(orderedFileNames);

//   for (const fileName of orderedFileNames) {
//     const filePath = path.join(dataDirectory, fileName);
//     const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
//     const modelName = path.basename(fileName, path.extname(fileName));
//     const model: any = prisma[modelName as keyof typeof prisma];

//     try {
//       for (const data of jsonData) {
//         await model.create({ data });
//       }
//       console.log(`Seeded ${modelName} with data from ${fileName}`);
//     } catch (error) {
//       console.error(`Error seeding data for ${modelName}:`, error);
//     }
//   }
// }

// main()
//   .catch((e) => console.error(e))
//   .finally(async () => await prisma.$disconnect());