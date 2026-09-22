{
  "title": "A Malleable Diffuse",
  "category": "Software",
  "published": true,
  "published_on": "22-09-2026"
}

This piece of software has been around for a bit, 15 years to be precise! It started under a different name though, also Japanese, glad that didn't stick. There are a few ideas that did stick around, but with this fourth version, I'm making the biggest change since we've started; we're moving from the traditional app model to a malleable one, from **interface-first to data-first**.

Before we get into what that means exactly, what does this software actually do? Well, first and foremost, it's an audio player. I know, it's not as easy to use as streaming services, but I prefer buying music, even digitally, what can I say. In any case, Diffuse always revolved around playing audio files from the cloud or your machine, and making playlists based on the extracted metadata from those files. Here's what that looked like in version three:

![](https://icidasset-public.s3.amazonaws.com/diffuse-v3.jpg)

In the malleable version, describing what the software does and what it looks like becomes quite a bit harder. 


## What is an app anyway?!

Most software has been this fixed interface where you jam data into or produce data with. That's what I mean by interface-first, there's only one interface and that's what gets the focus. What if we flip that picture upside down, put the data first and get to use an infinite amount of interfaces?

I always found myself asking, how can I do this thing with my data? Even in my own software! To fix that there's this urge to just keep on adding features, and even if you do, it's never enough. We all know what happens at that point. Then I heard people talking about malleable software and thought, yeah, this is it, this is how we escape the interface jail.

With this reasoning, what is Diffuse exactly? To be honest, I'm not quite sure yet. So far it has taken shape in the following ways. This is quite technical, so if you want you can skip this list and read the summary right after.

1. A [set](https://diffuse.sh/latest/elements/#definitions) of data schemas in the form of AT Protocol lexicons.
2. A [set](https://diffuse.sh/latest/elements/) of framework-agnostic web components. These make up multiple layers of logic, building blocks to create our software.
3. Web bundles in the form of [Web Tile](https://dasl.ing/tiles.html) CAR files. Basically just HTML snippets with Javascript and/or CSS in a small package.
4. A manifest that points at a web bundle, a simple HTML file, another manifest (eg. on atproto), or contents in the manifest itself. This represents an interface or a "feature".
5. A default extendable configuration of the included web components that are used throughout the included web bundles. This sets up the components in such a way that they communicate with each other even if they live in different browser tabs.
6. A dashboard that lists all the manifests in your collection. Here you can toggle features, bookmark + open interfaces, and edit them.
7. A loader that takes an interface manifest and renders it. Feature manifest contents are injected before the contents of the interface. This usually means that a script tag is rendered before the interface HTML.

This gives us a platform to build our personal audio player software on, consisting of many interfaces and features (logic loaded for every interface). It gives the ability to add & remove behaviour, to pick an interface that suits our current needs or likes, build (un)coupled interfaces on the fly, perform one-off actions, etc.

Yes, you can technically use this thing to build other software too, it's not restricted to Diffuse's components. That's why ...


## Patchwork

On the one hand I feel like this platform could be something more abstract, much like [Patchwork-26](https://www.youtube.com/watch?v=4UxGijnuXEs) is. On the other hand, there is a large collection of default interfaces and features; Patchwork doesn't have that (yet?).

What Patchwork does have is a better concept of security. In Diffuse, we just rely on the web security model and that's it. There's no permission model, no warning that a facet (that's what we call interfaces or features) could delete all your data; nothing like that. Maybe there should be, maybe not, I haven't decided. It's not like it's sensitive data, so that makes it easier. I also don't give Diffuse write/delete access to my music, so that's not something I need to worry about (but please, do have a data backup people).

You can rebuild a large part of the Diffuse interfaces in Patchwork-26 I'm sure. I made a [Javascript package](https://jsr.io/@toko/diffuse) for the Diffuse components so you can use them in other places. I suppose you could do the same in [Tonk](https://tonk.xyz). I might make some demos at some point.


## Default set

Thiis quite boring, but I thought I'd list which interfaces and features are included by default so far. Hopefully it gives somewhat of an idea how things fit together, but also how they're not tightly coupled.

**Base**:
_These are a bunch of features that are considered essential. Enabled by default, hidden from the default dashboard, but can be disabled._

- Artwork bundle, artwork retrieval from various locations.
- Input bundle, audio sourcing from various protocols.
- Metadata bundle, audio metadata retrieval through various means.
- Output bundle, userdata storage using various protocols and services.
- Upload bundle, audio file syncing using various protocols and services.
- Audio preloading, loads the next track in the queue automatically in the background.

**Features**:
_Non-essential features, some enabled by default._

- Add audio automatically to the queue.
- Store a local copy of audio after it's been playing for a while.
- Hide duplicate audio items (same artist and same title).
- Automatic processing of audio sources.
- Remember audio playback progress for items longer than 30 minutes.
- Audio scrobbling.
- On the fly audio file analysis, gather spectogram data.

**Interfaces / Themes**:
_These are somewhat similar to typical audio player interfaces, besides the fact that you can use them all at the same time with the same state and data._

- Blur, Blur Classic, Blur Pocket. A set of themes similar to the Diffuse v3 interface.
- Winamp v2.x in a Windows 98 desktop.
- Catalogue One
- iPod

Various UI components from themes are available as separate interfaces as well. This allows you to mix and match, or use them in separate windows/webviews.

**Interfaces / Management**:
_A few standard interfaces to manage data and state._

- File Manager, upload audio files and optionally sync them to the cloud.
- Playlists
- Queue
- Sources, manage audio input.
- Your data, manage userdata, indicates where userdata is stored and synced to.

**Interfaces / Other**:

- Automatic queue
- Command menu
- Connect *
- Export & Import
- Process tracks
- Scrobble *
- Setup
- Split view
- V3 import


## Personal tools

Besides all that, there's a few use cases that I consider to a bit more special, so I generated these tools with the provided Diffuse LLM skill (see Create page on the dashboard) and saved them into my "account":

- Some of the default themes have this functionality where you can add audio to a playlist called "Favourites". Other than reserving the name, it's just a regular playlist. This is something I heavily use and I then copy favourite tracks into other playlists per genre or vibe. **I made an interface that shows which favourited tracks aren't yet in any other playlists.**
- Sometimes I add tracks to the playlists multiple times, so I have an interface that shows what the duplicates are.
- Because playlists are loosely coupled to the audio tracks there's the possibility that some playlist items aren't matching to any tracks. **I created an interface that lists all the missing tracks in my collection**, and added the ability to listen to a track preview for each one + a buy link that links to Qobuz. This is useful, because sometimes I import playlists from elsewhere. For example, there's the Belgian [Tijdloze](https://tijdloze.rocks/) playlist which is compiled by a large number of people and a radio station.
- Now something non playlist related. **I created a feature that syncs my userdata to a second location.**

I have some other tools I still want to build, some for data processing (eg. fix metadata). The point is, I can just add or remove these whenever I see fit.
