param(
  [Parameter(Mandatory = $true)][string]$In,
  [Parameter(Mandatory = $true)][int]$Y,
  [int]$X0 = 0,
  [int]$X1 = -1
)
# probe_row.ps1 — print every horizontal colour transition on one scanline.
#   probe_row.ps1 -In ref.png -Y 1186 -X0 200
Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Bitmap]::FromFile((Resolve-Path $In).Path)
if ($X1 -lt 0) { $X1 = $img.Width - 1 }
$prev = ''
for ($x = $X0; $x -le $X1; $x++) {
  $c = $img.GetPixel($x, $Y)
  $k = "$($c.R),$($c.G),$($c.B)"
  if ($k -ne $prev) { Write-Output "$x : $k"; $prev = $k }
}
$img.Dispose()
