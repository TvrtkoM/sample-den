import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: "https://noose0ee.api.sanity.io/v2023-08-01/graphql/production/default",
  documents: ['./graphql/**/*.graphql'],
  generates: {
    './graphql-generated/': {
      preset: 'client',
      presetConfig: {
        gqlTagName: 'gql',
      },
    },
  },
}

export default config