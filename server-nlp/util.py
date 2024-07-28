import re
from nltk.corpus import stopwords
from nltk import download

download("stopwords")

# Define constants and compile regex patterns
TAG_RE = re.compile(r"<[^>]+>")
STOPWORDS = set(stopwords.words("english"))
PUNCTUATIONS = re.compile("[^a-zA-Z]")


def preprocess_text(sen):
    """Preprocesses a given text string."""
    # Lowercase the text
    sentence = sen.lower()
    # Remove HTML tags
    sentence = TAG_RE.sub("", sentence)
    # Remove punctuations
    sentence = PUNCTUATIONS.sub(" ", sentence)
    # Remove single characters
    sentence = re.sub(r"\s+[a-zA-Z]\s+", " ", sentence)
    # Remove multiple spaces
    sentence = re.sub(r"\s+", " ", sentence)
    # Remove stopwords
    sentence = " ".join(word for word in sentence.split() if word not in STOPWORDS)
    return sentence
