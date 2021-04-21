/// <reference types="../types" />

import { Handler } from "@netlify/functions";

export const handler: Handler = async () => {
  try {
    const recentlyPlayedContent = await getRecentlyPlayedTracksContent();

    return {
      statusCode: 200,
      body: JSON.stringify(recentlyPlayedContent?.items ?? {}),
    };
  } catch (err) {
    console.error(err);

    return {
      statusCode: 500,
      body: undefined,
    };
  }
};

const getRecentlyPlayedTracksContent: () => Promise<RecentlyPlayedTracksResponse> = async () => {
  const Authorization = await getAuthorizationToken();

  const response = await fetch(
    `https://api.spotify.com/v1/me/player/recently-played`,
    {
      headers: {
        Authorization,
      },
    }
  );

  const { status } = response;

  // https://developer.spotify.com/documentation/web-api/#response-status-codes
  // 204 from spotify means no data was found
  if (status === 204) {
    return {};
  }

  // 200 is OK
  if (status === 200) {
    const data = await response.json();
    return data;
  }

  throw new Error(`Unhandled status: ${status}`);
};

const getAuthorizationToken = async () => {
  const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
  const SPOTIFY_REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;
  const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

  const token = btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`);
  const Authorization = `Basic ${token}`;

  const response = await fetch(`https://accounts.spotify.com/api/token`, {
    method: "POST",
    headers: {
      Authorization,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `grant_type=refresh_token&refresh_token=${SPOTIFY_REFRESH_TOKEN}`,
  });

  const data = await response.json();

  return `Bearer ${data.access_token}`;
};
