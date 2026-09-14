Add-Type -AssemblyName System.Drawing
$b=New-Object System.Drawing.Bitmap('D:\khizer_workspace\ConnexisTracker\p3a.png')
function Bands($b,$x,$y0,$y1,$tol){ $res=@(); $in=$false; $s=0
  for($y=$y0;$y -lt $y1;$y++){ $c=$b.GetPixel($x,$y); $m=([Math]::Abs($c.R-0x1B) -le $tol -and [Math]::Abs($c.G-0x24) -le $tol -and [Math]::Abs($c.B-0x30) -le $tol)
    if($m -and -not $in){$in=$true;$s=$y}; if(-not $m -and $in){$in=$false; if(($y-1-$s) -ge 20){$res+="${s}-$($y-1)"}} }
  if($in -and ($y1-1-$s) -ge 20){$res+="${s}-$($y1-1)"}
  return $res }
Write-Host ('x=300 bands: ' + ((Bands $b 300 200 1590 16) -join ' '))
Write-Host ('x=650 bands: ' + ((Bands $b 650 200 1590 16) -join ' '))
function Hex($b,$x,$y){ $c=$b.GetPixel($x,$y); return '#'+$c.R.ToString('X2')+$c.G.ToString('X2')+$c.B.ToString('X2') }
Write-Host ('top(360,50)='+[string](Hex $b 360 50)+' plate(360,250)='+[string](Hex $b 360 250))
$b.Dispose()
