Add-Type -AssemblyName System.Drawing
function Load($p){ $b=New-Object System.Drawing.Bitmap($p); return $b }
function Hex($b,$x,$y){ $c=$b.GetPixel($x,$y); return '#'+$c.R.ToString('X2')+$c.G.ToString('X2')+$c.B.ToString('X2') }
function Bands($b,$x,$y0,$y1){ $res=@(); $in=$false; $s=0
  for($y=$y0;$y -lt $y1;$y++){ $c=$b.GetPixel($x,$y); $m=([Math]::Abs($c.R-0x1B) -le 12 -and [Math]::Abs($c.G-0x24) -le 12 -and [Math]::Abs($c.B-0x30) -le 12)
    if($m -and -not $in){$in=$true;$s=$y}; if(-not $m -and $in){$in=$false; if(($y-1-$s) -ge 30){$res+="${s}-$($y-1)"}} }
  if($in -and ($y1-1-$s) -ge 30){$res+="${s}-$($y1-1)"}
  return $res }
function CountColor($b,$x0,$x1,$y0,$y1,$r,$g,$bl,$tol){ $n=0
  for($y=$y0;$y -lt $y1;$y++){ for($x=$x0;$x -lt $x1;$x++){ $c=$b.GetPixel($x,$y); if([Math]::Abs($c.R-$r) -le $tol -and [Math]::Abs($c.G-$g) -le $tol -and [Math]::Abs($c.B-$bl) -le $tol){$n++} } }
  return $n }
$b=Load 'D:\khizer_workspace\ConnexisTracker\p3a.png'
$bands=Bands $b 100 250 1590
Write-Host ('navy bands: ' + ($bands -join ' '))
$bh=@{}
$i=0
foreach($bd in $bands){ $p=$bd.Split('-'); $bh[$i]=@([int]$p[0],[int]$p[1]); $i++ }
# band 0 = fuel, 1 = temp, 2 = Routes, 3 = QuickReport (expected order)
for($k=2; $k -lt [Math]::Min(4,$i); $k++){
  $y0=$bh[$k][0]; $y1=$bh[$k][1]
  $gr=CountColor $b 30 690 ($y1+4) ($y1+420) 0x35 0xCB 0x35 14
  $am=CountColor $b 30 690 ($y1+4) ($y1+420) 0xF0 0xB4 0x29 14
  $rd=CountColor $b 30 690 ($y1+4) ($y1+420) 0xE0 0x31 0x31 14
  Write-Host ("band {0} y={1}..{2}: below-body green={3} amber={4} red={5}" -f $k,$y0,$y1,$gr,$am,$rd)
}
$b.Dispose()
