---
layout: nav
title: Puzzle Archive
---
# Puzzle Archive

<div class="search-container">
    <input type="text" id="content-search" placeholder="Search by title or tag...">
    <div id="search-suggestions" class="search-suggestions"></div>
</div>

{% assign puzzlesByYear = site.puzzles | group_by_exp:"puzzles", "puzzles.date | date: '%Y'" | reverse %}
{% for year in puzzlesByYear %}
<div class="year-section" markdown="1">
## {{ year.name }}
{% assign puzzlesByMonth = year.items | group_by_exp:"puzzles", "puzzles.date | date: '%B'" | reverse %}
{% for month in puzzlesByMonth %}
<div class="month-section" markdown="1">
### {{ month.name }}
{% for puzzle in month.items reversed %}
<div class="entry-item" data-title="{{ puzzle.title | downcase }}" data-tags="{{ puzzle.tags | join: ',' | downcase }}" markdown="1">
- <span class="archive-date">{{ puzzle.date | date: "%B %-d" }}</span> [{{ puzzle.title }}]({{ puzzle.url }})
</div>
{% endfor %}
</div>
{% endfor %}
</div>
{% endfor %}