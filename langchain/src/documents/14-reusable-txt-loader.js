import { CustomTxtLoader } from "./loaders/customTxtLoader.js";
import { debugDocuments } from "./utils/debugDocuments.js";

const filePath = "data/class-10/science/life-processes.txt";

const loader = new CustomTxtLoader(filePath, {
  loaderType: "custom-txt-loader",
});

const docs = await loader.load();

debugDocuments(docs, {
  previewLength: 200,
});