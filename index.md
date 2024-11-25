---
layout: default
title: Home
---
## The Site
Over the past 15 years, I have been known for my involvement with rhythm games, international puzzle competitions, and anime reviews. I also have an academic background in mathematics (probability theory) and an active professional background in software engineering. 

I intend to post everything from the logic puzzles I construct, to essays elucidating why fans of the *Muv-Luv* saga should try reading *The Fifth Head of Cerberus*, to code that I might find particularly interesting or useful.

## Recent Posts
{% assign all_posts = '' | split: '' %}
{% for essay in site.essays %}
  {% assign all_posts = all_posts | push: essay %}
{% endfor %}
{% for technical in site.technical %}
  {% assign all_posts = all_posts | push: technical %}
{% endfor %}
{% for puzzle in site.puzzles %}
  {% assign all_posts = all_posts | push: puzzle %}
{% endfor %}
{% assign sorted_posts = all_posts | sort: 'date' | reverse %}
{% for post in sorted_posts limit:10 %}
<div class="post-line">
  <div class="post-left">
    <span class="archive-date">{{ post.date | date: "%B %-d" }}</span>
    <a href="{{ post.url }}">{{ post.title }}</a>
  </div>
  <span class="post-category">{{ post.collection | default: "Posts" | capitalize }}</span>
</div>
{% endfor %}
