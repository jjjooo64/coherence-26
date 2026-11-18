const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand, PutCommand, DeleteCommand } = require("@aws-sdk/lib-dynamodb");
const { SSMClient, GetParameterCommand, PutParameterCommand } = require("@aws-sdk/client-ssm");

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const ssm = new SSMClient({});
const TABLE = process.env.TABLE_NAME;
const PARAM = process.env.PARAMETER_NAME;
const KEY = { id: "config" };

async function getPassword() {
  const res = await ssm.send(new GetParameterCommand({ Name: PARAM, WithDecryption: true }));
  return res.Parameter?.Value || "";
}

async function setPassword(pw) {
  await ssm.send(new PutParameterCommand({
    Name: PARAM,
    Value: pw,
    Type: "SecureString",
    Overwrite: true
  }));
}

async function getConfig() {
  try {
    const res = await ddb.send(new GetCommand({ TableName: TABLE, Key: KEY }));
    return res.Item || {};
  } catch (e) {
    return {};
  }
}

async function putConfig(item) {
  await ddb.send(new PutCommand({
    TableName: TABLE,
    Item: { ...KEY, ...item }
  }));
}

exports.handler = async (event) => {
  const headers = {
    "Cache-Control": "no-store",
    "Content-Type": "application/json"
  };

  if (event.requestContext?.http?.method === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  const path = event.requestContext?.http?.path || event.rawPath || "/";
  const method = event.requestContext?.http?.method || "GET";

  // Public: verification text
  if ((path === "/code" || path.endsWith("/code")) && method === "GET") {
    const cfg = await getConfig();
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ verificationText: cfg.verificationText || null })
    };
  }

  // Public: render parameters (pathless)
  if (path === "/" && method === "GET") {
    const cfg = await getConfig();
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        domains: cfg.domains || [],
        resourceLocations: cfg.resourceLocations || []
      })
    };
  }

  // Admin actions
  if ((path === "/admin" || path.endsWith("/admin")) && method === "POST") {
    let body = {};
    try { body = JSON.parse(event.body || "{}"); } catch (e) {}
    const currentPw = await getPassword();
    if (body.password !== currentPw) {
      return { statusCode: 401, headers, body: "unauthorized" };
    }

    // Change password
    if (body.newPassword !== undefined) {
      if (String(body.newPassword).length < 8) {
        return { statusCode: 400, headers, body: "password too short" };
      }
      await setPassword(String(body.newPassword));
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true, changed: "password" }) };
    }

    // Update config fields
    const cfg = await getConfig();
    if (body.verificationText !== undefined) {
      cfg.verificationText = body.verificationText ? String(body.verificationText).slice(0, 500) : null;
    }
    if (body.domains !== undefined) {
      cfg.domains = body.domains;
    }
    if (body.resourceLocations !== undefined) {
      cfg.resourceLocations = body.resourceLocations;
    }
    await putConfig(cfg);
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  }

  // Admin page
  if ((path === "/admin" || path.endsWith("/admin")) && method === "GET") {
    const cfg = await getConfig();
    const html = `<!DOCTYPE html>
<html><head><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:sans-serif;max-width:640px;margin:2em auto;padding:1em">
  <h2>Admin</h2>
  <form id="f">
    <input name="password" type="password" placeholder="password" required style="width:100%;margin:.5em 0;padding:.5em;box-sizing:border-box"><br>

    <label>verificationText</label><br>
    <textarea name="verificationText" rows="3" style="width:100%;padding:.5em;box-sizing:border-box">${cfg.verificationText || ""}</textarea><br>

    <label>domains (JSON)</label><br>
    <textarea name="domains" rows="6" style="width:100%;padding:.5em;box-sizing:border-box;font-family:monospace">${JSON.stringify(cfg.domains || [], null, 2)}</textarea><br>

    <label>resourceLocations (JSON)</label><br>
    <textarea name="resourceLocations" rows="12" style="width:100%;padding:.5em;box-sizing:border-box;font-family:monospace">${JSON.stringify(cfg.resourceLocations || [], null, 2)}</textarea><br>

    <button type="submit" style="padding:.6em 1.2em">Save all</button>
  </form>
  <pre id="out" style="margin-top:1em;white-space:pre-wrap"></pre>

  <h2 style="margin-top:2em">Backup</h2>
  <button id="download" style="padding:.6em 1.2em">Download backup</button>
  <pre id="backupOut" style="margin-top:1em;white-space:pre-wrap"></pre>

  <h2 style="margin-top:2em">Change password</h2>
  <form id="pw">
    <input name="password" type="password" placeholder="current password" required style="width:100%;margin:.5em 0;padding:.5em;box-sizing:border-box"><br>
    <input name="newPassword" type="password" placeholder="new password (min 8)" required style="width:100%;margin:.5em 0;padding:.5em;box-sizing:border-box"><br>
    <button type="submit" style="padding:.6em 1.2em">Change password</button>
  </form>
  <pre id="pwOut" style="margin-top:1em;white-space:pre-wrap"></pre>

  <script>
    document.getElementById("f").onsubmit = async e => {
      e.preventDefault();
      const d = new FormData(e.target);
      const out = document.getElementById("out");
      out.textContent = "Saving...";
      try {
        let domains, resourceLocations;
        try { domains = JSON.parse(d.get("domains") || "[]"); } catch { out.textContent = "domains JSON invalid"; return; }
        try { resourceLocations = JSON.parse(d.get("resourceLocations") || "[]"); } catch { out.textContent = "resourceLocations JSON invalid"; return; }
        const r = await fetch(location.pathname, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            password: d.get("password"),
            verificationText: d.get("verificationText"),
            domains,
            resourceLocations
          })
        });
        out.textContent = await r.text();
      } catch (err) {
        out.textContent = "Error: " + err.message;
      }
    };
    document.getElementById("download").onclick = async () => {
      const out = document.getElementById("backupOut");
      out.textContent = "Fetching...";
      try {
        const [paramsRes, textRes] = await Promise.all([
          fetch("/"),
          fetch("/code")
        ]);
        const params = paramsRes.ok ? await paramsRes.json() : {};
        const text = textRes.ok ? await textRes.json() : {};
        const backup = {
          verificationText: text.verificationText || null,
          domains: params.domains || [],
          resourceLocations: params.resourceLocations || []
        };
        const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "secret-code-backup.json";
        a.click();
        URL.revokeObjectURL(a.href);
        out.textContent = "Downloaded";
      } catch (err) {
        out.textContent = "Error: " + err.message;
      }
    };
    document.getElementById("pw").onsubmit = async e => {
      e.preventDefault();
      const d = new FormData(e.target);
      const out = document.getElementById("pwOut");
      out.textContent = "Saving...";
      try {
        const r = await fetch(location.pathname, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            password: d.get("password"),
            newPassword: d.get("newPassword")
          })
        });
        out.textContent = await r.text();
      } catch (err) {
        out.textContent = "Error: " + err.message;
      }
    };
  </script>
</body></html>`;
    return {
      statusCode: 200,
      headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
      body: html
    };
  }

  return { statusCode: 404, headers, body: "not found" };
};
