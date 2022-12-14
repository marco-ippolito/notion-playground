const { Client } = require("@notionhq/client");
const { readFile } = require("fs/promises");
const { join } = require("path");
require("dotenv").config();

async function run() {
  // Initializing a client
  const notion = new Client({
    auth: process.env.NOTION_TOKEN,
  });

  const videoName = "test";
  const videoBuffer = await readFile(join(process.cwd(), "mocks", "test.mp4"));
  const transcription = await readFile(
    join(process.cwd(), "mocks", "test.txt")
  );

  const databases = await notion.search({
    query: "test"
  });

  console.log(JSON.stringify(databases, null, 2));
}

run();
