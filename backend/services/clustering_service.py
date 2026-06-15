from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# Load the model once when the file is imported
# This model converts text → 384-dimensional vectors
# It's a small but powerful pre-trained model
print("Loading sentence transformer model...")
model = SentenceTransformer('all-MiniLM-L6-v2')
print("Model loaded!")

def get_embeddings(texts: list) -> np.ndarray:
    """
    Convert a list of text strings into vectors (embeddings).
    
    Example:
    Input:  ["Reverse a linked list", "Binary search explained"]
    Output: [[0.2, 0.5, ...384 numbers], [0.1, 0.8, ...384 numbers]]
    """
    return model.encode(texts)

def cluster_questions(questions: list, threshold: float = 0.7) -> list:
    """
    Group similar questions together based on meaning.
    
    threshold: how similar two questions must be to be grouped
               0.7 means 70% similar — good balance
               higher = stricter (fewer groups)
               lower = looser (more groups)
    
    Input: list of question dicts with 'id' and 'question_text'
    Output: list of clusters, each cluster is a group of similar questions
    """
    
    # Need at least 2 questions to cluster
    if len(questions) < 2:
        return [{
            "cluster_id": 0,
            "theme": questions[0]["question_text"][:50] if questions else "No questions",
            "questions": questions
        }]

    # Step 1: Extract just the text from each question
    texts = [q["question_text"] for q in questions]

    # Step 2: Convert all texts to vectors
    # Shape: (number_of_questions, 384)
    embeddings = get_embeddings(texts)

    # Step 3: Calculate similarity between every pair of questions
    # Result is a matrix where similarity_matrix[i][j] = 
    # how similar question i is to question j (0 to 1)
    similarity_matrix = cosine_similarity(embeddings)

    # Step 4: Group questions into clusters
    # We use a simple greedy algorithm:
    # - Start with question 0 as its own cluster
    # - For each new question, check if it's similar to any existing cluster
    # - If yes, add it to that cluster
    # - If no, create a new cluster
    
    clusters = []          # list of clusters we're building
    assigned = set()       # tracks which questions are already assigned

    for i in range(len(questions)):
        if i in assigned:
            continue  # skip if already in a cluster

        # Start a new cluster with this question
        current_cluster = [i]
        assigned.add(i)

        # Check all remaining questions
        for j in range(i + 1, len(questions)):
            if j in assigned:
                continue

            # If similarity is above threshold, add to this cluster
            if similarity_matrix[i][j] >= threshold:
                current_cluster.append(j)
                assigned.add(j)

        clusters.append(current_cluster)

    # Step 5: Convert index-based clusters to actual question data
    result = []
    for cluster_id, cluster_indices in enumerate(clusters):
        cluster_questions = [questions[idx] for idx in cluster_indices]
        
        # Generate a theme name for the cluster
        # Use the shortest question as the theme (usually most concise)
        shortest = min(cluster_questions, key=lambda q: len(q["question_text"]))
        theme = shortest["question_text"]
        # Truncate if too long
        if len(theme) > 60:
            theme = theme[:60] + "..."

        result.append({
            "cluster_id": cluster_id,
            "theme": theme,
            "question_count": len(cluster_questions),
            "questions": cluster_questions
        })

    # Sort clusters by size — biggest clusters first
    result.sort(key=lambda x: x["question_count"], reverse=True)

    return result