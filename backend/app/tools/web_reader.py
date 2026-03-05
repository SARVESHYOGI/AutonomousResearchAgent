import requests
from bs4 import BeautifulSoup


def read_web_content(url):

    response = requests.get(url, timeout=10)

    soup = BeautifulSoup(response.text, "html.parser")

    paragraphs = soup.find_all("p")

    text = " ".join(p.get_text() for p in paragraphs)

    return text[:5000]