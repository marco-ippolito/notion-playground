const { Client } = require("@notionhq/client");
const { readFile } = require("fs/promises");
const { join } = require("path");
require("dotenv").config();

async function run() {
  // Initializing a client
  const notion = new Client({
    auth: process.env.NOTION_TOKEN,
  });

  const transcription = await readFile(
    join(process.cwd(), "mocks", "test.txt"),
    "utf-8"
  );

  const transcriptionBlock = splitTranscription(transcription, 2000);

  const databases = await notion.search({
    query: "DATABASE NAME?",
    filter: {
      property: "object",
      value: "database",
    },
  });

  await notion.pages.create({
    parent: {
      type: "database_id",
      database_id: databases.results[0].id,
    },
    properties: {
      Name: {
        title: [
          {
            text: {
              content: "Backend Session 123",
            },
          },
        ],
      },
      Description: {
        rich_text: [
          {
            text: {
              content: "A description",
            },
          },
        ],
      },
      Transcription: {
        rich_text: transcriptionBlocks(transcriptionBlock),
      },
      Video: {
        files: [
          {
            external: {
              url: "https://www.youtube.com/watch?v=eBGIQ7ZuuiU",
            },
            name: "title",
          },
        ],
      },
    },
  });
}

function splitTranscription(transcription, max_char) {
  const arr = [];

  for (let i = 0; i < transcription.length; i += max_char) {
    arr.push(transcription.substring(i, i + max_char));
  }

  return arr;
}

function transcriptionBlocks(transcriptionBlock) {
  return transcriptionBlock.map((content) => {
    return {
      text: {
        content: content,
      },
    };
  });
}

run();
