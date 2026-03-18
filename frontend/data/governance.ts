interface PolicyContentBlock {
  type: "paragraph" | "bullets" | "numbered";
  text?: string;
  items?: string[];
}

interface PolicySection {
  heading: string;
  content: PolicyContentBlock[];
}

export interface GovernancePolicy {
  slug: string;
  title: string;
  description: string;
  revision: string;
  preamble?: string;
  sections: PolicySection[];
}

export interface PolicyCard {
  slug: string;
  title: string;
  description: string;
}

const policies: Record<string, GovernancePolicy> = {
  "anti-corruption": {
    slug: "anti-corruption",
    title: "Anti-Corruption Policy",
    description:
      "Guidelines on improper payments, bribery, and oversight controls.",
    revision: "2015-07",
    sections: [
      {
        heading: "Definitions Used in this Policy",
        content: [
          {
            type: "paragraph",
            text: "\u201CAgent\u201D means a person, corporation or other entity retained by the Company to represent its business interest or act on its behalf.",
          },
          {
            type: "paragraph",
            text: "\u201CBribe\u201D means any authorization, promise and, or payment of any money, gift, reward, advantage or benefit of any kind, offered or given to or received from a Public Official or contractor either directly or through an agent, to influence the making (or not making) or implementation of a decision or action.",
          },
          {
            type: "paragraph",
            text: "\u201CCompany\u201D means PT Agra Energi Indonesia (PT AEI).",
          },
          {
            type: "paragraph",
            text: "\u201CContractor\u201D means a person, corporation or other entity retained to supply services, materials or labor to the Company (includes distributors or resellers).",
          },
          {
            type: "paragraph",
            text: "\u201CEmployees\u201D includes members, permanent, temporary or contract staff.",
          },
          {
            type: "paragraph",
            text: "\u201CFacilitating Payment\u201D means any occasional small payment made solely to expedite or secure the performance of non-discretionary Government actions such as:",
          },
          {
            type: "bullets",
            items: [
              "Obtaining licenses, permits and other official documents to qualify to do business.",
              "Processing Governmental papers, such as visas and work permits.",
              "Providing or obtaining police protection, telephone service, utilities and mail services.",
              "Loading / unloading cargo, inspection of goods and protecting goods from deteriorating.",
            ],
          },
          {
            type: "paragraph",
            text: "\u201CImproper Payment\u201D means a Bribe or Kickback.",
          },
          {
            type: "paragraph",
            text: "\u201CKickback\u201D means the authorization, promise and / or payment of a portion of contract consideration to or from a public official or contractor \u2014 including the improper utilization of sub contracts, purchase orders, consulting agreements or gifts to channel payments to a Public Official, employees or other representatives of a public official or contractor, their relatives or business associates.",
          },
          {
            type: "paragraph",
            text: "\u201CPublic Official\u201D means:",
          },
          {
            type: "bullets",
            items: [
              "Any person employed or appointed by a Government, state, province, municipality, or public international organization, or state owned or controlled commercial entity.",
              "Any owner, director, officer or employee of an organization that performs a Governmental function.",
              "Any person employed, appointed or acting in an official capacity for an agency, department, corporation, board, commission or enterprise that is controlled by a Government, state, province, municipality or public international organization.",
              "Elected officials, candidates for public office, political parties, and officers or employees, of political parties.",
            ],
          },
        ],
      },
      {
        heading: "Overview",
        content: [
          {
            type: "paragraph",
            text: "Management has given consideration to the needs of the business to adequately control its day to day operations and has approved and delegated certain signature authorities and approval guidelines. In addition, this policy establishes guidelines and procedures to ensure no unlawful acts or inappropriate behavior is undertaken by the Company, its employees, agents or contractors without management\u2019s knowledge.",
          },
          {
            type: "paragraph",
            text: "PT AEI\u2019s management provides oversight and direction for the Company\u2019s operations and at least yearly, complete reports on the compliance program (including any actual or potential violations).",
          },
        ],
      },
      {
        heading: "Policy",
        content: [
          {
            type: "paragraph",
            text: "The Company, its members, employees and agents & contractors shall not, either directly or through an intermediary:",
          },
          {
            type: "numbered",
            items: [
              "Demand, solicit or accept an Improper Payment (bribe or kickback).",
              "Promise, offer or pay (or authorize the promise, offer or payment of) an Improper Payment (bribe or kickback).",
              "Create any false or misleading records to circumvent PT AEI\u2019s internal controls system.",
            ],
          },
          {
            type: "paragraph",
            text: "In particular, the Company, its members, employees, agents and contractors shall not, either directly or through an intermediary pay or offer anything of value to a public official or close relative of a public official to influence any act within the recipient\u2019s official capacity, or to induce the recipient to violate his or her lawful duty, or to induce the recipient to use his or her influence with any level of Government to affect or influence any act or decision of such Government for the purpose of obtaining, retaining or directing business or any undue advantage.",
          },
        ],
      },
      {
        heading: "Oversight & Controls",
        content: [
          {
            type: "paragraph",
            text: "The primary oversight & control point for this policy rests with the management who shall for example:",
          },
          {
            type: "numbered",
            items: [
              "Create and maintain adequate books and records, as well as devise and maintain a system of internal accounting controls.",
              "Ensure that a training program on the substance of this policy is completed & an Annual Compliance Certificate obtained from all employees.",
              "Research and document the reputation & past performance of any agent or contractor not affiliated with a reputable local or internationally known group or company. A Certification of Compliance will be also obtained.",
              "Oversee the Company\u2019s general rule that it does not provide for political gifts or contributions or employ public officials \u2014 unless it is lawful & management have determined the services to be rendered do not conflict in any manner with the Governmental duties of such person.",
            ],
          },
        ],
      },
      {
        heading: "Violations and Corrective Actions",
        content: [
          {
            type: "paragraph",
            text: "Any employee who becomes aware of a violation of this policy must promptly report the matter to a member of management who shall immediately investigate and report any violation of this policy to the entire management team.",
          },
          {
            type: "paragraph",
            text: "Retaliation by anyone as a consequence of an Employee making a good faith report of a possible violation of the law or this policy is strictly prohibited and will result in disciplinary action, including termination.",
          },
          {
            type: "paragraph",
            text: "If an employee or agent is found to be in violation of this policy, appropriate corrective disciplinary action, including where appropriate dismissal or termination of contract, shall be taken and immediately reported to management.",
          },
        ],
      },
    ],
  },
  "code-of-conduct": {
    slug: "code-of-conduct",
    title: "Code of Conduct",
    description:
      "Standards of behavior, integrity, and professional conduct.",
    revision: "2015-07",
    preamble:
      "PT Agra Energi Indonesia (PT AEI) via its management believes each member of management and employee is a responsible, mature adult and therefore expects appropriate conduct from him or her. The Company values fairness, integrity and courtesy in all interactions with colleagues, suppliers, investors, competitors and other external parties.",
    sections: [
      {
        heading: "Guiding Principles",
        content: [
          {
            type: "paragraph",
            text: "PT AEI aims to ensure all of its management and employees actively participate in creating a better working environment and within the following guiding principles, each member of management and employee is expected to:",
          },
          {
            type: "bullets",
            items: [
              "Maintain financial honesty and adherence to the Company\u2019s policies, procedures and related systems and internal controls;",
              "Conduct himself or herself in a manner that protects the Company\u2019s name and reputation;",
              "Adhere to the laws relevant to his or her work environment and discipline. The employee must ensure he or she does not involve the Company in any unlawful dealings nor involve the Company in any of his or her private and personal spheres of business;",
              "Refuse any money, good or any other form of inducement, benefit or gratification from any person in connection with conducting the Company\u2019s business. Similarly, no member of management or employee may offer money, goods or any other form of inducement, benefit or gratification to any external person in connection with conducting the Company\u2019s business.",
            ],
          },
        ],
      },
      {
        heading: "Related Policies",
        content: [
          {
            type: "paragraph",
            text: "Notwithstanding the above guiding principles, the Company also provides definitive policies on communication and anti-corruption which form an integral part of this Code of Conduct. Management and employees shall comply with the requirements of the Company\u2019s Communication Policy and Anti-Corruption Policy.",
          },
        ],
      },
      {
        heading: "Violations",
        content: [
          {
            type: "paragraph",
            text: "In connection with any violation of this Code of Conduct, the Company will take its own disciplinary actions, which could result in a written sanction, implementation of a probationary period or termination of employment. The Company is also entitled to pursue legal remedies through the courts.",
          },
          {
            type: "paragraph",
            text: "If a situation arises in which an employee is unclear as to the appropriate behavior, they should contact any member of the management.",
          },
        ],
      },
    ],
  },
  communications: {
    slug: "communications",
    title: "Communications Policy",
    description:
      "Rules governing confidential information and disclosures.",
    revision: "2015-07",
    sections: [
      {
        heading: "Definitions Used in this Policy",
        content: [
          {
            type: "paragraph",
            text: "\u201CCompany\u201D means PT Agra Energi Indonesia (PT AEI).",
          },
          {
            type: "paragraph",
            text: "\u201CEmployees\u201D includes management, permanent, temporary or contract staff, who may become aware of, or possess Confidential or Sensitive Information.",
          },
          {
            type: "paragraph",
            text: "\u201CConfidential or Sensitive Information\u201D means any technical, financial, legal or other documentation regarding the Company\u2019s activities, assets, business arrangements, financing etc. For the avoidance of doubt, any and all information produced, acquired, developed or maintained by the Company shall be treated as confidential and sensitive unless otherwise stated or specified by management.",
          },
        ],
      },
      {
        heading: "Overview",
        content: [
          {
            type: "paragraph",
            text: "PT AEI\u2019s management provides oversight and direction for the Company\u2019s operations. The management has given consideration to the needs of the business to adequately control its day to day operations and has approved and delegated certain signature authorities and approval guidelines. This policy serves to protect both the Company and its employees from unnecessary and unwanted financial, legal and reputational exposures associated with any communication.",
          },
          {
            type: "paragraph",
            text: "It is the Company\u2019s intent that all transactions involving Confidential or Sensitive Information receive adequate review & approval from management.",
          },
        ],
      },
      {
        heading: "Policy Applications",
        content: [
          {
            type: "paragraph",
            text: "PT AEI has developed this Communications Policy to ensure consistent and accurate disclosures regarding any technical, financial, legal or other documentation concerning the Company, its assets, business arrangements and financing. The policy applies to both Internal & External Communications and the following rules must be followed:",
          },
          {
            type: "numbered",
            items: [
              "Only management are allowed to comment publicly on Company activities, results or other significant matters.",
              "No employee shall disclose publicly the names of investors in the Company.",
              "Unless required by the Government of Indonesia or other Persons, Bodies or Institutions identified by the Directors, the Company or its employees shall not disclose or provide any information publicly nor comment, affirmatively or negatively, on Company activities, results or any other matters.",
              "No Employee shall save information on flash disks or other portable media for removal from the Company\u2019s premises without the formal written consent of a Member.",
              "No employee shall host or participate in, any public forums or link to electronic chat rooms or bulletin boards where information of any sort concerning the Company can be discussed or posted.",
              "All information obtained while under the employment of the Company remains property of the Company. All employees waive any and all rights to any information developed as an employee of the Company.",
            ],
          },
        ],
      },
      {
        heading: "Access to Confidential Information",
        content: [
          {
            type: "paragraph",
            text: "Employees shall be given access to confidential information on an \u201Cas needed\u201D basis and must not disclose that information to anyone except in the ordinary course of business and only where everyone involved understands that it is to be kept confidential.",
          },
          {
            type: "paragraph",
            text: "Employees must not discuss confidential information in situations where they may be overheard, or participate in discussions regarding decisions by others about investments, divestments or other corporate actions.",
          },
          {
            type: "paragraph",
            text: "In all cases, Non-Disclosure Agreements (NDAs) or Confidentiality Agreements (CAs) should be signed with any party or person outside the Company before disclosing any Company information.",
          },
        ],
      },
      {
        heading: "External Communications",
        content: [
          {
            type: "paragraph",
            text: "Certain external communications must receive particular attention due to their sensitive nature or content. Such communications may include, but are not limited to press releases, as well as correspondence or document submission to the Government and our joint venture partners.",
          },
          {
            type: "paragraph",
            text: "Any press releases relating to operations and or other matters involving our joint venture partners, must also receive approval from those partners prior to release.",
          },
        ],
      },
      {
        heading: "Penalties",
        content: [
          {
            type: "paragraph",
            text: "Where the Company determines that this policy has been violated and it is able to identify the individual employee or employees involved, the Company will take disciplinary actions. These actions may result in written sanctions, implementation of a probationary period or termination of employment. The Company is also entitled to pursue legal remedies through the courts.",
          },
        ],
      },
    ],
  },
  "drugs-alcohol": {
    slug: "drugs-alcohol",
    title: "Drugs & Alcohol Policy",
    description:
      "Workplace substance abuse prevention and testing policy.",
    revision: "2015-07",
    preamble:
      "PT Agra Energi Indonesia (PT AEI) recognizes alcohol and drug abuse in the work place will impair an individual\u2019s work performance, both in the short term and long term. Such impairment will affect performance and productivity on the job, the health, safety and security of colleagues and the organization as a whole.",
    sections: [
      {
        heading: "Prevention",
        content: [
          {
            type: "paragraph",
            text: "PT AEI will endeavor to prevent contraband; drug and alcohol abuse by employee or workers deployed in the course of company business and will assist and cooperate with partners in the execution of their substance abuse policies.",
          },
        ],
      },
      {
        heading: "Testing",
        content: [
          {
            type: "paragraph",
            text: "PT AEI shall have the right at any time, through any person authorized by the Company to do so, to request urine and/or breath samples from any individual to be taken and tested for the presence of alcohol and prohibited drugs.",
          },
          {
            type: "paragraph",
            text: "Testing of individuals may be conducted under the following circumstances:",
          },
          {
            type: "bullets",
            items: [
              "As a condition of employment engagement;",
              "Where there are reasonable grounds for suspicion that an individual is under the influence of alcohol, drugs and other mood altering substances;",
              "Following any accident or injury at work involving individuals deployed in the course of Company business;",
              "As part of a random testing procedure.",
            ],
          },
        ],
      },
      {
        heading: "Penalties",
        content: [
          {
            type: "paragraph",
            text: "Where the Company determines this policy has been violated the Company will take disciplinary actions. These actions may result in written sanctions, implementation of a probationary period or termination of employment.",
          },
        ],
      },
    ],
  },
};

export const POLICY_CARDS: PolicyCard[] = [
  {
    slug: "anti-corruption",
    title: "Anti-Corruption Policy",
    description:
      "Guidelines on improper payments, bribery, and oversight controls.",
  },
  {
    slug: "code-of-conduct",
    title: "Code of Conduct",
    description:
      "Standards of behavior, integrity, and professional conduct.",
  },
  {
    slug: "communications",
    title: "Communications Policy",
    description:
      "Rules governing confidential information and disclosures.",
  },
  {
    slug: "drugs-alcohol",
    title: "Drugs & Alcohol Policy",
    description:
      "Workplace substance abuse prevention and testing policy.",
  },
];

export function getPolicy(slug: string): GovernancePolicy | undefined {
  return policies[slug];
}

export function getAllPolicySlugs(): string[] {
  return Object.keys(policies);
}
