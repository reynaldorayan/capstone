import pickle
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import tensorflow as tf
from tensorflow.keras.preprocessing.sequence import pad_sequences  # type: ignore
from util import preprocess_text
from deep_translator import GoogleTranslator
from typing import List

app = FastAPI()

origins = [
    "http://192.168.1.22",
    "http://192.168.1.22:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Review(BaseModel):
    text: str


class MultipleReviews(BaseModel):
    reviews: List[Review]


# Global variables to hold the model and tokenizer
model = None
tokenizer = None
max_len = 100
vocab_size = 0
threshold = 0.5


@app.on_event("startup")
async def startup_event():
    global model
    global tokenizer
    global max_len
    global vocab_size

    try:
        # Load the custom trained model
        model = tf.keras.models.load_model("server-nlp/sentiment.h5")

        with open("server-nlp/tokenizer.pickle", "rb") as handle:
            tokenizer = pickle.load(handle)

        vocab_size = len(tokenizer.word_index) + 1

        print("Model and tokenizer loaded successfully.")

    except FileNotFoundError as e:
        print(f"Error loading file: {e}")
        raise HTTPException(
            status_code=500,
            detail="File not found. Ensure the CSV and model files are in the correct path.",
        )
    except Exception as e:
        print(f"Error during startup: {e}")
        raise HTTPException(
            status_code=500,
            detail="An error occurred during startup. Check logs for more details.",
        )


@app.get("/")
def read_root():
    return {"message": "NLP Server is running..."}


@app.post("/sentiment")
def sentiment(review: Review):
    if model is None or tokenizer is None:
        raise HTTPException(status_code=503, detail="Model or tokenizer not loaded")

    # Translate the input review to English
    translatedText = GoogleTranslator(source="auto", target="en").translate(
        review.text.split("::")[1]
    )

    # Preprocess the input review
    processed_review = preprocess_text(translatedText)

    # Tokenize and pad the input review
    review_seq = tokenizer.texts_to_sequences([processed_review])
    review_seq = pad_sequences(review_seq, maxlen=max_len, padding="post")

    # Make prediction
    prediction = model.predict(review_seq)

    # Score
    sentiment_score = prediction[0][0]

    return {
        "score": f"{sentiment_score:.3f}",
        "sentiment": ("positive" if float(prediction) > threshold else "negative"),
        "emotion": ("😀" if float(prediction) > threshold else "😞"),
    }


@app.post("/sentiments")
def sentiment(review: MultipleReviews):
    if model is None or tokenizer is None:
        raise HTTPException(status_code=503, detail="Model or tokenizer not loaded")

    results = []

    for r in review.reviews:
        # Translate the input review to English
        translatedText = GoogleTranslator(source="auto", target="en").translate(
            r.text.split("::")[1]
        )

        # Preprocess the input review
        processed_review = preprocess_text(translatedText)

        # Tokenize and pad the input review
        review_seq = tokenizer.texts_to_sequences([processed_review])
        review_seq = pad_sequences(review_seq, maxlen=max_len, padding="post")

        # Make prediction
        prediction = model.predict(review_seq)

        # Score
        sentiment_score = prediction[0][0]

        results.append(
            {
                "reviewId": r.text.split("::")[0],
                "score": f"{sentiment_score:.2f}",
            }
        )

    return results
