+++
title = '$CADEN Index'
date = 2026-02-27T00:00:00-08:00
draft = false
+++

The $CADEN Index is an equal-weight composite of a few companies.
We start with a base value of 1000. Each position tracks its percentage gain/loss from my buy date, and the index is the average of all active positions.

The interactive chart below shows the index performance with candlestick/area views and multiple timeframes (1D, 1W, 1M, YTD, 1Y).

<iframe src="/caden_index/caden_index.html" width="100%" height="650" frameborder="0" scrolling="no" style="background: #000; display: block;"></iframe>

**Holdings:**

| Name                            | Ticker    | Buy Date   | Gain    |
| ------------------------------- | --------- | ---------- | ------- |
| SamsungElec                     | 005930.KS | 2025-12-12 | +100.9% |
| SK hynix                        | 000660.KS | 2025-12-12 | +88.8%  |
| Ciena Corporation               | CIEN      | 2025-12-12 | +59.4%  |
| KIOXIA HOLDINGS CORPORATION     | 285A.T    | 2025-12-15 | +128.9% |
| Nebius Group N.V.               | NBIS      | 2025-12-16 | +12.7%  |
| AXT Inc                         | AXTI      | 2025-12-30 | +139.7% |
| TEAM GROUP INC                  | 4967.TW   | 2026-01-02 | +5.7%   |
| NANYA TECHNOLOGY CORPORATION    | 2408.TW   | 2026-01-05 | +37.5%  |
| Sandisk Corporation             | SNDK      | 2026-01-06 | +81.7%  |
| Seagate Technology Holdings PLC | STX       | 2026-01-06 | +24.0%  |
| TEL AVIV STOCK EXC              | TASE.TA   | 2026-01-06 | +42.0%  |
| Micron Technology, Inc.         | MU        | 2026-01-06 | +20.0%  |
| Intel Corporation               | INTC      | 2026-01-07 | +7.0%   |
| KNOWLEDGE ATLAS                 | 2513.HK   | 2026-01-08 | +337.3% |
| MINIMAX-WP                      | 0100.HK   | 2026-01-08 | +224.9% |
| Sphere Entertainment Co.        | SPHR      | 2026-01-09 | +24.8%  |

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
