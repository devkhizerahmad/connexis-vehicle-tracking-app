// PixelProbe.cs — fast native (GDI+) pixel scanner for design-reference reading.
// hist   -> whole-image exact-colour histogram (flat UI palette recovery)
// cols   -> vertical colour bands down one column (vertical rhythm)
// rows   -> horizontal colour bands across one row (left/right edges)
// region -> modal colours inside a rectangle
// box    -> bounding box of a target colour
// runsx  -> horizontal runs of a target colour (extents of pills/bars)
// runsy  -> vertical runs of a target colour
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;
using System.Text;

public static class PixelProbe
{
    private static int W, H;
    private static int[] Px;

    public static void Load(string path)
    {
        using (var src = new Bitmap(path))
        using (var bmp = new Bitmap(src.Width, src.Height, PixelFormat.Format32bppArgb))
        {
            using (var g = Graphics.FromImage(bmp)) { g.DrawImageUnscaled(src, 0, 0); }
            W = bmp.Width; H = bmp.Height;
            Px = new int[W * H];
            var data = bmp.LockBits(new Rectangle(0, 0, W, H), ImageLockMode.ReadOnly, PixelFormat.Format32bppArgb);
            try
            {
                for (int y = 0; y < H; y++)
                    Marshal.Copy(IntPtr.Add(data.Scan0, y * data.Stride), Px, y * W, W);
            }
            finally { bmp.UnlockBits(data); }
        }
    }

    public static int Width { get { return W; } }
    public static int Height { get { return H; } }

    private static int At(int x, int y) { return Px[y * W + x] & 0xFFFFFF; }
    private static string Hex(int c) { return "#" + (c & 0xFFFFFF).ToString("X6"); }
    private static int Dist(int a, int b)
    {
        return Math.Abs(((a >> 16) & 255) - ((b >> 16) & 255))
             + Math.Abs(((a >> 8) & 255) - ((b >> 8) & 255))
             + Math.Abs((a & 255) - (b & 255));
    }
    private static int Parse(string hex) { return Convert.ToInt32(hex.TrimStart('#'), 16); }

    private static List<KeyValuePair<int, int>> Top(Dictionary<int, int> map, int top)
    {
        var list = new List<KeyValuePair<int, int>>(map);
        list.Sort(delegate (KeyValuePair<int, int> a, KeyValuePair<int, int> b) { return b.Value.CompareTo(a.Value); });
        if (list.Count > top) list.RemoveRange(top, list.Count - top);
        return list;
    }

    public static string Histogram(int top)
    {
        var map = new Dictionary<int, int>();
        for (int i = 0; i < Px.Length; i++)
        {
            int c = Px[i] & 0xFFFFFF;
            int n; map.TryGetValue(c, out n); map[c] = n + 1;
        }
        var sb = new StringBuilder();
        foreach (var kv in Top(map, top))
            sb.AppendLine(string.Format("{0}  count={1,8}  {2,7:F3}%", Hex(kv.Key), kv.Value, 100.0 * kv.Value / (W * H)));
        return sb.ToString();
    }

    public static string RegionMode(int x0, int y0, int w, int h, int top)
    {
        var map = new Dictionary<int, int>();
        int total = 0;
        for (int y = Math.Max(0, y0); y < Math.Min(y0 + h, H); y++)
            for (int x = Math.Max(0, x0); x < Math.Min(x0 + w, W); x++)
            {
                int c = At(x, y);
                int n; map.TryGetValue(c, out n); map[c] = n + 1; total++;
            }
        var sb = new StringBuilder();
        sb.AppendLine(string.Format("region x={0} y={1} w={2} h={3} (px={4})", x0, y0, w, h, total));
        foreach (var kv in Top(map, top))
            sb.AppendLine(string.Format("   {0}  count={1,7}  {2,7:F2}%", Hex(kv.Key), kv.Value, 100.0 * kv.Value / Math.Max(1, total)));
        return sb.ToString();
    }

    public static string ColBands(int x, int minRun, int tol)
    {
        var sb = new StringBuilder();
        int start = 0; int cur = At(x, 0);
        for (int y = 1; y <= H; y++)
        {
            int c = (y < H) ? At(x, y) : -999999;
            bool same = (y < H) && Dist(c, cur) <= tol;
            if (!same)
            {
                if (y - start >= minRun) sb.AppendLine(string.Format("y={0,4}..{1,4} h={2,4}  {3}", start, y - 1, y - start, Hex(cur)));
                start = y; cur = c;
            }
        }
        return sb.ToString();
    }

