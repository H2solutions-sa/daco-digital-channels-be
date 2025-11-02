import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

const UAT = "https://uat.dammamairports.sa/AODPAPI/api/v1";
const PROD = (process.env.AODP_PROD_BASE || "http://aodb.cd/api/v1").replace(/\/+$/, "");
const isInternal = process.env.AODP_INTERNAL_NETWORK === "1";

const TOP_MIN = 10, TOP_MAX = 1000, TOP_DEFAULT = 500;

async function fetchUpstream(url: string) {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), 6000);
  try {
    const r = await fetch(url, { cache: "no-store", signal: ac.signal });
    const text = await r.text();
    return { ok: r.ok, status: r.status, headers: r.headers, text };
  } finally {
    clearTimeout(t);
  }
}

export async function GET(req: NextRequest) {
  const q = new URL(req.url).searchParams;
  const arrDep = q.get("arr_dep");
  const topRaw = q.get("top");
  const top = Number.isFinite(Number(topRaw))
    ? Math.max(TOP_MIN, Math.min(TOP_MAX, parseInt(topRaw!, 10)))
    : TOP_DEFAULT;

  const basePreferred = isInternal ? PROD : UAT;
  const build = (base: string) => {
    const u = new URL(`${base}/flights`);
    if (arrDep === "A" || arrDep === "D") u.searchParams.set("$filter", `ARR_DEP eq '${arrDep}'`);
    u.searchParams.set("$top", String(top));
    return u.toString();
  };

  const firstURL = build(basePreferred);
  try {
    const first = await fetchUpstream(firstURL);
    if (first.ok) {
      return new NextResponse(first.text, {
        status: 200,
        headers: {
          "content-type": first.headers.get("content-type") || "application/json",
          "x-upstream-base": basePreferred,
          "cache-control": "no-store",
        },
      });
    }

    if (isInternal) {
      const fallbackURL = build(UAT);
      const fb = await fetchUpstream(fallbackURL);
      if (fb.ok) {
        return new NextResponse(fb.text, {
          status: 200,
          headers: {
            "content-type": fb.headers.get("content-type") || "application/json",
            "x-upstream-base": UAT,
            "x-upstream-failover": "1",
            "cache-control": "no-store",
          },
        });
      }
      return NextResponse.json(
        { error: "Upstream unavailable" },
        { status: fb.status || 502, headers: { "cache-control": "no-store", "x-upstream-first": firstURL, "x-upstream-fallback": fallbackURL } }
      );
    }

    return NextResponse.json(
      { error: "Upstream unavailable" },
      { status: first.status || 502, headers: { "cache-control": "no-store", "x-upstream": firstURL } }
    );
  } catch (_e: any) {
    if (isInternal) {
      try {
        const fbURL = build(UAT);
        const fb = await fetchUpstream(fbURL);
        if (fb.ok) {
          return new NextResponse(fb.text, {
            status: 200,
            headers: {
              "content-type": fb.headers.get("content-type") || "application/json",
              "x-upstream-base": UAT,
              "x-upstream-failover": "1",
              "cache-control": "no-store",
            },
          });
        }
      } catch { /* ignore */ }
    }
    return NextResponse.json(
      { error: "Proxy failure" },
      { status: 502, headers: { "cache-control": "no-store", "x-upstream": firstURL } }
    );
  }
}