import os
import re
import nltk
import pandas as pd
import numpy as np
import pinecone
import openai
import logging
import sys
from tqdm import tqdm
from nltk.tokenize import sent_tokenize
from pinecone_text.sparse import BM25Encoder
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.core import SimpleDirectoryReader
from llama_index.core.node_parser import SentenceSplitter
from llama_index.core import Settings
from llama_index.core import VectorStoreIndex, get_response_synthesizer
from llama_index.core.retrievers import VectorIndexRetriever
from llama_index.core.query_engine import RetrieverQueryEngine
from llama_index.core.postprocessor import SimilarityPostprocessor
from IPython.display import Markdown, display
from llama_index.vector_stores.pinecone import PineconeVectorStore
from llama_index.core import StorageContext


# Initialize Pinecone
pinecone.init(
    api_key=os.getenv("PINECONE_API_KEY"),
    environment=os.getenv("PINECONE_ENVIRONMENT")
)
index_name = "charles-resume-knowledge"  # Replace with your Pinecone index name