from langgraph.graph import StateGraph, END
from typing import TypedDict, List, Dict, Any

# ---------------- STATE ---------------- #

class ResearchState(TypedDict, total=False):
    query: str
    search_results: List[Dict[str, Any]]
    articles: List[str]
    summarized_results: List[str]
    report: str


# ---------------- IMPORT TOOLS ---------------- #

from app.tools.search import search_query
from app.tools.web_reader import read_web_content
from app.agents.summarize import summarize
from app.agents.report_generator import report_generator


# ---------------- NODES ---------------- #

def search_node(state: ResearchState):
    print("\n🔎 Running search...")

    query = state["query"]
    results = search_query(query)

    print(f"Found {len(results)} results")

    return {"search_results": results}


def read_node(state: ResearchState):
    print("\n📄 Reading web pages...")

    articles = []

    for r in state.get("search_results", []):
        url = r.get("url")

        if not url:
            continue

        try:
            content = read_web_content(url)
            articles.append(content)
        except Exception as e:
            print("Failed reading:", url)

    print(f"Collected {len(articles)} articles")

    return {"articles": articles}


def summarize_node(state: ResearchState):
    print("\n✂️ Summarizing articles...")

    summaries = []

    for article in state.get("articles", []):
        summary = summarize(article)
        summaries.append(summary)

    return {"summarized_results": summaries}


def report_node(state: ResearchState):
    print("\n📝 Generating report...")

    report = report_generator(
        state["query"],
        state.get("summarized_results", [])
    )

    return {"report": report}


# ---------------- GRAPH ---------------- #

graph = StateGraph(ResearchState)

graph.add_node("search", search_node)
graph.add_node("read", read_node)
graph.add_node("summarize", summarize_node)
graph.add_node("report", report_node)

graph.set_entry_point("search")

graph.add_edge("search", "read")
graph.add_edge("read", "summarize")
graph.add_edge("summarize", "report")
graph.add_edge("report", END)

research_graph = graph.compile()



def test_research_graph():

    print("\n🚀 Starting Research Agent...\n")

    result = research_graph.invoke({
        "query": "Future of job market in 3 years"
    })

    print("\n==============================")
    print("FINAL REPORT")
    print("==============================\n")

    print(result["report"])
    with open("ai_agents_report.md", "w", encoding="utf-8") as f:
        f.write(result["report"])


if __name__ == "__main__":
    test_research_graph()