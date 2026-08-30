import { GoogleGenAI } from "@google/genai";
import fs from 'fs';

const ai = new GoogleGenAI({ apiKey: "DUMMY_KEY" });

async function main() {
  console.log(Object.keys(ai));
  if (ai.interactions) {
    console.log(Object.keys(ai.interactions));
  }
}

main();
