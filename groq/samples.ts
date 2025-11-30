import groq from 'groq';

export const samplesPageQuery = groq`
{
  "samples": *[_type == "sample"]
    | order(_createdAt desc)
    [$offset...$end]
    {
      _id,
      title,
      slug,
      highResFile {
        mp3Url
      },
      priceUsd,
      categories[]->{
        title,
        slug
      }
    },
  "totalCount": count(*[_type == "sample"])
}
`;