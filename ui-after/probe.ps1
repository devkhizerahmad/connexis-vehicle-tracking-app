param(
  [Parameter(Mandatory = $true)][string]$Op,
  [string]$Path = 'd:\khizer_workspace\ConnexisTracker\design-references\engine control enhance version.png',
  [string]$A = '',
  [int]$Tol = 20,
  [int]$MinRun = 6,
  [int]$Top = 30,
  [string]$Out = ''
)
# probe.ps1 — driver for PixelProbe.cs. Usage:
#   probe.ps1 -Op hist -Top 60
#   probe.ps1 -Op cols -A '5,45,90,350,600,719' -MinRun 6
#   probe.ps1 -Op rows -A '300,860'
#   probe.ps1 -Op region -A '480,448,220,44;36,920,60,40'
#   probe.ps1 -Op runsx -A '#E53935,#4CAF50' -MinRun 20
#   probe.ps1 -Op runsy -A '#1B2430' -MinRun 30
Add-Type -AssemblyName System.Drawing
$cs = Join-Path $PSScriptRoot 'PixelProbe.cs'
if (-not ([System.Management.Automation.PSTypeName]'PixelProbe').Type) {
  Add-Type -TypeDefinition (Get-Content $cs -Raw) -Language CSharp -ReferencedAssemblies 'System.Drawing'
}
[PixelProbe]::Load((Resolve-Path $Path).Path)
$lines = New-Object System.Collections.Generic.List[string]
$lines.Add("== $Op | $(Split-Path $Path -Leaf) $([PixelProbe]::Width)x$([PixelProbe]::Height) | A=$A tol=$Tol minRun=$MinRun")
switch ($Op) {
  'hist'   { $lines.Add([PixelProbe]::Histogram($Top)) }
  'cols'   { foreach ($x in $A.Split(',')) { $lines.Add("-- col x=$x"); $lines.Add([PixelProbe]::ColBands([int]$x, $MinRun, $Tol)) } }
  'rows'   { foreach ($y in $A.Split(',')) { $lines.Add("-- row y=$y"); $lines.Add([PixelProbe]::RowBands([int]$y, $MinRun, $Tol)) } }
  'region' { foreach ($r in $A.Split(';')) { $p = $r.Split(','); $lines.Add("-- region $r"); $lines.Add([PixelProbe]::RegionMode([int]$p[0], [int]$p[1], [int]$p[2], [int]$p[3], $Top)) } }
  'quant'  { foreach ($r in $A.Split(';')) { $p = $r.Split(','); $lines.Add("-- quant $r"); $lines.Add([PixelProbe]::RegionQuant([int]$p[0], [int]$p[1], [int]$p[2], [int]$p[3], 4, $Top)) } }
  'rowmap' { $p = $A.Split(','); $lines.Add([PixelProbe]::RowMap([int]$p[0], [int]$p[1], $MinRun, 4)) }
  'box'    { $lines.Add([PixelProbe]::Boxes($A, $Tol, 20)) }
  'runsx'  { $lines.Add([PixelProbe]::RunsX($A, $Tol, $MinRun)) }
  'runsy'  { $lines.Add([PixelProbe]::RunsY($A, $Tol, $MinRun)) }
  default  { $lines.Add("unknown op") }
}
$text = ($lines -join "`n")
if ($Out -ne '') { Set-Content -Path $Out -Value $text -Encoding UTF8 }
$text
