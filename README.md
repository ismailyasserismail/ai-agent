# Al Mutahidah Concierge Agent

This repository provides a lightweight, rule-based AI concierge that mirrors the
core behavior described for Al Mutahidah’s customer-support assistant. The agent
supports English and Arabic prompts, detects the user’s language automatically,
and responds with concise guidance that follows the company’s service playbook.

## Features

- Service-aware responses for hourly cleaning, monthly helper/driver contracts,
  business solutions, and recruitment requests.
- Pricing, availability, offer, and general-advice flows aligned with the
  published assistant behavior.
- Automatic language detection between English and Arabic, with culturally
  appropriate phrasing.
- Command-line demo for quick experimentation.

## Quick Start

Create a virtual environment (optional), install the project in editable mode,
and run the demo CLI:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -e .
python -m ai_agent.cli
```

Type a user message and press enter to see the agent’s reply. End the session
with `Ctrl+D` (Unix/macOS) or `Ctrl+Z` followed by enter (Windows).

## Visual Demo on the Live Site Layout

Open the static mock to see how the concierge widget looks when overlaid on
the real almutahidah.com home page:

```bash
python -m http.server 8000  # from the project root
```

Then visit [http://localhost:8000/demo/almutahidah_agent_demo.html](http://localhost:8000/demo/almutahidah_agent_demo.html)
in your browser. The frame loads the public site inside an iframe and overlays
an interactive version of the rule-based agent so you can try the quick
prompts or type your own questions.

## Running Tests

```bash
pytest
```

The tests cover core behaviors such as language detection, pricing replies, and
the default greeting.
