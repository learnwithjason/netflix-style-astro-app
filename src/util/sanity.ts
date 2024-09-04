import { createClient } from '@sanity/client';
import type {
	AllSeriesQueryResult,
	EpisodeBySlugQueryResult,
	PersonByIdQueryResult,
	SeriesBySlugQueryResult,
} from '../types/sanity';
import groq from 'groq';

const client = createClient({
	projectId: 'vnkupgyb',
	dataset: 'develop',
	apiVersion: '2024-08-10',
	token: import.meta.env.SANITY_SECRET_TOKEN,
	useCdn: true,
});

const allSeriesQuery = groq`
  *[_type=="series"] {
    title,
    'slug': slug.current,
    description,
    image {
      public_id,
      height,
      width,
    },
    collections[]->{
      title,
      'slug': slug.current,
      release_year,
      'episode_count': count(episodes)
    },
    'total_episode_count': count(collections[]->episodes[])
  }
`;

const seriesBySlugQuery = groq`
  *[_type=="series" && slug.current==$series][0] {
    title,
    'slug': slug.current,
    description,
    image {
      public_id,
      height,
      width,
    },
    'collection': collections[@->slug.current==$collection && @->series._ref==^._id][0]->{
      title,
      'slug': slug.current,
      release_year,
      episodes[@->hidden!=true]->{
        title,
        'slug': slug.current,
        short_description,
        publish_date,
        'thumbnail': {
          'public_id': video.thumbnail.public_id,
          'alt': video.thumbnail_alt,
          'width': video.thumbnail.width,
          'height': video.thumbnail.height,
        },
        video {
          youtube_id
        }
      }
    },
    collections[]->{
      title,
      'slug': slug.current,
      release_year,
    }
  }
`;

const episodeBySlugQuery = groq`
  *[_type=="episode" && slug.current==$episode][0] {
    title,
    'slug': slug.current,
    description,
    publish_date,
    'thumbnail': {
      'public_id': video.thumbnail.public_id,
      'width': video.thumbnail.width,
      'height': video.thumbnail.height,
      'alt': video.thumbnail_alt,
    },
    video {
      youtube_id,
      'mux': mux_video.asset->data.playback_ids,
      'captions': captions.asset->url,
      transcript,
    },
    people[]->,
    supporters,
    'related_episodes': *[_type=="collection" && references(^._id)][0].episodes[]-> {
      title,
      'slug': slug.current,
      short_description,
      publish_date,
      'thumbnail': {
        'public_id': video.thumbnail.public_id,
        'width': video.thumbnail.width,
        'height': video.thumbnail.height,
        'alt': video.thumbnail_alt,
      },
      video {
        youtube_id
      }
    },
    'collection': *[_type=="collection" && references(^._id)][0] {
      'slug': slug.current,
      title,
      'episodeSlugs': episodes[]->slug.current,
    },
    'series': *[_type=="collection" && references(^._id)][0].series->{
      'slug': slug.current,
      title,
    },
  }
`;

const personByIdQuery = groq`
  *[_type == "person" && user_id == $user_id][0] {
    _id,
    name,
    photo {
      public_id,
      height,
      width,
    },
    bio,
    links[],
    user_id,
    "episodes": *[_type == "episode" && hidden!=true && references(^._id)] {
      title,
      'slug': slug.current,
      short_description,
      publish_date,
      'thumbnail': {
        'public_id': video.thumbnail.public_id,
        'alt': video.thumbnail_alt,
        'width': video.thumbnail.width,
        'height': video.thumbnail.height,
      },
      video {
        youtube_id,
      },
      'collection': *[_type=="collection" && references(^._id)][0] {
        'slug': slug.current,
        title,
        'episodeSlugs': episodes[]->slug.current,
      },
      'series': *[_type=="collection" && references(^._id)][0].series->{
        'slug': slug.current,
        title,
      },
    } | order(publish_date desc)[0...4]
  }
`;

export async function getAllSeries() {
	return client.fetch<AllSeriesQueryResult>(allSeriesQuery);
}

export async function getSeriesBySlug(params: {
	series: string;
	collection: string;
}) {
	return client.fetch<SeriesBySlugQueryResult>(seriesBySlugQuery, params);
}

export async function getEpisodeBySlug(params: { episode: string }) {
	const episode = await client.fetch<EpisodeBySlugQueryResult>(
		episodeBySlugQuery,
		params,
	);

	if (!episode) {
		throw new Error(`Invalid episode ${params.episode}`);
	}

	return episode;
}

export async function getPersonById(
	params: { user_id: string },
	options?: { useCdn: boolean },
) {
	return client.fetch<PersonByIdQueryResult>(personByIdQuery, params, {
		useCdn: options?.useCdn ?? true,
	});
}

export async function updatePerson(
	id: string,
	set: {
		name: string;
		bio: string;
		links: Array<{ label: string; url: string }>;
	},
) {
	return client.patch(id).set(set).commit({ autoGenerateArrayKeys: true });
}
