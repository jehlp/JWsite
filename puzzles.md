---
layout: nav
title: Puzzle Archive
---
# Puzzle Archive
{% assign puzzlesByYear = site.puzzles | group_by_exp:"puzzles", "puzzles.date | date: '%Y'" | reverse %}
{% for year in puzzlesByYear %}
## {{ year.name }}
{% assign puzzlesByMonth = year.items | group_by_exp:"puzzles", "puzzles.date | date: '%B'" | reverse %}
{% for month in puzzlesByMonth %}
### {{ month.name }}
{% for puzzle in month.items reversed %}
- <span class="archive-date">{{ puzzle.date | date: "%B %-d" }}</span> [{{ puzzle.title }}]({{ puzzle.url }})
{% endfor %}
{% endfor %}
{% endfor %}
