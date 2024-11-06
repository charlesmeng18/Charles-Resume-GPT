export * from "@langchain/community/utils/convex";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { internalAction } from "../_generated/server";
import { v } from "convex/values";



export const chunkDocs = internalAction({
    args: {
      url: v.string(),
    },
    handler: async (ctx, { url }) => {
      const loader = new PDFLoader(url); // Load the PDF from the URL

      const docs = await loader.load();
      console.log(docs.length);

      console.log(docs[0].pageContent.slice(0, 100));
        console.log(docs[0].metadata);

      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
      });
  
      const splitDocs = await textSplitter.splitDocuments(docs);
      return splitDocs;
    },
  });
