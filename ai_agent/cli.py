"""Simple command-line demo for the Al Mutahidah agent."""

from __future__ import annotations

import sys

from .agent import AlMutahidahAgent


def main() -> None:
    agent = AlMutahidahAgent()
    print("Al Mutahidah Concierge demo. Type a message, or Ctrl-D to exit.")
    for line in sys.stdin:
        message = line.strip()
        if not message:
            continue
        print(agent.respond(message))
        print("\n---\n")


if __name__ == "__main__":
    main()
