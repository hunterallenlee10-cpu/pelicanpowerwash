/**
 * Fallback "tap to price" house: a flat isometric illustration drawn in SVG,
 * used until h1-house-iso is generated. Every cleanable area carries a grime
 * overlay (`.hs-dirt[data-area]`); the price builder washes an area by adding
 * its id to `data-sel` on a wrapper (see globals.css).
 *
 * Geometry was generated from a simple 3D model with an isometric projection;
 * pin positions for it live in data/hotspots.ts (`fallback`).
 */
export function HouseSvg() {
  return (
    <svg viewBox="0 0 800 600" className="block h-auto w-full" aria-hidden focusable="false">
      <defs>
<pattern id="hs-grime-blot" width="96" height="72" patternUnits="userSpaceOnUse" patternTransform="rotate(24)">
<rect width="96" height="72" fill="#3f4a26" fillOpacity="0.34"/>
<ellipse cx="18" cy="16" rx="16" ry="6" fill="#2c351a" fillOpacity="0.32"/>
<ellipse cx="62" cy="40" rx="22" ry="7" fill="#2a3318" fillOpacity="0.3"/>
<ellipse cx="80" cy="12" rx="7" ry="3" fill="#6b5530" fillOpacity="0.35"/>
<ellipse cx="30" cy="56" rx="10" ry="4" fill="#5a4a2c" fillOpacity="0.32"/>
<ellipse cx="50" cy="20" rx="4" ry="2" fill="#20280f" fillOpacity="0.4"/>
<ellipse cx="88" cy="62" rx="5" ry="2.5" fill="#20280f" fillOpacity="0.35"/>
</pattern>
<pattern id="hs-grime-streak" width="22" height="48" patternUnits="userSpaceOnUse">
<rect width="22" height="48" fill="#1a1f16" fillOpacity="0.22"/>
<rect x="3" width="3" height="48" fill="#0d110b" fillOpacity="0.5"/>
<rect x="12" y="10" width="2" height="38" fill="#0d110b" fillOpacity="0.38"/>
<rect x="17" y="24" width="1.5" height="24" fill="#2b3a1c" fillOpacity="0.5"/>
</pattern>
</defs>
      <rect x="423.0" y="97.1" width="5" height="82.3" fill="#5b4a3a"/>
<ellipse cx="425.5" cy="97.1" rx="40.6" ry="35.3" fill="#3f6248"/>
<ellipse cx="414.9" cy="86.5" rx="21.2" ry="17.6" fill="#4f7558"/>
<rect x="545.2" y="120.6" width="5" height="94.1" fill="#5b4a3a"/>
<ellipse cx="547.7" cy="120.6" rx="47.3" ry="41.2" fill="#3f6248"/>
<ellipse cx="535.3" cy="108.2" rx="24.7" ry="20.6" fill="#4f7558"/>
<rect x="596.1" y="179.4" width="5" height="76.5" fill="#5b4a3a"/>
<ellipse cx="598.6" cy="179.4" rx="37.2" ry="32.3" fill="#3f6248"/>
<ellipse cx="588.9" cy="169.7" rx="19.4" ry="16.2" fill="#4f7558"/>
<polygon points="384.7,97.1 782.0,326.5 425.5,532.3 28.2,302.9" fill="#5f7f5a"/>
<polygon points="48.6,291.2 445.8,520.5 415.3,538.2 18.0,308.8" fill="#3a4552"/>
<polygon points="61.3,283.8 458.6,513.2 445.8,520.5 48.6,291.2" fill="#c9d2db"/>
<polygon points="277.8,235.3 338.9,270.6 188.6,357.3 127.5,322.1" fill="#cfd6dc"/>
<polygon points="277.8,235.3 338.9,270.6 188.6,357.3 127.5,322.1" className="hs-dirt" data-area="driveway" fill="url(#hs-grime-blot)"/>
<polygon points="377.1,322.1 402.5,336.8 277.8,408.8 252.3,394.1" fill="#cfd6dc"/>
<polygon points="377.1,322.1 402.5,336.8 277.8,408.8 252.3,394.1" className="hs-dirt" data-area="walkway" fill="url(#hs-grime-blot)"/>
<polygon points="634.3,276.5 695.4,311.8 639.4,344.1 578.3,308.8" fill="#c8b79a"/>
<polygon points="634.3,276.5 695.4,311.8 639.4,344.1 578.3,308.8" className="hs-dirt" data-area="patio" fill="url(#hs-grime-blot)"/>
<polygon points="518.2,327.1 542.6,341.2 507.0,361.8 482.5,347.6" fill="#6f7b86"/>
<polygon points="518.2,327.1 542.6,341.2 507.0,361.8 482.5,347.6" className="hs-dirt" data-area="basement" fill="url(#hs-grime-blot)"/>
<polygon points="518.2,327.1 542.6,341.2 540.1,342.6 515.6,328.5" fill="#9aa5ae"/>
<polygon points="511.0,331.2 535.5,345.3 532.9,346.8 508.5,332.6" fill="#9aa5ae"/>
<polygon points="503.9,335.3 528.4,349.4 525.8,350.9 501.4,336.8" fill="#9aa5ae"/>
<polygon points="496.8,339.4 521.2,353.5 518.7,355.0 494.2,340.9" fill="#9aa5ae"/>
<polygon points="489.6,343.5 514.1,357.6 511.5,359.1 487.1,345.0" fill="#9aa5ae"/>
<polygon points="529.9,330.9 585.9,363.2 585.9,350.3 529.9,317.9" fill="#94694a"/>
<polygon points="529.9,330.9 585.9,363.2 585.9,350.3 529.9,317.9" className="hs-dirt" data-area="deck" fill="url(#hs-grime-blot)"/>
<polygon points="621.6,342.6 585.9,363.2 585.9,350.3 621.6,329.7" fill="#94694a"/>
<polygon points="621.6,342.6 585.9,363.2 585.9,350.3 621.6,329.7" className="hs-dirt" data-area="deck" fill="url(#hs-grime-blot)"/>
<polygon points="565.5,297.4 621.6,329.7 585.9,350.3 529.9,317.9" fill="#b0805a"/>
<polygon points="565.5,297.4 621.6,329.7 585.9,350.3 529.9,317.9" className="hs-dirt" data-area="deck" fill="url(#hs-grime-blot)"/>
<polygon points="570.6,300.2 571.0,300.5 535.4,321.1 535.0,320.8" fill="#94694a"/>
<polygon points="575.7,303.2 576.1,303.4 540.5,324.0 540.1,323.8" fill="#94694a"/>
<polygon points="580.8,306.1 581.2,306.4 545.6,326.9 545.2,326.7" fill="#94694a"/>
<polygon points="585.9,309.1 586.3,309.3 550.7,329.9 550.3,329.6" fill="#94694a"/>
<polygon points="591.0,312.0 591.4,312.2 555.8,332.8 555.3,332.6" fill="#94694a"/>
<polygon points="596.1,314.9 596.5,315.2 560.8,335.8 560.4,335.5" fill="#94694a"/>
<polygon points="601.2,317.9 601.6,318.1 565.9,338.7 565.5,338.5" fill="#94694a"/>
<polygon points="606.3,320.8 606.7,321.1 571.0,341.6 570.6,341.4" fill="#94694a"/>
<polygon points="611.4,323.8 611.8,324.0 576.1,344.6 575.7,344.3" fill="#94694a"/>
<polygon points="616.5,326.7 616.9,326.9 581.2,347.5 580.8,347.3" fill="#94694a"/>
<polygon points="639.4,261.8 736.2,317.6 736.2,285.3 639.4,229.4" fill="#f3f5f7"/>
<polygon points="639.4,261.8 736.2,317.6 736.2,285.3 639.4,229.4" className="hs-dirt" data-area="fence" fill="url(#hs-grime-blot)"/>
<polygon points="638.6,261.3 640.2,262.2 640.2,226.9 638.6,226.0" fill="#d6dde3"/>
<polygon points="662.8,275.3 664.3,276.2 664.3,240.9 662.8,240.0" fill="#d6dde3"/>
<polygon points="687.0,289.3 688.5,290.1 688.5,254.9 687.0,254.0" fill="#d6dde3"/>
<polygon points="711.2,303.2 712.7,304.1 712.7,268.8 711.2,267.9" fill="#d6dde3"/>
<polygon points="735.4,317.2 736.9,318.1 736.9,282.8 735.4,281.9" fill="#d6dde3"/>
<polygon points="736.2,317.6 547.7,426.4 547.7,394.1 736.2,285.3" fill="#f3f5f7"/>
<polygon points="736.2,317.6 547.7,426.4 547.7,394.1 736.2,285.3" className="hs-dirt" data-area="fence" fill="url(#hs-grime-blot)"/>
<polygon points="736.9,317.2 735.4,318.1 735.4,282.8 736.9,281.9" fill="#d6dde3"/>
<polygon points="716.0,329.3 714.5,330.2 714.5,294.9 716.0,294.0" fill="#d6dde3"/>
<polygon points="695.0,341.4 693.5,342.3 693.5,307.0 695.0,306.1" fill="#d6dde3"/>
<polygon points="674.1,353.5 672.6,354.4 672.6,319.1 674.1,318.2" fill="#d6dde3"/>
<polygon points="653.2,365.6 651.6,366.4 651.6,331.2 653.2,330.3" fill="#d6dde3"/>
<polygon points="632.2,377.6 630.7,378.5 630.7,343.2 632.2,342.4" fill="#d6dde3"/>
<polygon points="611.3,389.7 609.8,390.6 609.8,355.3 611.3,354.5" fill="#d6dde3"/>
<polygon points="590.3,401.8 588.8,402.7 588.8,367.4 590.3,366.5" fill="#d6dde3"/>
<polygon points="569.4,413.9 567.9,414.8 567.9,379.5 569.4,378.6" fill="#d6dde3"/>
<polygon points="548.5,426.0 546.9,426.9 546.9,391.6 548.5,390.7" fill="#d6dde3"/>
<polygon points="272.7,232.4 344.0,273.5 344.0,214.7 272.7,173.6" fill="#cfd7de"/>
<polygon points="272.7,232.4 344.0,273.5 344.0,214.7 272.7,173.6" className="hs-dirt" data-area="siding" fill="url(#hs-grime-blot)"/>
<polygon points="415.3,232.4 344.0,273.5 344.0,214.7 415.3,173.6" fill="#b9c3cc"/>
<polygon points="415.3,232.4 344.0,273.5 344.0,214.7 415.3,173.6" className="hs-dirt" data-area="siding" fill="url(#hs-grime-blot)"/>
<polygon points="280.3,236.8 304.7,250.9 304.7,209.8 280.3,195.6" fill="#f2f4f6"/>
<polygon points="280.2,226.5 304.7,240.7 304.7,240.0 280.2,225.8" fill="#d9dee3"/>
<polygon points="280.2,216.3 304.7,230.4 304.7,229.7 280.2,215.5" fill="#d9dee3"/>
<polygon points="280.2,206.0 304.7,220.1 304.7,219.4 280.2,205.3" fill="#d9dee3"/>
<polygon points="311.8,255.0 336.3,269.2 336.3,228.0 311.8,213.9" fill="#f2f4f6"/>
<polygon points="311.8,244.8 336.2,258.9 336.2,258.2 311.8,244.1" fill="#d9dee3"/>
<polygon points="311.8,234.5 336.2,248.6 336.2,247.9 311.8,233.8" fill="#d9dee3"/>
<polygon points="311.8,224.2 336.2,238.3 336.2,237.6 311.8,223.5" fill="#d9dee3"/>
<polygon points="265.5,176.5 343.0,221.2 382.7,166.5 305.3,121.8" fill="#3d4652"/>
<polygon points="265.5,176.5 343.0,221.2 382.7,166.5 305.3,121.8" className="hs-dirt" data-area="roof" fill="url(#hs-grime-streak)"/>
<polygon points="343.0,221.2 382.7,166.5 422.4,175.3" fill="#2e3640"/>
<polygon points="343.0,221.2 382.7,166.5 422.4,175.3" className="hs-dirt" data-area="roof" fill="url(#hs-grime-streak)"/>
<polygon points="344.0,273.5 476.4,350.0 476.4,250.0 344.0,173.6" fill="#cfd7de"/>
<polygon points="344.0,273.5 476.4,350.0 476.4,250.0 344.0,173.6" className="hs-dirt" data-area="siding" fill="url(#hs-grime-blot)"/>
<polygon points="568.1,297.1 476.4,350.0 476.4,250.0 568.1,197.1" fill="#b9c3cc"/>
<polygon points="568.1,297.1 476.4,350.0 476.4,250.0 568.1,197.1" className="hs-dirt" data-area="siding" fill="url(#hs-grime-blot)"/>
<polygon points="359.2,263.6 374.5,272.4 374.5,248.9 359.2,240.0" fill="#7e9db3"/>
<polygon points="354.6,260.9 358.1,263.0 358.1,239.5 354.6,237.4" fill="#1f2a36"/>
<polygon points="375.5,273.0 379.0,275.1 379.0,251.5 375.5,249.5" fill="#1f2a36"/>
<polygon points="359.2,218.9 374.5,227.7 374.5,204.2 359.2,195.3" fill="#7e9db3"/>
<polygon points="354.6,216.3 358.1,218.3 358.1,194.8 354.6,192.7" fill="#1f2a36"/>
<polygon points="375.5,228.3 379.0,230.4 379.0,206.8 375.5,204.8" fill="#1f2a36"/>
<polygon points="389.8,281.2 405.0,290.0 405.0,266.5 389.8,257.7" fill="#7e9db3"/>
<polygon points="385.1,278.6 388.7,280.7 388.7,257.1 385.1,255.1" fill="#1f2a36"/>
<polygon points="406.0,290.6 409.6,292.7 409.6,269.2 406.0,267.1" fill="#1f2a36"/>
<polygon points="389.8,236.5 405.0,245.3 405.0,221.8 389.8,213.0" fill="#7e9db3"/>
<polygon points="385.1,233.9 388.7,236.0 388.7,212.4 385.1,210.4" fill="#1f2a36"/>
<polygon points="406.0,246.0 409.6,248.0 409.6,224.5 406.0,222.4" fill="#1f2a36"/>
<polygon points="443.2,312.1 458.5,320.9 458.5,297.4 443.2,288.6" fill="#7e9db3"/>
<polygon points="438.6,309.5 442.2,311.5 442.2,288.0 438.6,285.9" fill="#1f2a36"/>
<polygon points="459.5,321.5 463.1,323.6 463.1,300.1 459.5,298.0" fill="#1f2a36"/>
<polygon points="443.2,267.4 458.5,276.2 458.5,252.7 443.2,243.9" fill="#7e9db3"/>
<polygon points="438.6,264.8 442.2,266.8 442.2,243.3 438.6,241.2" fill="#1f2a36"/>
<polygon points="459.5,276.8 463.1,278.9 463.1,255.4 459.5,253.3" fill="#1f2a36"/>
<polygon points="410.1,308.3 422.4,315.3 422.4,276.5 410.1,269.4" fill="#26384d"/>
<polygon points="552.9,287.1 537.6,295.9 537.6,272.4 552.9,263.6" fill="#6c8aa0"/>
<polygon points="552.9,242.4 537.6,251.2 537.6,227.7 552.9,218.9" fill="#6c8aa0"/>
<polygon points="507.0,313.6 491.7,322.4 491.7,298.9 507.0,290.0" fill="#6c8aa0"/>
<polygon points="507.0,268.9 491.7,277.7 491.7,254.2 507.0,245.3" fill="#6c8aa0"/>
<polygon points="334.8,177.1 475.4,258.2 526.3,178.8 385.7,97.7" fill="#3d4652"/>
<polygon points="334.8,177.1 475.4,258.2 526.3,178.8 385.7,97.7" className="hs-dirt" data-area="roof" fill="url(#hs-grime-streak)"/>
<polygon points="475.4,258.2 526.3,178.8 577.2,199.4" fill="#2e3640"/>
<polygon points="475.4,258.2 526.3,178.8 577.2,199.4" className="hs-dirt" data-area="roof" fill="url(#hs-grime-streak)"/>
<polygon points="334.6,179.0 475.1,260.2 475.1,257.2 334.6,176.1" fill="#ffffff"/>
<polygon points="321.1,292.6 448.4,366.2 448.4,357.9 321.1,284.4" fill="#cfd5db"/>
<polygon points="476.4,350.0 448.4,366.2 448.4,357.9 476.4,341.8" fill="#c3cad1"/>
<polygon points="349.1,268.2 476.4,341.8 448.4,357.9 321.1,284.4" fill="#e4e8ec"/>
<polygon points="366.9,327.9 392.4,342.6 392.4,338.5 366.9,323.8" fill="#cfd5db"/>
<polygon points="400.0,338.2 392.4,342.6 392.4,338.5 400.0,334.1" fill="#c3cad1"/>
<polygon points="374.5,319.4 400.0,334.1 392.4,338.5 366.9,323.8" fill="#e4e8ec"/>
<polygon points="323.6,285.3 326.7,287.1 326.7,239.4 323.6,237.7" fill="#ffffff"/>
<polygon points="329.7,285.3 326.7,287.1 326.7,239.4 329.7,237.7" fill="#e6eaee"/>
<polygon points="326.7,235.9 329.7,237.7 326.7,239.4 323.6,237.7" fill="#ffffff"/>
<polygon points="354.7,303.2 357.7,305.0 357.7,257.4 354.7,255.6" fill="#ffffff"/>
<polygon points="360.8,303.2 357.7,305.0 357.7,257.4 360.8,255.6" fill="#e6eaee"/>
<polygon points="357.7,253.8 360.8,255.6 357.7,257.4 354.7,255.6" fill="#ffffff"/>
<polygon points="415.8,338.5 418.8,340.3 418.8,292.6 415.8,290.9" fill="#ffffff"/>
<polygon points="421.9,338.5 418.8,340.3 418.8,292.6 421.9,290.9" fill="#e6eaee"/>
<polygon points="418.8,289.1 421.9,290.9 418.8,292.6 415.8,290.9" fill="#ffffff"/>
<polygon points="445.8,355.9 448.9,357.6 448.9,310.0 445.8,308.2" fill="#ffffff"/>
<polygon points="452.0,355.9 448.9,357.6 448.9,310.0 452.0,308.2" fill="#e6eaee"/>
<polygon points="448.9,306.5 452.0,308.2 448.9,310.0 445.8,308.2" fill="#ffffff"/>
<polygon points="315.5,237.7 446.9,313.5 478.4,285.3 347.0,209.4" fill="#4a5461"/>
<polygon points="315.5,237.7 446.9,313.5 478.4,285.3 347.0,209.4" className="hs-dirt" data-area="roof" fill="url(#hs-grime-streak)"/>
<polygon points="315.2,240.2 446.6,316.0 446.6,313.1 315.2,237.2" fill="#ffffff"/>
<polygon points="234.0,227.7 244.1,233.5 244.1,212.4 234.0,206.5" fill="#4b5a68"/>
<polygon points="234.0,227.7 244.1,233.5 244.1,212.4 234.0,206.5" className="hs-dirt" data-area="trash" fill="url(#hs-grime-blot)"/>
<polygon points="254.3,227.7 244.1,233.5 244.1,212.4 254.3,206.5" fill="#3b4855"/>
<polygon points="254.3,227.7 244.1,233.5 244.1,212.4 254.3,206.5" className="hs-dirt" data-area="trash" fill="url(#hs-grime-blot)"/>
<polygon points="244.1,200.6 254.3,206.5 244.1,212.4 234.0,206.5" fill="#5c6c7b"/>
<polygon points="244.1,200.6 254.3,206.5 244.1,212.4 234.0,206.5" className="hs-dirt" data-area="trash" fill="url(#hs-grime-blot)"/>
<polygon points="247.2,235.3 257.4,241.2 257.4,220.0 247.2,214.1" fill="#4b5a68"/>
<polygon points="247.2,235.3 257.4,241.2 257.4,220.0 247.2,214.1" className="hs-dirt" data-area="trash" fill="url(#hs-grime-blot)"/>
<polygon points="267.6,235.3 257.4,241.2 257.4,220.0 267.6,214.1" fill="#3b4855"/>
<polygon points="267.6,235.3 257.4,241.2 257.4,220.0 267.6,214.1" className="hs-dirt" data-area="trash" fill="url(#hs-grime-blot)"/>
<polygon points="257.4,208.3 267.6,214.1 257.4,220.0 247.2,214.1" fill="#5c6c7b"/>
<polygon points="257.4,208.3 267.6,214.1 257.4,220.0 247.2,214.1" className="hs-dirt" data-area="trash" fill="url(#hs-grime-blot)"/>
<polygon points="268.6,397.0 270.6,398.2 270.6,379.4 268.6,378.2" fill="#ffffff"/>
<polygon points="272.7,397.0 270.6,398.2 270.6,379.4 272.7,378.2" fill="#e6eaee"/>
<polygon points="270.6,377.0 272.7,378.2 270.6,379.4 268.6,378.2" fill="#ffffff"/>
<polygon points="264.0,377.9 271.1,382.0 271.1,376.2 264.0,372.0" fill="#1a222b"/>
<polygon points="277.3,378.5 271.1,382.0 271.1,376.2 277.3,372.6" fill="#141b22"/>
<polygon points="270.1,368.5 277.3,372.6 271.1,376.2 264.0,372.0" fill="#222c36"/>
    </svg>
  );
}
