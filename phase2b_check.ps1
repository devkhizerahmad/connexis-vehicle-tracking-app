Add-Type -AssemblyName System.Drawing
[System.Reflection.Assembly]::LoadFrom(([System.Drawing.Bitmap].Assembly.Location)) | Out-Null
Add-Type -ReferencedAssemblies ([System.Drawing.Bitmap].Assembly.Location) -TypeDefinition @"
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;
public static class P2B {
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
  public static string ColorHex(string path, int x, int y) {
    byte[] a; int w,h,st; a=Raw(path,out w,out h,out st); int i=y*st+x*4; return "#"+a[i+2].ToString("X2")+a[i+1].ToString("X2")+a[i].ToString("X2");
  }
  public static string FirstX(string path,string hex,int tol,int y,int x0,int x1){ byte[] a;int w,h,st;a=Raw(path,out w,out h,out st);int r,g,b;C(hex,out r,out g,out b);for(int x=x0;x<x1;x++)if(M(a,st,x,y,r,g,b,tol))return x.ToString();return "NF"; }
  public static string Row(string path,int y,int x0,int x1,string hex,int tol){ byte[] a;int w,h,st;a=Raw(path,out w,out h,out st);int r,g,b;C(hex,out r,out g,out b);string res="";for(int x=x0;x<x1;x++)if(M(a,st,x,y,r,g,b,tol))res+=x+" ";return res.Trim()==""?"none":res.Trim(); }
}
"@
function CheckHeader($px, $y0, $y1, $label) {
  Add-Type -AssemblyName System.Drawing
  $mid = [int](($y0 + $y1) / 2)
  $rzx = [int]([P2B]::FirstX($px, '#FFFFFF', 8, $mid, 430, 720))
  $topEdge = [P2B]::ColorHex($px, 697, $y0)
  $top3 = [P2B]::ColorHex($px, 697, ($y0 + 4))
  $topMid = [P2B]::ColorHex($px, 500, ($y0 + 6))
  $botEdge = [P2B]::ColorHex($px, 697, $y1)
  $bot3 = [P2B]::ColorHex($px, 697, ($y1 - 2))
  $sep = [P2B]::ColorHex($px, ($rzx - 1), $mid)
  $whiteR = [P2B]::ColorHex($px, ($rzx + 2), $mid)
  $navyL = [P2B]::ColorHex($px, 60, $mid)
  Write-Host ("--- {0} header y={1}..{2} h={3}" -f $label, $y0, $y1, ($y1 - $y0 + 1))
  Write-Host ("    right-zone white starts x={0} (expect ~496)" -f $rzx)
  Write-Host ("    top corner: 697,{0}={1} ; 697,{2}={3} ; 500,{4}={5}  (radius: first rows navy/bg, then white)" -f $y0, $topEdge, ($y0+4), $top3, ($y0+6), $topMid)
  Write-Host ("    bottom edge: 697,{0}={1} ; 697,{2}={3}  (expect #FFFFFF square)" -f $y1, $botEdge, ($y1-2), $bot3)
  Write-Host ("    separator: x{0}={1} (expect #3A4450) ; x{2}={3} (expect #FFFFFF)" -f ($rzx-1), $sep, ($rzx+2), $whiteR)
  Write-Host ("    left zone: x60={0} (expect #1B2430)" -f $navyL)
}
$px = 'D:\khizer_workspace\ConnexisTracker\details_phase2.png'
CheckHeader $px 840 916 'FUEL'
CheckHeader $px 1270 1346 'TEMP'