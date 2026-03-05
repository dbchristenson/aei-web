/**
 * Centralized video registry for background videos.
 *
 * To swap which video plays in the hero splash or hero banner,
 * change HERO_SPLASH_VIDEO or HERO_BANNER_VIDEO below.
 *
 * To add a new video:
 *  1. Add a literal to the VideoKey union
 *  2. Add an entry to VIDEO_REGISTRY with Cloudinary URL + local poster path
 */

export type VideoKey =
  | "bali_beach"
  | "bali_cliffs"
  | "beach_populated"
  | "bromo_volcano"
  | "jakarta_roundie"
  | "surabaya_volcano"
  | "volcano_drone";

export interface VideoEntry {
  videoUrl: string;
  posterUrl: string;
}

const VIDEO_REGISTRY: Record<VideoKey, VideoEntry> = {
  bali_beach: {
    videoUrl:
      "https://res.cloudinary.com/dozfjnnca/video/upload/v1772652283/bali_beach_dhta8q.mp4",
    posterUrl: "/images/low_data_video_images/bali_beach_screengrab.jpg",
  },
  bali_cliffs: {
    videoUrl:
      "https://res.cloudinary.com/dozfjnnca/video/upload/v1772652282/bali_cliffs_nhcl6f.mp4",
    posterUrl: "/images/low_data_video_images/bali_cliffs_screengrab.jpg",
  },
  beach_populated: {
    videoUrl:
      "https://res.cloudinary.com/dozfjnnca/video/upload/v1772652285/beach_populated_axqebb.mp4",
    posterUrl: "/images/low_data_video_images/beach_populated_screengrab.jpg",
  },
  bromo_volcano: {
    videoUrl:
      "https://res.cloudinary.com/dozfjnnca/video/upload/v1772652284/bromo_volcano_kdyl7g.mp4",
    posterUrl: "/images/low_data_video_images/bromo_volcano_screengrab.jpg",
  },
  jakarta_roundie: {
    videoUrl:
      "https://res.cloudinary.com/dozfjnnca/video/upload/v1772652285/jakarta_roundie_xbxhmq.mp4",
    posterUrl: "/images/low_data_video_images/jakarta_roundie_screengrab.jpg",
  },
  surabaya_volcano: {
    videoUrl:
      "https://res.cloudinary.com/dozfjnnca/video/upload/v1772652284/surabaya_volcano_vmpxpa.mp4",
    posterUrl: "/images/low_data_video_images/surabaya_volcano_screengrab.jpg",
  },
  volcano_drone: {
    videoUrl:
      "https://res.cloudinary.com/dozfjnnca/video/upload/v1772652284/volcano_drone_o5tab6.mp4",
    posterUrl: "/images/low_data_video_images/volcano_drone_screengrab.jpg",
  },
};

/* ── Swap these to change which video plays in each section ── */
export const HERO_SPLASH_VIDEO: VideoKey = "bali_cliffs";
export const HERO_BANNER_VIDEO: VideoKey = "bromo_volcano";

export function getVideo(key: VideoKey): VideoEntry {
  return VIDEO_REGISTRY[key];
}
