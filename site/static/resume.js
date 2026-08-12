/**
 * Resume / C.V. — rendered live from the AT Protocol.
 *
 * The profile lives on the open AT Protocol (https://atproto.com/) as SIFA
 * records (`id.sifa.profile.*`). This script:
 *
 *   1. resolves the handle (tokono.ma) to a DID,
 *   2. looks up the Personal Data Server (PDS) from the DID document,
 *   3. pulls every SIFA profile collection via `com.atproto.repo.listRecords`,
 *   4. renders a C.V. into the `#sifa-resume` mount point.
 *
 * No API keys are needed — everything is public, read-only AT Protocol data,
 * and all endpoints below send `Access-Control-Allow-Origin: *`.
 */
(function () {
  "use strict";

  var HANDLE = "tokono.ma";

  var mount = document.getElementById("sifa-resume");
  if (!mount) return;

  // ----- label mappings (id.sifa.defs -> human readable) ---------------------
  // Covers every value used on this profile. Unknown ids fall back to a
  // readable fragment of the id itself (see `prettyId` below).
  var DEFS = {
    "id.sifa.defs#fullTime": "Full-time",
    "id.sifa.defs#partTime": "Part-time",
    "id.sifa.defs#contract": "Contract",
    "id.sifa.defs#temporary": "Temporary",
    "id.sifa.defs#apprenticeship": "Apprenticeship",
    "id.sifa.defs#internship": "Internship",
    "id.sifa.defs#trainee": "Trainee",
    "id.sifa.defs#seasonal": "Seasonal",
    "id.sifa.defs#volunteer": "Volunteer",
    "id.sifa.defs#freelance": "Freelance",
    "id.sifa.defs#selfEmployed": "Self-employed",
    "id.sifa.defs#contractRoles": "Contract roles",
    "id.sifa.defs#fullTimeRoles": "Full-time roles",
    "id.sifa.defs#partTimeRoles": "Part-time roles",
    "id.sifa.defs#collaborations": "Collaborations",
    "id.sifa.defs#remote": "Remote",
    "id.sifa.defs#onSite": "On-site",
    "id.sifa.defs#hybrid": "Hybrid",
    "id.sifa.defs#remoteGlobal": "Remote (worldwide)",
    "id.sifa.defs#remoteLocal": "Remote (local)",
    "id.sifa.defs#remoteRegion": "Remote (regional)",
  };

  var INDUSTRIES = {
    "id.sifa.defs#industryTechnology": "Technology",
    "id.sifa.defs#industrySoftware": "Software",
    "id.sifa.defs#domainSoftwareEngineering": "Software Engineering",
    "id.sifa.defs#domainOpenSource": "Open Source",
  };

  var PROFICIENCY = {
    native: "Native",
    full_professional: "Full professional",
    professional: "Professional",
    elementary: "Elementary",
  };

  // ----- helpers --------------------------------------------------------------

  function getJSON(url) {
    return fetch(url).then(function (res) {
      if (!res.ok) throw new Error("Request failed: " + url);
      return res.json();
    });
  }

  function label(id) {
    if (DEFS[id]) return DEFS[id];
    if (INDUSTRIES[id]) return INDUSTRIES[id];
    return prettyId(id);
  }

  // "id.sifa.defs#fullTime" -> "Full Time"
  function prettyId(id) {
    var fragment = String(id).split("#")[1] || String(id);
    return fragment
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .split(" ")
      .map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); })
      .join(" ");
  }

  function escapeHtml(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function link(href, text) {
    var a = document.createElement("a");
    a.className = "resume__link";
    a.href = href;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.textContent = text;
    return a;
  }

  function element(tag, className, children) {
    var el = document.createElement(tag);
    if (className) el.className = className;
    (children || []).forEach(function (c) {
      if (c == null) return;
      if (c.nodeType) el.appendChild(c);
      else el.appendChild(document.createTextNode(String(c)));
    });
    return el;
  }

  // AT Protocol: handle -> DID
  function resolveDid(handle) {
    return getJSON(
      "https://api.bsky.app/xrpc/com.atproto.identity.resolveHandle?handle=" +
        encodeURIComponent(handle)
    ).then(function (data) { return data.did; });
  }

  // AT Protocol: DID -> PDS service endpoint
  function resolvePds(did) {
    return getJSON("https://plc.directory/" + did).then(function (doc) {
      var svc =
        (doc.service || []).find(function (s) {
          return s.type === "AtprotoPersonalDataServer";
        }) || {};
      if (!svc.serviceEndpoint) throw new Error("No PDS found for " + did);
      return svc.serviceEndpoint.replace(/\/$/, "");
    });
  }

  // AT Protocol: paged list of record values for a collection
  function listRecords(pds, did, collection) {
    var values = [];
    var cursor;
    function page() {
      var url =
        pds +
        "/xrpc/com.atproto.repo.listRecords?repo=" +
        encodeURIComponent(did) +
        "&collection=" +
        encodeURIComponent(collection) +
        (cursor ? "&cursor=" + encodeURIComponent(cursor) : "");
      return getJSON(url).then(function (data) {
        (data.records || []).forEach(function (r) { values.push(r.value); });
        cursor = data.cursor;
        return cursor ? page() : values;
      });
    }
    return page();
  }

  // ----- field formatters ------------------------------------------------------

  function formatYearMonth(value) {
    if (!value) return "";
    var m = String(value).match(/^(\d{4})-(\d{2})/);
    if (!m) return String(value);
    var months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    return months[parseInt(m[2], 10) - 1] + " " + m[1];
  }

  function dateRange(startedAt, endedAt) {
    return formatYearMonth(startedAt) + " — " + (endedAt ? formatYearMonth(endedAt) : "Present");
  }

  // Combined heading for each career item:
  //   company  -> "Title at Company"
  //   freelance-> "Freelance Title"
  function positionTitle(position) {
    var title = position.title || "Role";
    if (position.company) return title + " at " + position.company;
    var type = position.employmentType ? label(position.employmentType) : "";
    return type ? type + " " + title : title;
  }

  function positionMeta(position) {
    var bits = [];
    if (position.workplaceType) bits.push(label(position.workplaceType));
    return bits.join(" · ");
  }

  function byStartDesc(a, b) {
    var ka = (a.startedAt || "0000-00");
    var kb = (b.startedAt || "0000-00");
    return ka < kb ? 1 : ka > kb ? -1 : 0;
  }

  // Ongoing (no end date) projects first, ordered by most-recent start;
  // then ended projects ordered by most-recent end date.
  function byProjectOrder(a, b) {
    var aOngoing = !a.endedAt;
    var bOngoing = !b.endedAt;
    if (aOngoing !== bOngoing) return aOngoing ? -1 : 1;
    if (aOngoing && bOngoing) return byStartDesc(a, b);
    var ea = a.endedAt || "0000-00";
    var eb = b.endedAt || "0000-00";
    return ea < eb ? 1 : ea > eb ? -1 : 0;
  }

  // Best proficiency first.
  var PROFICIENCY_ORDER = [
    "native",
    "full_professional",
    "professional",
    "elementary",
  ];

  function byProficiency(a, b) {
    var ra = PROFICIENCY_ORDER.indexOf(a.proficiency);
    var rb = PROFICIENCY_ORDER.indexOf(b.proficiency);
    if (ra === -1) ra = PROFICIENCY_ORDER.length;
    if (rb === -1) rb = PROFICIENCY_ORDER.length;
    if (ra !== rb) return ra - rb;
    return (a.name || "").localeCompare(b.name || "");
  }

  function uniqueBy(records, key) {
    var seen = {};
    return records.filter(function (r) {
      var k = r[key];
      if (seen[k]) return false;
      seen[k] = true;
      return true;
    });
  }

  function formatLocation(locations) {
    if (!locations.length) return null;
    // Prefer the primary location, fall back to the most recent.
    var loc =
      locations.find(function (l) { return l.isPrimary; }) ||
      locations[locations.length - 1];
    var addr = (loc && loc.address) || {};
    return [addr.locality, addr.region, countryName(addr.country)]
      .filter(Boolean)
      .join(", ");
  }

  function countryName(code) {
    var names = {
      BE: "Belgium",
      NL: "Netherlands",
      DE: "Germany",
      FR: "France",
      GB: "United Kingdom",
      US: "United States",
    };
    return names[code] || code || "";
  }

  // Verified Keytrace claims (e.g. GitHub) become profile links. The Bluesky
  // claim is skipped — it usually refers to a separate project/account.
  var KEYTRACE_LABELS = {
    github: "GitHub",
  };

  function mergeExternalLinks(accounts, keytrace) {
    var links = (accounts || []).map(function (a) {
      return {
        url: a.url,
        label: a.label || a.url,
      };
    });

    (keytrace || []).forEach(function (claim) {
      if (!claim || claim.type === "bsky") return;
      if (claim.status && claim.status !== "verified") return;
      var url = (claim.identity && claim.identity.profileUrl) || claim.claimUri;
      if (!url) return;
      links.push({
        url: url,
        label: KEYTRACE_LABELS[claim.type] || prettyId(claim.type),
      });
    });

    return links.sort(function (a, b) {
      return (a.label || "").toLowerCase().localeCompare((b.label || "").toLowerCase());
    });
  }

  // ----- rendering --------------------------------------------------------------

  function section(title) {
    return element("h2", "resume__section", [title]);
  }

  function render(profile) {
    var frag = document.createDocumentFragment();

    // Header
    frag.appendChild(
      element("div", "resume__head", [
        element("p", "resume__name", [profile.name || "@" + HANDLE]),
        profile.location
          ? element("p", "resume__location", [profile.location])
          : null,
      ])
    );

    frag.appendChild(section("About"));
    frag.appendChild(
      element("p", "resume__about", [profile.about || ""])
    );

    // Career
    if (profile.career.length) {
      frag.appendChild(section("Career"));
      var careerUl = element("ul", "resume__list");
      profile.career.forEach(function (pos) {
        var meta = positionMeta(pos);
        var item = element("li", "resume__item", []);
        var main = element("div", "resume__item-main", [
          element("span", "resume__item-title", [positionTitle(pos)]),
        ]);
        item.appendChild(main);
        if (meta) {
          item.appendChild(element("span", "resume__item-meta", [meta]));
        }
        item.appendChild(
          element("time", "resume__item-dates", [
            dateRange(pos.startedAt, pos.endedAt),
          ])
        );
        careerUl.appendChild(item);
      });
      frag.appendChild(careerUl);
    }

    // Skills
    if (profile.skills.length) {
      frag.appendChild(section("Skills"));
      var skillUl = element("ul", "resume__skills");
      profile.skills.forEach(function (skill) {
        skillUl.appendChild(element("li", "resume__skill", [skill.name]));
      });
      frag.appendChild(skillUl);
    }

    // Languages
    if (profile.languages.length) {
      frag.appendChild(section("Languages"));
      var langUl = element("ul", "resume__list");
      profile.languages.forEach(function (lang) {
        var prof = PROFICIENCY[lang.proficiency] || prettyId(lang.proficiency);
        var li = element("li", "resume__item", []);
        var main = element("div", "resume__item-inline", [
          element("span", "resume__item-title", [lang.name]),
        ]);
        if (prof) main.appendChild(element("span", "resume__item-meta", [" · " + prof]));
        li.appendChild(main);
        langUl.appendChild(li);
      });
      frag.appendChild(langUl);
    }

    // Projects
    if (profile.projects.length) {
      frag.appendChild(section("Projects"));
      var projectUl = element("ul", "resume__list");
      profile.projects.forEach(function (p) {
        var title =
          p.url && p.url !== "#"
            ? link(p.url, p.name || p.url)
            : (p.name || "");
        var li = element("li", "resume__item", []);
        var projectMain = element("div", "resume__item-main", [
          element("span", "resume__item-title", [title]),
        ]);
        li.appendChild(projectMain);
        if (p.startedAt) {
          var projStart = String(p.startedAt).slice(0, 4);
          var projDate = p.endedAt
            ? projStart + " — " + String(p.endedAt).slice(0, 4)
            : "Since " + projStart;
          projectMain.appendChild(
            element("time", "resume__item-dates", [projDate])
          );
        }
        if (p.description) {
          li.appendChild(element("p", "resume__item-desc", [p.description]));
        }
        projectUl.appendChild(li);
      });
      frag.appendChild(projectUl);
    }

    // External links
    if (profile.externals.length) {
      frag.appendChild(section("Links"));
      var extUl = element("ul", "resume__list");
      profile.externals.forEach(function (ex) {
        if (!ex.url) return;
        extUl.appendChild(
          element("li", "resume__item", [
            element("span", "resume__item-title", [
              link(ex.url, ex.label || ex.url),
            ]),
          ])
        );
      });
      frag.appendChild(extUl);
    }

    mount.innerHTML = "";
    mount.appendChild(frag);
  }

  function renderError(err) {
    mount.innerHTML = "";
    mount.appendChild(
      element("p", "resume__error", [
        "Couldn't load the CV from the AT Protocol right now. ",
        "See it live on ",
        link("https://sifa.id/p/tokono.ma", "Sifa"),
        ", or revisit this page later.",
      ])
    );
    if (window.console && console.error) console.error("resume.js:", err);
  }

  // ----- run --------------------------------------------------------------------

  async function load() {
    var did = await resolveDid(HANDLE);
    var pds = await resolvePds(did);

    var profile = await getJSON(
      "https://api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=" +
        encodeURIComponent(HANDLE)
    ).catch(function () { return {}; });

    var [self, positions, skills, languages, projects, externals, locations, keytrace] =
      await Promise.all([
        listRecords(pds, did, "id.sifa.profile.self"),
        listRecords(pds, did, "id.sifa.profile.position"),
        listRecords(pds, did, "id.sifa.profile.skill"),
        listRecords(pds, did, "id.sifa.profile.language"),
        listRecords(pds, did, "id.sifa.profile.project"),
        listRecords(pds, did, "id.sifa.profile.externalAccount"),
        listRecords(pds, did, "id.sifa.profile.location"),
        listRecords(pds, did, "dev.keytrace.claim"),
      ]);

    render({
      name: profile.displayName,
      about: (self[0] || {}).about
        ? (self[0] || {}).about.trim()
        : profile.description,
      location: formatLocation(locations),
      career: positions.filter(function (p) { return !p.isHidden; }).sort(byStartDesc),
      skills: uniqueBy(skills, "name").sort(function (a, b) {
        return (a.name || "").toLowerCase().localeCompare((b.name || "").toLowerCase());
      }),
      languages: languages.slice().sort(byProficiency),
      projects: projects.slice().sort(byProjectOrder),
      externals: mergeExternalLinks(externals, keytrace),
    });
  }

  load().catch(renderError);
})();