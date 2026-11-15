// Haalt de leesbare tekst uit oude pagina's (alleen <main>), om te herschrijven.
import fs from 'node:fs';
for (const f of process.argv.slice(2)) {
  const s = fs.readFileSync(f, 'utf8');
  const m = (s.match(/<main[\s\S]*?<\/main>/) || [s])[0];
  const t = m.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<svg[\s\S]*?<\/svg>/g, '')
    .replace(/<(h[1-6])[^>]*>/g, '\n## ').replace(/<(p|li|dt|dd|summary|tr)[^>]*>/g, '\n').replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/[ \t]+/g, ' ').replace(/\n\s*\n+/g, '\n').trim();
  console.log(`\n===== ${f} (${t.split(/\s+/).length} woorden)\n${t}`);
}
