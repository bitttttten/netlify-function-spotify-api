interface Artist {
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
}

interface Track {
  artists: Artist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  href: string;
  id: string;
  name: string;
  preview_url: string;
  track_number: number;
  type: string;
  uri: string;
}

interface RecentlyPlayedTracksItem {
  track: Track;
  played_at: Date;
}

interface RecentlyPlayedTracksResponse {
  items: RecentlyPlayedTracksItem[];
  next: string;
  cursors: {
    after: string;
    before: string;
  };
  limit: number;
  href: string;
}
