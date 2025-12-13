import { defineQuery } from 'groq';

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

const samplesSearchFragment = `
*[_type == "sample" && (
    !defined($search) ||
    $search == "" ||
    title match $search ||
    description match $search ||
    categories[]->title match $search
)]
`

export const samplesPageQuery = defineQuery(`
{
  "samples": ${samplesSearchFragment}
    | order(_createdAt desc)
    [$offset...$end]
    ${sampleFragment},
  "totalCount": count(${samplesSearchFragment})
}
`);

const samplesByIdsFragment = `
*[_type == "sample" && _id in $ids]
`;

export const samplesByIdsPageQuery = defineQuery(`
{
  "samples": ${samplesByIdsFragment}
    ${sampleFragment}
}
`);