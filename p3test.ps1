Add-Type -AssemblyName System.Drawing
$dir = 'D:\khizer_workspace\ConnexisTracker'
function Snap($name){ adb shell screencap -p /sdcard/p3.png | Out-Null; adb pull /sdcard/p3.png "$dir\$name" | Out-Null }
function GetBands($path){
  $b=New-Object System.Drawing.Bitmap($path); $res=@(); $in=$false; $s=0
  for($y=200;$y -lt 1500;$y++){
    $c=$b.GetPixel(300,$y)
    $m=([Math]::Abs($c.R-0x1B) -le 16 -and [Math]::Abs($c.G-0x24) -le 16 -and [Math]::Abs($c.B-0x30) -le 16)
    if($m -and -not $in){$in=$true;$s=$y}
    if(-not $m -and $in){$in=$false; if(($y-1-$s) -ge 20){$res+="${s}-$($y-1)"}}
  }
  if($in -and (1499-$s) -ge 20){$res+="${s}-1499"}
  $b.Dispose(); return $res
}
function CountColor($path,$x0,$x1,$y0,$y1,$r,$g,$bl,$tol){
  $b=New-Object System.Drawing.Bitmap($path); $n=0
  for($y=$y0;$y -lt $y1;$y++){ for($x=$x0;$x -lt $x1;$x++){ $c=$b.GetPixel($x,$y)
    if([Math]::Abs($c.R-$r) -le $tol -and [Math]::Abs($c.G-$g) -le $tol -and [Math]::Abs($c.B-$bl) -le $tol){$n++} } }
  $b.Dispose(); return $n
}
# scroll until TWO navy bands visible (Routes + QuickReport)
Snap 'p3cur.png'
$ok=$false
for($t=0; $t -lt 8 -and -not $ok; $t++){
  $bands=GetBands "$dir\p3cur.png"
  if($bands.Count -ge 2){$ok=$true} else { adb shell input swipe 360 1150 360 380 250; Start-Sleep -Milliseconds 700; Snap 'p3cur.png' }
}
Write-Host ("scroll: two bands visible = {0}; bands = {1}" -f $ok, ($bands -join ' '))
if(-not $ok){ Write-Host 'FATAL: cannot bring both headers into view'; exit 1 }
# ---- ROUTES block: 5x toggle ----
$fail=0
for($i=1; $i -le 5; $i++){
  $bands=GetBands "$dir\p3cur.png"; $p=$bands[0].Split('-'); $ymid=[int](($p[0]+$p[1])/2)
  adb shell input tap 360 $ymid; Start-Sleep -Milliseconds 700
  Snap 'p3cur.png'
  $bands=GetBands "$dir\p3cur.png"; $p=$bands[0].Split('-')
  $g=CountColor "$dir\p3cur.png" 30 690 ([int]$p[1]+4) ([int]$p[1]+460) 0x35 0xCB 0x35 14
  $expect = if($i % 2 -eq 1){'COLLAPSED'}else{'EXPANDED'}
  $actual = if($g -gt 5){'EXPANDED'}else{'COLLAPSED'}
  if($expect -ne $actual){$fail++}
  Write-Host ("ROUTES toggle {0}: expect {1} actual {2} (greenBadgePx={3}) -> {4}" -f $i,$expect,$actual,$g,$(if($expect -eq $actual){'PASS'}else{'FAIL'}))
}
Write-Host ("ROUTES RESULT: fail={0}" -f $fail)
# ---- QUICK REPORT block: 5x toggle ----
$fail2=0
for($i=1; $i -le 5; $i++){
  $bands=GetBands "$dir\p3cur.png"; $p=$bands[1].Split('-'); $ymid=[int](($p[0]+$p[1])/2)
  adb shell input tap 360 $ymid; Start-Sleep -Milliseconds 700
  Snap 'p3cur.png'
  $bands=GetBands "$dir\p3cur.png"; $p=$bands[1].Split('-')
  $bl=CountColor "$dir\p3cur.png" 30 690 ([int]$p[1]+4) ([int]$p[1]+420) 0x1E 0x88 0xE5 14
  $expect = if($i % 2 -eq 1){'COLLAPSED'}else{'EXPANDED'}
  $actual = if($bl -gt 5){'EXPANDED'}else{'COLLAPSED'}
  if($expect -ne $actual){$fail2++}
  Write-Host ("QUICKREP toggle {0}: expect {1} actual {2} (blueTilePx={3}) -> {4}" -f $i,$expect,$actual,$bl,$(if($expect -eq $actual){'PASS'}else{'FAIL'}))
}
Write-Host ("QUICKREP RESULT: fail={0}" -f $fail2)
# ---- (e) right-half tap test on Routes header ----
$bands=GetBands "$dir\p3cur.png"; $p=$bands[0].Split('-'); $ymid=[int](($p[0]+$p[1])/2)
adb shell input tap 560 $ymid; Start-Sleep -Milliseconds 700
Snap 'p3cur.png'
$bands=GetBands "$dir\p3cur.png"; $p=$bands[0].Split('-')
$g=CountColor "$dir\p3cur.png" 30 690 ([int]$p[1]+4) ([int]$p[1]+460) 0x35 0xCB 0x35 14
Write-Host ("RIGHT-HALF tap: greenBadgePx={0} -> {1} (expect COLLAPSED)" -f $g, $(if($g -gt 5){'EXPANDED'}else{'COLLAPSED'}))
# restore expanded state
$bands=GetBands "$dir\p3cur.png"; $p=$bands[0].Split('-'); $ymid=[int](($p[0]+$p[1])/2)
adb shell input tap 360 $ymid; Start-Sleep -Milliseconds 700
Snap 'p3_final_routes_open.png'
Write-Host 'DONE'
