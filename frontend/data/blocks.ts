export interface NewsItem {
  title: string;
  source: string;
  date: string;
  href?: string;
  type: "memo" | "external";
}

export interface BlockDetail {
  id: string;
  name: string;
  basin: string;
  summary: string;
  news: NewsItem[];
}

const blocks: Record<string, BlockDetail> = {
  gaea: {
    id: "gaea",
    name: "Gaea",
    basin: "Bintuni Basin",
    summary:
      "Located in western Papua, the Gaea block covers a prospective area in the Bintuni Basin with significant hydrocarbon potential. The block sits within one of Indonesia's most promising frontier basins, with proven petroleum systems and multiple structural and stratigraphic play types identified through regional seismic studies. AEI is currently conducting detailed geological and geophysical assessments to delineate drill-ready prospects.",
    news: [],
  },
  "gaea-ii": {
    id: "gaea-ii",
    name: "Gaea II",
    basin: "Bintuni Basin",
    summary:
      "Adjacent to the original Gaea block, Gaea II extends AEI's exploration footprint deeper into the Bintuni Basin. This expansion block was secured to capture additional structural leads identified during early-phase interpretation of the Gaea seismic dataset. Together with Gaea, it forms a contiguous acreage position that strengthens AEI's strategic presence in Papua's hydrocarbon corridor.",
    news: [],
  },
  jago: {
    id: "jago",
    name: "Jago",
    basin: "North Sumatra Basin",
    summary:
      "Situated off the northern coast of Sumatra, the Jago block targets proven petroleum systems in the North Sumatra Basin. The basin has a long production history and well-understood geology, providing a lower-risk exploration environment. AEI's work programme focuses on reprocessing legacy 2D seismic data and acquiring new 3D seismic to mature several identified leads into drillable prospects.",
    news: [],
  },
  palu: {
    id: "palu",
    name: "Palu",
    basin: "Bintuni Basin",
    summary:
      "The Palu block lies south of the Gaea blocks in the Bintuni Basin, offering additional exploration upside in the region. Its position provides access to deeper structural targets that complement the shallower plays being pursued on the neighbouring Gaea acreage. AEI is leveraging shared geological knowledge across the three Bintuni blocks to optimise its exploration strategy.",
    news: [],
  },
  talu: {
    id: "talu",
    name: "Talu",
    basin: "Kutei Basin",
    summary:
      "Spanning the Makassar Strait off eastern Kalimantan, the Talu block targets the prolific Kutei Basin. The Kutei Basin is one of Indonesia's most productive hydrocarbon provinces, with decades of oil and gas production from both onshore and offshore fields. AEI's position in the basin provides exposure to proven deltaic and deepwater play types with significant resource potential.",
    news: [],
  },
};

export function getBlockDetail(id: string): BlockDetail | undefined {
  return blocks[id];
}

export function getAllBlockIds(): string[] {
  return Object.keys(blocks);
}
