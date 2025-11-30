import groq from 'groq';

const sampleFragment = `
{
  _id,
  title,
  description,
  slug,
  highResFile {
    mp3Url
  },
  priceUsd,
  categories[]->{
    title,
    slug
  }
}
`;

export const samplesPageQuery = groq`
{
  "samples": *[_type == "sample"]
    | order(_createdAt desc)
    [$offset...$end]
    ${sampleFragment},
  "totalCount": count(*[_type == "sample"])
}
`;