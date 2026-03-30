+++
title = '$CADEN Index - Update'
date = 2026-03-29T00:00:00-08:00
draft = false
+++

Given my previous post corresponding to the $CADEN Index, I have given an update on the performance and updated the chart (because this is running on a static site). The market has not been friendly following the recent events down the block (Iran) and overall sentiment. However, we are still up this month (quite handsomely). I didn't update the index to include LNG (natural gas, not Li-Ning gaming the LoL team), and a few fertilizer companies, I may include them in the future, I just ran my script again for this small update.

<iframe src="/posts/2026-03-29/caden_index2.html" width="100%" height="650" frameborder="0" scrolling="no" style="background: #000; display: block;"></iframe>

**Holdings:**

| Name                            | Ticker    | Buy Date   | Gain    |
| ------------------------------- | --------- | ---------- | ------- |
| SamsungElec                     | 005930.KS | 2025-12-12 | +64.5%  |
| SK hynix                        | 000660.KS | 2025-12-12 | +60.4%  |
| Ciena Corporation               | CIEN      | 2025-12-12 | +83.8%  |
| KIOXIA HOLDINGS CORPORATION     | 285A.T    | 2025-12-15 | +120.5% |
| Nebius Group N.V.               | NBIS      | 2025-12-16 | +24.7%  |
| AXT Inc                         | AXTI      | 2025-12-30 | +282.9% |
| TEAM GROUP INC                  | 4967.TW   | 2026-01-02 | +18.1%  |
| NANYA TECHNOLOGY CORPORATION    | 2408.TW   | 2026-01-05 | +5.0%   |
| Sandisk Corporation             | SNDK      | 2026-01-06 | +76.1%  |
| Seagate Technology Holdings PLC | STX       | 2026-01-06 | +15.0%  |
| TEL AVIV STOCK EXC              | TASE.TA   | 2026-01-06 | +37.5%  |
| Micron Technology, Inc.         | MU        | 2026-01-06 | +4.0%   |
| Intel Corporation               | INTC      | 2026-01-07 | +1.2%   |
| KNOWLEDGE ATLAS                 | 2513.HK   | 2026-01-08 | +408.0% |
| MINIMAX-WP                      | 0100.HK   | 2026-01-08 | +321.3% |
| Sphere Entertainment Co.        | SPHR      | 2026-01-09 | +12.0%  |

<script>
(function(){
  var table = document.querySelector('article table');
  if (!table) return;
  var thead = table.querySelector('thead');
  var tbody = table.querySelector('tbody');
  if (!thead || !tbody) return;
  var ths = thead.querySelectorAll('th');
  var sortCol = -1, sortDir = 'asc';
  ths.forEach(function(th, i){
    th.style.cursor = 'pointer';
    th.style.userSelect = 'none';
    th.addEventListener('click', function(){
      if (sortCol === i) {
        sortDir = sortDir === 'asc' ? 'desc' : 'asc';
      } else {
        sortCol = i;
        sortDir = 'asc';
      }
      ths.forEach(function(h){ h.textContent = h.textContent.replace(/ [▲▼]$/, ''); });
      th.textContent += sortDir === 'asc' ? ' ▲' : ' ▼';
      var rows = Array.prototype.slice.call(tbody.querySelectorAll('tr'));
      rows.sort(function(a, b){
        var av = a.children[i].textContent.trim();
        var bv = b.children[i].textContent.trim();
        var an = parseFloat(av.replace(/[^0-9.\-]/g, ''));
        var bn = parseFloat(bv.replace(/[^0-9.\-]/g, ''));
        if (!isNaN(an) && !isNaN(bn)) {
          return sortDir === 'asc' ? an - bn : bn - an;
        }
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      });
      rows.forEach(function(r){ tbody.appendChild(r); });
    });
  });
})();
</script>
