---
layout: nav
title: Essays
---
# Essay Archive
{% assign essaysByYear = site.essays | group_by_exp:"essays", "essays.date | date: '%Y'" %}
{% for year in essaysByYear %}
## {{ year.name }}
{% assign essaysByMonth = year.items | group_by_exp:"essays", "essays.date | date: '%B'" %}
{% for month in essaysByMonth %}
### {{ month.name }}
{% for essays in month.items %}
- <span class="archive-date">{{ essays.date | date: "%B %-d" }}</span> [{{ essays.title }}]({{ essays.url }})
{% endfor %}
{% endfor %}
{% endfor %}
