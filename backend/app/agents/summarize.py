from langchain_huggingface import HuggingFacePipeline
from langchain_text_splitters import RecursiveCharacterTextSplitter
from transformers import pipeline, AutoModelForSeq2SeqLM, AutoTokenizer,BitsAndBytesConfig
import torch
print(torch.cuda.is_available())
print(torch.cuda.get_device_name(0))


model_id = "facebook/bart-large-cnn"

quant_config = BitsAndBytesConfig(
    load_in_4bit=True
)
tokenizer=AutoTokenizer.from_pretrained(model_id)
model= AutoModelForSeq2SeqLM.from_pretrained(
    model_id,
    device_map="auto",
    quantization_config=quant_config,
    dtype=torch.float16
)
device = 0 if torch.cuda.is_available() else -1
print(f"Using device: {device}")
hf_pipe=pipeline("summarization", model=model, tokenizer=tokenizer)

llm=HuggingFacePipeline(pipeline=hf_pipe)
splitter = RecursiveCharacterTextSplitter(
    chunk_size=800,
    chunk_overlap=100
)

def summarize(text: str) -> str:
    chunks = splitter.split_text(text)

    summaries = []

    for chunk in chunks:
        try:
            summaries.append(llm.invoke(chunk))
        except Exception as e:
            print("Chunk failed:", e)

    return "\n".join(summaries)

# text = """
# In the dim light of dawn, the city of Eryndor stretched like a living organism, its spires and towers clawing at the sky. Mist coiled between the streets like smoke from an unseen fire, and the sound of distant bells echoed across the cobblestones. Few knew the city as it truly was. To outsiders, it seemed a place of marvels—markets bustling with traders from distant lands, scholars debating in towering libraries, artists painting visions that could make even the most hardened heart weep.

# But beneath the surface, Eryndor was restless. Shadows whispered secrets in the alleys, and the very stones seemed to tremble with anticipation, as if aware of some impending event. On the edge of the city, where the last lamp flickered against the morning haze, a figure stirred.

# Kael, a young historian whose curiosity had always bordered on obsession, awoke with a start. He had dreamt again—the same dream that had haunted him for weeks: a labyrinth of endless corridors, lined with mirrors that reflected not what he was, but what he feared he might become. At the center of this labyrinth, a single door pulsed with a faint golden light, and behind it, a voice called his name.

# Kael shook his head, trying to dismiss the remnants of the dream. “It’s just imagination,” he muttered, but even as the words left his lips, the air seemed to hum with a strange resonance. Outside his window, the city was waking. The scent of fresh bread mingled with the tang of riverwater, and merchants called out their wares. Yet, for Kael, something felt... different. Something old and powerful had begun stirring.

# He dressed quickly, pulling on the worn leather of his coat and the satchel that always carried scraps of parchment, ink-stained and dog-eared. Today, he had a destination: the old archives beneath the Grand Library. Few ventured there, for the lower levels were said to house texts older than Eryndor itself, guarded by mechanisms no one truly understood. But Kael did not fear. He sought answers, and answers were often found in places where others dared not tread.

# As he descended the spiraling staircase, the torches flickered and shadows stretched unnaturally along the walls. The air grew colder, and the sound of dripping water echoed like a heartbeat. At the bottom, the grand vault opened before him—an arched doorway carved from obsidian, engraved with symbols that seemed to writhe under the torchlight.

# Kael swallowed. Here, in the heart of forgotten knowledge, he hoped to find a clue about the visions that haunted his sleep. His hand traced the symbols as he stepped inside, and the faint hum of the city above faded into silence.

# In the center of the vault lay a pedestal, upon which rested a single book bound in deep blue leather. Its cover was unmarked, yet it radiated an aura that made the hairs on Kael’s arms stand on end. He reached out, and the moment his fingers brushed the leather, the vault shivered. A whisper seemed to fill the room—not a voice of any one person, but a chorus of many, speaking in tongues older than any living soul.

# “Kael…” the whisper hissed, soft but insistent.

# He froze. His breath caught. “Who’s there?” he demanded, though a part of him knew the answer already. The book had chosen him. And with choice came consequence.

# The pages fluttered open on their own, as though caught in an invisible wind. Symbols and text scrawled across them in ink that shimmered with a light of its own. Kael leaned in, reading aloud the first line:

# "When the city dreams, the walls remember. When the walls remember, the world awakens."

# A chill ran down his spine. The words resonated deep within him, stirring a memory he did not know he had—a memory not of his life, but of something older, something that transcended time itself.

# Kael knew, in that instant, that his life, and perhaps the fate of Eryndor itself, had been irrevocably changed. The city was speaking, and he had heard its call.

# Outside, the first rays of sun broke through the mist, casting the spires of Eryndor in gold. But deep in the vault, Kael understood that darkness and light were not opposites—they were threads of the same tapestry, woven together by forces beyond mortal comprehension. And today, the weaving would begin anew.
# """
