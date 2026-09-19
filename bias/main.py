

from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np


model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')


left_articles = [
    "The government must increase environmental regulations to combat climate change.",
    "Healthcare is a right and should be accessible to all citizens."
]

right_articles = [
    "Lower taxes are essential for economic growth and individual freedom.",
    "Government overreach threatens personal liberties and free markets."
]


left_embeddings = model.encode(left_articles)
right_embeddings = model.encode(right_articles)


input_text = input("Enter news text: ")
input_embedding = model.encode([input_text])


left_score = np.mean(cosine_similarity(input_embedding, left_embeddings))
right_score = np.mean(cosine_similarity(input_embedding, right_embeddings))


if left_score > right_score + 0.05:
    bias = "Left-leaning"
elif right_score > left_score + 0.05:
    bias = "Right-leaning"
else:
    bias = "Neutral / Centrist"

print(f"Bias estimate: {bias}")
print(f"Left similarity: {left_score:.3f}, Right similarity: {right_score:.3f}")