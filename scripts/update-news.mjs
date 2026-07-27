// News kawaii 自動更新スクリプト
// NHKニュースRSSから最新の見出しを取得し、news-auto.json を更新します(見出しの伝達+リンク)。
const FEEDS = [
  "https://news.web.nhk/rss/news/cat0.xml",
  "https://www3.nhk.or.jp/rss/news/cat0.xml",
  "https://www.nhk.or.jp/rss/news/cat0.xml",
];

function pickEmoji(t) {
  if (/地震|震度|津波|噴火/.test(t)) return "📡";
  if (/台風|大雨|雷|天気|猛暑|暑さ|熱中症|気温|大雪|警報/.test(t)) return "🌡";
  if (/大谷|野球|甲子園|サッカー|スポーツ|五輪|オリンピック|大相撲|優勝|W杯|テニス|ゴルフ|マラソン/.test(t)) return "🏆";
  if (/宇宙|ロケット|衛星|JAXA|NASA|はやぶさ|月面|火星/.test(t)) return "🚀";
  if (/株価|円相場|経済|物価|賃金|日銀|関税|GDP|値上げ/.test(t)) return "💹";
  if (/選挙|首相|国会|内閣|政府|法案|大臣/.test(t)) return "🏛";
  if (/動物|パンダ|ねこ|猫|犬|ペンギン|ザル|クマ|水族館|動物園/.test(t)) return "🐾";
  return "🎀";
}

async function getFeed() {
  for (const url of FEEDS) {
    try {
      const res = await fetch(url, { headers: { "user-agent": "news-kawaii-bot/1.0" } });
      if (!res.ok) continue;
      const xml = await res.text();
      const items = [...xml.matchAll(
        /<item>[\s\S]*?<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>[\s\S]*?<link>([\s\S]*?)<\/link>[\s\S]*?<\/item>/g
      )].map((m) => ({ title: m[1].trim(), link: m[2].trim() }));
      if (items.length) return items;
    } catch {}
  }
  return [];
}

const items = await getFeed();
const fs = await import("node:fs");

if (!items.length) {
  console.log("見出しを取得できなかったので、前回の news-auto.json を維持します");
  process.exit(0);
}

const ticker = items.slice(0, 7).map((i) => pickEmoji(i.title) + " " + i.title);
ticker.push("☁ News kawaii は 出典リンクつきで お届けしています");

const out = {
  updated: new Date().toISOString(),
  source: "NHKニュースRSS(見出しの伝達)",
  ticker,
  heads: items.slice(0, 10),
};

fs.writeFileSync("news-auto.json", JSON.stringify(out, null, 1), "utf8");
console.log("更新しました:", ticker.length, "件");
