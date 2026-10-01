param(
  [Parameter(Mandatory = $true)][string]$In,
  [Parameter(Mandatory = $true)][string]$Out,
  [Parameter(Mandatory = $true)][int]$X,
  [Parameter(Mandatory = $true)][int]$Y,
  [Parameter(Mandatory = $true)][int]$W,
  [Parameter(Mandatory = $true)][int]$H,
  [double]$Zoom = 2
)
# crop.ps1 — crop a region out of a PNG and optionally upscale it for eyeballing.
#   crop.ps1 -In live.png -Out c1.png -X 430 -Y 170 -W 330 -H 240 -Zoom 3
Add-Type -AssemblyName System.Drawing
$src = [System.Drawing.Image]::FromFile((Resolve-Path $In).Path)
$wpx = [int]($W * $Zoom)
$hpx = [int]($H * $Zoom)
$bmp = New-Object System.Drawing.Bitmap -ArgumentList $wpx, $hpx
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::Half
$dst = New-Object System.Drawing.Rectangle -ArgumentList 0, 0, $wpx, $hpx
$srcRect = New-Object System.Drawing.Rectangle -ArgumentList $X, $Y, $W, $H
$g.DrawImage($src, $dst, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
$g.Dispose()
$bmp.Save((Join-Path (Get-Location) $Out), [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
$src.Dispose()
"saved $Out ($wpx x $hpx)"