    public static string RowBands(int y, int minRun, int tol)
    {
        var sb = new StringBuilder();
        int start = 0; int cur = At(0, y);
        for (int x = 1; x <= W; x++)
        {
            int c = (x < W) ? At(x, y) : -999999;
            bool same = (x < W) && Dist(c, cur) <= tol;
            if (!same)
            {
                if (x - start >= minRun) sb.AppendLine(string.Format("x={0,4}..{1,4} w={2,4}  {3}", start, x - 1, x - start, Hex(cur)));
                start = x; cur = c;
            }
        }
        return sb.ToString();
    }

    public static string Boxes(string targets, int tol, int minCount)
    {
        var sb = new StringBuilder();
        foreach (string raw in targets.Split(','))
        {
            string t = raw.Trim();
            if (t.Length == 0) continue;
            int tc = Parse(t);
            int minX = int.MaxValue, maxX = -1, minY = int.MaxValue, maxY = -1, count = 0;
            for (int y = 0; y < H; y++)
                for (int x = 0; x < W; x++)
                    if (Dist(At(x, y), tc) <= tol)
                    {
                        count++;
                        if (x < minX) minX = x;
                        if (x > maxX) maxX = x;
                        if (y < minY) minY = y;
                        if (y > maxY) maxY = y;
                    }
            if (count >= minCount)
                sb.AppendLine(string.Format("{0}: x={1}..{2} (w={3})  y={4}..{5} (h={6})  px={7}", t, minX, maxX, maxX - minX + 1, minY, maxY, maxY - minY + 1, count));
            else
                sb.AppendLine(string.Format("{0}: NOT FOUND (px={1})", t, count));
        }
        return sb.ToString();
    }

    private class Bucket
    {
        public long Count;
        public long R, G, B;
        public Dictionary<int, int> Exact = new Dictionary<int, int>();
    }

    // Quantized histogram (JPEG noise makes exact-colour histograms useless):
    // buckets colours by (channel >> q) and reports the bucket's average colour,
    // its share, and the most frequent exact colours inside the bucket.
    public static string RegionQuant(int x0, int y0, int w, int h, int q, int top)
    {
        var map = new Dictionary<int, Bucket>();
        long total = 0;
        for (int y = Math.Max(0, y0); y < Math.Min(y0 + h, H); y++)
            for (int x = Math.Max(0, x0); x < Math.Min(x0 + w, W); x++)
            {
                int c = At(x, y);
                int r = (c >> 16) & 255, g = (c >> 8) & 255, b = c & 255;
                int key = ((r >> q) << 12) | ((g >> q) << 6) | (b >> q);
                Bucket bk;
                if (!map.TryGetValue(key, out bk)) { bk = new Bucket(); map[key] = bk; }
                bk.Count++; bk.R += r; bk.G += g; bk.B += b; total++;
                int n; bk.Exact.TryGetValue(c, out n); bk.Exact[c] = n + 1;
            }
        var list = new List<KeyValuePair<int, Bucket>>(map);
        list.Sort(delegate (KeyValuePair<int, Bucket> a, KeyValuePair<int, Bucket> b) { return b.Value.Count.CompareTo(a.Value.Count); });
        var sb = new StringBuilder();
        sb.AppendLine(string.Format("quant region x={0} y={1} w={2} h={3} q={4} (px={5})", x0, y0, w, h, q, total));
        for (int i = 0; i < Math.Min(top, list.Count); i++)
        {
            Bucket bk = list[i].Value;
            string avg = Hex((int)(bk.R / bk.Count) << 16 | (int)(bk.G / bk.Count) << 8 | (int)(bk.B / bk.Count));
            var ex = new List<KeyValuePair<int, int>>(bk.Exact);
            ex.Sort(delegate (KeyValuePair<int, int> a, KeyValuePair<int, int> b) { return b.Value.CompareTo(a.Value); });
            var esb = new StringBuilder();
            for (int j = 0; j < Math.Min(3, ex.Count); j++) esb.Append(Hex(ex[j].Key) + "(" + ex[j].Value + ") ");
            sb.AppendLine(string.Format("   avg={0}  {1,7:F2}%  px={2,8}   top: {3}", avg, 100.0 * bk.Count / Math.Max(1, total), bk.Count, esb.ToString().Trim()));
        }
        return sb.ToString();
    }

