export async function onRequestPost(context) {
  const { request } = context;
  const HUB = "https://labs-enabler.fly.dev/api/inquiry";

  let body;
  try {
    body = await request.json();
  } catch (e) {
    return json({ ok: false, error: "invalid_json" }, 400);
  }

  if (!body || (!body.email && !body.message)) {
    return json({ ok: false, error: "missing_fields" }, 400);
  }

  const payload = {
    slug: "stayflow-care",
    name: String(body.name || "").slice(0, 200),
    email: String(body.email || "").slice(0, 200),
    phone: body.phone ? String(body.phone).slice(0, 60) : "",
    message: String(body.message || "").slice(0, 4000),
    extra: body.extra && typeof body.extra === "object" ? body.extra : {},
    utm_source: "stayflow-care-lp",
  };

  try {
    const res = await fetch(HUB, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      return json({ ok: false, error: "upstream_" + res.status }, 502);
    }
    return json({ ok: true }, 200);
  } catch (e) {
    return json({ ok: false, error: "network" }, 502);
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
  });
}
