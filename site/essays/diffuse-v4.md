{
  "title": "A Malleable Diffuse",
  "category": "Software",
  "published": true,
  "published_on": "24-09-2026"
}

This piece of software has been around for a bit, 15 years to be precise! It started under a different name though, also Japanese, glad that didn't stick. There are a few ideas that did stick around, but with this fourth version, I'm making the biggest change since we've started; we're moving from the traditional app model to a [malleable](https://www.inkandswitch.com/malleable-software/) one, from **interface-first to data-first**.

Before we get into what that means exactly, what does this software actually do? Well, first and foremost, it's an audio player. I know, it's not as easy to use as streaming services, but I prefer buying music, even digitally, what can I say. In any case, Diffuse always revolved around playing audio files from the cloud or your machine, and making playlists based on the extracted metadata from those files. Here's what that looked like in version three:

![](https://icidasset-public.s3.amazonaws.com/diffuse-v3.jpg)

In the malleable version, describing what the software exactly does and what it looks like becomes a bit harder. 


## What is an app anyway?!

Most software has been this fixed interface where you jam data into or produce data with. That's what I mean by interface-first, there's only one interface and that's what gets the focus. What if we flip that picture upside down, put the data first and allow the use of an infinite amount of interfaces?

Often there's something you want to do with your data, not available through the interface of the software you're using, maybe manipulate it somehow or display it in a specific way. Even in my own software I had this problem! In order to fix that, there's this urge to just keep on adding more and more to the software, but even if you do, it's never enough.

Then I heard people talking about malleable software and thought, yeah, this is it, this is how we escape the interface jail. With this reasoning, what is Diffuse exactly? To be honest, I'm not quite sure yet. So far it has taken shape in the following ways. This is quite technical, so if you want, you can skip this list and read the summary right after.

### New architecture

1. A [set](https://diffuse.sh/latest/elements/#definitions) of data schemas in the form of AT Protocol lexicons.
2. A [set](https://diffuse.sh/latest/elements/) of framework-agnostic web components. These make up multiple layers of logic, building blocks to create our software.
3. Web bundles in the form of [Web Tile](https://dasl.ing/tiles.html) CAR files. Basically just HTML snippets with Javascript and/or CSS in a small package.
4. A manifest that points at a web bundle, a simple HTML file, another manifest (eg. on atproto), or contents in the manifest itself. This represents an interface or a “feature”.
5. An extendable configuration of the included web components that are used throughout the included web bundles. This sets up the components in such a way that they communicate with each other even if they live in different browser tabs.
6. A dashboard that lists all the manifests in your collection. Here you can toggle features, bookmark + open interfaces, and edit them.
7. A loader that takes an interface manifest and renders it. Feature manifest contents are injected before the contents of the interface. This usually means that a script tag is rendered before the interface HTML.

This gives us **a platform to build our personal audio software on**, consisting of many interfaces and features (logic loaded for every interface). It allows us to add & remove behaviour, to pick an interface that suits our current needs or likes, build interfaces on the fly, perform one-off actions, etc.

![](../../images/essays/diffuse/features-min.jpg)

![](../../images/essays/diffuse/interfaces-min.jpg)

Yes, you can technically use this thing to build other software too, it's not restricted to Diffuse's components. That's why ...


## Patchwork

On the one hand I feel like this platform could be something more abstract, much like [Patchwork-26](https://www.youtube.com/watch?v=4UxGijnuXEs) is. On the other hand, there is a large collection of default interfaces and features; Patchwork doesn't have that (yet?).

What Patchwork does have is a better concept of security. In Diffuse, we just rely on the web security model and that's it. There's no permission model, no warning that a facet (that's what we call interfaces or features) could delete all your data; nothing like that. Maybe there should be, maybe not, I haven't decided. It's not like it's sensitive data, so that makes it easier. I also don't give Diffuse write/delete access to my music, so that's not something I need to worry about.

You can rebuild a large part of the Diffuse interfaces in Patchwork-26 I'm sure. I made a [Javascript package](https://jsr.io/@toko/diffuse) for the Diffuse components so you can use them in other places. I suppose you could even do the same in [Tonk](https://tonk.xyz). I might make some demos at some point.


## Default set

This is quite boring, but I thought I'd list which interfaces and features are included by default so far. Hopefully it gives somewhat of an idea how things fit together, but also how they're not tightly coupled. And to be clear, all of these are optional, but there are sensible defaults to get you started.

### Base

_These are a bunch of features that are considered “essential”. Enabled by default, hidden from the default dashboard, but can be disabled. You can think of these as implementations for all the protocols embedded in the components. For example, artwork retrieval would be pretty useless if there's no place to get the artwork from._

- Artwork bundle<small>: artwork retrieval from various locations.</small>
- Input bundle<small>: audio sourcing from various protocols.</small>
- Metadata bundle<small>: audio metadata retrieval through various means.</small>
- Output bundle<small>: userdata storage using various protocols and services.</small>
- Upload bundle<small>: audio file syncing using various protocols and services.</small>
- Audio preloading<small>: loads the next track in the queue automatically in the background.</small>

### Features

_Non-essential features, some enabled by default._

- Add audio automatically to the queue.
- Store a local copy of audio after it's been playing for a while.
- Hide duplicate audio items (same artist and same title).
- Automatic processing of audio sources.
- Remember audio playback progress for items longer than 30 minutes.
- Audio scrobbling.
- On the fly audio file analysis, gather spectogram data.

### Interfaces / Themes

_These are somewhat similar to typical audio player interfaces, besides the fact that you can use them all at the same time with the same state and data._

- Blur, Blur Classic, Blur Pocket. A set of themes similar to the Diffuse v3 interface.
- Winamp v2.x in a Windows 98 desktop.
- Catalogue One
- iPod

Various UI components from themes are available as separate interfaces as well. This allows you to mix and match, or use them in separate windows/webviews.

![](../../images/essays/diffuse/winamp-min.jpg)

![](../../images/essays/diffuse/blur-min.jpg)

### Interfaces / Management

_A few standard interfaces to manage data and state._

- Connect<small>: lists all input and output options.</small>
- File Manager<small>: upload audio files and optionally sync them to the cloud.</small>
- Playlists
- Queue
- Sources<small>: manage audio input.</small>
- Your data<small>: manage userdata, indicates where userdata is stored and synced to.</small>

### Interfaces / Other

- Automatic queue<small>: same thing as the feature; but instead you have to open this interface explicitly for the behaviour to be performed.</small>
- Command menu<small>: like a launcher on your OS, or other command palettes.</small>
- Export & Import<small>: export & import your userdata to/from a JSON file.</small>
- Process tracks<small>: just a tiny interface that shows a progress bar during processing.</small>
- Scrobble *<small>: a bunch of interfaces to configure various scrobbling tools.</small>
- Setup<small>: “get started” interface.</small>
- Split view<small>: load multiple interfaces into one webview/tab.</small>
- V3 import<small>: import data from Diffuse v3.</small>


## Personal tools

Besides all that, there's a few use cases that I consider more personal, so I generated these tools with the provided Diffuse LLM skill (see [Create page](https://diffuse.sh/latest/create/) on the dashboard) and saved them into my “account”:

- Some of the default themes have this functionality where you can add audio to a playlist called 'Favourites'. Other than reserving the name, it's just a regular playlist. This is something I heavily use and I then copy favourite tracks into other playlists per genre or vibe. **I made an interface that shows which favourited tracks aren't yet in any other playlists.**
- Sometimes I add tracks to playlists multiple times, so I have an interface that shows what the duplicates are.
- Because playlists are loosely coupled to the audio tracks there's the possibility that some playlist items aren't matching to any tracks. **I created an interface that lists all the missing tracks in my collection**, and added the ability to listen to a track preview for each one + a buy link that links to Qobuz. This is useful, because sometimes I import playlists from elsewhere. For example, there's the Belgian [Tijdloze](https://tijdloze.rocks/) playlist which is compiled by a large number of people and a radio station.
- Now something not related to playlists, **I created a feature that syncs my userdata to a second location.**

![](../../images/essays/diffuse/missing-tracks-min.jpg)

I have some other tools I still want to build, some for data processing (eg. fix metadata). The cool thing is, I can just add these whenever.


## Try it out

Diffuse v4 is currently in alpha, but you can try it out already at [diffuse.sh](https://diffuse.sh).

I didn't mention this yet, but another experiment here is that you can pick the version of the software that you want. It doesn't automatically upgrade you either, there's a little upgrade button that shows up if there's a new version. In case you press it by accident, you can actually go back to the older version by visiting the [chronicle](https://diffuse.sh/chronicle/) (that's the little star on the dashboard). There's bi-directional data migration (lenses), so new data works with older versions, and vice versa.

_A couple minor notes here:_

- <small>If you'd like to live on the edge, there is the nightly version that does automatically update. It is however even more unstable than alpha versions.</small>
- <small>I'm probably going to remove the alpha versions and release candidates at some point once we have a stable v4. Doesn't seem very useful to keep the unstable versions around, especially because the more versions we keep around the slower the redirecting logic becomes.</small>

Diffuse is [open-source](https://github.com/icidasset/diffuse) and you can host it yourself if you want. It's just a static site so you can put it wherever. Source code is also available on [Tangled](https://tangled.org/tokono.ma/diffuse), along with the deployed [artifacts](https://tangled.org/tokono.ma/diffuse-artifacts).


## Fin

I hope that made some sense, it's weird software for sure! I'm curious to hear about shortcomings of people's audio software. Let me know your thoughts on the [atmosphere](https://bsky.app/profile/tokono.ma).

🚨 PS. I'm currently looking for a new challenge. If anyone is looking for someone that does web engineering (front & back), web applications, data structures & syncing, distributed computing, cryptography, authN & authZ, etc. Please [let me know](../../contact/).

Also, special shoutout to @multikatt who has been [donating](https://ko-fi.com/toko) for three years and everyone else who supported me over the years! Thank you so much.
