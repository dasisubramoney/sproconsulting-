/**
 * Sustainability page copy. Source: company profile, "Carbon Footprint",
 * "Overall Vision", "The Current Climate Change", "Sustainable Innovation" and
 * "Our Offering". Lightly copy-edited — TODO: client to approve wording.
 */

export const climateContext = {
  points: [
    'Climate change is real, with temperatures rising on a global scale.',
    "South Africa's population is projected to reach 65–67 million by 2030.",
    'We have recently experienced an increase in drought periods, and consequently flooding thereafter.',
    'All of these factors increase the strain on national resources and networks that are already pushed to their limits.',
  ],
  population2030: { low: 65, high: 67, unit: 'million' },
};

export const sustainableInnovation = {
  intro:
    'The systems forming part of the S-PRO Sustainable Innovation solution use new benchmark and innovative fire and wet services engineering design solutions to address the challenges South Africa faces every day.',
  team: 'S-PRO Sustainable Engineering Solution Team — building engineering fire and wet services',
};

export const offering: { title: string; body: string }[] = [
  {
    title: 'Reclaimed water with renewable energy',
    body: 'We focus on the use of reclaimed rainwater, grey water, black water and ground water in combination with renewable energy.',
  },
  {
    title: 'Less load on municipal networks',
    body: 'Harvesting reclaimed water reduces the load on municipal water reserves, potable water reticulation networks and stormwater drainage networks.',
  },
  {
    title: 'Fire water independence',
    body: 'Fire water storage tanks give each building full independence from municipal infrastructure that could compromise the safety of occupants or the building in the event of a fire.',
  },
  {
    title: 'Lower electrical demand',
    body: 'Energy-efficient pumps and hot water generation systems reduce electrical consumption, and so reduce the load on a heavily strained electricity grid.',
  },
  {
    title: 'Flexible application',
    body: 'Our system can be applied to standalone developments, precinct-style developments, and private and commercial buildings, so a tailor-made, cost-effective solution can be used for each.',
  },
  {
    title: 'Sustainable, affordable growth',
    body: 'Our offer promotes self-sufficient development that benefits communities and relieves pressure on municipal resources and networks, reducing spending and freeing funds for development.',
  },
];

/** Water systems S-PRO designs. Each links to a project that proves it. */
export const waterSystems: { title: string; body: string; projectIds: string[] }[] = [
  {
    title: 'Rainwater harvesting',
    body: 'Rainwater harvesting and non-potable reticulation systems, including rainwater disposal.',
    projectIds: ['acsa-cape-town-international-airport-2017'],
  },
  {
    title: 'Grey water treatment',
    body: 'Grey water treatment systems.',
    projectIds: ['presidents-hotel', 'woolworths-distribution-centre'],
  },
  {
    title: 'Borehole purification',
    body: 'Borehole purification systems, designed through to council submission, monitoring and sign-off.',
    projectIds: ['presidents-hotel', 'woolworths-distribution-centre'],
  },
  {
    title: 'Water purification plant',
    body: 'Design, supply, installation, testing and commissioning of water purification plant.',
    projectIds: ['acsa-cape-town-international-airport-2017'],
  },
];

export const carbonFootprint = {
  households: 500,
  litresSavedPerYear: 6_570_000,
  intro:
    'S-PRO proposes measures to suppress environmental degradation through our reclaimed water solutions. The system also provides a payback period.',
  // TODO: payback period length not stated in the profile — confirm with client before showing a figure.
  followOnBenefits: [
    'Reduction in municipal network sizes',
    'Reduced cost of building new infrastructure',
    'Reduced cost of maintenance and repairs',
    'Reduced cost of water treatment',
    'Reduced electrical consumption',
    'Improved service delivery',
    'Benefits to the environment',
    'Greater community confidence',
  ],
};
