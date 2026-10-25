<?xml version="1.0" encoding="UTF-8"?>
<!-- Human-readable view of the sitemap in browsers. Search engines ignore this stylesheet. -->
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html lang="es">
      <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width,initial-scale=1"/>
        <meta name="robots" content="noindex"/>
        <title>Sitemap · Germán Oviedo</title>
        <style>
          :root { color-scheme: light dark; --bg:#FCFBF8; --ink:#1A1718; --muted:#5C5656; --rule:#E6E1DC; --accent:#7A1F2E; }
          @media (prefers-color-scheme: dark) { :root { --bg:#141412; --ink:#ECEAE5; --muted:#A8A59D; --rule:#2E2C28; --accent:#D9838F; } }
          body { margin:0; padding:48px 16px; background:var(--bg); color:var(--ink); font:15px/1.6 system-ui, sans-serif; }
          main { max-width:960px; margin:0 auto; }
          h1 { font:400 2rem Georgia, serif; margin:0 0 4px; }
          p { color:var(--muted); margin:0 0 24px; }
          table { width:100%; border-collapse:collapse; }
          th { text-align:left; font:12px ui-monospace, monospace; letter-spacing:.08em; text-transform:uppercase; color:var(--muted); padding:8px 8px 8px 0; border-bottom:1px solid var(--rule); }
          td { padding:8px 8px 8px 0; border-bottom:1px solid var(--rule); vertical-align:top; word-break:break-all; }
          a { color:var(--ink); text-decoration:none; } a:hover { color:var(--accent); }
          .alt { font:12px ui-monospace, monospace; color:var(--muted); }
        </style>
      </head>
      <body>
        <main>
          <h1>Sitemap</h1>
          <xsl:choose>
            <xsl:when test="s:sitemapindex">
              <p><xsl:value-of select="count(s:sitemapindex/s:sitemap)"/> sitemap(s)</p>
              <table>
                <tr><th>Sitemap</th></tr>
                <xsl:for-each select="s:sitemapindex/s:sitemap">
                  <tr><td><a href="{s:loc}"><xsl:value-of select="s:loc"/></a></td></tr>
                </xsl:for-each>
              </table>
            </xsl:when>
            <xsl:otherwise>
              <p><xsl:value-of select="count(s:urlset/s:url)"/> URLs</p>
              <table>
                <tr><th>URL</th><th>Idiomas</th></tr>
                <xsl:for-each select="s:urlset/s:url">
                  <tr>
                    <td><a href="{s:loc}"><xsl:value-of select="s:loc"/></a></td>
                    <td class="alt">
                      <xsl:for-each select="xhtml:link">
                        <a href="{@href}"><xsl:value-of select="@hreflang"/></a><xsl:if test="position() != last()"> · </xsl:if>
                      </xsl:for-each>
                    </td>
                  </tr>
                </xsl:for-each>
              </table>
            </xsl:otherwise>
          </xsl:choose>
        </main>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
