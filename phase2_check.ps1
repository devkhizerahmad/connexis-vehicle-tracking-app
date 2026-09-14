Add-Type -AssemblyName System.Drawing
[System.Reflection.Assembly]::LoadFrom(([System.Drawing.Bitmap].Assembly.Location)) | Out-Null
Add-Type -ReferencedAssemblies ([System.Drawing.Bitmap].Assembly.Location) -TypeDefinition @"
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;
public static class P2 {
  private static byte[] Raw(string path, out int w, out int h, out int st) {
    using (var bmp = new Bitmap(path)) {
      w = bmp.Width; h = bmp.Height;
      var data = bmp.LockBits(new Rectangle(0,0,w,h), ImageLockMode.ReadOnly, PixelFormat.Format32bppArgb);
      st = data.Stride; byte[] a = new byte[Math.Abs(st)*h];
      Marshal.Copy(data.Scan0, a, 0, a.Length); bmp.UnlockBits(data); return a;
    }
  }
  private static bool M(byte[] a,int st,int x,int y,int tr,int tg,int tb,int tol){ int i=y*st+x*4; return Math.Abs(a[i+2]-tr)<=tol&&Math.Abs(a[i+1]-tg)<=tol&&Math.Abs(a[i]-tb)<=tol; }
  private static void C(string h,out int r,out int g,out int b){ string x=h.TrimStart('#'); r=Convert.ToInt32(x.Substring(0,2),16); g=Convert.ToInt32(x.Substring(2,2),16); b=Convert.ToInt32(x.Substring(4,2),16); }
  public static string NavyBands(string path, int x, int y0, int y1) {
    byte[] a; int w,h,st; a=Raw(path,out w,out h,out st); int r,g,b; C("#1B2430",out r,out g,out b);
    string res=""; bool inB=false; int s=0;
    for(int y=y0;y<y1;y++){ bool m=M(a,st,x,y,r,g,b,10); if(m&&!inB){inB=true;s=y;} if(!m&&inB){inB=false;res+=s+"-"+(y-1)+" ";} }
    if(inB) res+=s+"-"+(y1-1); return res.Trim()==""?"none":res.Trim();
  }
  public static string ColorHex(string path, int x, int y) {
    byte[] a; int w,h,st; a=Raw(path,out w,out h,out st);
    int i=y*st+x*4; return "#"+a[i+2].ToString("X2")+a[i+1].ToString("X2")+a[i].ToString("X2");
  }
  public static string FirstX(string path,string hex,int tol,int y,int x0,int x1){ byte[] a;int w,h,st;a=Raw(path,out w,out h,out st);int r,g,b;C(hex,out r,out g,out b);for(int x=x0;x<x1;x++)if(M(a,st,x,y,r,g,b,tol))return x.ToString();return "NF"; }
}
"@
$px = 'D:\khizer_workspace\ConnexisTracker\details_phase2.png'
Write-Host 'navy bands at x=100 (uppermost are fuel/temp sensor headers):'
$bands = (Invoke-Expression "[P2]::NavyBands('$px', 100, 250, 1500)").Split(' ') | Where-Object { $_ }
Write-Host $bands
# Sens headers: those bands large enough and containing a white right-zone
$prev = -99
foreach ($b in $bands) {
  if ($b -notmatch '^(\d+)-(\d+)$') { continue }
  $y0 = [int]$Matches[1]; $y1 = [int]$Matches[2]
  if (($y1 - $y0) -lt 40) { continue }
  if ($y0 - 280 -lt 0) { continue }
  $mid = [int](($y0 + $y1) / 2)
  $rz = [P2]::FirstX($px, '#FFFFFF', 8, $mid, 430, 720)
  Write-Host "band y=$y0..$y1 h=$($y1-$y0+1) right-zone white starts x=$rz"
  if ($rz -ne 'NF' -and [int]$rz -gt 380) {
    $rzx = [int]$rz
    $c1 = [P2]::ColorHex($px, 697, $y0)
    $c2 = [P2]::ColorHex($px, 697, ($y0 + 3))
    $c3 = [P2]::ColorHex($px, 697, ($y0 + 10))
    $c4 = [P2]::ColorHex($px, 697, $y1)
    $c5 = [P2]::ColorHex($px, 697, ($y1 - 3))
    $c6 = [P2]::ColorHex($px, ($rzx - 1), $mid)
    $c7 = [P2]::ColorHex($px, ($rzx + 1), $mid)
    $c8 = [P2]::ColorHex($px, 60, $mid)
    Write-Host ("  topY0={0} c697={1}  topY0+3={2}  topY0+10={3}" -f $y0, $c1, $c2, $c3)
    Write-Host ("  botY1={0} c697={1}  botY1-3={2}" -f $y1, $c4, $c5)
    Write-Host ("  sep-left={0} sep-right={1}  farLeft={2}" -f $c6, $c7, $c8)
  }
}