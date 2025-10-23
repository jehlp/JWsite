---
layout: nav
title: Technical Archive
---
# Technical Archive
{% assign techincalByYear = site.technical | group_by_exp:"technical", "technical.date | date: '%Y'" | reverse %}
{% for year in techincalByYear %}
## {{ year.name }}
{% assign technicalByMonth = year.items | group_by_exp:"technical", "technical.date | date: '%B'" | reverse %}
{% for month in technicalByMonth %}
### {{ month.name }}
{% for technical in month.items reversed %}
- <span class="archive-date">{{ technical.date | date: "%B %-d" }}</span> [{{ technical.title }}]({{ technical.url }})
{% endfor %}
{% endfor %}
{% endfor %}
