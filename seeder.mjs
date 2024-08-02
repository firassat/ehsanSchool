import {
  classes,
  military_services,
  nationalities,
  sections,
  sectors,
  social_statuses,
} from "./dataSeeder.js";
import connectDb from "./config/conectDb.mjs";
import { configDotenv } from "dotenv";
import { Classes } from "./models/Classes.mjs";
import { Sections } from "./models/Sections.mjs";
import { Social_statuses } from "./models/social_statuses.mjs";
import { Sectors } from "./models/Sectors.mjs";
import { Nationalities } from "./models/Nationalities.mjs";
import { Military_services } from "./models/Military_services.mjs";

configDotenv();
connectDb();

// Import Books (seeding database)
const importData = async () => {
  try {
    await Classes.insertMany(classes);
    await Sections.insertMany(sections);
    await Social_statuses.insertMany(social_statuses);
    await Sectors.insertMany(sectors);
    await Nationalities.insertMany(nationalities);
    await Military_services.insertMany(military_services);
    console.log(" Imported");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

// Remove Books
const removeData = async () => {
  try {
    await Classes.deleteMany();
    await Sections.deleteMany();
    await Social_statuses.deleteMany();
    await Sectors.deleteMany();
    await Nationalities.deleteMany();
    await Military_services.deleteMany();
    console.log(" Removed!");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

// node seeder.mjs -import
if (process.argv[2] === "-import") {
  importData();
} else if (process.argv[2] === "-remove") {
  removeData();
}
