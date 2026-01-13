import requests
from readability import Document
from bs4 import BeautifulSoup
from app.utils import clean_text

def extract_web_text(url: str) -> tuple[str, str]:
    r = requests.get(url, timeout=20, headers={"User-Agent": "FlowbitLabsBot/1.0"})
    r.raise_for_status()
    doc = Document(r.text)
    title = doc.short_title() or url
    html = doc.summary()
    soup = BeautifulSoup(html, "html.parser")
    text = soup.get_text("\n")
    return title, clean_text(text)
