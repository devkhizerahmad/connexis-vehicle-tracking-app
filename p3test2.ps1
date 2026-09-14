Add-Type -AssemblyName System.Drawing
$dir = 'D:\khizer_workspace\ConnexisTracker'
function Snap($name){ adb shell screencap -p /sdcard/p3.png | Out-Null; adb pull /sdcard/p3.png "$dir\$name" | Out-Null }
function GetBands($path){
  $b=New-Object System.Drawing.Bitmap($path); $res=@(); $in=$false; $s=0
  for($y=120;$y -lt 1560;$y++){
    $c=$b.GetPixel(300,$y)
    $m=([Math]::Abs($c.R-0x1B) -le 16 -and [Math]::Abs($c.G-0x24) -le 16 -and [Math]::Abs($c.B-0x30) -le 16)
    if($m -and -not $in){$in=$true;$s=$y}
    if(-not $m -and $in){$in=$false; if(($y-1-$s) -ge 20){$res+="${s}-$($y-1)"}}
  }
  if($in -and (1559-$s) -ge 20){$res+="${s}-1559"}
  $b.Dispose(); return $res
}
function CountColor($path,$x0,$x1,$y0,$y1,$r,$g,$bl,$tol){
  $b=New-Object System.Drawing.Bitmap($path); $n=0
  if($y1 -gt 1599){$y1=1599}; if($y0 -lt 0){$y0=0}
  for($y=$y0;$y -lt $y1;$y++){ for($x=$x0;$x -lt $x1;$x++){ $c=$b.GetPixel($x,$y)
    if([Math]::Abs($c.R-$r) -le $tol -and [Math]::Abs($c.G-$g) -le $tol -and [Math]::Abs($c.B-$bl) -le $tol){$n++} } }
  $b.Dispose(); return $n
}
# scroll further up until ONLY 2 bands and identity checks pass (Routes=amber badge, QR=blue tiles)
for($t=0; $t -lt 10; $t++){
  Snap 'p3cur.png'
  $bands=GetBands "$dir\p3cur.png"
  if($bands.Count -eq 2){
    $p0=$bands[0].Split('-'); $p1=$bands[1].Split('-')
    $amb=CountColor "$dir\p3cur.png" 20 200 ([int]$p0[1]+4) ([int]$p0[1]+470) 0xF0 0xB4 0x29 14
    $blu=CountColor "$dir\p3cur.png" 20 700 ([int]$p1[1]+4) ([int]$p1[1]+420) 0x1E 0x88 0xE5 14
    Write-Host ("probe t={0}: bands={1} amberBelow0={2} blueBelow1={3}" -f $t,($bands -join ' '),$amb,$blu)
    if($amb -gt 200 -and $blu -gt 2000){ break }
  } else { Write-Host ("probe t={0}: bands={1}" -f $t,($bands -join ' ')) }
  adb shell input swipe 360 1100 360 500 300; Start-Sleep -Milliseconds 700
}
# ---- ROUTES: 5x toggle ----
$fail=0
for($i=1; $i -le 5; $i++){
  Snap 'p3cur.png'; $bands=GetBands "$dir\p3cur.png"; $p=$bands[0].Split('-'); $ymid=[int](($p[0]+$p[1])/2)
  adb shell input tap 360 $ymid; Start-Sleep -Milliseconds 700
  Snap 'p3cur.png'; $bands=GetBands "$dir\p3cur.png"; $p=$bands[0].Split('-')
  $amb=CountColor "$dir\p3cur.png" 20 200 ([int]$p[1]+4) ([int]$p[1]+470) 0xF0 0xB4 0x29 14
  $expect = if($i % 2 -eq 1){'COLLAPSED'}else{'EXPANDED'}
  $actual = if($amb -gt 200){'EXPANDED'}else{'COLLAPSED'}
  if($expect -ne $actual){$fail++}
  Write-Host ("ROUTES toggle {0}: expect {1} actual {2} (amberBadgePx={3}) -> {4}" -f $i,$expect,$actual,$amb,$(if($expect -eq $actual){'PASS'}else{'FAIL'}))
  if($i -eq 1){ Copy-Item "$dir\p3cur.png" "$dir\p3_routes_collapsed.png" }
}
Write-Host ("ROUTES RESULT: fail={0}/5" -f $fail)
# ---- QUICK REPORT: 5x toggle ----
$fail2=0
for($i=1; $i -le 5; $i++){
  Snap 'p3cur.png'; $bands=GetBands "$dir\p3cur.png"; $p=$bands[1].Split('-'); $ymid=[int](($p[0]+$p[1])/2)
  adb shell input tap 360 $ymid; Start-Sleep -Milliseconds 700
  Snap 'p3cur.png'; $bands=GetBands "$dir\p3cur.png"; $p=$bands[1].Split('-')
  $blu=CountColor "$dir\p3cur.png" 20 700 ([int]$p[1]+4) ([int]$p[1]+420) 0x1E 0x88 0xE5 14
  $expect = if($i % 2 -eq 1){'COLLAPSED'}else{'EXPANDED'}
  $actual = if($blu -gt 2000){'EXPANDED'}else{'COLLAPSED'}
  if($expect -ne $actual){$fail2++}
  Write-Host ("QUICKREP toggle {0}: expect {1} actual {2} (blueTilePx={3}) -> {4}" -f $i,$expect,$actual,$blu,$(if($expect -eq $actual){'PASS'}else{'FAIL'}))
}
Write-Host ("QUICKREP RESULT: fail={0}/5" -f $fail2)
# ---- (e) right-half tap on Routes ----
Snap 'p3cur.png'; $bands=GetBands "$dir\p3cur.png"; $p=$bands[0].Split('-'); $ymid=[int](($p[0]+$p[1])/2)
adb shell input tap 560 $ymid; Start-Sleep -Milliseconds 700
Snap 'p3cur.png'; $bands=GetBands "$dir\p3cur.png"; $p=$bands[0].Split('-')
$amb=CountColor "$dir\p3cur.png" 20 200 ([int]$p[1]+4) ([int]$p[1]+470) 0xF0 0xB4 0x29 14
Write-Host ("RIGHT-HALF tap: amberBadgePx={0} -> {1} (expect COLLAPSED)" -f $amb, $(if($amb -gt 200){'EXPANDED'}else{'COLLAPSED'}))
# restore Routes expanded
$bands=GetBands "$dir\p3cur.png"; $p=$bands[0].Split('-'); $ymid=[int](($p[0]+$p[1])/2)
adb shell input tap 360 $ymid; Start-Sleep -Milliseconds 700
Snap 'p3_final_routes_open.png'
Write-Host 'DONE'
