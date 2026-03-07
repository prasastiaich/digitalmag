// All article content, keyed by slug.
// To add a new article, add a new key matching the URL slug.

const ARTICLES = {
    'infusion-pump-crisis': {
        title: 'The Ghost Decimal: How a Newton of Resistance Caused a 10-Fold Tragedy',
        readTime: '4 min',
        category: 'The Medtech Archive',
        content: [
            { type: 'p', text: 'At first glance, typing a number is a mundane "low-level" cognitive action we perform hundreds of times a day on ovens, smartphones, and calculators.' },
            { type: 'p', text: '<em>In 2009, a patient passed away because of this mundane task being performed wrong.</em>' },
            { type: 'p', text: 'When we discuss <em>Human Factors Engineering (HFE)</em>, we often focus on <em>complex software flows</em> or <em>call-to-actions</em>. But one of the most fundamental interfaces we are also involved with is physical.' },
            { type: 'p', text: 'Investigation into the <em>Alaris Infusion Pump</em> involved in this tragedy revealed a startling engineering oversight: The keypad was not uniform. To register a digit (1–9), a specific amount of force was required. However, the decimal point key, probably the most critical modifier in medication dosing required significantly more force to actuate.' },
            { type: 'p', text: 'We call this a failure of Tactile Feedback Consistency. Operating under familiarity by pressing the digits, the nurse applied the <em>same pressure to the decimal</em>. The button "felt" pressed. To the machine, the pressure never crossed the threshold of a registered event. The decimal was <em>unregistered</em> for in the mechanical resistance of the system.' },
            { type: 'h2', text: 'A Systemic Trap' },
            { type: 'p', text: 'Between <em>2005 and 2009</em>, the Food and Drug Administration (FDA) received over <em>56,000</em> reports of adverse events related to infusion pumps, leading to <em>87 recalls</em>. While many were labeled "user error," a deeper look reveals a "Systemic Trap."' },
            { type: 'p', text: 'Modern "Smart Pumps" are designed with Drug Recognition Libraries and Dose-Error Reduction Systems (DERS). Yet, if the hardware fails to capture the input correctly, the "smart" software is simply processing "dumb" data, thus contributing to possible human side mess ups.' },
            { type: 'h2', text: 'Three Design Deficiencies' },
            { type: 'p', text: 'The Alaris Case highlighted three specific Design Deficiencies:' },
            { type: 'p', text: '<strong>1. Haptic Disparity:</strong> The physical resistance of the decimal key didn\'t match the numeric keys.' },
            { type: 'p', text: '<strong>2. Lack of Forcing Functions:</strong> The system accepted "68" as a valid entry without a "Reasonableness Check" or a confirmation asking, "You entered a 1000% increase from the previous dose. Confirm?"' },
            { type: 'p', text: '<strong>3. Ambiguous Feedback:</strong> The device provided no distinct auditory or visual "click" specifically for the decimal.' },
            { type: 'h2', text: 'The Turning Point' },
            { type: 'p', text: 'The 2009 tragedy was a tipping point. The FDA realised that investigating pump failures on a case-by-case basis was inadequate. In response, they launched the <em>Infusion Pump Improvement Initiative</em>, which fundamentally changed MedTech regulation.' },
            { type: 'p', text: 'Under modern Human Factors Validation standards (such as ANSI/AAMI HE75), manufacturers must prove their devices are "error-resistant" through rigorous summative testing.' },
            { type: 'p', text: 'Even the Alaris system itself underwent a massive, multi-year remediation, finally receiving a landmark <em>510(k)</em> clearance in late 2023 for a redesigned system built specifically to fix these haptic and logic flaws.' },
            { type: 'h2', text: 'Our Responsibility' },
            { type: 'p', text: 'This is where our responsibility as Human Factors Engineers truly begins. We are an inseparable part of a massive, interconnected ecosystem.' },
            { type: 'p', text: 'When a patient is in a hospital bed, they are not just being cared for by the doctor holding the chart or the nurse hanging the IV bag. They are being cared for by the work of teams and teams of scientists, designers, and engineers who built the world around that bed.' },
            { type: 'p', text: 'As HFEs, we are the architects of that safety net. If we fail to account for a single Newton of resistance or a split second of cognitive bias, the ecosystem collapses.' },
            { type: 'h2', text: 'References' },
            {
                type: 'references', links: [
                    { label: 'FDA White Paper: Infusion Pump Improvement Initiative', url: 'https://www.fda.gov/medical-devices/infusion-pumps/white-paper-infusion-pump-improvement-initiative' },
                    { label: 'FDA: Infusion Pump Total Product Life Cycle', url: 'https://www.fda.gov/media/71142/download' },
                    { label: 'IEEE: Software-Related Recalls in the Medical Device Industry', url: 'https://www.computer.org/csdl/journal/ts/2015/07/06991548/13rRUwdrdMt' },
                    { label: 'PMC: Human Factors and Infusion Pump Usability', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7750013/' },
                    { label: 'ISMP: Smart Infusion Pumps Safety Guidelines', url: 'https://www.ismp.org/system/files/resources/2020-10/ISMP176C-Smart%20Infusion%20Pumps-100620.pdf' },
                ]
            },
        ],
    },
};

export function getArticleMeta(slug) {
    if (ARTICLES[slug]) return ARTICLES[slug];
    const title = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    return { title, readTime: '5 min', category: 'General', content: [{ type: 'p', text: 'Article content coming soon.' }] };
}

export default ARTICLES;
