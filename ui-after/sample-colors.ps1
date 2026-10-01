param([string]$Path, [string]$Out, [int]$X = 40, [int]$Y0 = 0, [int]$Y1 = 0)
Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile((Resolve-Path $Path).Path)
if ($Y1 -le 0) { $Y1 = $bmp.Height }

# Walk a single vertical column and print each contiguous colour band. This is the
# reliable way to read the reference's vertical rhythm without guessing y values.
$prev = ''
$startY = $Y0
$lines = @()
for ($y = $Y0; $y -lt $Y1; $y += 2) {
  $c = $bmp.GetPixel($X, $y)
  $hex = '{0:X2}{1:X2}{2:X2}' -f $c.R, $c.G, $c.B
  if ($hex -ne $prev) {
    if ($prev -ne '' -and ($y - $startY) -ge 8) {
      $lines += ("y={0,4}..{1,4} h={2,3}  #{3}" -f $startY, ($y - 2), ($y - $startY), $prev)
    }
    $prev = $hex
    $startY = $y
  }
}
$bmp.Dispose()
$lines | Set-Content -Path $Out -Encoding UTF8
$lines
