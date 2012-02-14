A small library that runs readabilitySAX on feeds.

This version works, but is far from perfect. Some things that should be done:

* The feed parser should read data as it approaches
* CACHING. For every run, every page of a feed needs to be processed by `readabilitySAX`. Due to `readabilitySAX`' speed, the CPU isn't the main concern - network usage matters even more.
* It would be nice to have PuSH (PubSubHubbub) support