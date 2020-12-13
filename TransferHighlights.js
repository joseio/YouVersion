const axios = require("axios");
const AUTH = require("./secret");

const config = {
  headers: { Authorization: `Bearer ${AUTH}` },
};

// Define URLs needed to highlight verses
// Options (initiate highlight request)
const OPTIONS_HIGHLIGHT_URL =
  "https://nodejs.bible.com/api_auth/moments/create/3.1";
const POST_HIGHLIGHT_URL =
  "https://nodejs.bible.com/api_auth/moments/create/3.1";
// Define map of translation names to their version IDs
const MAP_TRANSLATION_VER = { HCSB: 72, NLT: 116, NASB2020: 2692 };
// Define map of book ID to number of chapters it contains
const MAP_BOOK_CHAPTERS = {
  // OT
  GEN: 50,
  EXO: 40,
  LEV: 27,
  NUM: 36,
  DEU: 34,
  JOS: 24,
  JDG: 21,
  RUT: 4,
  "1SA": 31,
  "2SA": 24,
  "1KI": 22,
  "2KI": 25,
  "1CH": 29,
  "2CH": 36,
  EZR: 10,
  NEH: 13,
  EST: 10,
  JOB: 42,
  PSA: 150,
  PRO: 131,
  ECC: 12,
  SNG: 8,
  ISA: 66,
  JER: 52,
  LAM: 5,
  EZK: 48,
  DAN: 12,
  HOS: 14,
  JOL: 3,
  AMO: 9,
  OBA: 1,
  JON: 4,
  MIC: 7,
  NAM: 3,
  HAB: 3,
  ZEP: 3,
  HAG: 2,
  ZEC: 14,
  MAL: 4,
  // NT
  MAT: 28,
  MRK: 16,
  LUK: 24,
  JHN: 21,
  ACT: 28,
  ROM: 16,
  "1CO": 16,
  "2CO": 13,
  GAL: 6,
  EPH: 6,
  PHP: 4,
  COL: 4,
  "1TH": 5,
  "2TH": 3,
  "1TI": 6,
  "1TI": 4,
  TIT: 3,
  PHM: 1,
  HEB: 13,
  JAS: 5,
  "1PE": 5,
  "2PE": 3,
  "1JN": 5,
  "2JN": 1,
  "3JN": 1,
  JUD: 1,
  REV: 22,
};

// Track failed highlight copies
var failed = [];
// Transfer highlgihts from HCSB to NASB2020 for each book of Bible
Object.keys(MAP_BOOK_CHAPTERS).forEach((book) => {
  // Loop from 1 to n chapters in selected book
  for (var i = 1; i <= MAP_BOOK_CHAPTERS[book]; ++i) {
    let url_get = `https://nodejs.bible.com/api_auth/moments/verse_colors/3.1?usfm=${book}.${i}&version_id=${MAP_TRANSLATION_VER["HCSB"]}`;
    // Initiate highlight request with options request
    axios.options(OPTIONS_HIGHLIGHT_URL).then(() => {
      // Get all highlights in book chapter specified below
      axios
        .get(url_get, config)
        .then((res) => {
          // Return if current chapter has no highlights in HCSB
          if (res.data.hasOwnProperty("errors")) return;

          // Create arr of axios post requests for later parallelization
          const post_requests = res.data.verse_colors.map((arr) =>
            // Create post highlight request
            axios
              .post(
                POST_HIGHLIGHT_URL,
                {
                  kind: "highlight",
                  references: [
                    {
                      usfm: [arr[0]],
                      version_id: MAP_TRANSLATION_VER["NASB2020"],
                    },
                  ],
                  color: arr[1],
                  created_dt: "2020-12-12T22:57:38+00:00",
                },
                config
              )
              // Create option request to update "Moments"
              .then(() => axios.options(url_get, config))
              .catch((error) => {
                failed.push(`${book} chapter ${i}`);
                console.log(
                  `Error in posting highlights in NASB2020's ${arr[0]}. Likely connection reset. Possible manual intervention needed`
                );
              })
          );
          axios
            .all(post_requests)
            .then(() => console.log(`Done with ${book} chapter ${i}`))
            .catch((error) =>
              console.log("Error in posting highlights in parallel =>", error)
            );
        })
        .catch((error) => {
          failed.push(`${book} chapter ${i}`);
          if (i <= MAP_BOOK_CHAPTERS[book])
            console.log(
              `Error in getting highlighted verses from HCSB's ${book} chapter ${i}`,
              error
            );
          // Otherwise this is likely a one-off index warning that can be safely ignored
        });
    });
  }
});

if (failed.length)
  console.log(
    "Done! However, some highlights require manual intervention: ",
    failed
  );
