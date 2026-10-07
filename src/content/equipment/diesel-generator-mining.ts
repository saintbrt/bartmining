import type { GuideSection } from './index'

/** Points generator buyers to the sizing calculator on the rental page, which uses the same rules as the off-grid power guide. */
export const sections: GuideSection[] = [
  {
    id: 'size-calculator',
    title: 'Estimate the Generator Size for Your Load',
    html: `<p>A generator for a mine is sized on more than the total of its motor ratings. Large motors draw several times their running current when they start, and a set that runs close to its full rating all day wears faster and leaves no room for an extra pump. Our <a href="/generator-rental#generator-size-calculator">generator sizing calculator</a> takes a list of your loads, allows for how each motor starts and keeps the set at or below 80% of its rating, giving a first kVA figure in a minute.</p>
<p>Use that figure to start the conversation, not to finish it. Send the load list with the operating hours and the largest motor’s starting method, and the supplier will confirm the size, fuel use and whether a soft starter or variable-speed drive on the largest motor would let you buy or hire a smaller set. For the wider comparison of diesel, grid and hybrid supply, see our <a href="/insights/off-grid-mine-power">off-grid mine power guide</a>.</p>`,
  },
]
