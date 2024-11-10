import os
from tqdm import tqdm
from llama_index.core import (
    SimpleDirectoryReader,
    SentenceSplitter,
    OpenAIEmbedding,
    Document  # Ensure you import Document
)
from llama_hub.file.llama_parse import LlamaParse
from convex import ConvexClient
from dotenv import load_dotenv
import nest_asyncio
from collections import defaultdict

def main():
    load_dotenv()
    # Initialize Convex client
    client = ConvexClient('https://hearty-donkey-749.convex.cloud')

    # Apply nest_asyncio (necessary for Jupyter environments)
    nest_asyncio.apply()

    # Initialize LlamaParse parser
    # llamaparse_key = os.getenv('LLAMA_CLOUD_API_KEY')  # Assumes you set your key as an env variable
    parser = LlamaParse(
        api_key=llamaparse_key,
        result_type="markdown",  # "markdown" or "text"
        verbose=True
    )
    
    # Read and load data from the ./data directory
    documents = SimpleDirectoryReader(
        "./data", file_extractor={".pdf": parser, ".docx": parser}
    ).load_data()

     # Group documents by file_name
    documents_by_file = defaultdict(list)
    for doc in documents:
        file_name = doc.metadata.get("file_name")
        documents_by_file[file_name].append(doc)

    # Merge documents from the same file
    merged_documents = []
    for file_name, docs in documents_by_file.items():
        # Combine texts
        combined_text = "\n".join([d.text for d in docs])
        # Use metadata from the first document (you can choose how to handle metadata)
        metadata = docs[0].metadata
        # Create a new merged Document
        merged_doc = Document(text=combined_text, metadata=metadata)
        merged_documents.append(merged_doc)
    
    # Initialize OpenAI Embedding model
    embed_model = OpenAIEmbedding(model="text-embedding-3-small")
    
    # Split documents into nodes for embedding generation
    text_splitter = SentenceSplitter(chunk_size=500, chunk_overlap=50)

    # Process all documents
    for doc in tqdm(merged_documents, desc="Processing Documents"):
        # Prepare document data for Convex insertion
        document_data = {
            'title': doc.metadata.get("file_name"),
            'text': str(doc.text),
            'lastModifiedDate': doc.metadata.get("last_modified_date")
        }

        # Insert document into Convex and get document ID
        document_id = client.mutation("process:loadDocument", document_data)
        print(f"Inserted Document ID: {document_id}")

        # Split document text into chunks/nodes
        nodes = text_splitter.get_nodes_from_documents([doc])
    
        # Generate and insert embeddings for each chunk
        for node in nodes:
            text = node.get_content()
            embedding = embed_model.get_text_embedding(text)
            
            # Prepare chunk data for Convex insertion
            chunk_data = {
                'documentId': document_id,
                'text': text,
                'embedding': embedding
            }
    
            # Insert chunk into Convex
            chunk_id = client.mutation("process:loadChunk", chunk_data)
            print(f"Inserted Chunk ID: {chunk_id}")
    