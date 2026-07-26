# Scans the card-images folder, converts each to webp under public/services/cards/,
# and emits a manifest TS file. Re-run whenever the user adds/removes photos.
# ASCII-only script body (PS 5.1 mangles non-ASCII source).
$ErrorActionPreference = 'Stop'
$proj = 'C:\Users\abayb\Desktop\Claude skil\mediacrew-kadraj'
$src = Join-Path $proj 'Hizmetlerimiz Kart Gorselleri'
if (-not (Test-Path $src)) { $src = Join-Path $proj ([char]0x48 + 'izmetlerimiz Kart G' + [char]0x00F6 + 'rselleri') }
# Resolve the real folder (Turkish name) by pattern
$src = (Get-ChildItem $proj -Directory | Where-Object { $_.Name -like 'Hizmetlerimiz Kart*' } | Select-Object -First 1).FullName

$outDir = Join-Path $proj 'public\services\cards'
if (Test-Path $outDir) { Remove-Item "$outDir\*" -Force -ErrorAction SilentlyContinue }
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

function Get-Slug([string]$s) {
  $pairs = @(
    @('c',[char]0x00E7), @('c',[char]0x00C7), @('g',[char]0x011F), @('g',[char]0x011E),
    @('i',[char]0x0131), @('i',[char]0x0130), @('o',[char]0x00F6), @('o',[char]0x00D6),
    @('s',[char]0x015F), @('s',[char]0x015E), @('u',[char]0x00FC), @('u',[char]0x00DC)
  )
  foreach ($p in $pairs) { $s = $s.Replace([string]$p[1], $p[0]) }
  $s = $s.ToLowerInvariant()
  $s = ($s -replace '[^a-z0-9]+', '-').Trim('-')
  return $s
}

$files = Get-ChildItem $src -File |
  Where-Object { $_.Extension -match '(?i)\.(png|jpg|jpeg|jfif|webp)$' } |
  Sort-Object Name

$entries = @()
foreach ($f in $files) {
  $name = [System.IO.Path]::GetFileNameWithoutExtension($f.Name)
  $slug = Get-Slug $name
  $out = Join-Path $outDir "$slug.webp"
  ffmpeg -y -hide_banner -loglevel error -i $f.FullName -vf "scale='min(840,iw)':-1" -q:v 82 $out | Out-Null
  $kb = [math]::Round((Get-Item $out).Length / 1KB, 0)
  Write-Output ("  [ok] {0,-24} -> {1}.webp ({2} KB)" -f $name, $slug, $kb)
  $entries += [pscustomobject]@{ slug = $slug; name = $name; image = "/services/cards/$slug.webp" }
}

# Emit manifest TS (UTF-8 no BOM)
$sb = New-Object System.Text.StringBuilder
[void]$sb.AppendLine('// AUTO-GENERATED from "Hizmetlerimiz Kart Gorselleri" by build-service-cards.ps1.')
[void]$sb.AppendLine('// Do not edit by hand; re-run the script after changing the source images.')
[void]$sb.AppendLine('export type GeneratedServiceCard = { slug: string; name: string; image: string };')
[void]$sb.AppendLine('export const generatedServiceCards: GeneratedServiceCard[] = [')
foreach ($e in $entries) {
  $n = $e.name.Replace('\', '\\').Replace("'", "\'")
  [void]$sb.AppendLine("  { slug: '$($e.slug)', name: '$n', image: '$($e.image)' },")
}
[void]$sb.AppendLine('];')

$manifest = Join-Path $proj 'lib\service-cards.generated.ts'
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($manifest, $sb.ToString(), $utf8NoBom)

Write-Output ("`n[DONE] {0} kart -> {1}" -f $entries.Count, $manifest)