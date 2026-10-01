param([string]$Path, [string]$Out, [string]$Targets = '')
Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile((Resolve-Path $Path).Path)

# Find the bounding box of every pixel close to a target colour. The reference is
# 724x2172 (1.856x of the 390pt target), so this recovers exact pixel geometry
# without eyeballing coordinates.
$boxes = @{}
foreach ($t in $Targets.Split(',')) {
  $t = $t.Trim()
  if ($t -eq '') { continue }
  $tr = [Convert]::ToInt32($t.Substring(1, 2), 16)
  $tg = [Convert]::ToInt32($t.Substring(3, 2), 16)
  $tb = [Convert]::ToInt32($t.Substring(5, 2), 16)
  $minX = 99999; $maxX = -1; $minY = 99999; $maxY = -1; $count = 0
  for ($y = 0; $y -lt $bmp.Height; $y++) {
    for ($x = 0; $x -lt $bmp.Width; $x++) {
      $c = $bmp.GetPixel($x, $y)
      $d = [Math]::Abs($c.R - $tr) + [Math]::Abs($c.G - $tg) + [Math]::Abs($c.B - $tb)
      if ($d -le 18) {
        $count++
        if ($x -lt $minX) { $minX = $x }
        if ($x -gt $maxX) { $maxX = $x }
        if ($y -lt $minY) { $minY = $y }
        if ($y -gt $maxY) { $maxY = $y }
      }
    }
  }
  if ($count -gt 0) {
    $boxes[$t] = ("{0}: x={1}..{2} (w={3})  y={4}..{5} (h={6})  px={7}" -f
      $t, $minX, $maxX, ($maxX - $minX + 1), $minY, $maxY, ($maxY - $minY + 1), $count)
  } else {
    $boxes[$t] = "$t : NOT FOUND"
  }
}
$bmp.Dispose()
$out = $boxes.Values
$out | Set-Content -Path $Out -Encoding UTF8
$out