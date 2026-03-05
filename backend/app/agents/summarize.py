from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, pipeline
from langchain_huggingface import HuggingFacePipeline

# Smaller model for low-memory usage
model_id = "t5-small"

# Load tokenizer and model
tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForSeq2SeqLM.from_pretrained(model_id)

# Use the correct pipeline task for seq2seq models
pipe = pipeline(
    task="text2text-generation",  # <-- important fix
    model=model,
    tokenizer=tokenizer,
    device=-1,  # CPU
    max_length=512,
    truncation=True
)

# Wrap in LangChain
llm = HuggingFacePipeline(pipeline=pipe)

def summarize(content: str):
    """
    Summarizes text using T5-small via HuggingFacePipeline.
    """
    response = llm.invoke(content)
    return response[0]["generated_text"]

if __name__ == "__main__":
    text = """
    Hugging Face: Revolutionizing Natural Language Processing
    Introduction
    In the rapidly evolving field of NLP, Hugging Face has emerged as a prominent and innovative force...
    """
    summary = summarize(text)
    print("\n--- SUMMARY OUTPUT ---\n")
    print(summary)