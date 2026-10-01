param(
  [Parameter(Mandatory = $true)][string]$In,
  [Parameter(Mandatory = $true)][int]$X,
  [int]$Y0 = 0,
  [int]$Y1 = -1
)
# probe_col.ps1 — print every vertical colour transition down one column.
#   probe_col.ps1 -In ref.png -X 300 -Y0 1200 -Y1 1500
Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Bitmap]::FromFile((Resolve-Path $In).Path)
if ($Y1 -lt 0) { $Y1 = $img.Height - 1 }
$prev = ''
for ($y = $Y0; $y -le $Y1; $y++) {
  $c = $img.GetPixel($X, $y)
  $k = "$($c.R),$($c.G),$($c.B)"
  if ($k -ne $prev) { Write-Output "$y : $k"; $prev = $k }
}
$img.Dispose()