    // Vertical section map: for each row, the modal colour of x0..x1 (quantized);
    // consecutive rows with the same modal colour collapse into one band. This is the
    // reliable way to read a reference's vertical rhythm without eyeballing y values.
    public static string RowMap(int x0, int x1, int minRun, int q)
    {
        var sb = new StringBuilder();
        int prevKey = int.MinValue, start = 0, bandShare = 0;
        long bR = 0, bG = 0, bB = 0, bN = 0;
        for (int y = 0; y <= H; y++)
        {
            int key = int.MinValue, share = 0;
            long r = 0, g = 0, b = 0, n = 0;
            if (y < H)
            {
                var map = new Dictionary<int, long[]>();
                int width = Math.Min(x1, W) - Math.Max(0, x0);
                for (int x = Math.Max(0, x0); x < Math.Min(x1, W); x++)
                {
                    int c = At(x, y);
                    int k = ((((c >> 16) & 255) >> q) << 12) | ((((c >> 8) & 255) >> q) << 6) | ((c & 255) >> q);
                    long[] v;
                    if (!map.TryGetValue(k, out v)) { v = new long[4]; map[k] = v; }
                    v[0]++; v[1] += (c >> 16) & 255; v[2] += (c >> 8) & 255; v[3] += c & 255;
                }
                long best = -1;
                foreach (var kv in map)
                    if (kv.Value[0] > best)
                    {
                        best = kv.Value[0]; key = kv.Key;
                        r = kv.Value[1]; g = kv.Value[2]; b = kv.Value[3];
                        share = (int)(100 * kv.Value[0] / Math.Max(1, width)); n = kv.Value[0];
                    }
            }
            bool same = (y < H) && key == prevKey;
            if (!same)
            {
                if (y - start >= minRun && prevKey != int.MinValue)
                {
                    string avg = Hex((int)(bR / Math.Max(1, bN)) << 16 | (int)(bG / Math.Max(1, bN)) << 8 | (int)(bB / Math.Max(1, bN)));
                    sb.AppendLine(string.Format("y={0,4}..{1,4} h={2,4}  avg={3}  rowShare~{4}%", start, y - 1, y - start, avg, bandShare));
                }
                start = y; prevKey = key; bR = r; bG = g; bB = b; bN = n; bandShare = share;
            }
        }
        return sb.ToString();
    }

    private static string Runs(string targets, int tol, int minRun, bool horizontal)
    {
        var sb = new StringBuilder();
        foreach (string raw in targets.Split(','))
        {
            string t = raw.Trim();
            if (t.Length == 0) continue;
            int tc = Parse(t);
            sb.AppendLine("-- runs" + (horizontal ? "X " : "Y ") + t);
            int outer = horizontal ? H : W;
            int inner = horizontal ? W : H;
            int pStart = 0, pEnd = 0, pOut0 = -1, pOut1 = -1;
            var groups = new List<int[]>();
            for (int o = 0; o < outer; o++)
            {
                int s = int.MaxValue, e = -1, runStart = -1;
                for (int i = 0; i < inner; i++)
                {
                    bool hit = Dist(At(horizontal ? i : o, horizontal ? o : i), tc) <= tol;
                    if (hit && runStart < 0) runStart = i;
                    if ((!hit || i == inner - 1) && runStart >= 0)
                    {
                        int end = hit ? i : i - 1;
                        if (end - runStart + 1 >= minRun)
                        {
                            if (runStart < s) s = runStart;
                            if (end > e) e = end;
                        }
                        runStart = -1;
                    }
                }
                if (e < 0)
                {
                    if (pOut0 >= 0) { groups.Add(new int[] { pOut0, pOut1, pStart, pEnd }); pOut0 = -1; }
                    continue;
                }
                if (pOut0 >= 0 && Math.Abs(s - pStart) <= 2 && Math.Abs(e - pEnd) <= 2) { pOut1 = o; }
                else
                {
                    if (pOut0 >= 0) groups.Add(new int[] { pOut0, pOut1, pStart, pEnd });
                    pStart = s; pEnd = e; pOut0 = o; pOut1 = o;
                }
            }
            if (pOut0 >= 0) groups.Add(new int[] { pOut0, pOut1, pStart, pEnd });
            foreach (int[] g in groups)
            {
                if (horizontal)
                    sb.AppendLine(string.Format("   y={0,4}..{1,4} (h={2,3})  x={3,4}..{4,4} (w={5,3})", g[0], g[1], g[1] - g[0] + 1, g[2], g[3], g[3] - g[2] + 1));
                else
                    sb.AppendLine(string.Format("   x={0,4}..{1,4} (w={2,3})  y={3,4}..{4,4} (h={5,3})", g[0], g[1], g[1] - g[0] + 1, g[2], g[3], g[3] - g[2] + 1));
            }
        }
        return sb.ToString();
    }

    public static string RunsX(string targets, int tol, int minRun) { return Runs(targets, tol, minRun, true); }
    public static string RunsY(string targets, int tol, int minRun) { return Runs(targets, tol, minRun, false); }
}
