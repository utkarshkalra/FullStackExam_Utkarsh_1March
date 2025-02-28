const { createApi } = require("unsplash-js");
const fetch = require("node-fetch");
require("dotenv").config();

const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY,
  fetch: fetch,
});

async function getRandomShoeImage() {
  try {
    const result = await unsplash.photos.getRandom({
      query: "shoes sneakers",
      count: 1,
    });

    if (result.errors) {
      console.error("Error fetching Unsplash image:", result.errors[0]);
      return "https://images.unsplash.com/photo-1460353581641-37baddab0fa2";
    }

    return result.response[0].urls.regular;
  } catch (error) {
    console.error("Error fetching Unsplash image:", error);
    return "https://images.unsplash.com/photo-1460353581641-37baddab0fa2";
  }
}

module.exports = getRandomShoeImage;
