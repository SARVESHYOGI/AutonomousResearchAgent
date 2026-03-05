

def report_generator(query, summaries):

    report = f"""
# Research Report

## Topic
{query}

## Key Findings
"""

    for i, summary in enumerate(summaries, 1):

        report += f"""

### Source {i}

{summary}

"""

    report += """

## Conclusion

AI agents are evolving from simple assistants to autonomous systems capable of reasoning, decision-making, and coordinating complex tasks across digital environments.
"""

    return report