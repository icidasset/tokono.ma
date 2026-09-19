{
  "title": "A Malleable Diffuse",
  "category": "Software",
  "published": false
}

This piece of software has been around for a bit, 15 years to be precise! It started under a different name though, also Japanese (like my handle), glad that didn't stick. There are a few ideas that did stick around, but with this fourth version I'm making the biggest change since we've started; we're moving from the traditional app model to a malleable one, from interface-first to data-first.

Before we get into what that means exactly, what does this software actually do? Well, first and foremost, it's an audio player. I know, it's not as easy to use as streaming services, but I prefer buying music, even digitally, what can I say. In any case, Diffuse always revolved around playing audio files from the cloud or your machine, and making playlists based on the extracted metadata from those files. Here's what that looked like in version three:

![](https://icidasset-public.s3.amazonaws.com/diffuse-v3.jpg)

In the malleable version, describing what the software does and what it looks like becomes quite a bit harder. 


## What is an app anyway?!

Most software has been this fixed interface where you jam data into or produce data with. That's what I mean by interface-first, there's only one interface and that's what gets the focus. What if we flip that picture upside down, put the data first and get to use an infinite amount of interfaces?

I always found myself asking, how can I do this thing with my data? Even in my own software! There's this urge to just keep on adding features, and even if you do, it's never enough. Then I heard people talking about malleable software and thought, yeah, this is it, this is how we escape the interface jail.

With this reasoning, what is Diffuse exactly? To be honest, I'm not quite sure yet. So far it has taken shape in the following ways. This is quite technical, so if you want you can skip this list and read the summary right after.

1. A [set](https://diffuse.sh/latest/elements/#definitions) of data schemas in the form of AT Protocol lexicons.
2. A [set](https://diffuse.sh/latest/elements/) of framework-agnostic web components. These make up multiple layers of logic, building blocks to create our software.
3. Web bundles in the form of [Web Tile](https://dasl.ing/tiles.html) CAR files. Basically just HTML snippets with Javascript and/or CSS in a small package.
4. A manifest that points at a web bundle, a simple HTML file, another manifest or contents in the manifest itself. This represents an interface or a "feature".
5. A default extendable configuration of the included web components that are used throughout the included web bundles. This sets up the components in such a way that they communicate with each other even if they live in different browser tabs.
6. A dashboard that lists all the manifests in your collection. Here you can toggle features, bookmark + open interfaces, and edit them.
7. A loader that takes an interface manifest and renders it. Feature manifest contents are injected before the contents of the interface. This usually means, a script tag is rendered before the interface HTML is.

This gives us a platform to build our personal software on.
